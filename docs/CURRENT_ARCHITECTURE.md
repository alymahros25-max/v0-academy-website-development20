# المرجع المعماري الحالي

> آخر مراجعة موثقة: 26 أكتوبر 2026 — الفرع `perf/mobile-speed-20261026` — Commit `4a4a987`.
>
> هذا الملف يصف الحالة الموجودة فعليًا في الكود، وليس خطة مستقبلية. عند اختلاف أي وصف قديم في `docs/` أو ملفات الملخصات، يُرجع إلى هذا الملف ثم إلى الكود و`package.json`.

## 1. تعريف المشروع

أكاديمية الحافظ المتميز منصة تعليمية عربية لتعليم القرآن الكريم والتجويد وتأسيس اللغة العربية عبر الإنترنت. الموقع موجّه للعائلات والطلاب، ويستخدم صفحات عامة وصفحات هبوط حسب الدولة، بينما تتم إدارة المحتوى من لوحة `/admin`.

- المستودع: `alymahros25-max/v0-academy-website-development20`
- الفرع الإنتاجي المتعارف عليه: `main`
- فرع توثيق/تحسين الأداء الحالي: `perf/mobile-speed-20261026`
- النطاق العام المعلن في metadata: `https://quran-elhafez.com`
- الحجز والتواصل: WhatsApp وقنوات التواصل؛ لا يوجد checkout فعال في التطبيق الحالي.

## 2. لقطة تقنية

| الطبقة | التقنية الحالية |
| --- | --- |
| إطار التطبيق | Next.js `16.4.1` مع App Router |
| واجهة المستخدم | React `19.2.3` وTypeScript `5.7.3` |
| التنسيق | Tailwind CSS `3.4.x`، PostCSS، و`tailwindcss-animate` |
| البيانات والمصادقة | Supabase JS `2.108.2`، Supabase Auth، وPostgreSQL عبر Supabase |
| التحقق من المدخلات | Zod `4.6.6` و`@hookform/resolvers` |
| إدارة جلب البيانات | SWR `2.4.0` في أجزاء لوحة التحكم والعميل |
| الأيقونات والتفاعل | Lucide React، Radix UI، Embla Carousel، Framer Motion |
| الوسائط | `next/image` وSharp، صور WebP/AVIF، وYouTube iframe عند التفاعل |
| المراقبة | Sentry Next.js عند ضبط DSN؛ GA4 للتتبع المباشر بعد التحميل الكسول |
| التطوير والبناء | Node.js متوافق مع CI، pnpm، Turbopack في `pnpm dev` |
| النشر المقصود | Vercel من GitHub، مع Preview لفروع Pull Request عند تفعيل التكامل |

الإصدارات المعلنة في `package.json` و`pnpm-lock.yaml` هي المصدر الموثوق. لا تحدّث أرقام الشارات في README يدويًا دون مراجعة الملفات نفسها.

## 3. تدفق التطبيق

```mermaid
flowchart LR
    V[الزائر] --> N[Next.js App Router]
    N --> SC[Server Components وStatic/ISR Pages]
    N --> RC[Client Components]
    SC --> API[Route Handlers]
    API --> SB[(Supabase/PostgreSQL)]
    A[المشرف] --> ADM[/admin]
    ADM --> AUTH[جلسة إدارة محمية]
    AUTH --> API
    N --> IMG[next/image + Sharp]
    RC --> GA[GA4 بعد lazyOnload]
    RC --> YT[YouTube عند اختيار الفيديو]
```

### مبادئ التنفيذ

1. الصفحات العامة تستخدم Server Components أو SSG/ISR كلما أمكن، مع `revalidate` في الصفحات التي تتغير دوريًا.
2. المسارات الحساسة تنفذ على الخادم، ولا يُرسل `SUPABASE_SERVICE_ROLE_KEY` إلى المتصفح.
3. القراءة العامة يجب أن تكون محدودة بالسجلات النشطة/المنشورة عبر allowlist وRLS.
4. مكونات العميل تؤجل التكاملات الاختيارية والوسائط الثقيلة.
5. الصور تستخدم أبعادًا معلنة و`next/image`، والفيديو لا ينشئ iframe قبل تفاعل المستخدم.
6. التغييرات الجديدة يجب أن تراعي RTL والعربية، الوصول بلوحة المفاتيح، و`prefers-reduced-motion`.

## 4. خريطة الملفات

| المسار | المسؤولية |
| --- | --- |
| `app/` | صفحات App Router، layouts، صفحات الدول، `/admin`، Route Handlers تحت `app/api`. |
| `components/` | مكونات الواجهة العامة، الصفحة الرئيسية، الفيديو، الإدارة، النماذج، والثيم. |
| `lib/` | طبقات Supabase، المصادقة، API clients، المحتوى، الدول، SEO، الأمان، الأداء، والتحليلات. |
| `public/` | الصور، الأيقونات، manifest، robots، والموارد العامة. |
| `supabase/migrations/` | سجل SQL تاريخي ومراجع migrations؛ لا يفترض تشغيله كاملًا من الصفر على قاعدة الإنتاج الحالية. |
| `supabase/rollback/` | ملفات rollback محددة لبعض migrations، وليست بديلًا عن نسخة احتياطية. |
| `scripts/` | أدوات seed/migration والتحديثات الأمنية. |
| `tests/` | اختبارات Node.js للعقود، المسارات، SEO، عزل الدول، والأمن. |
| `docs/` | المراجع التشغيلية والتقارير التاريخية. |
| `.github/workflows/` | تحقق metadata للمستودع عند push إلى `main` أو Pull Request. |

## 5. المسارات العامة الحالية

يوجد مسار رئيسي، صفحات برامج ومحتوى، و40 مدخلًا لصفحات الدول بحسب اختبار `tests/country-routes.test.mjs`. المسارات الديناميكية الأساسية هي:

- `/`، `/about`، `/quran`، `/arabic`
- `/teachers`، `/reviews`، `/faq`، `/contact`
- `/library`، `/blog`، `/blog/[slug]`
- `/blog/country/[slug]/[topic]`
- `/classroom-moments`، `/games`، `/account`
- `/privacy`، `/terms`، `/refund-policy`
- صفحات الدول مثل `/saudi-arabia` و`/united-arab-emirates` و`/canada` و`/germany` و`/qatar` وغيرها؛ مصدر القائمة الفعلي هو مجلد `app/` واختبار `tests/country-routes.test.mjs`.

المسارات الإدارية لا يجب فهرستها: `/admin`، `/admin/login`، `/admin/cms`، `/admin/pages`، `/admin/theme`، `/admin/users`.

## 6. المكتبات المباشرة

المصدر الكامل هو `package.json`. أهم المجموعات:

- **الإطار واللغة:** `next`, `react`, `react-dom`, `typescript`, `tsx`.
- **البيانات والنماذج:** `@supabase/supabase-js`, `swr`, `zod`, `react-hook-form`, `@hookform/resolvers`.
- **الواجهة:** حزم Radix UI، `lucide-react`، `class-variance-authority`، `clsx`، `tailwind-merge`، `vaul`.
- **الحركة والوسائط:** `framer-motion`، `embla-carousel-react`، `react-pdf`، `sharp`.
- **المحتوى المرئي:** `react-markdown`، `recharts`.
- **المراقبة:** `@sentry/nextjs`.
- **البناء والجودة:** `eslint`، `eslint-config-next`، `eslint-plugin-react-hooks`، `postcss`، `@tailwindcss/postcss`، `tailwindcss`.

لا تضف مكتبة جديدة لتفاعل صغير قبل التحقق من إمكانية تنفيذ السلوك بالمكونات الحالية أو Web APIs.

## 7. إعداد التشغيل المحلي

```bash
git clone https://github.com/alymahros25-max/v0-academy-website-development20.git
cd v0-academy-website-development20
pnpm install
cp .env.example .env.local
pnpm dev
```

الأوامر الأساسية:

| الأمر | الغرض |
| --- | --- |
| `pnpm dev` | خادم التطوير مع Turbopack. |
| `pnpm build` | بناء الإنتاج والتحقق من توليد المسارات. |
| `pnpm start` | تشغيل بناء الإنتاج. |
| `pnpm lint` | تشغيل ESLint. |
| `pnpm exec tsc --noEmit` | فحص TypeScript. |
| `pnpm test:country-routes` | تحقق من صفحات الدول. |
| `pnpm test:security-boundaries` | تحقق من حدود المصادقة والبيانات الحساسة. |
| `pnpm test:migration-contract` | تحقق من عقود migrations. |

فحوص Pull Request المقترحة:

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm test:migration-contract
pnpm test:security-boundaries
pnpm build
```

ملاحظة تحقق حالية: `pnpm test:seo-metadata` يفشل حاليًا بسبب توقع الاختبار وجود `unstable_cache` داخل `app/blog/[slug]/page.tsx`، بينما الصفحة الحالية تستخدم مستودع المدونة المباشر. هذا تعارض قائم في الاختبار/العقد وليس نتيجة تحديث التوثيق، ويجب معالجته في تغيير كود مستقل.

## 8. متغيرات البيئة

| المتغير | الاستخدام |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` و`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | اتصال Supabase العام من العميل. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | اسم قديم مدعوم كـ fallback في بعض أجزاء المشروع. |
| `SUPABASE_URL` و`SUPABASE_SERVICE_ROLE_KEY` | اتصال الخادم الموثوق؛ ممنوع في Client Components. |
| `ADMIN_EMAIL` و`ADMIN_PASSWORD_SCRYPT_HASH` و`ADMIN_SESSION_SECRET` | دخول وجلسة الإدارة. |
| `NEXT_PUBLIC_SENTRY_DSN` و`SENTRY_DSN` و`SENTRY_TRACES_SAMPLE_RATE` | مراقبة الأخطاء عند التفعيل. |
| `GEMINI_API_KEY` و`GOOGLE_GENERATIVE_AI_KEY` | تكاملات المساعد/الترجمة عند التفعيل. |
| `RESEND_API_KEY` و`CONTACT_FROM_EMAIL` و`CONTACT_INBOX_EMAIL` و`NEXT_PUBLIC_CONTACT_EMAIL` | رسائل التواصل والبريد عند التفعيل. |
| `MIGRATION_TARGET` | اختيار هدف أدوات الترحيل. |

لا ترفع `.env.local` أو قيم الأسرار إلى GitHub. راجع `.env.example` عند إضافة متغير جديد.

## 9. الحالة الحالية للأداء

في Commit `4a4a987` تم:

- تأجيل Google Analytics إلى `lazyOnload`.
- تقسيم أقسام الصفحة الرئيسية غير الحرجة إلى dynamic chunk مع بقاء SSR.
- تأجيل تحميل طبقة WhatsApp ومتتبع GA4 من الحزمة الأولية.
- الحفاظ على تحسين صور Next.js وتأجيل فيديوهات YouTube.

تم التحقق من `pnpm lint` و`pnpm build` بنجاح في ذلك التغيير. لا توجد حاليًا عتبة Lighthouse آلية مفعلة في سير العمل الموجود.

## 10. قواعد التغيير

- لا تعدّل migration مطبقة سابقًا؛ أضف ملفًا جديدًا وصفيًا.
- لا تشغّل `supabase db push` اعتمادًا على الترقيم التاريخي وحده؛ راجع `docs/DATABASE_REFERENCE.md` و`supabase/README.md`.
- لا تضع بيانات إنتاج أو مفاتيح سرية في fixtures أو logs.
- بعد تعديل عقد API أو جدول، حدّث المرجع المناسب واختبارات العقد.
- افصل بين كود لوحة الإدارة وقراءة المحتوى العام، وحافظ على allowlists وRLS.
- أي تغيير في المحتوى أو الأسعار يجب أن يوضح هل مصدره قاعدة البيانات أم fallback في الكود.
