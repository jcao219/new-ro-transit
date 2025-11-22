import "@std/dotenv/load";

import { App, staticFiles } from "fresh";
import { stateMiddleware } from "@/middleware.ts";
import { State } from "@/utils.ts";

export const app = new App<State>()
  .use(staticFiles())
  .use(stateMiddleware)
  .fsRoutes();
