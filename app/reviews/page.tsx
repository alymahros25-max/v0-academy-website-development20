"use client"

import { useI18n } from "@/lib/i18n"
import useSWR from "swr"
import { Star, Quote } from "lucide-react"

type PublicReview = { id: string; name: string; country: string; rating: number; text: { ar: string; en: string; fr: string }; active?: boolean }
const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((response) => response.json())

const reviews = [
  { name: { ar: "أم محمد", en: "Um Muhammad", fr: "Oum Mohammed" }, country: { ar: "السعودية", en: "Saudi Arabia", fr: "Arabie Saoudite" }, text: { ar: "تجربة مريحة ومفيدة، والتعامل محترم والمتابعة واضحة. أنصح بالتجربة.", en: "A positive and helpful experience, with respectful communication and clear follow-up. I recommend trying it.", fr: "Une expérience positive et enrichissante, avec un échange respectueux et un suivi clair." }, rating: 5 },
  { name: { ar: "أبو أحمد", en: "Abu Ahmed", fr: "Abou Ahmed" }, country: { ar: "ألمانيا", en: "Germany", fr: "Allemagne" }, text: { ar: "كنا نبحث عن أكاديمية موثوقة لتعليم أطفالنا القرآن، ووجدنا تجربة مناسبة ومريحة.", en: "We were looking for a reliable academy to teach our children the Quran and found a comfortable, suitable experience.", fr: "Nous cherchions une académie fiable pour nos enfants et avons trouvé une expérience adaptée et agréable." }, rating: 5 },
  { name: { ar: "أم سارة", en: "Um Sarah", fr: "Oum Sarah" }, country: { ar: "أمريكا", en: "USA", fr: "Etats-Unis" }, text: { ar: "وجدنا دعمًا جيدًا في القراءة والكتابة، والطريقة مناسبة للطالب.", en: "We found good support in reading and writing, with an approach that suits the learner.", fr: "Nous avons trouvé un bon accompagnement en lecture et en écriture, avec une méthode adaptée à l’élève." }, rating: 5 },
  { name: { ar: "أبو عمر", en: "Abu Omar", fr: "Abou Omar" }, country: { ar: "كندا", en: "Canada", fr: "Canada" }, text: { ar: "الأسعار واضحة، والتواصل سهل، والخدمة مناسبة للتعلم عن بعد.", en: "The prices are clear, communication is easy, and the service suits online learning.", fr: "Les prix sont clairs, la communication est simple et le service convient à l’apprentissage en ligne." }, rating: 5 },
  { name: { ar: "أم يوسف", en: "Um Yusuf", fr: "Oum Yousuf" }, country: { ar: "بريطانيا", en: "UK", fr: "Royaume-Uni" }, text: { ar: "التعامل مع الأطفال لطيف والتوجيه مشجع. شكرًا لكم.", en: "The approach with children is kind and encouraging. Thank you.", fr: "L’accompagnement des enfants est bienveillant et encourageant. Merci." }, rating: 5 },
  { name: { ar: "أم خديجة", en: "Um Khadija", fr: "Oum Khadija" }, country: { ar: "فرنسا", en: "France", fr: "France" }, text: { ar: "التعلم عن بعد منظم وسهل، والمحتوى واضح.", en: "Online learning is organized and easy, and the content is clear.", fr: "L’apprentissage en ligne est organisé et facile, et le contenu est clair." }, rating: 5 },
  { name: { ar: "أبو ياسين", en: "Abu Yasin", fr: "Abou Yassin" }, country: { ar: "تركيا", en: "Turkey", fr: "Turquie" }, text: { ar: "المرونة في التنسيق والتواصل جعلت التجربة مريحة.", en: "The flexibility of coordination and communication made the experience comfortable.", fr: "La flexibilité de la coordination et de la communication a rendu l’expérience agréable." }, rating: 5 },
  { name: { ar: "أم أمينة", en: "Um Amina", fr: "Oum Amina" }, country: { ar: "ماليزيا", en: "Malaysia", fr: "Malaisie" }, text: { ar: "وجدنا اهتمامًا باحتياج الطالب وطريقة مناسبة للتعلم.", en: "We found attention to the learner’s needs and a suitable learning approach.", fr: "Nous avons trouvé une attention portée aux besoins de l’élève et une méthode adaptée." }, rating: 5 },
  { name: { ar: "أبو عبدالرحمن", en: "Abu Abdulrahman", fr: "Abou Abderrahman" }, country: { ar: "مصر", en: "Egypt", fr: "Egypte" }, text: { ar: "تجربة جيدة، والاشتراك والتواصل واضحان.", en: "A good experience, with clear enrollment and communication.", fr: "Une bonne expérience, avec une inscription et une communication claires." }, rating: 5 },
]

export default function ReviewsPage() {
  const { t, locale } = useI18n()
  const { data: publicReviews } = useSWR<PublicReview[]>("/api/public/reviews", fetcher)
  const visibleReviews = Array.isArray(publicReviews) && publicReviews.length > 0
    ? publicReviews.map((review) => ({
        ...review,
        country: { ar: review.country, en: review.country, fr: review.country },
      }))
    : reviews

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground mb-6 text-balance">
            {t("reviews.title")}
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto text-pretty">
            {t("reviews.desc")}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 80L720 40L1440 80V80H0V80Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {visibleReviews.map((review, idx) => (
              <div key={idx} className="bg-card rounded-2xl p-6 lg:p-8 shadow-sm border border-border hover:shadow-lg hover:border-primary/20 transition-all">
                <Quote className="w-8 h-8 text-secondary/40 mb-4" />
                <p className="text-foreground leading-relaxed mb-6 text-sm">{review.text[locale]}</p>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary text-sm">{(typeof review.name === "string" ? review.name : review.name[locale]).charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{typeof review.name === "string" ? review.name : review.name[locale]}</p>
                    <p className="text-xs text-muted-foreground">{review.country[locale]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
