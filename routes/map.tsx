// routes/map.tsx
import { Head } from "$fresh/runtime.ts";
import InteractiveMap from "../islands/InteractiveMap.tsx"; // Import the island

export default function MapPage() {
  return (
    <>
      <Head>
        <title>New Rochelle Transit Map</title>
        {/* Make sure Leaflet CSS is linked in _app.tsx */}
      </Head>
      <div class="p-4 mx-auto max-w-screen-lg">
        <h1 class="text-4xl font-bold mb-6">Interactive Transit Map</h1>
        <p class="mb-8 text-lg">Visualize New Rochelle's connection to NYC.</p>
        {/* Render the island component */}
        <InteractiveMap />
         <a href="/" class="inline-block mt-8 text-blue-600 hover:underline">&larr; Back Home</a>
      </div>
    </>
  );
}
