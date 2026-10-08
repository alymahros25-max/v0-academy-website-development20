# Manifest تنفيذ ملفات Supabase Migrations

**الفرع المفحوص:** `refactor/three-country-engine-migration`  
**النقطة المرجعية عند الجرد:** `fdcc220`  
**النطاق:** كل ملفات `supabase/migrations/*.sql` الموجودة في هذا الفرع وقت إعداد القائمة (46 ملفًا).

> **هذا جرد وترتيب مراجعة، وليس إذنًا بتنفيذ SQL.** لم يتم ربط Supabase أو فحص سجل قاعدة بعيدة أو تشغيل أي Migration. لا تستخدم `supabase db push` اعتمادًا على هذه القائمة قبل معالجة تحذيرات النسخ المكررة أدناه.

> **قرار نطاق حالي:** ملفات الدفع القديمة `009`, `010`, و`012` محفوظة هنا كسجل تاريخي فقط. أزيلت وحدة الدفع والطلبات من التطبيق، وهذه الملفات ليست جزءًا من baseline قاعدة المعاينة النظيفة ولا يجوز تطبيقها عليها.

## نتيجة الفحص قبل التنفيذ

1. الملفات مرقمة تسلسليًا في أسمائها، لكن توجد ثلاث نسخ مكررة: `022` و`023` و`026`. كما أن الأرقام `004–008` غير موجودة. لا تنشئ ملفات فارغة لسد الفجوات، ولا تعِد ترقيم التاريخ عشوائيًا.
2. يتتبع Supabase حالة التنفيذ عبر رقم النسخة في سجل migrations، ويشغّل الملفات بترتيب النسخة. لذلك لا يستطيع هذا الـManifest وحده التمييز بأمان بين ملفين لهما رقم النسخة نفسه. يجب أولًا مراجعة سجل القاعدة المستهدفة، ثم اعتماد طريقة واحدة موثقة لمعالجة التعارضات قبل `db push`؛ لا نغيّر أسماء النسخ الآن.
3. ترتيب الملفات المتساوية في الرقم أدناه أبجدي وحتمي فقط؛ الملفات المتساوية مستقلة بحسب الفحص الساكن الحالي، لكن هذا لا يحل تصادم رقم النسخة في سجل Supabase.
4. `022_remove_legacy_package_durations.sql` يحتوي `DELETE` يحذف باقات 40 و60 دقيقة من `public.packages` و`public.area_packages`. يلزم مراجعة أثره على القاعدة المستهدفة ونسخة احتياطية مناسبة قبل أي تطبيق.
5. في ملفات `035–048` تم استبدال alias المحلي داخل `VALUES` من `desc` إلى `description_text` فقط؛ عمود قاعدة البيانات يظل `description_ar`. لم تتغير الأسعار أو العملات أو الـslugs نتيجة هذا التعديل. هذا تصحيح مصدر، وليس إثباتًا بتشغيل PostgreSQL.

## ترتيب أسماء الملفات في المستودع (للمراجعة فقط، لا للتشغيل)

| الترتيب | رقم الاسم | اسم الملف الفعلي | الغرض / الاعتماد الظاهر |
|---:|:---:|---|---|
| 1 | 001 | `001_create_cms_tables.sql` | الجداول الأساسية لمحتوى الموقع وإعداداته وسجل الترجمة. |
| 2 | 002 | `002_phase3_extended_schema.sql` | جداول CMS والصفحات والثيمات والأدوات. |
| 3 | 003 | `003_classroom_videos.sql` | جدول فيديوهات الصفوف. |
| 4 | 009 | `009_stripe_payments.sql` | أرشيف تاريخي لجداول المدفوعات والطلبات؛ مستثنى من قاعدة المعاينة الجديدة. |
| 5 | 010 | `010_multi_provider_payment_settings.sql` | أرشيف تاريخي لإعدادات المزودين والالتحاقات؛ مستثنى من قاعدة المعاينة الجديدة. |
| 6 | 011 | `011_legal_pages.sql` | صفحات الشروط والسياسات. |
| 7 | 012 | `012_harden_payment_rls.sql` | أرشيف تاريخي لسياسات RLS للمدفوعات؛ مستثنى من قاعدة المعاينة الجديدة. |
| 8 | 013 | `013_faq_content.sql` | محتوى الأسئلة الشائعة. |
| 9 | 014 | `014_site_areas_country_content.sql` | جداول المناطق ومحتوى وباقات وروابط الدول الأساسية. |
| 10 | 015 | `015_seed_isolated_country_data.sql` | بيانات محتوى وباقات وروابط وFAQ المعزولة حسب المنطقة. |
| 11 | 016 | `016_seed_global_and_germany_faq.sql` | بيانات الموقع العام وFAQ ألمانيا. |
| 12 | 017 | `017_seed_area_contact_links.sql` | روابط اتصال المناطق. |
| 13 | 018 | `018_country_content_enrichment.sql` | إنشاء الثيمات والمدن والمناطق الزمنية وبياناتها. |
| 14 | 019 | `019_optimize_country_enrichment_rls.sql` | تحسين سياسات RLS لجداول الإثراء. |
| 15 | 020 | `020_split_country_enrichment_admin_policies.sql` | فصل سياسات الإدارة لجداول الإثراء. |
| 16 | 021 | `021_country_quran_facts.sql` | إضافة حقول حقائق القرآن للثيم. |
| 17 | 022 | `022_homepage_copy_refresh.sql` | تحديث نصوص الصفحة الرئيسية. مستقل عن تنظيف الباقات أدناه. |
| 18 | 022 | `022_remove_legacy_package_durations.sql` | **حذف بيانات** باقات 40/60 دقيقة؛ يتطلب مراجعة خاصة. |
| 19 | 023 | `023_add_blog_sort_order.sql` | إضافة ترتيب منشورات المدونة. |
| 20 | 023 | `023_remove_homepage_hero_copy.sql` | تحديث نص hero بالصفحة الرئيسية؛ مستقل عن ترتيب المدونة. |
| 21 | 024 | `024_seed_kuwait_country_page.sql` | بيانات صفحة الكويت. |
| 22 | 025 | `025_seed_new_country_areas.sql` | تعريف مناطق دول إضافية وبياناتها الأساسية. |
| 23 | 026 | `026_analytics_mvp.sql` | جداول التحليلات؛ مستقل عن Seed جنوب أفريقيا. |
| 24 | 026 | `026_seed_south_africa_country_page.sql` | بيانات صفحة جنوب أفريقيا. |
| 25 | 027 | `027_seed_china_country_page.sql` | بيانات صفحة الصين. |
| 26 | 028 | `028_seed_italy_country_page.sql` | بيانات صفحة إيطاليا. |
| 27 | 029 | `029_seed_russia_country_page.sql` | بيانات صفحة روسيا. |
| 28 | 030 | `030_seed_norway_country_page.sql` | بيانات صفحة النرويج. |
| 29 | 031 | `031_seed_austria_country_page.sql` | بيانات صفحة النمسا. |
| 30 | 032 | `032_seed_switzerland_country_page.sql` | بيانات صفحة سويسرا. |
| 31 | 033 | `033_seed_brazil_country_page.sql` | بيانات صفحة البرازيل. |
| 32 | 034 | `034_seed_mexico_country_page.sql` | بيانات صفحة المكسيك. |
| 33 | 035 | `035_seed_colombia_country_page.sql` | بيانات صفحة كولومبيا. |
| 34 | 036 | `036_seed_venezuela_country_page.sql` | بيانات صفحة فنزويلا. |
| 35 | 037 | `037_seed_denmark_country_page.sql` | بيانات صفحة الدنمارك. |
| 36 | 038 | `038_seed_greece_country_page.sql` | بيانات صفحة اليونان. |
| 37 | 039 | `039_seed_new_zealand_country_page.sql` | بيانات صفحة نيوزيلندا. |
| 38 | 040 | `040_seed_finland_country_page.sql` | بيانات صفحة فنلندا. |
| 39 | 041 | `041_seed_turkey_country_page.sql` | بيانات صفحة تركيا. |
| 40 | 042 | `042_seed_indonesia_country_page.sql` | بيانات صفحة إندونيسيا. |
| 41 | 043 | `043_seed_malaysia_country_page.sql` | بيانات صفحة ماليزيا. |
| 42 | 044 | `044_seed_portugal_country_page.sql` | بيانات صفحة البرتغال. |
| 43 | 045 | `045_seed_poland_country_page.sql` | بيانات صفحة بولندا. |
| 44 | 046 | `046_seed_argentina_country_page.sql` | بيانات صفحة الأرجنتين. |
| 45 | 047 | `047_seed_senegal_country_page.sql` | بيانات صفحة السنغال. |
| 46 | 048 | `048_seed_nigeria_country_page.sql` | بيانات صفحة نيجيريا. |

## بوابة ما قبل التنفيذ

- [ ] تحديد القاعدة المقصودة ومراجعة `supabase_migrations.schema_migrations` قراءةً فقط؛ هذا لم يحدث في هذه الدفعة.
- [ ] حسم تعارضات أرقام `022/023/026` بطريقة متوافقة مع سجل القاعدة، دون إعادة ترقيم تاريخي غير موثق.
- [ ] اختبار القائمة كاملة على PostgreSQL/Supabase محلي أو بيئة معزولة من الصفر، ثم إعادة الملفات القابلة للتكرار للتحقق من idempotency.
- [ ] مراجعة أثر حذف باقات 40/60 دقيقة، ومطابقة أسعار وعملات الدول وقيود `ON CONFLICT`.
- [ ] حفظ نتائج الاختبار ومطابقة الملفات في Commit منفصل قبل أي تطبيق بعيد.
- [ ] عدم تعديل Vercel أو Production أو تشغيل SQL عن بُعد ضمن هذه المرحلة.

## مراجع Supabase

- [Database migrations — Local development](https://supabase.com/docs/guides/local-development/database-migrations)
- [Database migrations — Deployment and history](https://supabase.com/docs/guides/deployment/database-migrations)
