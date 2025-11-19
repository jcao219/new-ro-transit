import { useEffect, useRef, useState } from "preact/hooks";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Location {
    name: string;
    coords?: [number, number];
    type: "restaurant" | "landmark";
    description?: string;
}

interface PremiumMapProps {
    accessToken: string;
    locations: Location[];
}

export default function PremiumMap(
    { accessToken, locations }: PremiumMapProps,
) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [activeLocation, setActiveLocation] = useState<Location | null>(null);
    const [filter, setFilter] = useState<"all" | "restaurant" | "landmark">(
        "all",
    );

    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        // deno-lint-ignore no-explicit-any
        (mapboxgl as any).accessToken = accessToken;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/standard",
            center: [-73.780968, 40.911488], // New Rochelle center
            zoom: 15,
            pitch: 55, // Tilt for 3D effect
            bearing: -17.6,
            antialias: true,
        });

        map.current.on("load", () => {
            if (!map.current) return;

            // Add 3D buildings layer
            const layers = map.current.getStyle()?.layers;
            const labelLayerId = layers?.find(
                (layer) => layer.type === "symbol" && layer.layout?.["text-field"],
            )?.id;

            map.current.addLayer(
                {
                    id: "add-3d-buildings",
                    source: "composite",
                    "source-layer": "building",
                    filter: ["==", "extrude", "true"],
                    type: "fill-extrusion",
                    minzoom: 15,
                    paint: {
                        "fill-extrusion-color": "#aaa",
                        "fill-extrusion-height": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            15,
                            0,
                            15.05,
                            ["get", "height"],
                        ],
                        "fill-extrusion-base": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            15,
                            0,
                            15.05,
                            ["get", "min_height"],
                        ],
                        "fill-extrusion-opacity": 0.6,
                    },
                },
                labelLayerId,
            );

            // Add markers
            locations.forEach((loc) => {
                if (!loc.coords) return;

                // Create a DOM element for each marker.
                const el = document.createElement("div");
                el.className = `marker ${loc.type}`;
                el.style.width = "20px";
                el.style.height = "20px";
                el.style.borderRadius = "50%";
                el.style.cursor = "pointer";

                // Color coding
                if (loc.type === "restaurant") {
                    el.style.backgroundColor = "#3b82f6"; // Blue
                    el.style.boxShadow = "0 0 10px #3b82f6";
                } else {
                    el.style.backgroundColor = "#10b981"; // Green
                    el.style.boxShadow = "0 0 10px #10b981";
                }

                el.addEventListener("click", () => {
                    flyToLocation(loc);
                });

                new mapboxgl.Marker(el)
                    .setLngLat(loc.coords)
                    .setPopup(
                        new mapboxgl.Popup({ offset: 25 }).setHTML(
                            `<h3 style="color:black; font-weight:bold;">${loc.name}</h3><p style="color:gray;">${loc.description || ""
                            }</p>`,
                        ),
                    )
                    .addTo(map.current!);
            });
        });
    }, [accessToken, locations]);

    const flyToLocation = (loc: Location) => {
        if (!map.current || !loc.coords) return;

        setActiveLocation(loc);

        map.current.flyTo({
            center: loc.coords,
            zoom: 16,
            pitch: 60,
            bearing: 0,
            essential: true,
        });
    };

    const filteredLocations = locations.filter(
        (loc) => filter === "all" || loc.type === filter,
    );

    return (
        <div class="relative w-full h-screen">
            {/* Map Container */}
            <div ref={mapContainer} class="absolute inset-0 w-full h-full" />

            {/* Glassmorphism Sidebar */}
            <div class="absolute top-4 left-4 bottom-4 w-80 bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-white overflow-y-auto shadow-2xl z-10 hidden md:block">
                <h1 class="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    New Ro Explorer
                </h1>
                <p class="text-sm text-gray-300 mb-6">
                    Discover the best dining and landmarks in New Rochelle.
                </p>

                {/* Filter Toggles */}
                <div class="flex gap-2 mb-6">
                    <button
                        type="button"
                        onClick={() => setFilter("all")}
                        class={`px-3 py-1 rounded-full text-xs font-medium transition-all ${filter === "all"
                            ? "bg-white text-black"
                            : "bg-white/10 hover:bg-white/20"
                            }`}
                    >
                        All
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilter("restaurant")}
                        class={`px-3 py-1 rounded-full text-xs font-medium transition-all ${filter === "restaurant"
                            ? "bg-blue-500 text-white"
                            : "bg-white/10 hover:bg-white/20"
                            }`}
                    >
                        Dining
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilter("landmark")}
                        class={`px-3 py-1 rounded-full text-xs font-medium transition-all ${filter === "landmark"
                            ? "bg-green-500 text-white"
                            : "bg-white/10 hover:bg-white/20"
                            }`}
                    >
                        Landmarks
                    </button>
                </div>

                {/* Location List */}
                <div class="space-y-3">
                    {filteredLocations.map((loc, idx) => (
                        <div
                            key={idx}
                            onClick={() => flyToLocation(loc)}
                            class={`p-3 rounded-xl border border-white/5 cursor-pointer transition-all hover:bg-white/10 ${activeLocation?.name === loc.name
                                ? "bg-white/10 border-blue-500/50"
                                : "bg-black/20"
                                }`}
                        >
                            <div class="flex justify-between items-start">
                                <h3 class="font-semibold text-sm">{loc.name}</h3>
                                <span
                                    class={`w-2 h-2 rounded-full ${loc.type === "restaurant" ? "bg-blue-500" : "bg-green-500"
                                        }`}
                                >
                                </span>
                            </div>
                            {loc.description && (
                                <p class="text-xs text-gray-400 mt-1 line-clamp-2">
                                    {loc.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Bottom Sheet (Simplified) */}
            <div class="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-4 md:hidden z-10">
                <h2 class="text-white font-bold">New Ro Explorer</h2>
                <p class="text-gray-300 text-xs">Tap markers to explore.</p>
            </div>
        </div>
    );
}
