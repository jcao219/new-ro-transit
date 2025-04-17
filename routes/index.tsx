// routes/index.tsx
import { Head, asset } from "$fresh/runtime.ts";

export default function Home() {
  const heroGif  = "new-ro-gif.gif"; // Or "your-image-name.png", etc.

  return (
    <>
      <Head>
        <title>New Rochelle: Your Connected Urban Oasis</title>
      </Head>
      {/* Hero Section */}
      <div class="mb-8"> {/* Add margin below the image */}
        <img
          src={heroGif}
          alt="Scenic views of New Rochelle" // Add descriptive alt text
          class="w-full h-auto max-h-[58vh] object-cover rounded-lg shadow-lg"
        />
      </div>
      <div
        style="background: lightgrey;"
        class="min-h-[30vh] bg-cover bg-center rounded-lg shadow-lg flex items-center justify-center text-center p-6"
      >
        <div class="text-black max-w-3xl">
          <h1 class="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Live Near NYC, Without the Squeeze.
          </h1>
          <p class="text-xl md:text-2xl mb-8 font-light">
            Discover New Rochelle: Waterfront living, vibrant community, and a <span class="font-semibold text-green-900">~32 minute express train</span> to Grand Central Terminal.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/commute"
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md text-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              See Commute Times
            </a>
            <a
              href="/map"
              class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md text-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              View Transit Map
            </a>
          </div>
        </div>
      </div>

      {/* Optional: Add more sections below about NR amenities, etc. */}
      <div class="mt-12 p-6 bg-white rounded-lg shadow">
          <h2 class="text-3xl font-semibold mb-4 text-center">Why New Rochelle?</h2>
          <p class="text-lg text-gray-700 text-center max-w-2xl mx-auto">
              Beyond the fast commute, New Rochelle offers beautiful parks, a lively downtown, diverse dining, and a welcoming community. Explore the possibilities!
          </p>
      </div>
    </>
  );
}