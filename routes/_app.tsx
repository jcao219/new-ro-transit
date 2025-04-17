// routes/_app.tsx
import { type PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

const SITE_NAME = "NewRoTransitInfo";

export default function App({ Component }: PageProps) {
  return (
    <html lang="en">
      <Head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Rochelle: Your Connected Urban Oasis</title>
        <meta name="description" content="Discover why New Rochelle's unbeatable transit connections make it the perfect place to live for NYC commuters." />
        {/* Link to the Tailwind CSS output file */}
        <link rel="stylesheet" href="/styles.css" />
        {/* Link to Leaflet CSS (Essential for the map island) */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          crossOrigin=""
        />
      </Head>
      <body class="bg-gray-100 text-gray-800">
          <nav class="container mx-auto flex justify-between items-center p-4">
            <a href="/" class="text-2xl font-bold text-blue-700 hover:text-blue-800">
              {SITE_NAME}
            </a>
            <div class="space-x-4">
              <a href="/" class="text-gray-700 hover:text-blue-600 font-medium">Home</a>
              <a href="/commute" class="text-gray-700 hover:text-blue-600 font-medium">Commute</a>
              <a href="/map" class="text-gray-700 hover:text-blue-600 font-medium">Map</a>
              {/* Add links to future pages: /about, /landmarks etc. */}
            </div>
          </nav>

        {/* Render the specific page component here */}
        <main class="container mx-auto p-4 md:p-6">
          <Component />
        </main>

        <footer class="text-center py-6 mt-10 text-gray-500 text-sm border-t border-gray-200">
          <p>&copy; {new Date().getFullYear()} | Jimmy C (VimPro) of Downtown New Rochelle</p>
          <span class="row">
            <label for="src_repo">Built with Deno & Fresh & Gemini 2.5: </label>
            <a id="src_repo" href="https://github.com/jcao219/new-ro-transit" class="text-blue-600 hover:text-blue-800">
              GitHub Repository
            </a>
          </span>
        </footer>
      </body>
    </html>
  );
}