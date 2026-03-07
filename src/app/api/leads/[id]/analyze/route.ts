import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // 1. Verificar autenticação do consultor e criar cliente autenticado
        const authHeader = req.headers.get("Authorization");

        const supabaseAuth = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: {
                        Authorization: authHeader || ""
                    }
                }
            }
        );

        let user;

        if (authHeader) {
            const { data: { user: authUser }, error: authError } = await supabaseAdmin.auth.getUser(authHeader.replace("Bearer ", ""));
            if (authError || !authUser) {
                return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
            }
            user = authUser;
        } else {
            const { data: { user: authUser } } = await supabaseAdmin.auth.getUser();
            user = authUser;
        }

        if (!user) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        // 2. Verificar/Resetar créditos do consultor
        const { data: consultant, error: consultantError } = await supabaseAuth
            .from("consultants")
            .select("id, plan_type, solar_api_credits, solar_api_last_reset")
            .eq("id", user.id)
            .single();

        if (consultantError || !consultant) {
            return NextResponse.json({ error: "Consultor não encontrado" }, { status: 404 });
        }

        let currentCredits = consultant.solar_api_credits;
        const lastReset = consultant.solar_api_last_reset ? new Date(consultant.solar_api_last_reset) : null;
        const now = new Date();
        const maxCredits = consultant.plan_type === 'free' || !consultant.plan_type ? 2 : 100;

        // Lógica de reset mensal (30 dias)
        if (currentCredits === null || currentCredits === undefined || !lastReset || (now.getTime() - lastReset.getTime() > 30 * 24 * 60 * 60 * 1000)) {
            currentCredits = maxCredits;
            await supabaseAuth
                .from("consultants")
                .update({
                    solar_api_credits: maxCredits,
                    solar_api_last_reset: now.toISOString()
                })
                .eq("id", user.id);
        }

        if (currentCredits <= 0) {
            const upgMsg = maxCredits === 2 ? " Faça upgrade para liberar 100 análises." : "";
            return NextResponse.json({ error: `Você atingiu seu limite de ${maxCredits} análises técnicas para este mês.${upgMsg}` }, { status: 403 });
        }

        // 3. Buscar dados do Lead
        const { data: lead, error: leadError } = await supabaseAuth
            .from("leads")
            .select("*")
            .eq("id", id)
            .eq("consultant_id", user.id)
            .single();

        if (leadError || !lead) {
            return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
        }

        if (lead.score !== "A" && lead.score !== "B") {
            return NextResponse.json({ error: "Apenas leads com Score A ou B são elegíveis para Análise de Viabilidade Técnica por Satélite." }, { status: 403 });
        }

        const sData = lead.simulation_data || {};
        const address = `${sData.numeroCasa || ""}, ${sData.cep || ""}, Brazil`.trim();

        if (!sData.cep) {
            return NextResponse.json({ error: "Endereço incompleto (CEP ausente) na ficha do lead." }, { status: 400 });
        }

        // 4. Geocoding API
        const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (geoData.status !== "OK" || !geoData.results[0]) {
            return NextResponse.json({ error: "Google não localizou as coordenadas exatas para este CEP e Número." }, { status: 400 });
        }

        const { lat, lng } = geoData.results[0].geometry.location;

        // 5. Google Solar API
        const solarUrl = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&key=${GOOGLE_API_KEY}`;
        const solarRes = await fetch(solarUrl);
        const solarData = await solarRes.json();

        if (solarRes.status !== 200) {
            return NextResponse.json({ error: "Telhado não identificado ou fora da área de cobertura do Google Solar." }, { status: 404 });
        }

        // 6. Extrair Métricas Técnicas
        const stats = solarData.wholeRoofStats;
        const areaM2 = stats.areaMeters2 || 0;
        const maxSunHoursPerYear = solarData.solarPotential?.maxSunshineHoursPerYear || 0;
        const irradiance = maxSunHoursPerYear;
        const maxKwp = solarData.solarPotential?.maxArrayKwp || (areaM2 * 0.15);
        const satelliteUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=20&size=600x400&maptype=satellite&key=${GOOGLE_API_KEY}`;

        const geracaoMensalEst = (maxKwp * (irradiance / 12) * 0.82);
        const economiaMensal = Math.min(lead.monthly_bill || 0, geracaoMensalEst);
        const payback = 4.5; // Estimativa fixa técnica

        // 7. Atualizar Lead no banco
        const { error: updateError } = await supabaseAuth
            .from("leads")
            .update({
                tech_analyzed: true,
                tech_area_m2: areaM2,
                tech_irradiance: irradiance,
                tech_kwp: maxKwp,
                tech_savings_month: economiaMensal,
                tech_payback: payback,
                tech_satellite_url: satelliteUrl,
                tech_data: solarData
            })
            .eq("id", id);

        if (updateError) throw updateError;

        // 8. Debitar crédito
        await supabaseAuth
            .from("consultants")
            .update({ solar_api_credits: currentCredits - 1 })
            .eq("id", user.id);

        return NextResponse.json({
            success: true,
            data: {
                areaM2,
                irradiance,
                maxKwp,
                satelliteUrl,
                economiaMensal,
                payback: payback.toString()
            }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error("Erro na Solar API:", err);
        return NextResponse.json({ error: "Falha na análise técnica satelital." }, { status: 500 });
    }
}
