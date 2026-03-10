import { NextRequest, NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function POST(req: NextRequest) {
    try {
        const { address, lat: overrideLat, lng: overrideLng } = await req.json();

        if (!GOOGLE_API_KEY) {
            return NextResponse.json({ error: "API Key não configurada no servidor" }, { status: 500 });
        }

        if (!address) {
            return NextResponse.json({ error: "Endereço não fornecido" }, { status: 400 });
        }

        let lat = overrideLat;
        let lng = overrideLng;
        let formattedAddress = address;

        if (!lat || !lng) {
            // 1. Geocoding via Nominatim (OpenStreetMap) para evitar bloqueios de Referer Key
            const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
            try {
                const geoRes = await fetch(geoUrl, { headers: { "User-Agent": "XpectSolar_App/1.0" }});
                const geoData = await geoRes.json();

                if (geoData && geoData.length > 0) {
                    lat = parseFloat(geoData[0].lat);
                    lng = parseFloat(geoData[0].lon);
                    formattedAddress = geoData[0].display_name;
                } else {
                    return NextResponse.json({ error: "Nosso sistema não localizou as coordenadas exatas para este endereço." }, { status: 400 });
                }
            } catch (err) {
                console.error("Geocoding Error:", err);
                return NextResponse.json({ error: "Erro ao consultar serviço de localização." }, { status: 500 });
            }
        }

        // 2. Mapeamento Solar API para pegar análise do telhado
        const reqReferer = req.headers.get("referer") || req.headers.get("origin") || "https://xpectsolar.com/";
        const solarUrl = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${GOOGLE_API_KEY}`;
        let solarData = null;

        try {
            const solarRes = await fetch(solarUrl, {
                headers: {
                    "Referer": reqReferer
                }
            });
            if (solarRes.ok) {
                solarData = await solarRes.json();
            } else {
                console.warn("Solar API error status:", solarRes.status);
            }
        } catch (err) {
            console.error("Fetch falhou na Solar API", err);
        }

        return NextResponse.json({
            success: true,
            location: { lat, lng, formattedAddress },
            solarData: solarData || null
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Erro no /api/simulate:", error);
        return NextResponse.json({ error: "Erro interno ao consultar API do Google" }, { status: 500 });
    }
}
