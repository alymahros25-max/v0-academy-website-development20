# مرجع قاعدة البيانات وSupabase

> آخر مراجعة: 26 أكتوبر 2026. هذا المرجع يصف ما يظهر في migrations والكود الحالي، ويفصل بين البنية الحالية والملفات التاريخية.

## 1. القاعدة المستهدفة

وفق `supabase/README.md`، قاعدة الموقع المعزولة هي مشروع Supabase باسم `quran123` ومعرّف المشروع `rjkqyvhbmxrmhsafelao`. بدأت من baseline معزول، وليست قاعدة جديدة تُبنى بأمان عبر تشغيل كل ملفات `001..055` بالترتيب الاسمي.

الهجرات التاريخية تحتوي أرقامًا مكررة (`022` و`023` و`026`) وفجوات، كما تحتوي ملفات دفع قديمة. لذلك:

- لا تشغّل `supabase db push` على الإنتاج اعتمادًا على أسماء الملفات وحدها.
- لا تعِد ترقيم migrations المطبقة.
- لا تعدّل migration سبق تطبيقها.
- أي تغيير جديد يجب أن يكون ملف SQL وصفيًا جديدًا، ويُطبّق أولًا على بيئة معزولة.
- احتفظ بنفس ملف SQL والمحتوى الذي تم تطبيقه لتجنب drift.

## 2. طبقات البيانات

### محتوى CMS العام

| الجدول | الاستخدام |
| --- | --- |
| `site_content` | نصوص ومحتوى الأقسام العامة. |
| `site_settings` | إعدادات الموقع العامة. |
| `translation_history` | سجل عمليات الترجمة/التغييرات. |
| `site_pages` | صفحات CMS ومعلومات النشر. |
| `theme_customizations` | تخصيصات المظهر والأقسام. |
| `widget_configs` | القوائم والأدوات العامة مثل WhatsApp. |
| `preview_cache` | بيانات معاينة مؤقتة عند استخدام مسار المعاينة. |

### المستخدمون والإدارة

| الجدول | الاستخدام |
| --- | --- |
| `cms_users` | مستخدمو CMS المرتبطون بـ`auth.users`. |
| `cms_permissions` | صلاحيات الأدوار والوحدات. |
| `auth.users` | هوية Supabase Auth، وتُستخدم أيضًا لحسابات الطلاب والإدارة بحسب المسار. |

### المحتوى التعليمي

| الجدول | الاستخدام |
| --- | --- |
| `classroom_videos` | فيديوهات الفصول المنشورة أو المميزة. |
| `faq_items` | الأسئلة الشائعة العامة. |
| `legal_pages` | النصوص القانونية حسب `page_slug` و`locale`. |
| `digital_library_documents` | مستندات المكتبة الرقمية. |
| `educational_games` | الألعاب التعليمية المنشورة. |
| `blog_posts` | منشورات المدونة ومحتوى SEO. |

### صفحات الدول والعزل

| الجدول | المفتاح/العزل | الاستخدام |
| --- | --- | --- |
| `site_areas` | `id`, `slug` | كيان global أو دولة واحدة. |
| `area_content` | `area_id` | نصوص ومقاطع الكيان. |
| `area_packages` | `area_id`, `package_key` | البرامج والأسعار والمزايا. |
| `area_faq_items` | `area_id`, `question_key` | FAQ الدولة. |
| `area_links` | `area_id`, `link_key` | أزرار وروابط الاتصال. |
| `area_themes` | `area_id` | الثيم الخاص بالدولة. |
| `area_cities` | `area_id` | المدن والمناطق. |
| `area_timezones` | `area_id` | المناطق الزمنية والتسميات. |

### التحليلات

| الجدول | الاستخدام |
| --- | --- |
| `analytics_sources` | مصادر التحليلات. |
| `analytics_sync_snapshots` | لقطات مزامنة المصادر. |
| `internal_analytics_events` | أحداث داخلية. |
| `analytics_event_deliveries` | تسليم الأحداث إلى المصدر. |

### الدفع التاريخي

تظهر الجداول التالية في ملفات migrations القديمة، لكنها ليست دليلًا على وجود checkout فعال في التطبيق الحالي:

- `orders`
- `subscriptions`
- `invoices`
- `refunds`
- `payment_settings`
- `student_enrollments`

ملفات `009` و`010` و`012` محفوظة كسجل تاريخي، ولا تُعامل كجزء من baseline المعزول الحالي دون قرار ومراجعة منفصلين.

## 3. سياسات القراءة والكتابة

- RLS مفعّل على جداول المحتوى والإدارة والبيانات الحساسة.
- القراءة العامة تقتصر على الصفوف النشطة أو المنشورة أو المفعلة حسب الجدول.
- الكتابة الإدارية تمر عبر Route Handlers محمية بجلسة الإدارة وallowlist.
- جداول التحليلات الداخلية مقيدة بالخادم/`service_role`.
- الصفحات العامة لا تستخدم مفتاح الخدمة في المتصفح.
- أي endpoint جديد يجب أن يحدد صراحة: public read، admin read/write، أو service-only.

Migration `052_harden_rls_and_public_reads.sql` تضيف/تثبت سياسات القراءة العامة لعدد من كيانات المحتوى، بينما `053_harden_function_search_paths.sql` تعالج search path للدوال، و`054` و`055` تضيف محتوى SEO والصفحات canonical وفق تاريخها.

## 4. المسارات المرتبطة بالبيانات

| الطبقة | المسارات الحالية |
| --- | --- |
| عام | `/api/public/areas/[slug]`, `/api/public/faq`, `/api/public/legal`, `/api/public/packages`, `/api/public/reviews`, `/api/public/teachers`, `/api/public/theme`, `/api/public/widgets`. |
| إدارة | `/api/admin/data`, `/api/admin/faq`, `/api/admin/areas`, `/api/admin/legal-pages`, `/api/admin/account`. |
| CMS | `/api/cms/content`, `/api/cms/pages`, `/api/cms/landing-pages`, `/api/cms/classroom-videos`, `/api/cms/legal-pages`, `/api/cms/settings`, `/api/cms/theme`, `/api/cms/widgets`, `/api/cms/users`, `/api/cms/permissions`. |
| خدمات | `/api/blog`, `/api/classroom-videos`, `/api/library`, `/api/contact`, `/api/visitor-country`, `/api/revalidate`. |

## 5. إضافة migration جديدة

1. حدد الجدول أو القيد أو السياسة المتأثرة.
2. راجع baseline الفعلي وسجل `schema_migrations` في البيئة المستهدفة قراءةً فقط.
3. أنشئ ملفًا جديدًا باسم وصفي لا يعيد استخدام رقم تاريخي متعارض.
4. أضف القيود والفهارس وRLS والسياسات في نفس التغيير عند الحاجة.
5. اجعل migration قابلة لإعادة المراجعة، وتجنب عمليات حذف غير قابلة للعكس دون خطة rollback.
6. طبّقها على بيئة معزولة/Preview مع نسخة البيانات المناسبة.
7. تحقق من سجل migrations وSupabase advisors واختبارات العقد.
8. اربطها بالكود وواجهة الإدارة، ثم حدّث هذا المرجع.

أوامر التحقق المحلي:

```bash
pnpm test:migration-contract
pnpm test:country-db-seed
pnpm test:country-learning
pnpm test:security-boundaries
pnpm exec tsc --noEmit
pnpm lint
```

## 6. عزل بيانات الدولة

كل `slug` يمثل منطقة واحدة. يجب أن تستخدم دوال القراءة مثل `getAreaLandingData(slug)` وAPI `/api/public/areas/[slug]` نفس `area_id` عند جمع المحتوى والباقات وFAQ والروابط والثيم والمدن والمنطقة الزمنية. لا يجوز أن يؤدي نقص سجل دولة إلى قراءة سجل دولة أخرى بصمت.

عند تعديل دولة من لوحة التحكم:

1. أرسل `slug` الصحيح.
2. حدّث نوعًا واحدًا من `content` أو `packages` أو `faq` أو `links`.
3. تحقق من صفوف `area_id` قبل وبعد التغيير.
4. اختبر أن دولة أخرى لم تتغير.
5. أعد التحقق من الصفحة العامة.

## 7. مصدر الحقيقة والتوثيق

- بنية SQL: `supabase/migrations/`.
- سياسة التشغيل: `supabase/README.md`.
- سجل المراجعة التاريخي: `supabase/MIGRATION_EXECUTION_MANIFEST.md`.
- عقود الكود: `lib/admin-data-schemas.ts` و`lib/country-content.ts` وRoute Handlers.
- اختبارات العزل والعقود: `tests/`.

لا يُعد وجود ملف seed أو migration دليلًا على تطبيقه في قاعدة الإنتاج. يجب توثيق التطبيق الفعلي عبر سجل البيئة المستهدفة أو أداة Supabase المعتمدة.
