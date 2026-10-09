# خطة ترحيل صفحات الدول إلى محرك مركزي واحد

## 0. الهدف والقيود

### الهدف

نقل صفحات الدول الأربعين إلى **محرك صفحات مركزي واحد**، مع الحفاظ على اختلاف كل دولة في:

- الاسم والعملة والرمز.
- العنوان والوصف والكلمات المفتاحية.
- الأسعار والباقات.
- المدن والتوقيت.
- النصوص والـFAQ.
- المعلمين والمحتوى المرئي.
- الألوان والهوية البصرية.
- ترتيب الأقسام ونسخة تصميم كل قسم.

### القيود غير القابلة للكسر

1. لا يتغير أي URL حالي لصفحة دولة أثناء الترحيل.
2. لا نستخدم redirect لصفحة إلى نفسها أو نغيّر الـslug لمجرد نقل الكود.
3. لا ننقل التصميم إلى قالب موحد بالقوة؛ نوحد المحرك والبيانات والمكونات فقط.
4. لا نربط الإنتاج مباشرة بقاعدة الحساب الجديد قبل اكتمال اختبار البيانات والـSEO.
5. لا نحذف الصفحة القديمة قبل وجود بديل مركزي مطابق ومختبر.
6. قاعدة البيانات الجديدة تبدأ كبيئة مستقلة: migrations + seed/ETL + تحقق، وليس تعديلًا مباشرًا على قاعدة الحساب القديم.

---

## 1. ما تم اكتشافه في المستودع

المستودع يحتوي حاليًا على:

- **40 route** لصفحات الدول داخل `app/<country>/page.tsx`.
- **31 ملف إعداد** مستقلًا داخل `lib/*-landing-config.ts`.
- migrations كثيرة لمحتوى الدول داخل `supabase/migrations/014` وما بعدها.
- أكثر من نظام عرض:
  - صفحات تستعمل `NewCountryLanding`.
  - صفحات مخصصة فيها JSX وأقسامها الخاصة.
  - صفحات تقرأ جزئيًا من `getAreaLandingData()`.
  - صفحات تعتمد على ملفات فرعية خاصة داخل مجلد الدولة.
- أكثر من مصدر لقائمة الدول والفوتر والـnavigation.
- طبقة بيانات مفيدة موجودة بالفعل في `lib/country-content.ts`.
- لوحة إدارة موجودة في `components/admin/CountryLandingPagesTab.tsx` وواجهة API في `app/api/admin/areas/route.ts`.

### تقسيم التنفيذ حسب البنية الحالية

هذا التقسيم ليس فصلًا دائمًا في النظام النهائي؛ هو فقط ترتيب عملي للترحيل:

| المجموعة | الدول | ما سيتم فعله |
|---|---|---|
| صفحات `NewCountryLanding` | قطر، عُمان، الأردن، البحرين، فرنسا، إسبانيا، هولندا، بلجيكا، السويد، الكويت | تحويل المكون الحالي إلى renderer مركزي يعتمد على config/sections بدل قائمة شروط داخل مكون واحد |
| صفحات مرتبطة جزئيًا ببيانات المناطق | ألمانيا، جنوب أفريقيا، الصين، إيطاليا، روسيا، النرويج، النمسا، البرازيل، المكسيك، سويسرا، كولومبيا | توحيد loader والـfallback ثم استخراج الأقسام إلى مكونات مشتركة قابلة للتخصيص |
| صفحات ذات تصميم ومكونات فرعية خاصة | السعودية، الإمارات، تركيا، البرتغال، بولندا، الأرجنتين، السنغال، فنزويلا، إندونيسيا، ماليزيا، نيوزيلندا، فنلندا، الدنمارك، اليونان | تفكيكها إلى أقسام عامة، مع الاحتفاظ فقط بالـvariant البصري الذي لا يمكن تعميمه |
| صفحات بسيطة/مخصصة داخل `page.tsx` | الولايات المتحدة، كندا، المملكة المتحدة، أستراليا، فرنسا/إسبانيا وما سبق حسب النسخة الحالية | تحويل كل واحدة إلى تعريف صفحة مركزي ثم إزالة JSX المكرر تدريجيًا |

> القائمة أعلاه تصف طريقة العمل الحالية، وليست نظامًا نهائيًا منفصلًا. بعد الترحيل تكون كل الدول تحت registry وrenderer وdata contract واحد.

---

## 2. الشكل النهائي المستهدف

### 2.1 المسار المركزي

يكون لدينا في النهاية:

```txt
app/[countrySlug]/page.tsx
```

ويستقبل كل مسارات الدول الحالية:

```txt
/saudi-arabia
/united-arab-emirates
/turkey
/qatar
/portugal
...
```

المسار الثابت القديم يمكن أن يبقى أثناء مراحل الترحيل، لأن Next.js يعطي المسارات الثابتة أولوية. لا نحذف أي route قديم إلا بعد نجاح بديله.

### 2.2 مركز التسجيل

```ts
// lib/country-pages/registry.ts
export const countryPageRegistry = {
  "saudi-arabia": { renderer: "country", profile: "saudi", status: "migrated" },
  "turkey": { renderer: "country", profile: "turkey", status: "migrated" },
  "qatar": { renderer: "country", profile: "qatar", status: "migrated" },
} as const
```

الـregistry لا يحتوي نصوصًا طويلة أو أسعارًا؛ يحدد فقط:

- الـslug.
- الدولة والعملة.
- renderer/variant.
- حالة الترحيل.
- مصدر البيانات.
- نسخة schema أو layout.

### 2.3 محرك الصفحة

```tsx
const page = await getCountryPage(countrySlug)
return <CountryPageRenderer page={page} />
```

ويكون المحرك مسؤولًا عن:

- تحميل بيانات الدولة.
- التحقق من اكتمال البيانات.
- ترتيب الأقسام.
- اختيار variant لكل قسم.
- إخراج metadata وJSON-LD.
- استخدام fallback مضبوط عند غياب قيمة غير حرجة.

### 2.4 الأقسام القابلة للتركيب

```txt
CountryShell
CountryHero
ProgramSection
PricingSection
CitiesSection
TimezoneSection
TeachersSection
VideosSection
LearningHubSection
FaqSection
ClosingCta
CountryFooter
```

كل قسم له variants، مثل:

```txt
hero: editorial | notebook | decision-sheet | journey | custom
pricing: table | cards | columns | rail | slanted-plans
videos: grid | rail | timeline | collage | none
```

الهدف هو تحويل الاختلافات الحالية إلى variants محدودة قابلة لإعادة الاستخدام، لا إلى 40 صفحة JSX مستقلة.

---

# 3. الخطة المرحلية

## المرحلة 0 — تجميد baseline وجرد نهائي

### الهدف
تثبيت الوضع الحالي قبل أي تغيير، حتى نعرف أن أي اختلاف لاحق سببه الترحيل وليس الكود القديم.

### التنفيذ

1. عمل branch باسم:

```txt
migration/country-pages-central-engine
```

2. إنشاء تقرير route inventory يحتوي لكل دولة:
   - URL.
   - title وdescription وcanonical.
   - keywords.
   - نوع الصفحة الحالي.
   - الملفات التي تعتمد عليها.
   - هل تقرأ من قاعدة البيانات؟
   - هل لديها prices/FAQ/JSON-LD خاصة؟
   - الفوتر المستخدم.
   - المكونات الخاصة.
   - الصور والفيديوهات.

3. حفظ HTML baseline لكل URL في بيئة staging الحالية.
4. حفظ screenshots على mobile وdesktop.
5. تسجيل status code، canonical، title، H1، عدد الأقسام، أسعار العرض، وروابط الـCTA.
6. تشغيل build وlint/typecheck وتسجيل النتيجة قبل الترحيل.
7. أخذ backup/exports من أي بيانات يمكن الوصول إليها في الحساب القديم، دون اعتبار قاعدة الحساب القديم مصدرًا دائمًا.

### مخرجات المرحلة

```txt
/docs/country-pages-inventory.csv
/docs/country-pages-baseline.json
/docs/country-pages-baseline-screenshots/
```

### شرط الخروج
وجود baseline قابل للمقارنة لكل الـ40 URL وعدم وجود route غير معروف أو slug مكرر.

---

## المرحلة 1 — إنشاء قاعدة الحساب الجديد بشكل مستقل

هذه المرحلة تبدأ قبل توصيل التطبيق بالإنتاج الجديد.

### 1.1 إنشاء المشروع الجديد

- إنشاء مشروع Supabase بالحساب الجديد.
- حفظ `project ref` وURL والـkeys في secrets/environment variables، وليس داخل Git.
- إنشاء بيئات منفصلة قدر الإمكان:
  - development.
  - staging.
  - production.
- عدم استخدام service-role key في المتصفح.

### 1.2 تشغيل schema migrations

نقل migrations الهيكلية إلى المستودع بصيغة مرتبة ونظيفة، ثم تشغيلها في المشروع الجديد.

قبل تشغيل migrations القديمة كما هي، يجب فصلها إلى:

```txt
supabase/migrations/
  000_core_schema.sql
  010_cms_schema.sql
  020_country_schema.sql
  030_country_page_sections.sql
  040_rls_policies.sql
  050_seed_reference_data.sql
```

لا ننقل بيانات الدفع أو المستخدمين تلقائيًا ضمن جداول محتوى الدول. يتم التعامل مع:

- المستخدمين والمصادقة.
- Stripe/webhooks.
- analytics.
- بيانات التسجيل أو الطلبات.

كـworkstream منفصل بعد جردها، لأنها تحمل مخاطر وصلاحيات مختلفة.

### 1.3 إضافة schema التوحيد

نحافظ على الجداول الحالية المفيدة، ونضيف طبقة page composition:

```sql
country_page_profiles
- id
- area_id
- profile_key
- renderer_key
- schema_version
- status
- published_at
- is_active
- created_at
- updated_at

country_page_sections
- id
- profile_id
- section_key
- section_type
- variant
- sort_order
- is_active
- settings_jsonb
- created_at
- updated_at

country_page_seo
- profile_id
- seo_title_ar
- seo_description_ar
- keywords_jsonb
- canonical_url
- og_image
- robots_index
- robots_follow
- schema_overrides_jsonb

country_page_teachers
- profile_id
- teacher_id
- sort_order
- is_active
- bio_override_ar

country_page_assets
- profile_id
- asset_key
- asset_url
- alt_ar
- width
- height
- is_active
```

الجداول الموجودة تبقى مصدرًا للبيانات المتكررة:

```txt
site_areas
area_content
area_packages
area_faq_items
area_links
area_themes
area_cities
area_timezones
```

### 1.4 مبدأ البيانات

- لا نضع JSX في قاعدة البيانات.
- لا نضع أسعارًا أو نصوصًا ثابتة داخل renderer.
- `settings_jsonb` يستخدم فقط لإعداد variant، مثل عدد البطاقات أو إظهار قسم، وليس لحفظ صفحة HTML كاملة.
- كل record له `area_id` واضح وRLS على مستوى area/admin.

### شرط الخروج

- كل migrations تعمل من قاعدة فارغة إلى schema مكتمل.
- RLS مختبر.
- API admin لا يعرض أو يعدل بيانات area أخرى.
- وجود مشروع staging جديد يمكن للتطبيق الاتصال به دون لمس الإنتاج القديم.

---

## المرحلة 2 — بناء طبقة البيانات الجديدة بدون تغيير الواجهة

### الهدف
إنشاء adapter موحد يمكنه قراءة البيانات من قاعدة الحساب الجديد مع استمرار الصفحات القديمة في العمل.

إنشاء:

```txt
lib/country-pages/types.ts
lib/country-pages/registry.ts
lib/country-pages/repository.ts
lib/country-pages/normalizer.ts
lib/country-pages/validation.ts
```

### العقد الموحد

```ts
type CountryPageModel = {
  country: {
    slug: string
    nameAr: string
    nameEn?: string
    countryCode: string
    currencyCode: string
    currencySymbol: string
    timezone?: string
    cities: string[]
  }
  seo: {
    title: string
    description: string
    canonical: string
    keywords: string[]
    robots: { index: boolean; follow: boolean }
  }
  theme: ThemeModel
  sections: SectionModel[]
  packages: PackageModel[]
  faq: FaqModel[]
  links: LinkModel[]
  teachers: TeacherModel[]
  assets: AssetModel[]
}
```

### قواعد الـnormalizer

1. ترتيب الأسعار حسب `sort_order`.
2. فصل Quran وArabic اعتمادًا على `program` لا على ترتيب عشوائي.
3. عدم استبدال سعر مفقود بسعر دولة أخرى.
4. fallback للنصوص من code فقط إذا كان ذلك مسجلًا ومسموحًا للدولة.
5. عدم قبول canonical مختلف عن URL المعتمد إلا بقرار صريح.
6. فشل build في staging عند نقص حقل SEO أساسي أو عملة أو slug.

### شرط الخروج
يمكن تحميل نموذج موحد لكل دولة من قاعدة staging، حتى لو لم تستخدمه الصفحة القديمة بعد، ويمر schema validation لكل الدول الأربعين.

---

## المرحلة 3 — توحيد الأشياء المشتركة منخفضة المخاطر

نبدأ بأجزاء لا تغيّر جوهر صفحة الدولة:

1. `countryRegistry` واحد بدل قوائم الدول المكررة.
2. `CountryFooter` مركزي.
3. `CountryNavigation` مركزي.
4. روابط `/games` و`/library` و`/blog` و`/contact` و`/privacy` و`/terms`.
5. زر WhatsApp وcontact URL من `links`.
6. `CountrySeo` موحد مع الحفاظ على القيم الحالية.
7. `CountryJsonLd` موحد، مع دعم Course/Offer/FAQ حسب ما كان موجودًا في كل صفحة.
8. `CountryLearningHub` و`CountryTeacherMarquee` عبر props موحدة.

### أسلوب الترحيل

لا نغير كل الصفحات مرة واحدة. نبدأ بصفحة واحدة:

```tsx
<CountryFooter country={page.country} links={page.links} theme={page.theme} />
```

ثم نطبقها على مجموعة صغيرة، ونقارن HTML والـSEO والصورة قبل توسيعها.

### شرط الخروج
كل route يستخدم قائمة الدول والفوتر المركزيين، دون اختلاف في الروابط أو canonical، مع بقاء التصميم الخاص قابلًا للتخصيص من theme/variant.

---

## المرحلة 4 — توحيد مجموعة `NewCountryLanding`

هذه أفضل مجموعة للبدء لأنها تحتوي بالفعل على مفهوم variants.

### العمل

1. تفكيك `components/new-country-landing.tsx` إلى:
   - `CountryPageRenderer`.
   - `HeroRenderer`.
   - `PricingRenderer`.
   - `StepsRenderer`.
   - `FaqRenderer`.
   - `LocalSectionRenderer`.
   - `ClosingRenderer`.
2. إزالة التفرعات الكبيرة من نوع `if (variant === ...)` قدر الإمكان، وتحويلها إلى registry للـvariants.
3. نقل config الخاصة بـ10 دول إلى نموذج `CountryPageModel`.
4. جعل الأسعار وFAQ والمدن والـSEO تُقرأ من قاعدة staging مع fallback موثق.
5. إضافة snapshot لكل دولة من الدول العشر.

### شرط الخروج
الدول العشر تعمل من renderer المركزي، والـpage files الخاصة بها تصبح wrappers مؤقتة أو تُحذف بعد تفعيل المسار الديناميكي، مع تطابق وظيفي وSEO.

---

## المرحلة 5 — توحيد الصفحات ذات البيانات الجزئية

الدول المستهدفة تبدأ بالصفحات التي تستعمل `getAreaLandingData()` بالفعل.

### العمل

1. إزالة تكرار loader من كل `page.tsx`.
2. جعل `repository` يعيد `CountryPageModel` واحدًا.
3. نقل بيانات الأسعار/FAQ/المدن/التوقيت/الروابط إلى قاعدة الحساب الجديد.
4. تحويل ملفات config الحالية إلى seed/reference فقط، ثم إيقاف استخدامها runtime بعد التحقق.
5. نقل JSON-LD إلى مولد مشترك مع الحفاظ على `priceCurrency` والـoffers لكل دولة.
6. تحويل الفوتر والـcountry links إلى المكون المركزي.

### شرط الخروج
لا توجد صفحة في هذه المجموعة تستدعي Supabase مباشرة داخل JSX؛ كل القراءة تمر عبر repository/normalizer.

---

## المرحلة 6 — تفكيك الصفحات ذات المكونات الخاصة

الصفحات ذات الملفات الفرعية مثل:

```txt
argentina-music-notebook.tsx
brazil-slanted-plans.tsx
china-goal-stepper.tsx
portugal-nautical-route.tsx
turkey-tabbed-study.tsx
...
```

لا تُحذف تلقائيًا. لكل مكون قرار:

| القرار | متى يستخدم |
|---|---|
| Promote إلى variant عام | إذا كان التصميم يمكن أن يخدم دولتين أو أكثر |
| Keep كـcountry-specific section | إذا كان فريدًا لكن صغيرًا ومهمًا للصفحة |
| Refactor إلى بيانات + component | إذا كان JSX يكرر نفس بنية القسم |
| Retire | إذا كان زائدًا أو مكررًا ولا يؤثر على الصفحة الحالية |

### القاعدة

حتى القسم الخاص لا يُستدعى من route دولة مستقل؛ يسجل داخل composition المركزي:

```ts
{
  sectionType: "custom",
  variant: "turkey-tabbed-study",
  sortOrder: 3,
  settings: {}
}
```

ويجب أن يمر من allow-list في الكود، لا أن يسمح للمستخدم بتحميل component عشوائي من قاعدة البيانات.

### شرط الخروج
كل صفحة مخصصة تمر من `CountryPageRenderer`، حتى لو بقي فيها section خاص.

---

## المرحلة 7 — إدخال المسار الديناميكي المركزي

### الأسلوب الآمن

لا نحذف الـ40 route القديمة في يوم واحد.

1. ننشئ `app/[countrySlug]/page.tsx`.
2. نبقي routes الثابتة القديمة مؤقتًا؛ Next.js يختارها أولًا.
3. نحدد `migrated: true` في registry لدولة واحدة.
4. ننقل route تلك الدولة إلى renderer المركزي أو نجعل ملفها القديم wrapperًا نحيفًا.
5. نختبرها.
6. نحذف route الثابتة فقط بعد نجاحها، فيصبح `[countrySlug]` هو الذي يخدمها.
7. نكرر دولة بدولة أو batch صغير.

### قرار مهم
إذا أظهر build أو Next.js تعارضًا في وجود dynamic route مع الصفحات الثابتة، نستخدم مرحلة wrappers المركزية أولًا:

```txt
app/saudi-arabia/page.tsx -> <CountryPageEntry slug="saudi-arabia" />
```

ثم نفعّل dynamic route بعد اكتمال النقل. بهذه الطريقة لا نعتمد على سلوك route غير مختبر.

### شرط الخروج
كل الـ40 URL تستجيب من مركز واحد، مع بقاء URL نفسه تمامًا.

---

## المرحلة 8 — ترحيل بيانات المحتوى إلى قاعدة الحساب الجديد

### مصدر البيانات
نستخدم المسارين التاليين معًا حسب ما هو متاح:

1. **بيانات الكود الحالي:** config files وfallbacks وseed migrations.
2. **بيانات قاعدة الحساب القديم:** export رسمي من الجداول، إذا كانت متاحة، لأن البيانات المعدلة من لوحة التحكم قد لا تكون موجودة في الكود.

إذا لم تكن قاعدة الحساب القديم متاحة، لا نخمن القيم؛ نستخدم seed من الكود ونضع قائمة `content-review-required` لكل قيمة تحتاج مراجعة يدوية.

### ETL المقترح

```txt
extract-old-db-or-code
  -> normalize-slugs
  -> normalize-currencies
  -> normalize-packages
  -> normalize-seo
  -> validate
  -> load-new-db
  -> compare
```

### ضوابط مهمة

- slug ثابت lowercase بدون تغيير.
- currency code من ISO 4217.
- الأسعار decimal/numeric، لا float.
- `sessions_per_month` رقم صحيح.
- `features_ar` JSON array صحيح.
- canonical يطابق `https://quran-elhafez.com/<slug>`.
- عدم تسريب أرقام أو مفاتيح خاصة ضمن content/public tables.
- عدم نقل service-role keys أو Stripe secrets إلى قاعدة البيانات كمحتوى.

### شرط الخروج
تقرير مقارنة لكل دولة:

```txt
areas: match
packages: match
faq: match
seo: match
links: match
cities/timezones: match
missing/changed values: explicit list
```

---

## المرحلة 9 — تشغيل staging ومقارنة الصفحات

لكل دولة، نقارن النسخة الحالية والنسخة المركزية آليًا ويدويًا.

### فحص HTML/SEO

- HTTP 200.
- URL النهائي صحيح.
- canonical صحيح.
- title مطابق أو معتمد التغيير.
- meta description موجودة.
- H1 واحد واضح.
- `lang="ar"` و`dir="rtl"`.
- robots لا تحتوي noindex بالخطأ.
- JSON-LD صالح.
- FAQ/Offers لا تختفي.
- روابط الفوتر تعمل.
- الصور لها alt.

### فحص المحتوى

- اسم الدولة.
- العملة والرمز.
- 8 باقات أو العدد المعتمد لكل دولة.
- الأسعار لا تختلط بين الدول.
- WhatsApp message للدولة الصحيحة.
- المدن والتوقيت.
- FAQ والنصوص الخاصة.

### فحص بصري

- desktop 1440px.
- tablet 768px.
- mobile 390px.
- screenshot diff مع baseline.
- فحص طويل الصفحة، وليس أول شاشة فقط.

### شرط الخروج
لا توجد فروق غير مبررة في المحتوى أو SEO أو CTA. الفروق البصرية المقبولة تُسجل في approval log.

---

## المرحلة 10 — إطلاق تدريجي وقطع الاتصال بقاعدة الحساب القديم

### ترتيب الإطلاق

1. إطلاق staging بقاعدة الحساب الجديد.
2. اختبار داخلي.
3. إطلاق دولة واحدة قليلة المخاطر.
4. مراقبة 24–72 ساعة.
5. إطلاق batch من 3–5 دول.
6. إطلاق بقية الدول.
7. بعد الاستقرار، جعل القاعدة الجديدة production primary.
8. إبقاء القاعدة القديمة read-only/backup لفترة احتفاظ متفق عليها.

### تبديل البيئة

يكون الاتصال بالقاعدة الجديدة عبر environment variables، مثل:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

ولا نضع مفاتيح الحساب القديم والجديد في نفس متغيرات الإنتاج بطريقة غير واضحة. نستخدم أسماء secrets/بيئات منفصلة، ونراجع deployment قبل cutover.

### استراتيجية rollback

- إعادة deployment إلى آخر نسخة مستقرة.
- إعادة environment variables إلى القاعدة السابقة إذا كانت ما زالت متاحة.
- عدم حذف القاعدة القديمة قبل إغلاق نافذة rollback.
- الاحتفاظ بجدول release matrix يوضح أي دولة تعمل من أي renderer/DB.

> إذا كانت القاعدة الجديدة ستصبح المصدر الوحيد ولا يمكن rollback إليها، يجب أخذ export كامل من القاعدة القديمة وتجميد تغييرات المحتوى أثناء لحظة cutover أو تسجيل أي تغييرات تمت أثناء freeze يدويًا.

---

# 4. حماية SEO بالتفصيل

## 4.1 URL

- عدم تغيير أي slug من الـ40.
- عدم إضافة `/country/` أو لغة في المسار.
- عدم استخدام query string كبديل لصفحة الدولة.
- إذا تغير slug مستقبلًا، نضيف 301 من القديم إلى الجديد ونحتفظ بالقديم في redirect map.

## 4.2 Canonical وhreflang

في أول migration نحافظ على canonical الحالي كما هو، ولا نخلط بين توحيد الكود وتغيير SEO.

بعد الاستقرار يمكن مراجعة:

- هل `x-default` مناسب؟
- هل language alternates حقيقية أم مجرد نفس URL؟
- هل توجد canonical URLs غير متطابقة؟

هذه مراجعة لاحقة مستقلة، وليست جزءًا من cutover الأول.

## 4.3 Metadata

كل صفحة يجب أن تنتج metadata من نموذج الدولة، مع fallback يمنع نشر title عام مثل عنوان الموقع الرئيسي.

الحقول الإلزامية:

```txt
seo_title
seo_description
canonical
robots
og:title
og:description
og:url
og:image
```

## 4.4 JSON-LD

نحافظ على أنواع schema الموجودة حيثما كانت صحيحة:

- WebPage.
- EducationalOrganization.
- Course.
- Offer.
- FAQPage.

لكن لا نكرر JSON-LD مرتين بعد دمج الفوتر أو renderer. يجب فحص source HTML النهائي.

## 4.5 Sitemap وrobots

- إبقاء كل URLs الحالية في sitemap.
- توليد sitemap من registry بعد اكتماله، وليس من قائمة ثانية.
- التأكد أن staging غير مفهرس.
- بعد الإنتاج، إرسال sitemap في Search Console.
- فحص robots.txt بعد كل deployment.

## 4.6 Search Console والمراقبة

بعد كل batch نراقب:

- 404.
- soft 404.
- canonical alternate page.
- duplicate without user-selected canonical.
- انخفاض indexed pages.
- CTR والانطباعات لكل route.
- Core Web Vitals.

لا نعتبر انخفاضًا في الانطباعات خلال ساعات دليلًا على فشل؛ نراقب نافذة كافية ونقارن batch بمرجع baseline.

---

# 5. لوحة الإدارة في النظام الجديد

بعد ثبات renderer، نعيد ربط لوحة الإدارة بالـschema الجديد.

## ما يمكن تعديله من لوحة الإدارة

- اسم الدولة والعملة.
- النصوص.
- SEO title/description.
- الأسعار والباقات.
- FAQ.
- المدن والتوقيت.
- الروابط وCTA.
- theme tokens.
- تفعيل/تعطيل القسم.
- ترتيب الأقسام.
- اختيار variant من allow-list.

## ما لا يجب السماح به من لوحة الإدارة

- كتابة JSX أو HTML كامل.
- اختيار component باسم نصي عشوائي.
- تغيير route slug دون workflow redirect.
- تغيير canonical إلى نطاق غير معتمد.
- حذف section أساسي دون validation.

## workflow النشر

```txt
Draft -> Validate -> Preview -> Approve -> Publish -> Audit log
```

كل تعديل يسجل:

- المستخدم.
- الوقت.
- الدولة.
- الحقل القديم والجديد.
- نسخة الصفحة.

---

# 6. ترتيب التنفيذ المقترح

## Sprint 1 — foundation

- baseline وinventory.
- registry/types.
- schema validation.
- إنشاء قاعدة staging الجديدة.
- migrations وRLS.
- seed أولي.

## Sprint 2 — shared shell

- CountryFooter.
- CountryNavigation.
- CountrySeo.
- CountryJsonLd.
- repository/normalizer.
- أول route تجريبي.

## Sprint 3 — أول batch

- قطر، عُمان، الأردن، البحرين، فرنسا.
- مقارنة HTML/SEO/screenshots.
- تصحيح variants.

## Sprint 4 — إكمال NewCountryLanding

- إسبانيا، هولندا، بلجيكا، السويد، الكويت.
- نقل المحتوى إلى قاعدة staging.
- تفعيل إدارة الأقسام.

## Sprint 5 — database-driven batch

- ألمانيا، جنوب أفريقيا، الصين، إيطاليا، روسيا، النرويج، النمسا، البرازيل، المكسيك، سويسرا، كولومبيا.
- إزالة direct loaders من JSX.

## Sprint 6 — custom sections

- تركيا، البرتغال، بولندا، الأرجنتين، السنغال، فنزويلا، إندونيسيا، ماليزيا، نيوزيلندا، فنلندا، الدنمارك، اليونان.
- promote/reuse/keep custom حسب القرار المسجل.

## Sprint 7 — الصفحات الأعلى حساسية

- السعودية.
- الإمارات.
- الولايات المتحدة.
- كندا.
- المملكة المتحدة.
- أستراليا.

هذه الصفحات تحتاج مقارنة أكثر دقة لأنها تحتوي على metadata ومكونات أو تصميمات أقدم/أكثر تخصيصًا.

## Sprint 8 — dynamic route وcutover

- تفعيل `[countrySlug]` تدريجيًا.
- إكمال sitemap من registry.
- اختبار production shadow/staging.
- إطلاق تدريجي.
- مراقبة Search Console وlogs.
- إيقاف القراءة من الحساب القديم بعد نافذة rollback.

---

# 7. معايير قبول كل دولة

لا تعتبر الدولة migrated إلا إذا تحققت كل البنود:

- [ ] URL القديم يعمل بدون redirect.
- [ ] HTTP 200.
- [ ] title معتمد.
- [ ] description معتمدة.
- [ ] canonical صحيح.
- [ ] H1 مناسب للدولة.
- [ ] العملة صحيحة.
- [ ] الأسعار مطابقة للمصدر المعتمد.
- [ ] FAQ صحيحة.
- [ ] CTA وWhatsApp للدولة الصحيحة.
- [ ] المدن والتوقيت صحيحان.
- [ ] JSON-LD صالح وغير مكرر.
- [ ] sitemap يتضمن URL.
- [ ] الفوتر والروابط تعمل.
- [ ] mobile/desktop مقبولان.
- [ ] لا توجد console errors.
- [ ] لا توجد hydration errors.
- [ ] مقارنة HTML/screenshots تمت واعتمدت.
- [ ] rollback معروف ومختبر.

---

# 8. القرارات التي لا ينبغي اتخاذها أثناء أول cutover

لتقليل المخاطر، لا نغيّر في نفس الإطلاق الأول:

- أسماء الـslugs.
- لغة الموقع أو اتجاهه.
- استراتيجية hreflang.
- نصوص SEO إلا عند نقلها كما هي.
- أسعار الدول من تلقاء أنفسنا.
- نظام الدفع.
- نظام المستخدمين/auth.
- نطاق الموقع.
- تصميم كل الصفحات مرة واحدة.

الترحيل الأول هدفه **نقل الملكية البرمجية إلى مركز واحد مع الحفاظ على السلوك**. التحسينات التسويقية والبصرية تأتي بعد إثبات الاستقرار.

---

# الخلاصة التنفيذية

الخطة ليست إنشاء نظام للصفحات الجديدة ونظام للقديمة. الخطة هي:

```txt
قاعدة جديدة مستقلة
+ schema موحد للمحتوى
+ registry مركزي لكل الدول
+ repository/normalizer واحد
+ CountryPageRenderer واحد
+ sections وvariants قابلة لإعادة الاستخدام
+ custom sections مسجلة داخل نفس المحرك
+ routes الحالية محفوظة
+ إطلاق تدريجي مع rollback
```

والترتيب الآمن هو:

```txt
baseline
-> قاعدة staging جديدة
-> data contract
-> shared shell
-> NewCountryLanding
-> database-driven pages
-> custom pages
-> dynamic route
-> production cutover
```

بهذا نحقق أكبر قدر عملي من التوحيد دون أن نضحي باختلاف كل دولة أو نخاطر بفقدان الـSEO أو المحتوى الحالي.