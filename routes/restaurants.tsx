// routes/restaurants.tsx
import { Head } from "$fresh/runtime.ts";
import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
// Import the restaurant data
import restaurantData from "../data/eats.json" with { type: "json" };

// Define the shape of a single restaurant item
interface RestaurantInfo {
  name: string;
  cuisine: string;
  area: string;
  notes?: string; // Optional notes
  website?: string; // Optional website link
}

// Define the data structure passed to the page component
interface RestaurantPageData {
  restaurants: RestaurantInfo[];
}

// Handler to load data (runs on the server)
export const handler: Handlers<RestaurantPageData> = {
  GET(_req: Request, ctx: FreshContext) {
    // Extract the restaurants array from the imported JSON data
    const restaurants: RestaurantInfo[] = restaurantData.restaurants;
    // Pass the data to the rendering context
    return ctx.render({ restaurants });
  },
};

// Page component (receives data via props)
export default function RestaurantPage({ data }: PageProps<RestaurantPageData>) {
  const { restaurants } = data; // Extract restaurants array from props

  return (
    <>
      <Head>
        <title>New Rochelle Restaurants | Dining Guide</title>
        <meta name="description" content="Explore diverse dining options available in New Rochelle, NY." />
      </Head>
      <div class="max-w-screen-lg mx-auto">
        <h1 class="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Dining in New Rochelle</h1>
        <p class="mb-8 text-lg text-gray-600">
          From casual cafes to waterfront dining, discover some of the great places to eat around the city. (Sample Data)
        </p>

        {/* Restaurant Cards Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((resto, index) => (
            <div key={index} class="bg-white p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between">
              {/* Main Info */}
              <div>
                <h2 class="text-xl font-semibold mb-1 text-blue-700">{resto.name}</h2>
                <p class="text-sm font-medium text-gray-500 mb-2">{resto.cuisine}</p>
                <p class="text-sm text-gray-700 mb-3">
                  <span class="font-medium">Area:</span> {resto.area}
                </p>
                {resto.notes && (
                  <p class="text-sm text-gray-600 italic mb-3">{resto.notes}</p>
                )}
              </div>

              {/* Optional Link */}
              {resto.website && resto.website !== "#" && ( // Only show if website exists and isn't just '#'
                <div class="mt-auto pt-3 border-t border-gray-100">
                  <a
                    href={resto.website}
                    target="_blank" // Open in new tab
                    rel="noopener noreferrer" // Security best practice for target="_blank"
                    class="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    Visit Website &rarr;
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

         <div class="mt-10 text-center">
             <a href="/" class="text-blue-600 hover:underline font-medium">
                &larr; Back Home
             </a>
         </div>
      </div>
    </>
  );
}