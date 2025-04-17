// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $api_joke from "./routes/api/joke.ts";
import * as $commute from "./routes/commute.tsx";
import * as $index from "./routes/index.tsx";
import * as $map from "./routes/map.tsx";
import * as $InteractiveMap from "./islands/InteractiveMap.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/api/joke.ts": $api_joke,
    "./routes/commute.tsx": $commute,
    "./routes/index.tsx": $index,
    "./routes/map.tsx": $map,
  },
  islands: {
    "./islands/InteractiveMap.tsx": $InteractiveMap,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
