"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";

interface Panel {
    center: {
        latitude: number;
        longitude: number;
    };
    orientation: "PORTRAIT" | "LANDSCAPE";
    yearlyEnergyDcKwh: number;
    segmentIndex: number;
}

interface SegmentSummary {
    pitchDegrees: number;
    azimuthDegrees: number;
    panelsCount: number;
    segmentIndex: number;
}

interface InteractiveSolarMapProps {
    lat: number;
    lng: number;
    zoom?: number;
    solarPanels?: Panel[];
    panelsCount?: number;
    segmentSummaries?: SegmentSummary[];
    apiKey: string;
}

export default function InteractiveSolarMap({
    lat,
    lng,
    zoom = 20,
    solarPanels = [],
    panelsCount = 0,
    segmentSummaries = [],
    apiKey,
}: InteractiveSolarMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [mapReady, setMapReady] = useState(false);
    const mapInitialized = useRef(false);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (mapReady && mapRef.current && (window as any).google && !mapInitialized.current) {
            mapInitialized.current = true;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const google = (window as any).google;

            const mapOptions = {
                center: { lat, lng },
                zoom: zoom,
                mapTypeId: 'satellite',
                disableDefaultUI: true,
                zoomControl: true,
                tilt: 0
            };

            const map = new google.maps.Map(mapRef.current, mapOptions);

            if (solarPanels && solarPanels.length > 0 && panelsCount > 0) {
                // Select the top N panels based on the config
                const selectedPanels = solarPanels.slice(0, panelsCount);

                selectedPanels.forEach((panel) => {
                    // Try to get azimuth from segment summary, fallback to 0
                    const segment = segmentSummaries?.find(s => s.segmentIndex === panel.segmentIndex);
                    const azimuth = segment?.azimuthDegrees || 0;

                    const w = panel.orientation === 'PORTRAIT' ? 1.0 : 1.65;
                    const h = panel.orientation === 'PORTRAIT' ? 1.65 : 1.0;

                    // Center of the panel
                    const centerLat = panel.center.latitude;
                    const centerLng = panel.center.longitude;

                    // Calculate rotation
                    const angle = azimuth * Math.PI / 180;
                    const cosA = Math.cos(angle);
                    const sinA = Math.sin(angle);

                    const metersToLat = (meters: number) => meters / 111111;
                    const metersToLng = (meters: number, lat: number) => meters / (111111 * Math.cos(lat * Math.PI / 180));

                    const corners = [
                        { x: -w / 2, y: h / 2 }, // Top-left
                        { x: w / 2, y: h / 2 },  // Top-right
                        { x: w / 2, y: -h / 2 }, // Bottom-right
                        { x: -w / 2, y: -h / 2 } // Bottom-left
                    ];

                    const polygonPaths = corners.map(c => {
                        // Math for drawing panels accurately
                        const rx = c.x * cosA + c.y * sinA;
                        const ry = -c.x * sinA + c.y * cosA;

                        return {
                            lat: centerLat + metersToLat(ry),
                            lng: centerLng + metersToLng(rx, centerLat)
                        };
                    });

                    new google.maps.Polygon({
                        paths: polygonPaths,
                        strokeColor: "#2ECC8C",
                        strokeOpacity: 0.9,
                        strokeWeight: 1,
                        fillColor: "#111F18",
                        fillOpacity: 0.5,
                        map: map
                    });
                });
            } else {
                new google.maps.Marker({
                    position: { lat, lng },
                    map,
                    title: "Localização",
                    animation: google.maps.Animation.DROP,
                });
            }
        }
    }, [mapReady, lat, lng, zoom, solarPanels, panelsCount, segmentSummaries]);

    return (
        <div className="w-full h-full relative">
            <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`}
                strategy="lazyOnload"
                onLoad={() => setMapReady(true)}
            />
            <div ref={mapRef} className="w-full h-full" />

            {!mapReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 backdrop-blur-sm z-10 w-full h-full">
                    <div className="w-8 h-8 rounded-full border-4 border-[#2ECC8C] border-t-transparent animate-spin"></div>
                </div>
            )}
        </div>
    );
}
