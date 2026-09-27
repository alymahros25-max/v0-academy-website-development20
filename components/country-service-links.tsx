import Link from "next/link"

export function CountryServiceLinks() {
  return (
    <section className="mx-auto my-12 max-w-5xl rounded-2xl border border-border bg-card px-6 py-8 text-center shadow-sm sm:px-8" aria-labelledby="country-service-links-title">
      <h2 id="country-service-links-title" className="text-2xl font-bold text-foreground">تعرّف على البرامج التعليمية</h2>
      <p className="mx-auto mt-3 max-w-3xl leading-7 text-muted-foreground">تعرّف على تفاصيل البرنامج العام، ثم تواصل معنا لاختيار ما يناسب هدف الطالب.</p>
      <nav className="mt-6 flex flex-wrap justify-center gap-3" aria-label="صفحات برامج التعليم">
        <Link className="rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90" href="/quran">برنامج تحفيظ القرآن وحفظه ومراجعته</Link>
        <Link className="rounded-xl border border-border px-5 py-3 font-semibold text-foreground transition-colors hover:bg-secondary" href="/arabic">برنامج تأسيس العربية قراءة وكتابة</Link>
      </nav>
    </section>
  )
}
