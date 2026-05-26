import { alpicComponentDefinitions } from "./catalog.js";
import { alpicComponents } from "./components.js";
import { skiComponentDefinitions } from "./catalog.ski.js";
import { skiComponents } from "./components.ski.js";

/**
 * Flip this one literal to switch which catalog the model is given.
 *
 *   "alpic" → the serious Alpic design system catalog (default)
 *   "ski"   → the ski-resort emoji catalog (chalets, skis, lifts, snowflakes…)
 *
 * Because of the `as const`, TypeScript narrows the entire app to a single
 * concrete catalog, so the types stay precise on either side of the switch.
 */
const ACTIVE_CATALOG = "ski" as const;

export const componentDefinitions =
  ACTIVE_CATALOG === "ski"
    ? skiComponentDefinitions
    : alpicComponentDefinitions;

export const components =
  ACTIVE_CATALOG === "ski" ? skiComponents : alpicComponents;
