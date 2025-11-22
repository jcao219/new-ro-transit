// routes/map.tsx
import { page } from "fresh";
import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import PremiumMap from "@/islands/PremiumMap.tsx";
import restaurantData from "@/data/restaurants.json" with { type: "json" };
import landmarkData from "@/data/landmarks.json" with { type: "json" };

export const handler = define.handlers({
  GET(_ctx) {
    const token = Deno.env.get("MAPBOX_ACCESS_TOKEN") || "";

    // Map restaurants from JSON to the format expected by PremiumMap
    const restaurants = restaurantData.restaurants.map((r) => ({
      name: r.name,
      coords: r.coords as [number, number],
      type: "restaurant" as const,
      description: `${r.cuisine} - ${r.area}`,
    }));

    // Map landmarks from JSON to the format expected by PremiumMap
    const landmarks = landmarkData.landmarks.map((l) => ({
      name: l.name,
      coords: l.coords as [number, number],
      type: "landmark" as const,
      description: l.description,
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
