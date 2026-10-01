import { getNewCountryConfig } from "@/lib/new-country-pages"
import { normalizeCountryPageModel, type CountryLandingData } from "@/lib/country-pages/normalizer"
import { safeValidateCountryPageModel } from "@/lib/country-pages/validation"
import { countryPages } from "@/lib/country-pages-registry"

const config = getNewCountryConfig("qatar")
if (!config) throw new Error("Qatar config is missing")

const landingData = {
  area: {
    id: 1,
    slug: "qatar",
    area_type: "country",
    country_code: "QA",
    name_ar: "قطر",
    name_en: "Qatar",
    name_fr: null,
    currency_code: "QAR",
    currency_symbol: "ر.ق",
  },
  packages: [
    {
      id: 2,
      program: "arabic",
      package_key: "arabic-30-8",
      name_ar: "العربية",
      name_en: null,
      name_fr: null,
      description_ar: null,
      description_en: null,
      description_fr: null,
      price: 130,
      currency_code: "QAR",
      sessions_per_month: 8,
      features_ar: ["حصص فردية"],
      features_en: null,
      features_fr: null,
      is_popular: false,
      sort_order: 2,
    },
    {
      id: 1,
      program: "quran",
      package_key: "quran-30-8",
      name_ar: "القرآن",
      name_en: null,
      name_fr: null,
      description_ar: null,
      description_en: null,
      description_fr: null,
      price: 98,
      currency_code: "QAR",
      sessions_per_month: 8,
      features_ar: ["حفظ ومراجعة"],
      features_en: null,
      features_fr: null,
      is_popular: true,
      sort_order: 1,
    },
  ],
  faq: [{ id: 1, question_key: "start", question_ar: "كيف أبدأ؟", question_en: null, question_fr: null, answer_ar: "تواصل معنا.", answer_en: null, answer_fr: null, sort_order: 1 }],
  content: [],
  links: [{ id: 1, link_key: "whatsapp", label_ar: "واتساب", label_en: null, label_fr: null, href: "https://example.com", link_type: "external", is_external: true, sort_order: 1 }],
  theme: null,
  cities: [{ id: 1, city_key: "doha", name_ar: "الدوحة", name_en: "Doha", region_name: null, sort_order: 1 }],
  timezones: [{ id: 1, timezone_name: "Asia/Qatar", label_ar: "توقيت قطر", label_en: "Qatar time", is_primary: true, sort_order: 1 }],
} as CountryLandingData

const model = normalizeCountryPageModel("qatar", config, landingData)

if (model.packages[0]?.sortOrder !== 1 || model.packages[0]?.program !== "quran") {
  throw new Error("Packages were not sorted or normalized by program")
}
if (model.country.slug !== "qatar" || model.country.cities[0] !== "الدوحة") {
  throw new Error("Country fields were not normalized")
}
if (!safeValidateCountryPageModel(model).success) {
  throw new Error("Normalized model failed schema validation")
}
if (new Set(countryPages.map((country) => country.href)).size !== countryPages.length) {
  throw new Error("Country registry contains duplicate URLs")
}

console.log(`Country contract check passed for ${model.country.slug}`)
