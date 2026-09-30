export function CountryServiceLinks() {
  return (
    <section className="mx-auto my-12 max-w-5xl rounded-2xl border border-border bg-card px-6 py-8 text-center shadow-sm" aria-labelledby="country-service-links-title">
      <p className="saudi-eyebrow justify-center">برامج الأكاديمية</p>
      <h2 id="country-service-links-title" className="text-2xl font-bold text-foreground">مساران أساسيان وخدمات إضافية حسب الطلب</h2>
      <div className="mx-auto mt-6 grid max-w-4xl gap-4 text-start md:grid-cols-3">
        <article className="rounded-xl border border-border bg-secondary/40 p-5">
          <h3 className="font-bold text-foreground">القرآن الكريم</h3>
          <p className="mt-2 leading-7 text-muted-foreground">حفظ وتحفيظ القرآن، المراجعة، التلاوة الصحيحة، التجويد، وتفسير معاني الآيات ضمن الحصة أو في حصص مستقلة عند الطلب.</p>
        </article>
        <article className="rounded-xl border border-border bg-secondary/40 p-5">
          <h3 className="font-bold text-foreground">تأسيس اللغة العربية</h3>
          <p className="mt-2 leading-7 text-muted-foreground">قراءة وكتابة وحركات وإملاء وتعبير وفهم، للأطفال والشباب والبالغين بحسب المستوى والهدف.</p>
        </article>
        <article className="rounded-xl border border-border bg-secondary/40 p-5">
          <h3 className="font-bold text-foreground">دروس إسلامية إضافية</h3>
          <p className="mt-2 leading-7 text-muted-foreground">التفسير والفقه والتوحيد والأخلاق والآداب متاحة حسب طلب الأسرة وتخصص المعلم أو المعلمة.</p>
        </article>
      </div>
      <p className="mx-auto mt-5 max-w-3xl leading-7 text-muted-foreground">الأسعار الظاهرة في هذه الصفحة هي الأسعار المحلية لهذه الدولة، ويُحدَّد البرنامج المناسب عند التواصل.</p>
    </section>
  )
}
