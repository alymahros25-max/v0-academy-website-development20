# خريطة مصدر المكتبة المركزية

## المصدر المعتمد

- **قاعدة الإنتاج:** `public.digital_library_documents`
- **قراءة عامة:** `GET /api/library`، ولا تُعرض إلا السجلات `is_published = true`.
- **إدارة:** `GET/POST/PATCH/DELETE /api/library` بعد جلسة الإدارة، مع تحقق Zod على الخادم.
- **العرض:** `app/library/page.tsx` يقرأ API نفسها، ويعرض `drive_url` للمعاينة و`cover_url` للغلاف.
- **لوحة التحكم:** `components/admin/LibraryManager.tsx` تكتب السجل نفسه وتدعم رابط الغلاف والترتيب والنشر.

## العناصر المتحققة من روابط المستخدم

أضيفت في `supabase/migrations/049_seed_verified_library_documents.sql` باستخدام `ON CONFLICT (slug) DO NOTHING` حتى لا تستبدل أي تعديل إداري لاحقًا:

1. شرح الجزرية — PDF — الملف `1RwAzCB15XcDbG8FMl7kUpnQQ8x-1jFDm`
2. الجزء 1 — PDF — الملف `1NQa9-jcOiT0nidRBWBacyK886SL5D1e3`
3. الجزء 2 — PDF — الملف `1n9BFurh9hzRNrRGbXKrBcNgSrEOvi-FX`
4. سورة البلد — PowerPoint — الملف `18PzeR9-tsUv7ra2m7KEghww0hAf9JgX8`
5. سورة الزلزلة والعاديات — PowerPoint — الملف `1SMEbY83vbQKjvEA8xQAG2c96lzJMDlNs`
6. سورة الفاتحة — PowerPoint — الملف `1TO8_zSRO9fu8a3Ree8mi3JSki1udEkch`
7. سورة الفيل والهمزة والعصر — PowerPoint — الملف `1PIfVSNBnhsC5KDFGIqJ4BemZZQDwR9tR`
8. سورة الليل والشمس — PowerPoint — الملف `1A-VHhF5P-qcXpo1RTODOQBJLzMi0WLdJ`
9. سورة الناس والفلق والإخلاص — PowerPoint — الملف `1Inf_jqW9QorThN7tRUrypzqZ384tUZW`

لكل عنصر `cover_url` من Google Drive Thumbnail بالمعرف نفسه، ولا توجد صورة غلاف مستقلة مخترعة داخل الكود.

## عنصر لم يُضف

الرابط المباشر الثالث الذي أرسله المسؤول (`1i-Zwm81q26hkTbGB1XtBst7dK1czeRYO`) أعاد صفحة **إثبات هوية Google** بدل اسم الملف ومحتواه. لذلك لم يُخمن اسمه أو نوعه ولم يُضف إلى قاعدة البيانات. يلزم فتحه من حساب Google المصرح له ثم تزويد رابط قراءة صالح أو اسم الملف المؤكد.

## حدود النطاق

- لا تُنسخ هذه الكتب إلى جداول الدول ولا إلى ملفات JSON.
- لا تُنفذ migration استبدالية ولا حذف شامل؛ الـmigration الجديدة إدراج أولي محافظ فقط.
- محليًا، كان endpoint الإنتاج الحالي `/api/library` يعيد `500 Failed to load library` قبل تطبيق migration الجديدة، لذلك لا يُدّعى أن الكتب ظهرت حيًا قبل تشغيل migration على قاعدة الإنتاج ثم إعادة النشر.
