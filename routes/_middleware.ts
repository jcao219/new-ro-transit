import { define } from "@/utils.ts";

interface AppState {
  visits: number;
}

export const stateMiddleware = define.middleware(async (ctx) => {
  const kv = await Deno.openKv();
  const key = ["visits"];

  try {
    await kv.atomic().sum(key, 1n).commit();
    const res = await kv.get<number>(key);
    ctx.state.visits = res.value ?? 0;
  } catch (e) {
    console.error("KV error on getting visits", e);
    ctx.state.visits = 0;
  }

  return await ctx.next();
});
