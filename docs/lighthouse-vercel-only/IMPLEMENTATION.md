# إصلاح Lighthouse — فحص Vercel فقط

**التاريخ:** 11 أكتوبر 2026

## القرار

يستخدم Workflow الخاص بـ Lighthouse نسخة Vercel الجاهزة مباشرة، ولا يبني تطبيق Next.js داخل GitHub Actions.

تظل جميع متغيرات التشغيل والأسرار داخل Vercel فقط، وتشمل متغيرات Supabase وقاعدة البيانات والبريد والإدارة والتحليلات وGoogle.

## ما تم تغييره

تم تحديث:

```text
.github/workflows/lighthouse-ci.yml
```

وأصبح Workflow:

1. يشغّل GitHub Actions بحد أدنى من الصلاحيات.
2. يثبت Chrome فقط لتشغيل Lighthouse.
3. ينتظر استجابة رابط Vercel.
4. يفحص رابط Vercel مباشرة عبر `--collect.url`.
5. لا ينفذ `pnpm build`.
6. لا ينفذ `pnpm start`.
7. لا يقرأ `secrets.*`.
8. لا يقرأ أي متغير Supabase من GitHub.

## رابط الفحص

```text
https://quran-elhafez.com
```

تم اختيار النطاق العام بعد التحقق من استجابته بنجاح. روابط Vercel Preview المباشرة محمية بـSSO، لذلك لا تصلح لفحص GitHub Actions العام.

## سياسة المتغيرات

المصدر الوحيد للمتغيرات هو Vercel:

- Preview.
- Production.
- Development عند الحاجة داخل Vercel.

لا تُنسخ القيم إلى:

- GitHub Actions.
- GitHub Secrets.
- ملفات `.env` داخل المستودع.
- الكود أو ملفات التوثيق.

## سبب الإصلاح

كان Workflow القديم يبني التطبيق داخل GitHub Actions ويحتاج إلى متغيرات Supabase من `secrets.*`. هذا جعل نجاح الفحص مرتبطًا بوجود أسرار في GitHub، بينما إعداد التطبيق الفعلي موجود في Vercel.

الإعداد الجديد يفصل بين المسؤوليات:

- **Vercel:** البناء، المتغيرات، الاتصال بقاعدة البيانات، ونسخة التطبيق الجاهزة.
- **GitHub Actions:** فحص Lighthouse للرابط الجاهز فقط.

## نطاق الفحص

- Pull Request: تشغيل Lighthouse مرة واحدة.
- Push إلى `main`: تشغيل Lighthouse ثلاث مرات.
- لا توجد أسرار في مخرجات Workflow.
- لا يتم تعديل متغيرات Vercel من Workflow.
