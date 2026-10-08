import type { LucideIcon } from "lucide-react"
import {
  BarChart3,
  BookOpen,
  FileText,
  Film,
  Gamepad2,
  Languages,
  LayoutDashboard,
  Lock,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Package,
  Palette,
  Search,
  Settings,
  Star,
  Users,
} from "lucide-react"

export type AdminTabId =
  | "faq" | "country-pages" | "saudi-landing" | "uae-landing" | "dashboard"
  | "packages" | "teachers" | "reviews" | "messages" | "settings" | "pages"
  | "seo-guide" | "cms" | "theme" | "pages-builder" | "users" | "classroom-videos"
  | "educational-games" | "gsc-dashboard" | "request-indexing" | "blog" | "library" | "legal" | "widgets"

export type AdminNavigationItem = {
  id: AdminTabId
  label: string
  key: string
  icon: LucideIcon
  group: string
}

export function getAdminNavigation(t: (key: string) => string): AdminNavigationItem[] {
  return [
    { id: "dashboard", label: t("admin.dashboard"), key: "admin.dashboard", icon: LayoutDashboard, group: "الرئيسية" },
    { id: "country-pages", label: "صفحاتنا حسب الدولة", key: "admin.countryPages", icon: MapPin, group: "محتوى الموقع" },
    { id: "saudi-landing", label: "صفحة الهبوط السعودية", key: "admin.saudiLanding", icon: MapPin, group: "محتوى الموقع" },
    { id: "uae-landing", label: "صفحة الهبوط الإماراتية", key: "admin.uaeLanding", icon: MapPin, group: "محتوى الموقع" },
    { id: "faq", label: "الأسئلة الشائعة", key: "admin.faq", icon: MessageSquare, group: "محتوى الموقع" },
    { id: "packages", label: t("admin.packages"), key: "admin.packages", icon: Package, group: "محتوى الموقع" },
    { id: "teachers", label: t("admin.teachers"), key: "admin.teachers", icon: Users, group: "محتوى الموقع" },
    { id: "reviews", label: t("admin.reviews"), key: "admin.reviews", icon: Star, group: "محتوى الموقع" },
    { id: "messages", label: t("admin.messages"), key: "admin.messages", icon: Mail, group: "محتوى الموقع" },
    { id: "cms", label: "صفحات الموقع والمحتوى", key: "admin.cms", icon: BookOpen, group: "محتوى الموقع" },
    { id: "pages", label: "إدارة الصفحات", key: "admin.pages", icon: FileText, group: "محتوى الموقع" },
    { id: "blog", label: t("admin.blog"), key: "admin.blog", icon: BookOpen, group: "محتوى الموقع" },
    { id: "library", label: "المكتبة الرقمية", key: "admin.library", icon: BookOpen, group: "محتوى الموقع" },
    { id: "legal", label: "الصفحات القانونية", key: "admin.legal", icon: FileText, group: "محتوى الموقع" },
    { id: "classroom-videos", label: t("admin.classroomVideos"), key: "admin.classroomVideos", icon: Film, group: "الخدمات التعليمية" },
    { id: "educational-games", label: t("admin.educationalGames"), key: "admin.educationalGames", icon: Gamepad2, group: "الخدمات التعليمية" },
    { id: "pages-builder", label: t("admin.pagesBuilder"), key: "admin.pagesBuilder", icon: FileText, group: "أدوات الموقع" },
    { id: "widgets", label: "الأدوات والقوائم", key: "admin.widgets", icon: Menu, group: "أدوات الموقع" },
    { id: "theme", label: "المظهر والمعاينة الحية", key: "admin.theme", icon: Palette, group: "أدوات الموقع" },
    { id: "seo-guide", label: "دليل تحسين محركات البحث", key: "admin.seoGuide", icon: Languages, group: "أدوات الموقع" },
    { id: "gsc-dashboard", label: "لوحة Google Search Console", key: "admin.gscDashboard", icon: BarChart3, group: "أدوات الموقع" },
    { id: "request-indexing", label: "طلب فهرسة صفحة", key: "admin.requestIndexing", icon: Search, group: "أدوات الموقع" },
    { id: "users", label: "المستخدمون والصلاحيات", key: "admin.users", icon: Lock, group: "إدارة النظام" },
    { id: "settings", label: "إعدادات لوحة التحكم", key: "admin.settings", icon: Settings, group: "إدارة النظام" },
  ]
}
