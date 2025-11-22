import "@std/dotenv/load";

import { App, staticFiles } from "fresh";
import { stateMiddleware } from "@/routes/_middleware.ts";
import { State } from "@/utils.ts";

export const app = new App<State>()
  .use(stateMiddleware)
  .use(staticFiles())
  .fsRoutes();
