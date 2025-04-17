// islands/InteractiveMap.tsx
import { Head } from "$fresh/runtime.ts";
import { useEffect, useRef } from "preact/hooks";

// TODO: Add types to the leaflet map.
async function loadLeaflet(mapDivRef: HTMLDivElement): Promise<unknown> {
  const L = await import("https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js");
  // Define locations
  const nrStation = L.latLng(40.907, -73.782); // Approx. coords
  const pelhamStation = L.latLng(40.91013827102374, -73.80883213852191); // Pelham Station
  const mtVernonEastStation = L.latLng(40.912269892695534, -73.83190944773806); // Mt. Vernon East Station
  const fordhamStation = L.latLng(40.861, -73.885); // Fordham Station
  const harlem125thStStation = L.latLng(40.80525364195717, -73.9389457294409); // Harlem-125th St Station
  const grandCentral = L.latLng(40.7527, -73.9772);
  const pennStation = L.latLng(40.7506, -73.9935);
  const marbleHillManhattan = L.latLng(40.87434625287056, -73.91011525552229); // Marble Hill, Manhattan

  // Initialize map
  const map = L.map(mapDivRef).setView(L.latLng(40.83, -73.88), 11); // Centered view

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Add Markers
  L.marker(nrStation).addTo(map)
    .bindPopup("<b>New Rochelle Station</b><br>Metro-North & Amtrak");
  L.marker(grandCentral).addTo(map)
    .bindPopup("<b>Grand Central Terminal</b><br>~38 min via Metro-North");
  L.marker(pennStation).addTo(map)
    .bindPopup("<b>Penn Station (Moynihan)</b><br>~30 min via Amtrak");
  L.marker(marbleHillManhattan).addTo(map)
    .bindPopup("<b>Marble Hill, Manhattan</b><br>7 miles away or 11 miles by car");

  // Optional: Draw lines
  L.polyline([
    nrStation,
    pelhamStation,
    mtVernonEastStation,
    fordhamStation,
    harlem125thStStation,
    grandCentral
  ], { color: 'red' }).addTo(map)
                      .bindTooltip("Metro-North Line", { permanent: true, direction: 'top' })
                      .openTooltip(); // Open tooltip on load.
  L.polyline([nrStation, pennStation], { color: 'blue' })
    .addTo(map)
    .bindTooltip("Amtrak", { permanent: true, direction: 'top' })
    .openTooltip(); // Open tooltip on load.
  
  return map;
};

export default function InteractiveMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<unknown>(null); // To hold the Leaflet map instance

  useEffect(() => {
    // Dynamically import Leaflet only on the client-side
    if (mapRef.current != null && mapInstance.current == null) {
      loadLeaflet(mapRef.current)
        .then(map => mapInstance.current = map)
        .catch(err => console.error("Failed to load Leaflet:", err));
    }

    // Cleanup function to remove map on component unmount
    return () => {
      if (mapInstance.current) {
        (mapInstance.current as { remove: () => void }).remove();
        mapInstance.current = null; // Clear the instance ref
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <>
      <Head>
        {/* Leaflet CSS is loaded in _app.tsx */}
        {/* Ensure Leaflet JS is loaded before this component renders fully */}
      </Head>
      {/* The div needs explicit height */}
      <div ref={mapRef} style={{ height: "600px", width: "100%" }}>
         {/* Map will be rendered here by Leaflet */}
         Loading map...
      </div>
    </>
  );
}