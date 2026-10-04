/**
 * Transitional import path for the central country registry.
 * The public registry remains in lib/country-pages-registry.ts until all
 * existing imports have migrated, so this step does not change runtime routes.
 */
export {
  countryPageRegistry,
  countryPages,
  type CountryPageRegistryEntry,
} from "@/lib/country-pages-registry"
