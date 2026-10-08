import { promises as fs } from "fs"
import path from "path"
import { adminDataRepository } from "@/lib/repositories"
import type { GlobalPackageRow } from "@/lib/repositories/contracts/admin-data"

const DATA_DIR = path.join(process.cwd(), "data")

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

async function readData<T>(filename: string, defaultData: T): Promise<T> {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, filename)
  try {
    const raw = await fs.readFile(filePath, "utf-8")
    return JSON.parse(raw) as T
  } catch {
    return defaultData
  }
}

async function writeData<T>(filename: string, data: T): Promise<void> {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, filename)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
}

async function readLocalFallback<T>(filename: string, defaultData: T): Promise<T> {
  return adminDataRepository ? defaultData : readData(filename, defaultData)
}

// Types
export interface Teacher {
  id: string
  name: Record<string, string>
  specialty: Record<string, string>
  experience: string
  image: string
  active: boolean
  sortOrder?: number
}

export interface Package {
  id: string
  type: "quran" | "arabic"
  name?: Record<string, string>
  sessions: number
  price: number
  duration?: number
  popular: boolean
  features: Record<string, string[]>
  active: boolean
  sortOrder?: number
}

export interface Review {
  id: string
  name: string
  country: string
  rating: number
  text: Record<string, string>
  active: boolean
  createdAt: string
  sortOrder?: number
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  message: string
  read: boolean
  createdAt: string
}

export interface SiteSettings {
  siteName: Record<string, string>
  siteDescription: Record<string, string>
  email: string
  whatsapp: string
  telegram: string
  heroTitle: Record<string, string>
  heroSubtitle: Record<string, string>
  aboutText: Record<string, string>
}

// Default data
const defaultTeachers: Teacher[] = [
  {
    id: "1",
    name: { ar: "الشيخ أحمد محمود", en: "Sheikh Ahmad Mahmoud", fr: "Cheikh Ahmad Mahmoud" },
    specialty: { ar: "حفظ القرآن والقراءات العشر", en: "Quran Memorization & Ten Qira'at", fr: "Memorisation du Coran et Dix Qira'at" },
    experience: "15",
    image: "/images/teacher-quran.webp",
    active: true,
  },
  {
    id: "2",
    name: { ar: "الأستاذة نورا الهاشمي", en: "Ustaza Noura Al-Hashimi", fr: "Ustaza Noura Al-Hashimi" },
    specialty: { ar: "تحفيظ القرآن للأطفال", en: "Quran Teaching for Children", fr: "Enseignement du Coran pour enfants" },
    experience: "10",
    image: "/images/teacher-quran.webp",
    active: true,
  },
  {
    id: "3",
    name: { ar: "الشيخ عبدالرحمن السيد", en: "Sheikh Abdulrahman Al-Sayed", fr: "Cheikh Abdulrahman Al-Sayed" },
    specialty: { ar: "التجويد وعلم القراءات", en: "Tajweed & Qira'at Science", fr: "Tajweed et Science des Qira'at" },
    experience: "12",
    image: "/images/teacher-quran.webp",
    active: true,
  },
  {
    id: "4",
    name: { ar: "الأستاذة فاطمة العلي", en: "Ustaza Fatima Al-Ali", fr: "Ustaza Fatima Al-Ali" },
    specialty: { ar: "تأسيس اللغة العربية", en: "Arabic Language Foundation", fr: "Fondation de la langue arabe" },
    experience: "8",
    image: "/images/teacher-quran.webp",
    active: true,
  },
  {
    id: "5",
    name: { ar: "الشيخ محمد حسن", en: "Sheikh Muhammad Hassan", fr: "Cheikh Muhammad Hassan" },
    specialty: { ar: "الحفظ المتقن والمراجعة", en: "Expert Memorization & Review", fr: "Memorisation experte et revision" },
    experience: "20",
    image: "/images/teacher-quran.webp",
    active: true,
  },
  {
    id: "6",
    name: { ar: "الأستاذة مريم خالد", en: "Ustaza Maryam Khalid", fr: "Ustaza Maryam Khalid" },
    specialty: { ar: "تعليم العربية لغير الناطقين بها", en: "Arabic for Non-Native Speakers", fr: "Arabe pour non-arabophones" },
    experience: "7",
    image: "/images/teacher-quran.webp",
    active: true,
  },
]

const defaultPackages: Package[] = [
  { id: "q1", type: "quran", sessions: 4, price: 15, popular: false, features: { ar: ["مرونة في اختيار الوقت", "معلمون مجازون", "إشراف ومتابعة", "حفظ وتجويد ومراجعة وتفسير"], en: ["Flexible scheduling", "Certified teachers", "Supervision & follow-up", "Memorization, Tajweed, review & interpretation"], fr: ["Horaires flexibles", "Enseignants certifies", "Supervision et suivi", "Memorisation, Tajweed, revision et interpretation"] }, active: true },
  { id: "q2", type: "quran", sessions: 8, price: 28, popular: true, features: { ar: ["مرونة في اختيار الوقت", "معلمون مجازون", "إشراف ومتابعة", "حفظ وتجويد ومراجعة وتفسير"], en: ["Flexible scheduling", "Certified teachers", "Supervision & follow-up", "Memorization, Tajweed, review & interpretation"], fr: ["Horaires flexibles", "Enseignants certifies", "Supervision et suivi", "Memorisation, Tajweed, revision et interpretation"] }, active: true },
  { id: "q3", type: "quran", sessions: 12, price: 42, popular: false, features: { ar: ["مرونة في اختيار الوقت", "معلمون مجازون", "إشراف ومتابعة", "حفظ وتجويد ومراجعة وتفسير"], en: ["Flexible scheduling", "Certified teachers", "Supervision & follow-up", "Memorization, Tajweed, review & interpretation"], fr: ["Horaires flexibles", "Enseignants certifies", "Supervision et suivi", "Memorisation, Tajweed, revision et interpretation"] }, active: true },
  { id: "a1", type: "arabic", sessions: 4, price: 24, popular: false, features: { ar: ["قراءة وكتابة بطرق حديثة", "معلمون متخصصون", "إشراف ومتابعة", "إملاء وتعبير"], en: ["Reading & writing with modern methods", "Specialized teachers", "Supervision & follow-up", "Dictation & expression"], fr: ["Lecture et ecriture modernes", "Enseignants specialises", "Supervision et suivi", "Dictee et expression"] }, active: true },
  { id: "a2", type: "arabic", sessions: 8, price: 38, popular: true, features: { ar: ["قراءة وكتابة بطرق حديثة", "معلمون متخصصون", "إشراف ومتابعة", "إملاء وتعبير"], en: ["Reading & writing with modern methods", "Specialized teachers", "Supervision & follow-up", "Dictation & expression"], fr: ["Lecture et ecriture modernes", "Enseignants specialises", "Supervision et suivi", "Dictee et expression"] }, active: true },
  { id: "a3", type: "arabic", sessions: 12, price: 50, popular: false, features: { ar: ["قراءة وكتابة بطرق حديثة", "معلمون متخصصون", "إشراف ومتابعة", "إملاء وتعبير"], en: ["Reading & writing with modern methods", "Specialized teachers", "Supervision & follow-up", "Dictation & expression"], fr: ["Lecture et ecriture modernes", "Enseignants specialises", "Supervision et suivi", "Dictee et expression"] }, active: true },
]

const defaultReviews: Review[] = [
  { id: "1", name: "أم يوسف - مصر", country: "EG", rating: 5, text: { ar: "الحمد لله، ابني حفظ جزء عم في 3 أشهر مع الشيخ أحمد. المعلم ممتاز وصبور جداً مع الأطفال. أنصح الجميع بهذه الأكاديمية.", en: "Alhamdulillah, my son memorized Juz Amma in 3 months with Sheikh Ahmad. Excellent and patient teacher. I recommend this academy to everyone.", fr: "Mon fils a memorise Juz Amma en 3 mois. Enseignant excellent et patient." }, active: true, createdAt: "2025-01-15" },
  { id: "2", name: "Abu Ahmad - UK", country: "GB", rating: 5, text: { ar: "أفضل أكاديمية أون لاين تعاملت معها. المعلمون محترفون والأسعار ممتازة مقارنة بالجودة العالية.", en: "Best online academy I've dealt with. Professional teachers and excellent prices for the high quality.", fr: "Meilleure academie en ligne. Enseignants professionnels et prix excellents." }, active: true, createdAt: "2025-02-10" },
  { id: "3", name: "فاطمة - السعودية", country: "SA", rating: 5, text: { ar: "بنتي تحسنت كثيراً في القراءة والكتابة بعد الاشتراك في باقة تأسيس العربي. شكراً لجهودكم.", en: "My daughter improved greatly in reading and writing after subscribing to the Arabic foundation package. Thank you.", fr: "Ma fille s'est beaucoup amelioree en lecture et ecriture. Merci." }, active: true, createdAt: "2025-03-05" },
  { id: "4", name: "Mohamed - France", country: "FR", rating: 5, text: { ar: "كأب مسلم في فرنسا، كنت أبحث عن أكاديمية موثوقة لتعليم أبنائي القرآن. وجدت ما أبحث عنه هنا.", en: "As a Muslim father in France, I was looking for a reliable academy to teach my children the Quran. Found what I was looking for here.", fr: "En tant que pere musulman en France, j'ai trouve l'academie ideale pour mes enfants." }, active: true, createdAt: "2025-03-20" },
]

const defaultSettings: SiteSettings = {
  siteName: { ar: "أكاديمية الحافظ المتميز", en: "Al-Hafiz Al-Mutamayez Academy", fr: "Academie Al-Hafiz Al-Mutamayez" },
  siteDescription: { ar: "أكاديمية عالمية لتحفيظ القرآن الكريم وتأسيس اللغة العربية اون لاين", en: "A global online academy for Quran memorization and Arabic language foundation", fr: "Academie mondiale en ligne pour la memorisation du Coran" },
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  whatsapp: "https://bit.ly/4aJfOl6",
  telegram: "https://t.me/acabemy_quraan",
  heroTitle: { ar: "أكاديمية الحافظ المتميز", en: "Al-Hafiz Al-Mutamayez Academy", fr: "Academie Al-Hafiz Al-Mutamayez" },
  heroSubtitle: { ar: "أكاديمية عالمية لتحفيظ القرآن الكريم وتأسيس اللغة العربية اون لاين", en: "A Global Online Academy for Quran Memorization & Arabic Language Foundation", fr: "Academie mondiale en ligne pour la memorisation du Coran et l'enseignement de la langue arabe" },
  aboutText: { ar: "أكاديمية الحافظ المتميز هي منصة تعليمية عالمية متخصصة", en: "Al-Hafiz Academy is a global educational platform", fr: "L'academie est une plateforme educative mondiale" },
}

// Repository is the source of truth when configured; JSON is a local-development fallback only.
async function getPersistent<T>(contentType: string, fallback: T): Promise<T> {
  if (!adminDataRepository) return fallback
  const rows = await adminDataRepository.listContent(contentType)
  if (!rows.length) return fallback
  if (contentType === "settings") return (rows[0]?.data ?? fallback) as T
  return rows.map((row) => row.data) as T
}

async function setPersistent<T extends Array<{ id?: string }> | SiteSettings>(contentType: string, data: T) {
  if (!adminDataRepository) return false
  const entries = contentType === "settings"
    ? [{ content_id: "site", data }]
    : (data as Array<{ id?: string }>).map((item, index) => ({ content_id: String(item.id ?? index), data: item }))
  await adminDataRepository.replaceContent(contentType, entries)
  return true
}

async function writeLocalFallback<T>(filename: string, data: T) {
  if (process.env.NODE_ENV === "production") throw new Error("Database not configured; persistent admin writes are disabled")
  await writeData(filename, data)
}

export const getTeachers = async () => {
  const teachers = await getPersistent<Teacher[]>("teachers", await readLocalFallback("teachers.json", defaultTeachers))
  return teachers.map((teacher, index) => ({ ...teacher, sortOrder: teacher.sortOrder ?? index + 1 })).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}
export const setTeachers = async (data: Teacher[]) => { if (!(await setPersistent("teachers", data))) await writeLocalFallback("teachers.json", data) }
type PackageRow = GlobalPackageRow

function packageRowToPackage(row: PackageRow): Package {
  return {
    id: row.id,
    type: row.type,
    name: { ar: row.name_ar, en: row.name_en, fr: row.name_fr },
    sessions: row.sessions,
    price: Number(row.price),
    duration: row.duration,
    popular: row.popular,
    active: row.active,
    features: {
      ar: row.features_ar.split("،").map((item) => item.trim()).filter(Boolean),
      en: row.features_en.split(",").map((item) => item.trim()).filter(Boolean),
      fr: row.features_fr.split(",").map((item) => item.trim()).filter(Boolean),
    },
    sortOrder: row.sort_order,
  }
}

function packageToRow(pkg: Package, index: number): PackageRow {
  const features = pkg.features ?? { ar: [], en: [], fr: [] }
  return {
    id: pkg.id || `package-${index + 1}`,
    type: pkg.type,
    name_ar: pkg.name?.ar || `باقة ${pkg.sessions} ${pkg.sessions === 12 ? "حصة" : "حصص"}`,
    name_en: pkg.name?.en || `${pkg.sessions} Sessions Package`,
    name_fr: pkg.name?.fr || `Forfait ${pkg.sessions} séances`,
    sessions: pkg.sessions,
    price: pkg.price,
    duration: 30,
    features_ar: (features.ar ?? []).join("، "),
    features_en: (features.en ?? features.ar ?? []).join(", "),
    features_fr: (features.fr ?? features.ar ?? []).join(", "),
    popular: Boolean(pkg.popular),
    active: pkg.active !== false,
    sort_order: pkg.sortOrder ?? index + 1,
  }
}

export const getPackages = async (): Promise<Package[]> => {
  const fallback = await readLocalFallback<Package[]>("packages.json", defaultPackages)
  if (adminDataRepository) {
    const data = await adminDataRepository.listPackages()
    if (data.length) return data.filter((row) => row.duration === 30).map(packageRowToPackage)
  }
  return fallback.filter((pkg) => pkg.duration === 30).map((pkg, index) => ({ ...pkg, sortOrder: pkg.sortOrder ?? index + 1 })).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

export const setPackages = async (data: Package[]) => {
  if (adminDataRepository) {
    const rows = data.filter((pkg) => pkg.duration === 30).map(packageToRow)
    const saved = await adminDataRepository.replacePackages(rows)
    return saved.length ? saved.map(packageRowToPackage) : data
  }
  await writeLocalFallback("packages.json", data)
  return data
}
export const getReviews = async () => {
  const reviews = await getPersistent<Review[]>("reviews", await readLocalFallback("reviews.json", defaultReviews))
  return reviews.map((review, index) => ({ ...review, sortOrder: review.sortOrder ?? index + 1 })).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}
export const setReviews = async (data: Review[]) => { if (!(await setPersistent("reviews", data))) await writeLocalFallback("reviews.json", data) }
export const getMessages = async () => getPersistent<ContactMessage[]>("messages", await readLocalFallback("messages.json", []))
export const addMessage = async (message: ContactMessage) => {
  if (adminDataRepository) {
    await adminDataRepository.addContent("messages", message.id, message)
    return
  }

  const messages = await getMessages()
  await writeLocalFallback("messages.json", [...messages, message])
}
export const setMessages = async (data: ContactMessage[]) => { if (!(await setPersistent("messages", data))) await writeLocalFallback("messages.json", data) }
export const getSettings = async () => getPersistent<SiteSettings>("settings", await readLocalFallback("settings.json", defaultSettings))
export const setSettings = async (data: SiteSettings) => { if (!(await setPersistent("settings", data))) await writeLocalFallback("settings.json", data) }
