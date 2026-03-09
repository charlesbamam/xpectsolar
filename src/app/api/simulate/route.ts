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
            // 1. Geocoding API para pegar coordenadas se não enviadas
            const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`;
            const geoRes = await fetch(geoUrl);
            const geoData = await geoRes.json();

            if (geoData.status !== "OK" || !geoData.results[0]) {
                return NextResponse.json({ error: "Google não localizou as coordenadas exatas." }, { status: 400 });
            }

            lat = geoData.results[0].geometry.location.lat;
            lng = geoData.results[0].geometry.location.lng;
            formattedAddress = geoData.results[0].formatted_address;
        }

        // 2. Google Solar API para pegar análise do telhado
        const solarUrl = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${GOOGLE_API_KEY}`;
        let solarData = null;

        try {
            const solarRes = await fetch(solarUrl);
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
