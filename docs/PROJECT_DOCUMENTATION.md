# التوثيق المركزي للمشروع

> **نوع الوثيقة:** مرجع الحالة الحالية — وليس سجلًا تاريخيًا.
>
> **آخر مراجعة:** 26 أكتوبر 2026
>
> **المستودع:** [alymahros25-max/v0-academy-website-development20](https://github.com/alymahros25-max/v0-academy-website-development20)
>
> **المرجع المرتبط:** [سجل تاريخ التعديلات](PROJECT_HISTORY.md)

هذا هو المدخل الرئيسي لفهم المشروع كما هو موجود في الكود والمستودع. لا تخلط بينه وبين تقارير التنفيذ القديمة؛ لمعرفة ماذا تغير ومتى ولماذا، افتح [سجل التاريخ](PROJECT_HISTORY.md).

## 1. ملخص المشروع

**أكاديمية الحافظ المتميز** منصة تعليمية عربية لتحفيظ القرآن الكريم وتأسيس اللغة العربية عبر الإنترنت. الموقع مبني أولًا للعربية وRTL، ويعرض البرامج والمحتوى التعليمي وصفحات هبوط محلية للدول، بينما تتم إدارة المحتوى من `/admin`. التواصل والحجز الحاليان يتمان عبر WhatsApp وقنوات التواصل، ولا يوجد checkout فعال في التطبيق الحالي.

### الحالة الموثقة

| المجال | الحالة الحالية |
| --- | --- |
| الموقع العام | موجود عبر Next.js App Router ويضم الصفحات العامة والبرامج والمدونة والمكتبة والألعاب والتواصل. |
| صفحات الدول | 40 مدخلًا فعليًا تحت `app/`، مع محرك بيانات وعقود مشتركة في `lib/`. |
| المحرك المركزي | `lib/country-page-model.ts` و`lib/country-content.ts` و`lib/country-data-resolution.mjs` توحّد قراءة وعرض بيانات الدول. |
| لوحة التحكم | `/admin` محمية بجلسة إدارة وتضم إدارة المحتوى والدول والباقات وFAQ والمدونة والمكتبة والصفحات القانونية والمظهر والمستخدمين. |
| قاعدة البيانات | Supabase/PostgreSQL مع migrations وRLS وطبقات قراءة/كتابة عامة وإدارية. راجع [مرجع قاعدة البيانات](DATABASE_REFERENCE.md). |
| البريد | متغيرات Resend ومسار التواصل موجودة في الكود؛ إعدادات الحساب الحية والقوالب لا تُفترض من وجود المتغيرات وحده. |
| الدفع | migrations تاريخية للدفع موجودة، لكن لا يوجد checkout فعال في الواجهة الحالية. |
| النشر | النشر المقصود عبر Vercel من GitHub. |

## 2. خريطة المجلدات

| المسار | المسؤولية |
| --- | --- |
| `app/` | صفحات Next.js، layouts، صفحات الدول، لوحة الإدارة، وRoute Handlers تحت `app/api/`. |
| `components/` | مكونات الواجهة العامة والإدارة والفيديو والثيم والنماذج والعناصر المشتركة. |
| `components/admin/` | مكونات تبويبات ولوحات الإدارة والمحررات والمعاينة. |
| `lib/` | طبقات Supabase، المصادقة، CMS، المحتوى، محرك الدول، SEO، الأمان، الأداء، والتحليلات. |
| `data/` | بيانات fallback/محتوى محلي مثل البرامج والرسائل والمراجعات والإعدادات. |
| `public/` | الصور والأيقونات والـ manifest والملفات العامة. |
| `supabase/migrations/` | SQL migrations وسجل تاريخي لتطور المخطط. |
| `db/isolated/` | baseline معزول وملفات بيانات تجريبية لبيئة منفصلة. |
| `supabase/seeds/` | لقطات seed مرتبطة بمراحل محتوى الدول. |
| `scripts/` | أدوات الترحيل وتوليد SQL وseed والتحقق الأمني وتحسين الصور. |
| `tests/` | اختبارات المسارات والعقود والأمن وSEO وعزل بيانات الدول. |
| `docs/` | هذا المرجع، المراجع التشغيلية، والتقارير التاريخية. |
| `.github/workflows/` | عمليات التحقق المرتبطة بـ GitHub Actions. |

## 3. التقنية والمكتبات

| الطبقة | التنفيذ |
| --- | --- |
| الإطار | Next.js `16.4.1` مع App Router وServer/Client Components. |
| الواجهة | React `19.2.3` وTypeScript `5.7.3`. |
| التصميم | Tailwind CSS، PostCSS، `tailwindcss-animate`، Radix UI، وRTL عربي. |
| البيانات | `@supabase/supabase-js` `2.108.2` وPostgreSQL عبر Supabase. |
| التحقق والنماذج | Zod، React Hook Form، و`@hookform/resolvers`. |
| الجلب والتخزين المؤقت | SWR، Next revalidation، ووسوم cache لمحركات الدول. |
| الحركة والوسائط | Framer Motion، Embla Carousel، `next/image`، Sharp، React PDF، وYouTube المؤجل. |
| المحتوى | React Markdown وRecharts. |
| المراقبة | Sentry عند ضبط DSN، وGA4 بعد التحميل الكسول/الموافقة حسب المسار. |
| الجودة والبناء | pnpm، Turbopack أثناء التطوير، ESLint، TypeScript، واختبارات Node. |
| النشر | Vercel من GitHub مع Preview عند تفعيل التكامل. |

المصدر الكامل للإصدارات هو [`package.json`](../package.json) و`pnpm-lock.yaml`، وليس شارات README.

## 4. تدفق النظام والمحرك المركزي

```mermaid
flowchart LR
    U[الزائر] --> N[Next.js App Router]
    N --> R[صفحة الدولة أو الصفحة العامة]
    R --> M[محرك الدولة المركزي]
    M --> C[Supabase: area/content/packages/FAQ/links/theme]
    M --> F[Fallback آمن عند غياب البيانات]
    A[المشرف] --> D[/admin]
    D --> AUTH[جلسة إدارة محمية]
    AUTH --> API[Route Handlers / CMS API]
    API --> C
    N --> OBS[GA4/Sentry عند التفعيل]
```

### مكونات محرك الدول

- `lib/country-page-model.ts`: عقد العرض الموحد الذي يجمع بيانات المنطقة وSEO والمحتوى التعليمي والـ fallback.
- `lib/country-content.ts`: قراءة snapshot الدولة، cache/revalidation، وتحديث مسارات الدولة بعد التعديل.
- `lib/country-data-resolution.mjs`: حل slug والبيانات والباقات والمدد مع حدود واضحة.
- `lib/country-education-resolution.mjs`: حل محتوى التعلم الخاص بالدولة.
- `lib/country-fallbacks.ts` و`lib/country-static-fallback.ts`: fallback عندما لا تتوفر بيانات قاعدة البيانات.
- `lib/country-renderers.ts`: مكونات/عارضات العرض المشتركة.
- `lib/country-seo.ts` و`lib/country-seo-data.ts`: metadata وSEO لكل دولة.
- `lib/new-country-pages.ts`: تعريفات صفحات الدول الجديدة والروابط المشتركة.

القاعدة المهمة: لا يجوز أن يؤدي نقص بيانات دولة إلى قراءة بيانات دولة أخرى بصمت. كل قراءة وتعديل يجب أن يبقى مربوطًا بـ `slug` و`area_id` الصحيحين.

## 5. الدول الأربعون

هذه قائمة المسارات الموجودة فعليًا في `app/`، ويؤكدها اختبار `tests/country-routes.test.mjs`. وجود المسار لا يعني أن كل محتواه مصدره قاعدة البيانات؛ راجع مصدر كل نوع محتوى في [مرجع قاعدة البيانات](DATABASE_REFERENCE.md).

| # | الدولة | المسار |
| ---: | --- | --- |
| 1 | الأرجنتين | `/argentina` |
| 2 | أستراليا | `/australia` |
| 3 | النمسا | `/austria` |
| 4 | البحرين | `/bahrain` |
| 5 | بلجيكا | `/belgium` |
| 6 | البرازيل | `/brazil` |
| 7 | كندا | `/canada` |
| 8 | الصين | `/china` |
| 9 | كولومبيا | `/colombia` |
| 10 | الدنمارك | `/denmark` |
| 11 | فنلندا | `/finland` |
| 12 | فرنسا | `/france` |
| 13 | ألمانيا | `/germany` |
| 14 | اليونان | `/greece` |
| 15 | إندونيسيا | `/indonesia` |
| 16 | إيطاليا | `/italy` |
| 17 | الأردن | `/jordan` |
| 18 | الكويت | `/kuwait` |
| 19 | ماليزيا | `/malaysia` |
| 20 | المكسيك | `/mexico` |
| 21 | هولندا | `/netherlands` |
| 22 | نيوزيلندا | `/new-zealand` |
| 23 | نيجيريا | `/nigeria` |
| 24 | النرويج | `/norway` |
| 25 | عُمان | `/oman` |
| 26 | بولندا | `/poland` |
| 27 | البرتغال | `/portugal` |
| 28 | قطر | `/qatar` |
| 29 | روسيا | `/russia` |
| 30 | السعودية | `/saudi-arabia` |
| 31 | السنغال | `/senegal` |
| 32 | جنوب أفريقيا | `/south-africa` |
| 33 | إسبانيا | `/spain` |
| 34 | السويد | `/sweden` |
| 35 | سويسرا | `/switzerland` |
| 36 | تركيا | `/turkey` |
| 37 | الإمارات العربية المتحدة | `/united-arab-emirates` |
| 38 | المملكة المتحدة | `/united-kingdom` |
| 39 | الولايات المتحدة | `/united-states` |
| 40 | فنزويلا | `/venezuela` |

## 6. الموقع العام والمسارات المهمة

- الأساسية والبرامج: `/`, `/about`, `/quran`, `/arabic`.
- الثقة والمحتوى: `/teachers`, `/reviews`, `/faq`, `/library`, `/blog`, `/blog/[slug]`.
- التفاعل: `/contact`, `/classroom-moments`, `/games`, `/account`.
- SEO متعدد المستويات: `/blog/country/[slug]/[topic]`, `sitemap.ts`, `robots.ts`.
- القانونية: `/privacy`, `/terms`, `/refund-policy`.
- الإدارة: `/admin`, `/admin/login`, `/admin/cms`, `/admin/pages`, `/admin/theme`, `/admin/users`.

## 7. لوحة التحكم

- الدخول: `/admin/login`.
- الجلسة والتحقق: `/api/admin/auth` مع `ADMIN_EMAIL` و`ADMIN_PASSWORD_SCRYPT_HASH` و`ADMIN_SESSION_SECRET`.
- إدارة المحتوى: الدول، السعودية، الإمارات، FAQ، الباقات، المعلمون، المراجعات، الرسائل، الصفحات، المدونة، المكتبة، والصفحات القانونية.
- الخدمات التعليمية: فيديوهات الفصول والألعاب.
- أدوات الموقع: منشئ الصفحات، الأدوات والقوائم، المظهر والمعاينة، وSEO.
- إدارة النظام: المستخدمون والصلاحيات وإعدادات لوحة التحكم.

التغيير الإداري لا يُعد ناجحًا بمجرد تحديث الواجهة المحلية: يجب التأكد من رسالة نجاح الخادم، إعادة تحميل البيانات، فتح المعاينة العامة، والتحقق من أن دولة أخرى لم تتغير. التفاصيل في [دليل لوحة التحكم](ADMIN_DASHBOARD.md).

## 8. قاعدة البيانات وSupabase

البنية موثقة تفصيليًا في [DATABASE_REFERENCE.md](DATABASE_REFERENCE.md)، وسياسة التشغيل في [supabase/README.md](../supabase/README.md). المجموعات الرئيسية:

- CMS العام: `site_content`, `site_settings`, `site_pages`, `theme_customizations`, `widget_configs`, `preview_cache`.
- الإدارة: `cms_users`, `cms_permissions`, و`auth.users`.
- المحتوى: `classroom_videos`, `faq_items`, `legal_pages`, `digital_library_documents`, `educational_games`, `blog_posts`.
- عزل الدول: `site_areas`, `area_content`, `area_packages`, `area_faq_items`, `area_links`, `area_themes`, `area_cities`, `area_timezones`.
- التحليلات: `analytics_sources`, `analytics_sync_snapshots`, `internal_analytics_events`, `analytics_event_deliveries`.

RLS والـ allowlists وحدود القراءة العامة/الكتابة الإدارية جزء من العقد. لا تستخدم `SUPABASE_SERVICE_ROLE_KEY` في المتصفح، ولا تعتبر migration أو seed دليلًا على تطبيقه في قاعدة إنتاج حية دون سجل البيئة.

## 9. Resend والبريد

يظهر تكامل البريد في متغيرات `.env.example` ومسار `app/api/contact/route.ts` وواجهات الحساب/الإدارة. المتغيرات المعروفة:

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_INBOX_EMAIL`
- `NEXT_PUBLIC_CONTACT_EMAIL`

هذا التوثيق يثبت وجود طبقة الإعداد/الاستخدام في الكود، لكنه لا يدّعي حالة حساب Resend أو القوالب أو الـ webhooks الحية إلا إذا تم فحصها من لوحة Resend. أي سر يجب أن يبقى في إعدادات البيئة، لا في Git.

## 10. التشغيل والتحقق

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

قبل Pull Request:

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm test:country-routes
pnpm test:migration-contract
pnpm test:security-boundaries
pnpm build
```

إذا تعارض تقرير تاريخي مع الكود الحالي، تكون الأولوية بهذا الترتيب: الكود الحالي، `package.json`، migrations/عقود الاختبارات، ثم المراجع التشغيلية الحالية، ثم التقارير القديمة.

## 11. متغيرات البيئة والأسرار

راجع [`.env.example`](../.env.example). لا ترفع `.env.local` أو مفاتيح Supabase أو Resend أو Sentry أو Gemini أو hash الإدارة. المتغيرات العامة فقط هي التي يُسمح أن تبدأ بـ `NEXT_PUBLIC_`، وحتى المفتاح العام يجب أن يعمل مع RLS صحيحة.

## 12. قواعد التغيير

1. لا تعدّل migration سبق تطبيقها؛ أضف migration وصفية جديدة.
2. لا تخلط fallback دولة مع دولة أخرى دون توثيق واختبار.
3. عند تغيير CMS أو قاعدة البيانات، حدّث هذا المرجع ومرجع القاعدة ودليل الإدارة عند الحاجة.
4. عند تعديل لوحة التحكم، اختبر الحفظ من اللوحة ثم المعاينة العامة وإعادة التحميل.
5. عند إضافة دولة، حدّث عقد المسارات والبيانات والـ SEO والاختبارات وجدول الدول هنا.
6. عند كل تغيير مهم، أضف رابط commit/PR أو ملاحظة في [سجل التاريخ](PROJECT_HISTORY.md).
