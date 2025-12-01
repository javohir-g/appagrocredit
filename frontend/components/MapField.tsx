"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface MapFieldProps {
    geometry?: any;
    editable?: boolean;
    onGeometryChange?: (geometry: any) => void;
}

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 13);
    }, [center, map]);
    return null;
}

export default function MapField({ geometry, editable = false, onGeometryChange }: MapFieldProps) {
    const [mounted, setMounted] = useState(false);
    const [coords, setCoords] = useState<[number, number][]>([
        [40.7128, -74.0060],
        [40.7138, -74.0050],
        [40.7148, -74.0070],
        [40.7138, -74.0080],
    ]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (geometry && geometry.coordinates && geometry.coordinates[0]) {
            // Convert GeoJSON coordinates [lng, lat] to Leaflet format [lat, lng]
            const leafletCoords = geometry.coordinates[0].map((coord: number[]) => [coord[1], coord[0]] as [number, number]);
            setCoords(leafletCoords);
        }
    }, [geometry]);

    useEffect(() => {
        if (editable && onGeometryChange) {
            // Convert Leaflet coordinates back to GeoJSON format
            const geoJsonCoords = coords.map(([lat, lng]) => [lng, lat]);
            const geoJson = {
                type: "Polygon",
                coordinates: [geoJsonCoords],
            };
            onGeometryChange(geoJson);
        }
    }, [coords, editable, onGeometryChange]);

    if (!mounted) {
        return (
            <div className="w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Loading map...</p>
            </div>
        );
    }

    const center: [number, number] = coords.length > 0 ? coords[0] : [40.7128, -74.0060];

    return (
        <div className="w-full h-[400px] rounded-lg overflow-hidden border-2 border-gray-200">
            <MapContainer
                center={center}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
            >
                <MapUpdater center={center} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polygon
                    positions={coords}
                    pathOptions={{
                        color: editable ? "#16a34a" : "#22c55e",
                        fillColor: "#22c55e",
                        fillOpacity: 0.3,
                        weight: 2,
                    }}
                />
            </MapContainer>
        </div>
    );
}
