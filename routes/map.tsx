// routes/map.tsx
import { page } from "fresh";
import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import PremiumMap from "../islands/PremiumMap.tsx";
import restaurantData from "../data/eats.json" with { type: "json" };

// Hardcoded landmarks for now (can be moved to JSON later)
const landmarks = [
  {
    name: "New Rochelle Train Station",
    coords: [-73.7824, 40.9138] as [number, number],
    type: "landmark" as const,
    description: "Main transit hub connecting to NYC and beyond.",
  },
  {
    name: "Hudson Park & Beach",
    coords: [-73.7750, 40.9000] as [number, number],
    type: "landmark" as const,
    description: "Scenic waterfront park with beach access.",
  },
  {
    name: "Iona University",
    coords: [-73.7880, 40.9250] as [number, number],
    type: "landmark" as const,
    description: "Private Catholic university with a beautiful campus.",
  },
];

export const handler = define.handlers({
  GET(_ctx) {
    const token = Deno.env.get("MAPBOX_ACCESS_TOKEN") || "";

    // Combine restaurants and landmarks
    // Note: We need to geocode restaurants if they don't have coords.
    // For this demo, I'll mock coords for restaurants based on the area description or random nearby points
    // In a real app, we'd use a geocoding API.

    const restaurants = restaurantData.restaurants.map((r) => ({
      name: r.name,
      // Mocking coords around New Ro center for demo purposes since JSON lacks them
      // Spread randomly around center [-73.780968, 40.911488]
      coords: [
        -73.780968 + (Math.random() - 0.5) * 0.02,
        40.911488 + (Math.random() - 0.5) * 0.02,
      ] as [number, number],
      type: "restaurant" as const,
      description: `${r.cuisine} - ${r.area}`,
    }));

    const locations = [...landmarks, ...restaurants];

    return page({ token, locations });
  },
});

export default define.page<typeof handler>(function MapPage({ data }) {
  const { token, locations } = data;

  return (
    <>
      <Head>
        <title>Interactive Map | New Rochelle Transit</title>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>
      <div class="w-full h-screen bg-gray-900">
        <PremiumMap accessToken={token} locations={locations} />
      </div>
    </>
  );
});
