import { z } from "zod"

const localizedText = z.record(z.string(), z.string()).default({})

export const teacherSchema = z.object({
  id: z.string().optional(),
  name: localizedText,
  specialty: localizedText,
  experience: z.union([z.string(), z.number()]),
  image: z.string().max(2000),
  active: z.boolean(),
  sortOrder: z.number().int().nonnegative().optional(),
}).strict()

export const packageSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["quran", "arabic"]),
  name: localizedText.optional(),
  sessions: z.number().int().positive(),
  price: z.number().nonnegative(),
  duration: z.number().int().positive().optional(),
  popular: z.boolean(),
  features: z.record(z.string(), z.array(z.string())),
  active: z.boolean(),
  sortOrder: z.number().int().nonnegative().optional(),
}).strict()

export const reviewSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1).max(200),
  country: z.string().trim().min(2).max(3),
  rating: z.number().int().min(1).max(5),
  text: localizedText,
  active: z.boolean(),
  createdAt: z.string().optional(),
  sortOrder: z.number().int().nonnegative().optional(),
}).strict()

export const messageSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(40),
  message: z.string().trim().min(1).max(10000),
  read: z.boolean(),
  createdAt: z.string().optional(),
}).strict()

export const settingsSchema = z.object({
  siteName: localizedText,
  siteDescription: localizedText,
  email: z.string().email().or(z.literal("")),
  whatsapp: z.string().max(2000),
  heroTitle: localizedText,
  heroSubtitle: localizedText,
  aboutText: localizedText,
}).strict()

export const adminDataSchemas = {
  teachers: teacherSchema,
  packages: packageSchema,
  reviews: reviewSchema,
  messages: messageSchema,
  settings: settingsSchema,
} as const

export function validateAdminData(type: string, data: unknown, partial = false) {
  const schema = adminDataSchemas[type as keyof typeof adminDataSchemas]
  return schema ? (partial ? schema.partial().safeParse(data) : schema.safeParse(data)) : null
}
