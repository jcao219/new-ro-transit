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
    const locationToMarker = useRef(new Map<Location, mapboxgl.Marker>());
    const [activeLocation, setActiveLocation] = useState<Location | undefined>();
    const [filter, setFilter] = useState<"all" | "restaurant" | "landmark">(
        "all",
    );

    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        map.current = new mapboxgl.Map({
            accessToken,
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/standard",
            center: [-73.780968, 40.911488], // New Rochelle center
            zoom: 16,
            pitch: 60, // Tilt for 3D effect
            bearing: 0,
            antialias: true,
        });

        map.current.on("load", () => {
            if (!map.current) return;

            locationToMarker.current.clear();

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

                locationToMarker.current.set(loc, new mapboxgl.Marker({ element: el })
                    .setLngLat(loc.coords)
                    .setPopup(
                        new mapboxgl.Popup({ offset: 25 }).setHTML(
                            `<h3 style="color:black; font-weight:bold;">${loc.name}</h3><p style="color:gray;">${loc.description || ""
                            }</p>`,
                        ),
                    )
                    .addTo(map.current!));
            });
        });
    }, [accessToken, locations]);

    const flyToLocation = (loc: Location) => {
        if (!map.current || !loc.coords) return;

        // Remove pulse animation from all markers
        locationToMarker.current.forEach((marker) => {
            marker.getElement().classList.remove("animate-pulse");
        });

        setActiveLocation(loc);

        // Add pulse animation to the selected marker
        locationToMarker.current.get(loc)?.getElement().classList.add("animate-pulse");

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
        <div class="flex w-full h-screen">
            {/* Glassmorphism Sidebar - Sticks to left */}
            <div class="w-80 bg-black/30 backdrop-blur-md border-r border-white/10 p-6 text-white overflow-y-auto shadow-2xl z-10 hidden md:block">
                <h1 class="text-2xl font-bold mb-2 text-gray-200">
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

            {/* Map Container - Takes remaining space */}
            <div class="flex-1 relative">
                <div ref={mapContainer} class="absolute inset-0 w-full h-full" />

                {/* Mobile Bottom Sheet (Simplified) */}
                <div class="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-4 md:hidden z-10">
                    <h2 class="text-white font-bold">New Ro Explorer</h2>
                    <p class="text-gray-300 text-xs">Tap markers to explore.</p>
                </div>
            </div>
        </div>
    );
}
