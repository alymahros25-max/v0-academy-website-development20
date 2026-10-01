import { z } from "zod"
import type { CountryPageModel } from "@/lib/country-pages/types"

const nonEmpty = z.string().trim().min(1)

export const countryPageModelSchema = z.object({
  country: z.object({
    slug: nonEmpty.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    nameAr: nonEmpty,
    nameEn: z.string().optional(),
    countryCode: nonEmpty.length(2),
    currencyCode: nonEmpty,
    currencySymbol: nonEmpty,
    timezone: z.string().optional(),
    cities: z.array(nonEmpty),
  }),
  seo: z.object({
    title: nonEmpty,
    description: nonEmpty,
    canonical: z.string().url(),
    keywords: z.array(nonEmpty),
    robots: z.object({ index: z.boolean(), follow: z.boolean() }),
    ogImage: z.string().url().optional(),
  }),
  theme: z.object({
    primary: nonEmpty,
    accent: nonEmpty,
    background: nonEmpty,
    surface: nonEmpty,
    ink: nonEmpty,
  }),
  sections: z.array(z.object({
    key: nonEmpty,
    type: nonEmpty,
    variant: nonEmpty,
    sortOrder: z.number().int().nonnegative(),
    isActive: z.boolean(),
    settings: z.record(z.string(), z.unknown()).optional(),
  })),
  packages: z.array(z.object({
    id: nonEmpty,
    program: z.enum(["quran", "arabic", "other"]),
    name: nonEmpty,
    price: z.number().finite().nonnegative(),
    currencyCode: nonEmpty,
    sessionsPerMonth: z.number().int().positive(),
    features: z.array(z.string()),
    popular: z.boolean(),
    sortOrder: z.number().int().nonnegative(),
  })),
  faq: z.array(z.object({
    id: nonEmpty,
    question: nonEmpty,
    answer: nonEmpty,
    sortOrder: z.number().int().nonnegative(),
  })),
  links: z.array(z.object({
    key: nonEmpty,
    href: nonEmpty,
    label: nonEmpty,
    type: nonEmpty,
    external: z.boolean(),
    sortOrder: z.number().int().nonnegative(),
  })),
  teachers: z.array(z.object({
    id: nonEmpty,
    sortOrder: z.number().int().nonnegative(),
    bio: z.string().optional(),
  })),
  assets: z.array(z.object({
    key: nonEmpty,
    url: nonEmpty,
    alt: nonEmpty,
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
  })),
  status: z.enum(["baseline", "in-progress", "migrated", "verified"]),
  schemaVersion: z.number().int().positive(),
})

export function validateCountryPageModel(value: unknown): CountryPageModel {
  return countryPageModelSchema.parse(value) as CountryPageModel
}

export function safeValidateCountryPageModel(value: unknown) {
  return countryPageModelSchema.safeParse(value)
}
