import { NextRequest, NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function POST(req: NextRequest) {
    try {
        const { address } = await req.json();

        if (!GOOGLE_API_KEY) {
            return NextResponse.json({ error: "API Key não configurada no servidor" }, { status: 500 });
        }

        if (!address) {
            return NextResponse.json({ error: "Endereço não fornecido" }, { status: 400 });
        }

        const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (geoData.status !== "OK" || !geoData.results[0]) {
            return NextResponse.json({ error: "Google não localizou as coordenadas exatas para este endereço." }, { status: 400 });
        }

        const { lat, lng } = geoData.results[0].geometry.location;

        return NextResponse.json({
            success: true,
            location: { lat, lng }
        });
    } catch (error: any) {
        console.error("Erro no /api/geocode:", error);
        return NextResponse.json({ error: "Erro interno ao consultar API do Google" }, { status: 500 });
    }
}
