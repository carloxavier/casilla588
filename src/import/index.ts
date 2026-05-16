import { degiroAdapter } from "./degiro";
import { nativeAdapter } from "./native";
import { type Adapter } from "./types";

export const ADAPTERS: Adapter[] = [nativeAdapter, degiroAdapter];

export function getAdapter(id: Adapter["id"]): Adapter {
  const a = ADAPTERS.find((x) => x.id === id);
  if (!a) throw new Error(`Unknown adapter: ${id}`);
  return a;
}

export * from "./types";
export { nativeAdapter, degiroAdapter };
