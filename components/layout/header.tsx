"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useI18n, type Locale } from "@/lib/i18n"
import { getPublicWidgets } from "@/lib/public-widgets-client"
import { Menu, X, ChevronDown, Globe } from "lucide-react"

const localeLabels: Record<Locale, string> = {
  ar: "العربية",
  en: "English",
  fr: "Français",
}

type NavbarConfig = { items: string[] }
const defaultNavbar: NavbarConfig = { items: ["home", "about", "quran", "arabic", "teachers", "reviews", "library", "classroom", "games", "faq", "blog", "contact", "account"] }

export function Header() {
  const { t, locale, setLocale, dir } = useI18n()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const moreButtonRef = useRef<HTMLButtonElement>(null)
  const [navbar, setNavbar] = useState(defaultNavbar)
  const [navbarLoaded, setNavbarLoaded] = useState(false)
  const [navbarEnabled, setNavbarEnabled] = useState(true)

  useEffect(() => {
    let frame = 0

    const handleScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20)
        frame = 0
      })
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    let active = true
    type IdleWindow = Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number
      cancelIdleCallback?: (handle: number) => void
    }

    const idleWindow = window as IdleWindow
    let idleHandle: number | undefined
    let timeoutHandle: number | undefined
    const loadNavbar = async (refresh = false) => {
      try {
        const widgets = await getPublicWidgets(refresh)
        const row = widgets.find((item) => item.widget_type === "navbar")
        if (!active || !row) return
        const candidate = row.config_json as Partial<NavbarConfig>
        const allowed = new Set(defaultNavbar.items)
        const items = Array.isArray(candidate.items) ? candidate.items.filter((item): item is string => typeof item === "string" && allowed.has(item)) : defaultNavbar.items
        setNavbar({ items })
        setNavbarEnabled(row.is_enabled)
        setNavbarLoaded(true)
      } catch { /* keep compiled navigation as a safe fallback */ }
    }

    const handleWidgetsUpdated = () => { void loadNavbar(true) }
    window.addEventListener("widgets:updated", handleWidgetsUpdated)
    if (idleWindow.requestIdleCallback) {
      idleHandle = idleWindow.requestIdleCallback(() => { void loadNavbar() }, { timeout: 2000 })
    } else {
      timeoutHandle = window.setTimeout(() => { void loadNavbar() }, 600)
    }

    return () => {
      active = false
      if (idleHandle !== undefined) idleWindow.cancelIdleCallback?.(idleHandle)
      if (timeoutHandle !== undefined) window.clearTimeout(timeoutHandle)
      window.removeEventListener("widgets:updated", handleWidgetsUpdated)
    }
  }, [])

  const navLinks = [
    { key: "home", href: "/", label: t("nav.home") },
    { key: "about", href: "/about", label: t("nav.about") },
    { key: "quran", href: "/quran", label: locale === "ar" ? "أسعار تحفيظ القرآن" : locale === "en" ? "Quran Pricing" : "Tarifs mémorisation du Coran", desktopLabel: locale === "ar" ? "تحفيظ القرآن" : locale === "en" ? "Quran & Tajweed" : "Coran et tajwid" },
    { key: "arabic", href: "/arabic", label: locale === "ar" ? "أسعار تأسيس العربي" : locale === "en" ? "Arabic Foundation Pricing" : "Tarifs fondation arabe", desktopLabel: locale === "ar" ? "تأسيس العربية" : locale === "en" ? "Arabic Foundation" : "Fondements de l’arabe" },
    { key: "teachers", href: "/teachers", label: t("nav.teachers") },
    { key: "reviews", href: "/reviews", label: t("nav.reviews") },
    { key: "library", href: "/library", label: t("nav.library") },
    { key: "classroom", href: "/classroom-moments", label: locale === "ar" ? "فيديوهات من حصصنا" : locale === "fr" ? "Vidéos de nos cours" : "Videos from our classes" },
    { key: "games", href: "/games", label: t("nav.games") },
    { key: "faq", href: "/faq", label: t("nav.faq") },
    { key: "blog", href: "/blog", label: t("nav.blog") },
    { key: "contact", href: "/contact", label: t("nav.contact") },
    { key: "account", href: "/account", label: t("nav.account") },
  ]
  const activeNavLinks = navbarLoaded ? (navbarEnabled ? navbar.items.flatMap((key) => { const item = navLinks.find((link) => link.key === key); return item ? [item] : [] }) : []) : navLinks
  const desktopPrimaryKeys = ["home", "quran", "arabic", "teachers", "classroom", "reviews"]
  const desktopPrimaryLinks = desktopPrimaryKeys.flatMap((key) => {
    const item = activeNavLinks.find((link) => link.key === key)
    return item ? [item] : []
  })
  const desktopMoreLinks = activeNavLinks.filter((link) => !desktopPrimaryKeys.includes(link.key))

  return (
    <header
      dir={dir}
      className={`primary-site-header fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy-primary/95 backdrop-blur-md shadow-lg xl:bg-[#173B54]/95"
          : "bg-navy-primary xl:bg-[#173B54]"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between min-h-20 py-2 lg:min-h-24">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-navy-light overflow-hidden">
            <Image src="/logo-128.webp" alt="شعار أكاديمية الحافظ المتميز" width={56} height={56} sizes="56px" quality={75} style={{ width: "56px", height: "56px" }} className="size-14 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className={`font-bold text-sm lg:text-base leading-tight ${scrolled ? "text-white" : "text-white"}`}>
              {locale === "ar" ? "الحافظ المتميز" : "Al-Hafiz Academy"}
            </span>
            <span className={`text-[10px] lg:text-xs text-navy-pale`}>
              {locale === "ar" ? "أكاديمية اون لاين" : "Online Academy"}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-0.5">
          {desktopPrimaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-lg px-2 py-2 text-sm font-bold text-white transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F2C14E]"
            >
              {link.desktopLabel ?? link.label}
            </Link>
          ))}
          {desktopMoreLinks.length > 0 && (
            <div
              className="relative"
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setMoreOpen(false)
                  moreButtonRef.current?.focus()
                }
              }}
            >
              <button
                ref={moreButtonRef}
                type="button"
                aria-expanded={moreOpen}
                aria-controls="desktop-more-menu"
                aria-label={locale === "ar" ? "المزيد من الصفحات" : locale === "fr" ? "Plus de pages" : "More pages"}
                onClick={() => setMoreOpen((open) => !open)}
                className="inline-flex whitespace-nowrap items-center gap-1 rounded-lg border border-white/25 bg-white/10 px-2.5 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F2C14E]"
              >
                {locale === "ar" ? "المزيد" : locale === "fr" ? "Plus" : "More"}
                <ChevronDown className={`size-4 transition-transform ${moreOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              {moreOpen && <div aria-hidden="true" className="fixed inset-0 z-10" onClick={() => setMoreOpen(false)} />}
              <div id="desktop-more-menu" hidden={!moreOpen} className="absolute end-0 top-full z-20 mt-2 w-64 overflow-hidden rounded-xl border border-[#173B54]/15 bg-white py-2 text-[#173B54] shadow-[0_18px_50px_rgba(16,42,67,0.22)]">
                {desktopMoreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMoreOpen(false)}
                    className="block px-4 py-2.5 text-start text-sm font-semibold leading-6 text-[#173B54] transition-colors hover:bg-[#EEF4F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#173B54]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              aria-label={locale === "ar" ? "تغيير اللغة" : locale === "en" ? "Change language" : "Changer la langue"}
              aria-expanded={langOpen}
              aria-haspopup="menu"
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm transition-colors xl:py-2 xl:font-semibold xl:text-white xl:hover:bg-white/10 ${
                scrolled
                  ? "text-foreground hover:bg-primary/10 xl:text-white"
                  : "text-primary-foreground lg:text-foreground hover:bg-primary/10 xl:text-white"
              }`}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{localeLabels[locale]}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                <div className="absolute top-full mt-1 min-w-[140px] overflow-hidden rounded-lg border border-border bg-card text-foreground shadow-xl z-20 end-0">
                  {(Object.keys(localeLabels) as Locale[]).map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setLocale(loc)
                        setLangOpen(false)
                      }}
                      className={`block w-full px-4 py-2.5 text-sm text-start transition-colors hover:bg-primary/10 ${
                        locale === loc ? "bg-primary/5 text-primary font-medium" : "text-foreground"
                      }`}
                    >
                      {localeLabels[loc]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* CTA Button */}
          <Link
            href="/contact"
            className="hidden min-h-11 items-center rounded-lg bg-secondary px-4 py-2 text-sm font-extrabold text-secondary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:brightness-110 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary/40 sm:inline-flex xl:min-h-12 xl:rounded-xl xl:bg-[#F2C14E] xl:px-5 xl:py-3 xl:text-base xl:text-[#173B54] xl:hover:bg-[#FFD36B]"
          >
            {t("nav.subscribe")}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className={`p-2 rounded-lg transition-colors xl:hidden ${
              scrolled ? "text-foreground" : "text-primary-foreground lg:text-foreground"
            } xl:text-white xl:hover:bg-white/10`}
            aria-label={locale === "ar" ? "فتح قائمة التنقل" : locale === "fr" ? "Ouvrir le menu" : "Open navigation menu"}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - slides from the right */}
      <div
        id="mobile-navigation"
        aria-hidden={!mobileOpen}
        className={`xl:hidden fixed inset-0 top-[80px] z-40 transition-all duration-300 lg:top-24 ${
          mobileOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-foreground/40 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-0 ${dir === "rtl" ? "right-0" : "left-0"} h-full w-[min(88vw,20rem)] bg-card shadow-2xl transition-transform duration-300 overflow-y-auto ${
            mobileOpen
              ? "translate-x-0"
              : dir === "rtl" ? "translate-x-full" : "-translate-x-full"
          }`}
          dir={dir}
        >
          <nav className="p-4 flex flex-col gap-1">
            {activeNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-foreground font-medium rounded-lg transition-colors hover:bg-primary/10 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-4 min-h-12 rounded-lg bg-secondary px-4 py-3 text-center font-extrabold text-secondary-foreground transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary/40 xl:rounded-xl xl:bg-[#F2C14E] xl:text-base xl:text-[#173B54] xl:hover:bg-[#FFD36B]"
            >
              {t("nav.subscribe")}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
