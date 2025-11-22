import { createDefine } from "fresh";

export interface State {
  visits: number;
}

export const define = createDefine<State>();
