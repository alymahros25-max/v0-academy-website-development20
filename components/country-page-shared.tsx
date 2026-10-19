import Link from "next/link"
import { CountryPagesSection } from "@/components/layout/country-pages-section"
import type { CountryPageModel } from "@/lib/country-page-model"

export function CountrySharedFooter({ page }: { page: CountryPageModel }) {
  const country = page.areaData.area?.name_ar || page.seo?.country || page.slug
  return <footer className="border-t border-border bg-primary px-5 py-10 text-primary-foreground sm:px-8"><div className="mx-auto max-w-6xl"><CountryPagesSection /><nav className="mt-8 flex flex-wrap gap-4 text-sm"><Link href="/">الرئيسية</Link><Link href="/games">الألعاب والمسابقات</Link><Link href="/library">المكتبة</Link><Link href="/teachers">المعلمون والمعلمات</Link><Link href="/blog">المدونة</Link><Link href="/contact">التواصل</Link><Link href="/privacy">سياسة الخصوصية</Link><Link href="/terms">شروط الاستخدام</Link><Link href="/refund-policy">سياسة الاسترداد</Link></nav><p className="mt-8 text-sm text-primary-foreground/75">تحفيظ القرآن وتأسيس اللغة العربية أونلاين في {country} © {new Date().getFullYear()} أكاديمية الحافظ المتميز</p></div></footer>
}

export function CountrySharedStructuredData({ page }: { page: CountryPageModel }) {
  const canonical = page.seo ? `https://quran-elhafez.com/${page.slug}` : `https://quran-elhafez.com/${page.slug}`
  const planOffers = (plans: CountryPageModel["quranPlans"]) => plans.map((plan) => ({
    "@type": "Offer",
    price: plan.price,
    priceCurrency: page.currencyCode || page.areaData.area?.currency_code || "",
    category: `${plan.monthlySessions} ${plan.monthlySessions >= 3 && plan.monthlySessions <= 10 ? "حصص" : "حصة"} شهريًا`,
    url: canonical,
  }))
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${canonical}#webpage`, url: canonical, name: page.seo?.title || page.slug, description: page.seo?.description || "", inLanguage: "ar" },
      { "@type": "Course", name: `تحفيظ القرآن أونلاين في ${page.areaData.area?.name_ar || page.seo?.country || page.slug}`, provider: { "@id": "https://quran-elhafez.com#organization" }, offers: planOffers(page.quranPlans) },
      { "@type": "Course", name: `تأسيس العربية أونلاين في ${page.areaData.area?.name_ar || page.seo?.country || page.slug}`, provider: { "@id": "https://quran-elhafez.com#organization" }, offers: planOffers(page.arabicPlans) },
      ...(page.faq.length ? [{ "@type": "FAQPage", mainEntity: page.faq.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) }] : []),
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />
}
