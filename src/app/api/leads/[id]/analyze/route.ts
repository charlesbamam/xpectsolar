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

        // Removida a verificação de Score A ou B para permitir que qualquer lead seja analisado.

        const sData = lead.simulation_data || {};
        let lat = sData.location?.lat;
        let lng = sData.location?.lng;

        // Se por algum motivo as coordenadas não foram salvas na simulação, tenta buscar via Geocoding
        if (!lat || !lng) {
            if (!sData.cep) {
                return NextResponse.json({ error: "Endereço incompleto (CEP ausente) na ficha do lead." }, { status: 400 });
            }

            // Função auxiliar para buscar no OSM (Nominatim) com mais precisão
            const getCoordsOSM = async (query: string) => {
                const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
                try {
                    const res = await fetch(url, { headers: { "User-Agent": "XpectSolar_App/1.0" }});
                    const data = await res.json();
                    if (data && data.length > 0) {
                        // Log de depuração (opcional no seu ambiente)
                        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
                    }
                } catch (e) {
                    console.error("Geocoding Error:", e);
                }
                return null;
            };

            // Tentativa 1: Endereço completo com número, CEP, Cidade, Estado
            const cityState = lead.city_state || "";
            let addressFallback = `${sData.numeroCasa || ""}, ${sData.cep || ""}, ${cityState}, Brazil`.replace(/^,\s*/, '').trim();
            let coords = await getCoordsOSM(addressFallback);

            if (!coords) {
                // Tentativa 2: CEP + Cidade + Estado (Mais seguro se o número falhar)
                addressFallback = `${sData.cep || ""}, ${cityState}, Brazil`.replace(/^,\s*/, '').trim();
                coords = await getCoordsOSM(addressFallback);

                if (!coords) {
                    // Tentativa 3: Apenas a Cidade e Estado
                    addressFallback = `${cityState}, Brazil`.replace(/^,\s*/, '').trim();
                    coords = await getCoordsOSM(addressFallback);
                    
                    if (!coords) {
                        return NextResponse.json({ error: "Não foi possível localizar as coordenadas geográficas para este endereço." }, { status: 400 });
                    }
                }
            }

            lat = coords.lat;
            lng = coords.lng;
        }

        // 5. Tecnlogia de Mapeamento por Satélite
        const reqReferer = req.headers.get("referer") || req.headers.get("origin") || "https://xpectsolar.com/";
        const solarUrl = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=LOW&key=${GOOGLE_API_KEY}`;
        const solarRes = await fetch(solarUrl, {
            headers: {
                "Referer": reqReferer
            }
        });
        const solarData = await solarRes.json();

        if (solarRes.status !== 200) {
            console.error("Erro da API de Satélite:", solarData);
            const apiMsg = solarData.error?.message || "Desconhecido";
            const apiStatus = solarData.error?.status || solarRes.status;

            // Tratamento especial para 404 (Localização sem dados solares 3D)
            if (solarRes.status === 404 || apiStatus === "NOT_FOUND") {
                return NextResponse.json({
                    error: "A Google Solar API ainda não possui mapeamento 3D detalhado para este telhado específico. A análise automática está indisponível para este local."
                }, { status: 404 });
            }

            return NextResponse.json({
                error: `A API Solar retornou um erro: [${apiStatus}] ${apiMsg}`
            }, { status: solarRes.status || 500 });
        }

        // 6. Extrair e Processar Métricas Técnicas
        const stats = solarData.wholeRoofStats || {};

        // Se a API não tiver o recorte 3D da área, usamos a projeção mecânica exata gerada no simulador
        const simData = lead.simulation_data || {};
        const baseAreaFallback = simData.num_placas ? Math.ceil(simData.num_placas * 2.2) : 25;
        const areaM2 = stats.areaMeters2 || solarData.solarPotential?.maxArrayAreaMeters2 || baseAreaFallback;

        const maxSunHoursPerYear = solarData.solarPotential?.maxSunshineHoursPerYear || 0;
        const irradiance = maxSunHoursPerYear || (simData.irradiance_mensal_kwh_m2 ? simData.irradiance_mensal_kwh_m2 * 12 : 2100);

        const fallbackKwp = simData.potencia_kwp || (areaM2 * 0.15);
        const maxKwp = solarData.solarPotential?.maxArrayKwp || fallbackKwp;

        const maxPanels = solarData.solarPotential?.maxArrayPanelsCount || simData.num_placas || Math.floor(maxKwp / 0.55);

        // Força a inserção no objeto de tech_data para garantir o resgate no frontend
        if (!solarData.solarPotential) {
            solarData.solarPotential = {};
        }
        solarData.solarPotential.maxArrayPanelsCount = maxPanels;

        // Ajuste de zoom para mostrar mais os arredores
        const satelliteUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=19&size=640x600&scale=2&maptype=satellite&key=${GOOGLE_API_KEY}`;

        const geracaoMensalEst = (maxKwp * (irradiance / 12) * 0.82);
        const economiaMensal = Math.min(lead.monthly_bill || 0, geracaoMensalEst);
        const payback = lead.estimated_savings > 0 ? (lead.estimated_capex / (economiaMensal * 12)) : 4.5;

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
                payback: payback.toString(),
                maxPanels,
                solarPanels: solarData.solarPotential?.solarPanels,
                roofSegmentSummaries: solarData.solarPotential?.roofSegmentSummaries,
                lat,
                lng
            }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error("Erro na Solar API:", err);
        return NextResponse.json({ error: "Falha na análise técnica satelital." }, { status: 500 });
    }
}
