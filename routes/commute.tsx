// routes/commute.tsx
import { page } from "fresh";
import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
// Import the full JSON structure
import transitData from "@/data/transit.json" with { type: "json" };

// Define the shape of a single commute item
interface CommuteInfo {
  destination: string;
  method: string;
  time: string;
  frequency: string;
  notes: string;
}

// Handler to load data (runs on the server)
export const handler = define.handlers({
  GET(_ctx) {
    // Extract the commutes array from the imported JSON data
    const commutes = transitData.commutes as CommuteInfo[];
    // Pass the data to the rendering context
    return page({ commutes });
  },
});

// Page component (receives data via props)
export default define.page<typeof handler>(function CommutePage({ data }) {
  const { commutes } = data; // Extract commutes array from props

  return (
    <>
      <Head>
        <title>New Rochelle Commute Times to NYC & Beyond</title>
      </Head>
      <div class="max-w-screen-lg mx-auto">
        <h1 class="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
          Commuting Made Easy
        </h1>
        <p class="mb-8 text-lg text-gray-600">
          New Rochelle's strategic location on Metro-North's New Haven Line and
          Amtrak's Northeast Corridor offers fast, reliable access to Manhattan
          and other key destinations.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commutes.map((item: CommuteInfo, index: number) => (
            <div
              key={index}
              class="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between"
            >
              <div>
                <h2 class="text-xl font-semibold mb-2 text-blue-700">
                  {item.destination}
                </h2>
                <p class="text-sm text-gray-500 mb-2">{item.method}</p>
                <p class="mb-1">
                  <span class="font-medium">Est. Time:</span>
                  <span class="font-bold text-green-700 ml-1">{item.time}</span>
                </p>
                <p class="text-sm mb-3">
                  <span class="font-medium">Frequency:</span> {item.frequency}
                </p>
              </div>
              <p class="text-xs text-gray-600 mt-2 italic">{item.notes}</p>
            </div>
          ))}
        </div>
        <div class="mt-8 text-center">
          <a href="/map" class="text-blue-600 hover:underline font-medium">
            View these on the interactive map &rarr;
          </a>
        </div>
      </div>
    </>
  );
});
