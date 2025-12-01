"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import api from "@/utils/api";

// Dynamic import to avoid SSR issues with Leaflet
const MapField = dynamic(() => import("@/components/MapField"), { ssr: false });

export default function NewFarmPage() {
    const [name, setName] = useState("");
    const [cropType, setCropType] = useState("");
    const [acreage, setAcreage] = useState("");
    const [geometry, setGeometry] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!geometry) {
            setError("Please draw a field polygon on the map");
            setLoading(false);
            return;
        }

        try {
            const response = await api.post("/farmer/farms", {
                name,
                crop_type: cropType,
                acreage: parseFloat(acreage),
                geometry,
            });

            router.push(`/farmer/farms/${response.data.id}`);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to create field. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Agro<span className="text-primary-600">Credit</span> AI
                    </h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Register New Field</h2>
                    <p className="text-gray-600">
                        Add your field information to receive an AI-generated credit score
                    </p>
                </div>

                {error && (
                    <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="card">
                        <h3 className="text-xl font-semibold mb-4">Field Information</h3>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Field Name *
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., North Field, Main Plot"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="cropType" className="block text-sm font-medium text-gray-700 mb-1">
                                    Crop Type *
                                </label>
                                <select
                                    id="cropType"
                                    value={cropType}
                                    onChange={(e) => setCropType(e.target.value)}
                                    className="input-field"
                                    required
                                >
                                    <option value="">Select crop type</option>
                                    <option value="wheat">Wheat</option>
                                    <option value="corn">Corn</option>
                                    <option value="rice">Rice</option>
                                    <option value="soybean">Soybean</option>
                                    <option value="cotton">Cotton</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="acreage" className="block text-sm font-medium text-gray-700 mb-1">
                                    Acreage *
                                </label>
                                <input
                                    id="acreage"
                                    type="number"
                                    step="0.1"
                                    min="0.1"
                                    value={acreage}
                                    onChange={(e) => setAcreage(e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., 10.5"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="text-xl font-semibold mb-4">Field Location</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            The map shows a sample field polygon. In production, you would be able to draw your actual field boundaries.
                        </p>
                        <MapField editable={true} onGeometryChange={setGeometry} />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="btn-outline flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Generating Score..." : "Save & Generate Score"}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
