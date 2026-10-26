# سجل تاريخ المشروع والتعديلات

> هذه الصفحة مخصصة لما حدث سابقًا: مراحل التطوير، التعديلات، والروابط المباشرة إلى GitHub. لا تستخدمها بدل [التوثيق المركزي للحالة الحالية](PROJECT_DOCUMENTATION.md).

## روابط سريعة

- [المستودع على GitHub](https://github.com/alymahros25-max/v0-academy-website-development20)
- [Commits](https://github.com/alymahros25-max/v0-academy-website-development20/commits/main)
- [Pull Requests](https://github.com/alymahros25-max/v0-academy-website-development20/pulls?q=is%3Apr+is%3Amerged)
- [التوثيق المركزي الحالي](PROJECT_DOCUMENTATION.md)
- [المعمارية الحالية](CURRENT_ARCHITECTURE.md)
- [مرجع قاعدة البيانات](DATABASE_REFERENCE.md)
- [دليل لوحة التحكم](ADMIN_DASHBOARD.md)

## طريقة قراءة السجل

كل مرحلة أدناه تحتوي على تاريخ تقريبي، وصف مختصر، ورابط إلى commit أو Pull Request. الروابط إلى GitHub هي المرجع الأصلي للتفاصيل وdiff والملفات التي تغيّرت. لا تُنسخ التقارير القديمة إلى وثيقة الحالة الحالية؛ تُربط هنا فقط حتى يبقى الشرح الحالي واضحًا.

## خط زمني مختصر

| المرحلة | التاريخ | ماذا حدث | المرجع |
| --- | --- | --- | --- |
| تأسيس وتطوير المنصة | قبل أكتوبر 2026 | بناء صفحات الموقع، مكونات الواجهة، المحتوى، والـ App Router. | [سجل commits](https://github.com/alymahros25-max/v0-academy-website-development20/commits/main) |
| المحرك المركزي للدول | 19 أكتوبر 2026 | استعادة/توحيد محرك صفحات الدول بدل تكرار منطق العرض. | [PR #172](https://github.com/alymahros25-max/v0-academy-website-development20/pull/172) |
| مصدر بيانات الدولة في Supabase | 19 أكتوبر 2026 | تجهيز SEO وFAQ لمصدر قاعدة البيانات ونقل محتوى التعلم لنموذج Supabase. | [PR #174](https://github.com/alymahros25-max/v0-academy-website-development20/pull/174)، [PR #175](https://github.com/alymahros25-max/v0-academy-website-development20/pull/175) |
| تحسين أداء صفحات الدول | 20 أكتوبر 2026 | تقليل تكلفة التحميل وتحسين صفحات الدول. | [PR #176](https://github.com/alymahros25-max/v0-academy-website-development20/pull/176) |
| تقوية حدود الأمان والقراءة | 20 أكتوبر 2026 | تشديد RLS وحدود القراءة من الخادم وتثبيت search path للدوال. | [PR #177](https://github.com/alymahros25-max/v0-academy-website-development20/pull/177)، [PR #178](https://github.com/alymahros25-max/v0-academy-website-development20/pull/178) |
| المراقبة والتدقيق التشغيلي | 21 أكتوبر 2026 | استكمال اختبارات الحدود الصحية والمراقبة والتدقيق. | [PR #179](https://github.com/alymahros25-max/v0-academy-website-development20/pull/179) |
| SEO والمحتوى | 21–23 أكتوبر 2026 | توحيد عرض CMS وصفحات الدول، وتحسين metadata والمدونة والمحتوى التعليمي. | [PR #180](https://github.com/alymahros25-max/v0-academy-website-development20/pull/180) و[سجل commits](https://github.com/alymahros25-max/v0-academy-website-development20/commits/main) |
| موافقة GA4 والتحليلات | 23–25 أكتوبر 2026 | إضافة/تقوية موافقة التحليلات، ترتيب تحميل GA4، وإزالة تقارير لوحة التحليلات القديمة. | [PR #181](https://github.com/alymahros25-max/v0-academy-website-development20/pull/181)، [PR #191](https://github.com/alymahros25-max/v0-academy-website-development20/pull/191)، [PR #192](https://github.com/alymahros25-max/v0-academy-website-development20/pull/192)، [PR #193](https://github.com/alymahros25-max/v0-academy-website-development20/pull/193)، [PR #194](https://github.com/alymahros25-max/v0-academy-website-development20/pull/194)، [PR #195](https://github.com/alymahros25-max/v0-academy-website-development20/pull/195) |
| تقوية البيئة والأمان | 24–25 أكتوبر 2026 | إضافة قالب بيئة آمن، تحديثات اعتماديات والتحقق من البريد. | [PR #189](https://github.com/alymahros25-max/v0-academy-website-development20/pull/189)، [PR #190](https://github.com/alymahros25-max/v0-academy-website-development20/pull/190) |
| تحسين سرعة الهاتف | 26 أكتوبر 2026 | تحسين التحميل الأولي، preload للصورة الرئيسية، وتأجيل أجزاء غير حرجة. | [PR #198](https://github.com/alymahros25-max/v0-academy-website-development20/pull/198)، [PR #199](https://github.com/alymahros25-max/v0-academy-website-development20/pull/199)، [PR #200](https://github.com/alymahros25-max/v0-academy-website-development20/pull/200)، [PR #201](https://github.com/alymahros25-max/v0-academy-website-development20/pull/201) |

## آخر لقطة موثقة

- آخر commit في نسخة الفحص: [`5f5191a`](https://github.com/alymahros25-max/v0-academy-website-development20/commit/5f5191a) — `Perf/mobile speed 20261026 (#201)`.
- commits مرتبطة مباشرة بالتحسينات الأخيرة: [`340a157`](https://github.com/alymahros25-max/v0-academy-website-development20/commit/340a157)، [`c70bbf7`](https://github.com/alymahros25-max/v0-academy-website-development20/commit/c70bbf7)، [`415817e`](https://github.com/alymahros25-max/v0-academy-website-development20/commit/415817e).
- آخر مراجعة للحالة الحالية: 26 أكتوبر 2026.

## أين توجد التفاصيل القديمة؟

التقارير القديمة تبقى في المستودع ولا تُحذف. أمثلة على مجلدات السجل:

- `docs/*-country-page/` — تقارير مراحل صفحات الدول.
- `docs/seo/` — خطط وتقارير SEO.
- `docs/country-40-structure/` — مراحل بناء هيكل الدول الأربعين.
- `supabase/MIGRATION_EXECUTION_MANIFEST.md` — سجل تنفيذ migrations كما كان موثقًا.
- `supabase/seeds/` و`supabase/rollback/` — لقطات وملفات استرجاع تاريخية.
- `scripts/MIGRATION_README.md` — شرح أدوات الترحيل القديمة/الحالية.

## قاعدة إضافة سجل جديد

عند تنفيذ تغيير مهم:

1. أكمل التغيير في branch مستقل.
2. اربط التغيير بـ commit واضح وPull Request إن وجد.
3. أضف صفًا مختصرًا في الخط الزمني مع الرابط المباشر.
4. حدّث `PROJECT_DOCUMENTATION.md` فقط إذا تغيرت **الحالة الحالية**.
5. حدّث `DATABASE_REFERENCE.md` أو `ADMIN_DASHBOARD.md` إذا تغير عقد القاعدة أو لوحة التحكم.
6. لا تضع أسرارًا أو بيانات طلاب أو قيم `.env` في السجل.

## تنبيه حول الدقة

وجود migration أو تقرير أو seed في GitHub يثبت أنه محفوظ في المستودع، لكنه لا يثبت وحده أنه مطبق على قاعدة إنتاج حية. التطبيق الفعلي يحتاج سجل البيئة المستهدفة أو فحص Supabase المصرح به. وبالمثل، وجود متغير Resend في `.env.example` يثبت عقد التكامل في الكود، ولا يثبت حالة حساب Resend أو القوالب الحية.
