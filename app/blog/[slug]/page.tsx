import { Metadata } from 'next'
import BlogArticleClient from "./client"
import { getSeoAlternates } from '@/lib/seo-metadata'
import { notFound, permanentRedirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { getCanonicalBlogSlug, getStoredBlogSlugs, isLegacyBlogSlug } from '@/lib/blog-slugs'

// المقالات الثابتة الافتراضية
const blogPosts: Record<string, any> = {
  "quran-memorization-techniques": {
    title: { ar: "تقنيات عملية لحفظ القرآن الكريم ومراجعته", en: "Practical Quran Memorization and Revision Techniques", fr: "Méthodes pratiques pour mémoriser et réviser le Coran" },
    category: { ar: "تحفيظ القرآن", en: "Quran Memorization", fr: "Mémorisation du Coran" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Équipe de l'académie" },
    date: "2024-06-15",
    readTime: 9,
    image: "/images/quran-memorization-techniques.webp",
    keywords: { ar: "حفظ القرآن للأطفال، طرق حفظ القرآن، مراجعة القرآن، تثبيت الحفظ، الاستماع للقرآن، أحكام التجويد", en: "Quran memorization for children, Quran revision, repetition, Quran listening, Tajweed", fr: "Mémorisation du Coran pour enfants, révision du Coran, répétition, tajwid" },
    description: { ar: "خطوات عملية لتنظيم حفظ القرآن ومراجعته، مع أفكار للتكرار والاستماع وفهم المعاني والمتابعة المناسبة لمستوى الطالب.", en: "Practical steps for organizing Quran memorization and revision, with ideas for repetition, listening, understanding, and suitable progress review.", fr: "Des étapes pratiques pour organiser la mémorisation et la révision du Coran, avec des idées de répétition et d’écoute." },
    content: {
      ar: `<h2>مقدمة</h2>
<p>حفظ القرآن الكريم هدف يسعى إليه كثير من المسلمين وأولياء الأمور. وتساعد الخطة الواضحة والمراجعة المنتظمة على تنظيم وقت التعلّم، مع اختيار مقدار يناسب مستوى الطالب وظروفه.</p>

<h2>أبرز التقنيات العملية لحفظ سريع ومتقن</h2>

<h3>1. الاستمرار على نسخة مصحف واحدة</h3>
<p>قد يساعد استخدام النسخة نفسها أثناء الحفظ والمراجعة على الاعتياد على شكل الصفحة وموضع الآيات. جرّب هذه الطريقة إن كانت مناسبة لك، ولا تجعل تذكّر موضع الصفحة بديلًا عن ضبط الآية ومراجعتها.</p>

<h3>2. التكرار الموزع (Spaced Repetition)</h3>
<p>يمكن تقسيم وقت المراجعة إلى جلسات قصيرة موزعة على اليوم، مع اختيار مقدار يناسب قدرة الطالب. جرّب تكرار المقطع مع الاستماع إليه، ثم استرجاعه من الذاكرة ومراجعته في وقت لاحق، وعدّل الخطة بحسب ما يثبت معك فعليًا.</p>

<h3>3. الاطلاع على المعاني والسياق</h3>
<p>قد يساعد فهم المعاني العامة والسياق على متابعة المقطع، مع الاعتماد على تفسير موثوق عند الحاجة. يبقى الحفظ والمراجعة والاستماع للقراءة من المصحف خطوات مستقلة لا يغني بعضها عن بعض.</p>

<h3>4. الاستماع والترديد</h3>
<p>يمكن أن يعرّفك الاستماع إلى تلاوة متقنة على نطق المقطع وإيقاعه. استمع مع متابعة المصحف، ثم ردّد الآيات واعرض قراءتك على معلّم لتصحيح ما يحتاج إلى مراجعة.</p>

<h2>دور التوجيه والمتابعة</h2>
<p>قد تساعد المتابعة المنتظمة على المحافظة على خطة الحفظ، ومن المفيد عند التعلّم مع معلّم أو مجموعة أن تتضمن المتابعة:</p>
<ul>
<li>خطة زمنية مخصصة لقدراتك.</li>
<li>التزاماً يومياً يمنع التسويف.</li>
<li>تصحيحاً فورياً لمخارج الحروف وأحكام التجويد.</li>
</ul>`,
      en: `<h2>Introduction</h2>
<p>Memorizing the Holy Quran is a precious wish for every Muslim, and for parents who aspire to see their children as people of the Quran. With the accelerating pace of life, many seek smart and practical ways to achieve this great goal with high efficiency and minimal effort and time.</p>`,
      fr: `<h2>Introduction</h2>
<p>Mémoriser le Saint Coran est un vœu précieux pour chaque musulman et musulmane. Avec l'accélération du rythme de la vie, beaucoup cherchent des moyens intelligents et pratiques pour atteindre cet objectif merveilleux.</p>`
    }
  },
  "quran-memorization-tools": {
    title: { ar: "بوصلة الحافظ: 5 أدوات وطرق حديثة لتسهيل حفظ القرآن الكريم", en: "A Guide to Five Practical Tools for Quran Memorization", fr: "Cinq outils pratiques pour faciliter la mémorisation du Coran" },
    category: { ar: "تحفيظ القرآن", en: "Quran Memorization", fr: "Mémorisation du Coran" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Équipe de l'académie" },
    date: "2026-07-25",
    readTime: 5,
    image: "/images/hero-children.jpg",
    keywords: { ar: "أدوات حفظ القرآن، طرق حفظ القرآن، مراجعة القرآن، تطبيقات القرآن، المتشابهات، التجويد", en: "Quran memorization tools, Quran revision, memorization methods, Tajweed", fr: "outils de mémorisation du Coran, révision, tajwid" },
    description: { ar: "خمس طرق وأدوات عملية تساعد على تنظيم حفظ القرآن الكريم وتثبيت المراجعة، مع التأكيد على التدرج والتلقي من معلّم متقن.", en: "Five practical methods and tools for organizing Quran memorization and strengthening revision, with guidance from a qualified teacher.", fr: "Cinq méthodes et outils pratiques pour organiser la mémorisation et la révision du Coran avec l’accompagnement d’un enseignant compétent." },
    content: {
      ar: `<h2>مقدمة</h2>
<p>حفظ كتاب الله رحلة إيمانية مباركة، لكنها تحتاج إلى خطة تجمع بين الإخلاص والتدرج والتكرار المنهجي. ويمكن للأدوات الحديثة أن تساعد الطالب على التنظيم والمراجعة، لكنها لا تغني عن التلقي والتسميع أمام معلّم متقن.</p>
<h2>1. الربط التراكمي بين الآيات</h2>
<p>لا تتعامل مع الصفحة ككتلة واحدة. احفظ آية أو مقطعًا قصيرًا، ثم اربطه بما قبله قبل الانتقال إلى الجزء التالي. يساعد هذا الأسلوب على تقليل التعثر عند الانتقال بين الآيات وتثبيت التسلسل.</p>
<h2>2. تطبيقات المصحف التفاعلية</h2>
<p>يمكن الاستفادة من تطبيقات المصحف التي تتيح تكرار الآيات والاستماع إلى قراء مختلفين وإخفاء النص لاختبار الاسترجاع. اختر مصدرًا موثوقًا، وراجع النص في المصحف، ولا تجعل التطبيق بديلًا عن تصحيح القراءة مع المعلّم.</p>
<h2>3. الاستماع المتكرر</h2>
<p>يساعد الاستماع إلى المقطع المراد حفظه قبل الحصة وأثناء المراجعة على تهيئة الأذن للنطق الصحيح. الأفضل أن يكون الاستماع بتركيز مع متابعة المصحف، ثم يقرأ الطالب بنفسه ويعرض قراءته للتصحيح.</p>
<h2>4. خرائط المتشابهات وفهم المعاني</h2>
<p>قد يقلل فهم المعنى العام والسياق من الخلط بين الآيات المتشابهة. استخدم تفسيرًا ميسرًا موثوقًا ودوّن الفروق التي تلاحظها، مع الانتباه إلى أن الفهم يساعد على الحفظ ولا يحل محل التكرار والمراجعة.</p>
<h2>5. التسجيل الصوتي الشخصي</h2>
<p>سجّل قراءتك ثم استمع إليها وقارنها بتلاوة متقنة أو اعرضها على المعلّم. تكشف هذه الطريقة بعض أخطاء النطق ومخارج الحروف وأحكام التجويد التي قد لا ينتبه إليها الطالب أثناء القراءة.</p>
<h2>خطة مراجعة بسيطة</h2>
<ol><li>حدّد مقدارًا يوميًا يناسب وقتك ومستواك.</li><li>راجع المحفوظ القديم قبل إضافة الجديد.</li><li>وزّع التكرار على جلسات قصيرة بدل الاعتماد على جلسة واحدة طويلة.</li><li>اجعل التسميع الدوري مع المعلّم جزءًا ثابتًا من الخطة.</li></ol>
<p><strong>الخلاصة:</strong> السر ليس في كثرة المقدار المحفوظ يوميًا، بل في المداومة وتثبيت المراجعة. قليل دائم خير من كثير منقطع.</p>`,
      en: `<h2>Introduction</h2><p>A clear plan, gradual progress, and regular revision are more useful than trying to memorize a large amount at once. Digital tools can support organization and listening, but they do not replace recitation with a qualified teacher.</p><h2>Five practical tools and methods</h2><ol><li>Connect each new verse to the previous one.</li><li>Use a trusted interactive mushaf for repetition and listening.</li><li>Listen carefully while following the mushaf.</li><li>Review meanings and similar verses with a reliable reference.</li><li>Record your recitation and ask a teacher to correct it.</li></ol><p>Consistency and revision are the foundation of lasting memorization.</p>`,
      fr: `<h2>Introduction</h2><p>Une méthode progressive et une révision régulière sont plus utiles que la mémorisation d’une grande quantité en une seule fois. Les outils numériques peuvent aider à organiser le travail, sans remplacer la récitation auprès d’un enseignant compétent.</p><h2>Cinq méthodes pratiques</h2><ol><li>Relier chaque nouveau verset au précédent.</li><li>Utiliser un muṣḥaf interactif fiable pour répéter et écouter.</li><li>Écouter en suivant le muṣḥaf.</li><li>Réviser le sens et les versets similaires avec une source fiable.</li><li>Enregistrer sa récitation et la faire corriger.</li></ol><p>La régularité et la révision sont la base d’une mémorisation durable.</p>`
    }
  },
  "arabic-foundation-importance": {
    title: { ar: "أهمية التأسيس الصحيح في اللغة العربية للأطفال", en: "The Importance of Proper Arabic Language Foundation for Children", fr: "L'importance d'une bonne base en langue arabe pour les enfants" },
    category: { ar: "تأسيس العربي", en: "Arabic Foundation", fr: "Fondation Arabe" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Équipe de l'académie" },
    date: "2024-06-10",
    readTime: 7,
    image: "/images/arabic-foundation-importance.webp",
    keywords: { ar: "تأسيس اللغة العربية للأطفال، تعليم القراءة والكتابة، تعليم الحروف العربية، نور البيان، تعليم العربية", en: "Arabic foundation for children, Arabic reading and writing, Arabic letters, Noor Al Bayan", fr: "Fondation arabe pour enfants, lecture et écriture arabes, lettres arabes" },
    description: { ar: "تعرف على أهمية تأسيس اللغة العربية للأطفال، وأفضل طرق تعليم الحروف والقراءة والكتابة وبناء مهارات لغوية قوية منذ الصغر.", en: "Learn why Arabic foundation matters for children and how to build strong reading, writing, and language skills from an early age.", fr: "Découvrez l’importance d’une bonne base en arabe et les méthodes pour apprendre la lecture et l’écriture dès le plus jeune âge." },
    content: {
      ar: `<h2>مقدمة</h2>
<p>تُعد اللغة العربية الهوية والركيزة الأساسية التي يبني عليها الطفل ثقافته وقدراته التواصلية. إن مرحلة الطفولة المبكرة هي العصر الذهبي لاكتساب المهارات اللغوية، ومن هنا تنبع أهمية التأسيس الصحيح في اللغة العربية؛ فهو ليس مجرد تلقين للحروف، بل هو حجر الأساس لرحلة تعليمية مستدامة وناجحة.</p>

<h2>لماذا يُعد التأسيس المبكر أمراً مصيرياً؟</h2>

<h3>تسهيل التعليم المستقبلي</h3>
<p>الطفل الذي يمتلك أساساً قوياً في القراءة والكتابة يسهل عليه استيعاب باقي المواد الدراسية مثل العلوم والتاريخ، وحتى فهم المسائل الرياضية.</p>

<h3>تعزيز الثقة بالنفس</h3>
<p>عندما يتمكن الطفل من التعبير عن نفسه بطلاقة وقراءة القصص بمفرده، تنمو لديه ثقة عالية بالنفس تدفعه للتميز الدراسي.</p>

<h3>ارتباط وثيق بالهوية والقرآن</h3>
<p>التأسيس الصحيح لغوياً يفتح للطفل الباب لفهم آيات القرآن الكريم وتدبرها وتلاوتها تلاوة صحيحة منذ الصغر.</p>

<h2>مخاطر التأسيس الضعيف</h2>
<p>إهمال هذه المرحلة قد يؤدي إلى تراكم المشكلات اللغوية، مثل صعوبة النطق، أو البطء الشديد في القراءة، مما يولد حاجزاً نفسياً بين الطالب والمدرسة، ويجعله يشعر بالإحباط مقارنة بأقرانه.</p>

<h2>كيف نؤسس أطفالنا بشكل صحيح؟</h2>
<ol>
<li><strong>الاعتماد على المناهج الصوتية:</strong> التركيز على أصوات الحروف (المدود والحركات) وليس أسمائها فقط (مثل منهج نور البيان).</li>
<li><strong>الدمج بين المتعة والتعلم:</strong> استخدام الألعاب التفاعلية، القصص المصورة، والوسائل البصرية التي تجعل الحصة مشوقة.</li>
<li><strong>الاستعانة بالمتخصصين:</strong> من خلال دورات متخصصة توفر بيئة تفاعلية ومتابعة مستمرة تضمن تقييم مستوى الطفل أولاً بأول.</li>
</ol>

<blockquote>
<p><strong>خلاصة:</strong> الاستثمار في تأسيس طفلك باللغة العربية اليوم، هو توفير لسنوات من العناء الدراسي غداً.</p>
</blockquote>`,
      en: `<h2>Introduction</h2>
<p>The Arabic language is the identity and foundation upon which a child builds their culture and communication skills. Early childhood is the golden age for acquiring language skills, hence the importance of proper Arabic language foundation.</p>`,
      fr: `<h2>Introduction</h2>
<p>La langue arabe est l'identité et la fondation sur laquelle un enfant construit sa culture et ses compétences en communication.</p>`
    }
  },
  "online-learning-benefits": {
    title: { ar: "فوائد التعليم الإلكتروني في تحسين مستوى الطلاب", en: "Benefits of Online Learning in Improving Student Levels", fr: "Avantages de l'apprentissage en ligne pour améliorer le niveau des étudiants" },
    category: { ar: "التعليم الإلكتروني", en: "Online Learning", fr: "Apprentissage en ligne" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Équipe de l'académie" },
    date: "2024-06-05",
    readTime: 8,
    image: "/images/online-learning-benefits.webp",
    keywords: { ar: "فوائد التعليم الإلكتروني للأطفال، التعليم عن بعد، التعلم أونلاين، الحصص الفردية، تعليم اللغة العربية عن بعد", en: "online learning benefits for children, distance learning, online Arabic lessons, one-on-one classes", fr: "avantages de l’apprentissage en ligne, cours d’arabe à distance, cours individuels" },
    description: { ar: "اكتشف فوائد التعليم الإلكتروني للأطفال ودور الحصص الفردية والتعلم عن بعد في تحسين التركيز والتحصيل والمهارات التعليمية.", en: "Discover how online learning, distance education, and one-on-one classes can improve children's focus, achievement, and learning skills.", fr: "Découvrez comment l’apprentissage en ligne et les cours individuels peuvent améliorer la concentration et les résultats des enfants." },
    content: {
      ar: `<h2>مقدمة</h2>
<p>لم يعد التعليم الإلكتروني (عن بُعد) مجرد بديل مؤقت أو رفاهية تكنولوجية، بل أصبح ركيزة أساسية من ركائز التعليم الحديث. لقد أثبتت الفصول الافتراضية والمنصات التعليمية قدرتها العالية على سد الفجوات التعليمية وتطوير مهارات الطلاب بشكل ملحوظ مقارنة بالطرق التقليدية.</p>

<h2>كيف يساهم التعليم الإلكتروني في رفع مستوى الطلاب؟</h2>

<h3>التعلم المخصص والمستهدف</h3>
<p>في الفصول التقليدية المزدحمة، قد يخجل الطالب من طرح الأسئلة. التعليم الإلكتروني (خاصة الحصص الفردية أو المجموعات الصغيرة) يتيح للمعلم التركيز الكامل على نقاط ضعف الطالب ومعالجتها فوراً.</p>

<h3>المرونة والراحة النفسية</h3>
<p>توفير وقت وجهد المواصلات يمنح الطالب طاقة أكبر للتركيز. كما أن التعلم من المنزل يوفر بيئة هادئة ومريحة خالية من المشتتات.</p>

<h3>الوسائط المتعددة والتفاعلية</h3>
<p>استخدام الفيديوهات، الألعاب التعليمية، والاختبارات الإلكترونية الفورية يحول التعليم من عملية تلقين جافة إلى تجربة تفاعلية ممتعة، مما يزيد من معدل استيعاب المعلومة وتذكرها.</p>

<h3>سهولة المتابعة لأولياء الأمور</h3>
<p>تتيح المنصات الإلكترونية تقارير دورية دقيقة ومسجلة عن حضور الطالب، درجاته، ومدى تقدمه، مما يسهل على الأهل متابعة تطور أبنائهم مع الأكاديمية بسلاسة.</p>

<h2>مستقبل التعليم بين يديك</h2>
<p>إن دمج التكنولوجيا بالتعليم يساعد الطلاب أيضاً على اكتساب مهارات تقنية يحتاجونها في مستقبلهِم المهني، ويجعلهم أكثر اعتماداً على أنفسهم في البحث والمعرفة.</p>`,
      en: `<h2>Introduction</h2>
<p>Online education is one way to access lessons and learning materials remotely. Virtual classrooms and educational platforms can provide a setting for live instruction, practice, and communication between students and teachers.</p>`,
      fr: `<h2>Introduction</h2>
<p>L’apprentissage en ligne permet d’accéder à des cours et à des ressources à distance. Une classe virtuelle peut offrir un cadre pour les leçons en direct, les exercices et les échanges entre élèves et enseignants.</p>`
    }
  },
  "easy-arabic-learning-for-children": {
    title: { ar: "أساليب وأسس عملية لتسهيل تعلم اللغة العربية للأطفال", en: "Practical Principles and Methods for Making Arabic Easier for Children", fr: "Principes et méthodes pratiques pour faciliter l’apprentissage de l’arabe aux enfants" },
    category: { ar: "تأسيس العربية", en: "Arabic Foundation", fr: "Fondation en arabe" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Équipe de l’académie" },
    date: "2026-09-11",
    readTime: 9,
    image: "/images/arabic-learning-children-1.webp",
    keywords: { ar: "تعلم العربية للأطفال، تأسيس اللغة العربية، تعليم القراءة، تعليم الأطفال", en: "Arabic learning for children, Arabic foundation, reading instruction, child education", fr: "Apprentissage de l’arabe pour enfants, fondation en arabe, lecture" },
    description: { ar: "دليل عملي للآباء والمعلمين يوضح أسس وأساليب تجعل تعلم اللغة العربية أسهل وأكثر متعة وثباتاً لدى الأطفال.", en: "A practical guide for parents and teachers to make Arabic learning easier, more engaging, and more lasting for children.", fr: "Un guide pratique pour aider les parents et les enseignants à rendre l’apprentissage de l’arabe plus simple et motivant." },
    content: {
      ar: `<h2>مقدمة: كيف نجعل العربية تجربة محببة؟</h2>
<p>يتعلم الطفل اللغة العربية بصورة أفضل عندما يشعر أنها وسيلة للتعبير واللعب والتواصل، لا مجموعة من القواعد التي ينبغي حفظها فقط. لذلك فإن تسهيل تعلم العربية يبدأ من بناء علاقة إيجابية معها، ثم تقديم المهارات بالتدرج وبأساليب تناسب عمر الطفل واهتماماته وقدرته على التركيز.</p>

<h2>أولاً: الأسس التي يقوم عليها التعلم الفعّال</h2>

<h3>1. البدء من مستوى الطفل الحقيقي</h3>
<p>لا يكفي معرفة عمر الطفل لتحديد نقطة البداية؛ فالأطفال يختلفون في حصيلتهم اللغوية ونطقهم وقدرتهم على التمييز بين الأصوات والحروف. يبدأ المعلم أو ولي الأمر بتقييم بسيط: هل يستطيع الطفل فهم التعليمات؟ هل يميز الأصوات المتقاربة؟ هل يقرأ كلمات قصيرة؟ ثم تُبنى الخطة على ما يحتاج إليه فعلاً، لا على افتراضات عامة.</p>

<h3>2. التدرج من الاستماع إلى التحدث ثم القراءة والكتابة</h3>
<p>اللغة مهارات مترابطة. يستفيد الطفل من الاستماع إلى العربية الواضحة أولاً، ثم استخدام كلمات وجمل قصيرة في الحديث، وبعد ذلك الانتقال إلى ربط الصوت بالحرف والكلمة، وأخيراً التدريب على الكتابة. هذا الترتيب يقلل شعور الطفل بالصعوبة ويمنحه فرصاً متكررة لفهم ما يتعلمه واستعماله.</p>

<h3>3. ربط التعلم بسياق ذي معنى</h3>
<p>يتذكر الطفل الكلمة عندما ترتبط بصورة أو موقف أو قصة. بدلاً من تقديم قائمة كلمات منفصلة، يمكن تعليم مفردات الطعام أثناء إعداد وجبة، أو مفردات الألوان من خلال لعبة، أو أسماء الحيوانات في قصة مصورة. كلما كان المعنى قريباً من حياة الطفل، أصبح استدعاء الكلمة واستخدامها أسهل.</p>

<h2>ثانياً: أساليب عملية لتسهيل تعلم العربية</h2>

<h3>التعلم باللعب والأنشطة القصيرة</h3>
<p>الألعاب اللغوية مثل مطابقة الصورة بالكلمة، وترتيب الحروف، واكتشاف الكلمة المختلفة، وتمثيل الأدوار، تحول التدريب إلى مشاركة ممتعة. ويُفضّل أن تكون الأنشطة قصيرة ومتنوعة، من خمس إلى عشر دقائق، مع تغيير النشاط قبل أن يفقد الطفل تركيزه.</p>

<h3>القصص والحوار اليومي</h3>
<p>القصة من أقوى الوسائل لبناء المفردات وفهم تركيب الجملة. يقرأ البالغ قصة مناسبة بصوت واضح، ثم يطرح أسئلة بسيطة مثل: من الشخصية؟ ماذا حدث؟ ماذا تتوقع؟ كما يمكن استثمار المواقف اليومية في حوار عربي قصير، مثل وصف الملابس أو السؤال عن المشاعر أو الحديث عن أحداث اليوم.</p>

<h3>التدريب الصوتي قبل الحفظ الكتابي</h3>
<p>عند تعليم القراءة، يحتاج الطفل إلى سماع الصوت الصحيح وملاحظته في كلمات متعددة قبل كتابة الحرف مرات كثيرة. تساعد المقاطع الصوتية والحركات والمدود على بناء الوعي الصوتي، وهو أساس مهم للقراءة السليمة وتقليل الخلط بين الحروف المتشابهة.</p>

<h3>المراجعة المتباعدة دون ضغط</h3>
<p>المراجعة القصيرة المتكررة أكثر فاعلية من جلسة طويلة مرهقة. يمكن إعادة الكلمة أو المهارة في اليوم التالي، ثم بعد عدة أيام، ثم في نهاية الأسبوع، مع استخدامها في جملة أو لعبة جديدة. الهدف هو تثبيت التعلم مع الحفاظ على شعور الطفل بالنجاح.</p>

<h2>ثالثاً: دور الأسرة والمعلم</h2>
<ul>
<li><strong>التشجيع المحدد:</strong> قل للطفل ما الذي أتقنه تحديداً، مثل: «أحسنت، نطقت صوت الحرف بوضوح»، بدلاً من الاكتفاء بعبارة عامة.</li>
<li><strong>تصحيح لطيف وفوري:</strong> أعد الكلمة بالنطق الصحيح وامنح الطفل فرصة للتجربة، من غير إحراج أو مقارنة بإخوته وأقرانه.</li>
<li><strong>بيئة لغوية غنية:</strong> وفّر كتباً مصورة وملصقات وكلمات في أرجاء المنزل، واستخدم العربية الفصيحة المبسطة في مواقف يومية مناسبة.</li>
<li><strong>خطة ثابتة قابلة للقياس:</strong> حدّد هدفاً صغيراً لكل أسبوع، مثل اكتساب عشر كلمات أو قراءة خمس جمل، وسجّل التقدم بطريقة مشجعة.</li>
</ul>

<h2>أخطاء ينبغي تجنبها</h2>
<p>من أكثر الأخطاء شيوعاً البدء بكمية كبيرة من الحروف والكلمات، أو التركيز على أوراق العمل مع إهمال الاستماع والحوار، أو تحويل كل جلسة إلى اختبار. كما أن المقارنة المستمرة أو السخرية من الخطأ قد تجعل الطفل يتجنب استخدام العربية. التعلم الناجح يحتاج إلى صبر وتكرار وتوقعات مناسبة للمرحلة العمرية.</p>

<h2>خطة أسبوعية مبسطة</h2>
<ol>
<li>اليوم الأول: قصة قصيرة واستخراج خمس كلمات جديدة.</li>
<li>اليوم الثاني: مراجعة الكلمات بالصور ولعبة نطق.</li>
<li>اليوم الثالث: تكوين جمل شفوية قصيرة باستخدام الكلمات.</li>
<li>اليوم الرابع: ربط الأصوات بالحروف أو قراءة كلمات مناسبة للمستوى.</li>
<li>اليوم الخامس: نشاط كتابي أو فني يوظف المفردات.</li>
<li>اليومان السادس والسابع: مراجعة خفيفة وتطبيق الكلمات في حوار أو قصة.</li>
</ol>

<blockquote><p><strong>الخلاصة:</strong> تسهيل تعلم العربية للأطفال لا يعتمد على كثرة الواجبات، بل على وضوح الهدف، والتدرج، وكثرة الاستخدام، والتشجيع المستمر. عندما يشعر الطفل أن العربية قريبة من حياته وممتعة في تعلمها، تتحول الممارسة اليومية إلى عادة راسخة ومهارة نافعة.</p></blockquote>`,
      en: `<h2>Introduction: Making Arabic a Positive Experience</h2>
<p>Children learn Arabic best when they experience it as a language for expression, play, and communication rather than as a list of rules to memorize. A successful approach begins with a positive relationship with the language and introduces skills gradually in ways that match the child's age, interests, and attention span.</p>
<h2>Key Principles and Practical Methods</h2>
<p>Start from the child's actual level, move gradually from listening and speaking to reading and writing, and connect every new word to a meaningful story, image, or daily situation. Short games, picture books, daily conversations, phonics practice, and spaced review help children build confidence without pressure.</p>
<h2>The Role of Adults</h2>
<p>Parents and teachers can support progress through specific encouragement, gentle correction, a rich Arabic environment, and small measurable weekly goals. The most important habits are patience, consistency, and avoiding comparisons.</p>`,
      fr: `<h2>Introduction : rendre l’arabe agréable</h2>
<p>Les enfants apprennent mieux l’arabe lorsqu’ils le vivent comme une langue d’expression, de jeu et de communication. Une approche efficace respecte leur âge, leurs intérêts et leur capacité d’attention.</p>
<h2>Principes et méthodes pratiques</h2>
<p>Il est utile de commencer au niveau réel de l’enfant, de progresser de l’écoute vers la parole puis vers la lecture et l’écriture, et de relier chaque mot à une histoire, une image ou une situation quotidienne. Les jeux courts, les histoires illustrées et les révisions espacées renforcent la confiance.</p>
<h2>Le rôle des adultes</h2>
<p>Les parents et les enseignants favorisent les progrès par des encouragements précis, des corrections bienveillantes, un environnement riche en arabe et des objectifs hebdomadaires simples.</p>`
    }
  },
  "ahkam-noon-sakinah-tanween": {
    title: { ar: "أحكام النون الساكنة والتنوين: شرح مبسط مع أمثلة قرآنية", en: "Noon Sakinah and Tanween Rules: A Beginner’s Guide with Quran Examples", fr: "Règles du nûn sākinah et du tanwīn : guide simple et exemples coraniques" },
    category: { ar: "تعليم التجويد", en: "Tajweed Learning", fr: "Apprentissage du tajwid" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Équipe de l'académie" },
    date: "2026-09-27",
    readTime: 8,
    image: "/images/og-default.webp",
    keywords: { ar: "أحكام النون الساكنة والتنوين، الإظهار الحلقي، الإدغام بغنة، الإدغام بغير غنة، الإقلاب، الإخفاء الحقيقي، أمثلة التجويد من القرآن", en: "noon sakinah rules, tanween rules, izhar, idgham, iqlab, ikhfa, Tajweed examples", fr: "règles du nûn sākinah, tanwin, izhār, idghām, iqlāb, ikhfā, exemples de tajwid" },
    description: { ar: "شرح تعليمي موجز لأحكام النون الساكنة والتنوين الأربعة—الإظهار والإدغام والإقلاب والإخفاء—مع حروف كل حكم وأمثلة قرآنية ومصدر للمراجعة.", en: "A clear introduction to the four noon sakinah and tanween rules—izhar, idgham, iqlab, and ikhfa—with their letters, Quran examples, and a reference for further study.", fr: "Une introduction claire aux quatre règles du nûn sākinah et du tanwīn — izhār, idghām, iqlāb et ikhfā — avec leurs lettres et des exemples coraniques." },
    content: {
      ar: `<h2>ما النون الساكنة وما التنوين؟</h2>
<p>النون الساكنة هي نون لا تحمل حركة، وقد تأتي في وسط الكلمة أو آخرها. أما التنوين فهو نون ساكنة زائدة تُنطق في آخر الاسم ولا تُكتب نونًا مستقلة. عند التلاوة، يتحدد حكمهما بحسب الحرف الذي يأتي بعدهما؛ وأحكامهما الأساسية أربعة: الإظهار، والإدغام، والإقلاب، والإخفاء.</p>
<p>هذا ملخص تعليمي للتعرّف إلى أسماء الأحكام وحروفها. أما ضبط الأداء ومقدار الغنة ومخارج الحروف فيُتعلّم بالمشافهة والتلقي من معلّم متقن، مع الرجوع إلى المصحف والرواية التي يقرأ بها الطالب.</p>

<h2>1. الإظهار الحلقي</h2>
<p>يكون الإظهار إذا جاء بعد النون الساكنة أو التنوين واحد من حروف الحلق الستة: <strong>ء، هـ، ع، ح، غ، خ</strong>. ومعناه إبانة النون أو التنوين عند النطق، من غير إدغام في الحرف التالي. ومن أمثلته القرآنية: <a href="https://quran.com/1/7" target="_blank" rel="noreferrer">«أَنْعَمْتَ عَلَيْهِمْ»</a> في سورة الفاتحة؛ جاءت النون الساكنة قبل العين.</p>

<h2>2. الإدغام</h2>
<p>حروف الإدغام ستة، مجموعة في كلمة <strong>يرملون</strong>، ويكون الإدغام عند التقاء النون الساكنة أو التنوين بحرف منها في الكلمة التالية. وينقسم إلى نوعين:</p>
<ul>
<li><strong>إدغام بغنة:</strong> حروفه <strong>ي، ن، م، و</strong>، وتبقى الغنة عند الأداء. ومن أمثلته «مِنْ مَسَدٍ» في <a href="https://quran.com/111/5" target="_blank" rel="noreferrer">سورة المسد، الآية 5</a>.</li>
<li><strong>إدغام بغير غنة:</strong> حرفاه <strong>ل، ر</strong>. ومن أمثلته «هُدًى لِلْمُتَّقِينَ» في <a href="https://quran.com/2/2" target="_blank" rel="noreferrer">سورة البقرة، الآية 2</a>.</li>
</ul>
<p>ومن الاستثناءات التعليمية المشهورة أن النون الساكنة إذا جاء بعدها الواو أو الياء داخل كلمة واحدة تُظهر، كما في «الدنيا» و«بنيان»؛ لذلك لا يكفي حفظ الحروف دون ملاحظة موقع النون والحرف التالي.</p>

<h2>3. الإقلاب</h2>
<p>للإقلاب حرف واحد هو <strong>الباء</strong>. إذا جاءت الباء بعد النون الساكنة أو التنوين، تُقلب النون أو التنوين ميمًا مخفاة مع الغنة في التلاوة. ومن أمثلته «أَنْبِئْهُمْ» في <a href="https://quran.com/2/33" target="_blank" rel="noreferrer">سورة البقرة، الآية 33</a>.</p>

<h2>4. الإخفاء الحقيقي</h2>
<p>حروف الإخفاء خمسة عشر حرفًا، وهي بقية الحروف بعد حروف الإظهار والإدغام والإقلاب: <strong>ص، ذ، ث، ك، ج، ش، ق، س، د، ط، ز، ف، ت، ض، ظ</strong>. يكون النطق بين الإظهار والإدغام مع بقاء الغنة. ومن أمثلته «مِنْ شَرِّ» في <a href="https://quran.com/113/2" target="_blank" rel="noreferrer">سورة الفلق، الآية 2</a>.</p>

<h2>طريقة سهلة للمراجعة</h2>
<ol>
<li>ابحث عن النون الساكنة أو التنوين في المثال.</li>
<li>حدّد الحرف التالي مباشرة، وانتبه إلى كونه في الكلمة نفسها أو في كلمة تالية.</li>
<li>طابق الحرف مع مجموعة أحكامه: حروف الحلق للإظهار، و«يرملون» للإدغام، والباء للإقلاب، وبقية الحروف الخمسة عشر للإخفاء.</li>
<li>استمع إلى تلاوة متقنة وراجع المثال في المصحف، ثم اعرض قراءتك على معلّم؛ فالكتابة وحدها لا تكفي لضبط الأداء.</li>
</ol>

<h2>خلاصة أحكام النون الساكنة والتنوين</h2>
<p>الإظهار ستة أحرف، والإدغام ستة، والإقلاب حرف واحد هو الباء، والإخفاء خمسة عشر حرفًا. هذا التقسيم مدخل للمراجعة وليس بديلًا عن التلقي والتطبيق على التلاوة. يمكنك التعرّف إلى <a href="/quran">برنامج تعليم القرآن والتلاوة</a>، أو التدريب عبر <a href="/games">الألعاب القرآنية والتعليمية</a>، والاطلاع على <a href="/library">المكتبة الرقمية</a> للموارد المنشورة.</p>
<p><strong>المصدر التعليمي للحروف والتقسيم والأمثلة:</strong> <a href="https://awkafonline.gov.eg/content-sections/116/4995/%D8%A3%D8%AD%D9%83%D8%A7%D9%85-%D8%A7%D9%84%D9%86%D9%88%D9%86-%D8%A7%D9%84%D8%B3%D8%A7%D9%83%D9%86%D8%A9%D8%8C-%D9%88%D8%A7%D9%84%D8%AA%D9%86%D9%88%D9%8A%D9%86" target="_blank" rel="noreferrer">أحكام النون الساكنة والتنوين – وزارة الأوقاف المصرية</a>. وروابط الآيات تقود إلى نصها في Quran.com للمراجعة.</p>`,
      en: `<h2>What are noon sakinah and tanween?</h2>
<p>Noon sakinah is a still nūn that may occur within or at the end of a word. Tanween is an ending sound of nūn sakinah added to a noun in pronunciation, though it is not written as a separate nūn. The letter that follows determines one of four basic rules: izhar, idgham, iqlab, or ikhfa.</p>
<h2>The four rules</h2>
<h3>1. Izhar (clear pronunciation)</h3><p>Izhar applies before the six throat letters: hamzah, hāʾ, ʿayn, ḥāʾ, ghayn, and khāʾ. A Quran example is <a href="https://quran.com/1/7">أَنْعَمْتَ عَلَيْهِمْ</a> (Al-Fatihah 1:7), where nūn sakinah is followed by ʿayn.</p>
<h3>2. Idgham (merging)</h3><p>Its six letters are gathered in <em>yarmalūn</em>. With yāʾ, nūn, mīm, or wāw it is with ghunnah; with lām or rāʾ it is without ghunnah. Examples include <a href="https://quran.com/111/5">مِنْ مَسَدٍ</a> and <a href="https://quran.com/2/2">هُدًى لِلْمُتَّقِينَ</a>. Notice that the usual rule applies across two words; nūn before yāʾ or wāw within one word is pronounced clearly in well-known examples such as الدنيا and بنيان.</p>
<h3>3. Iqlab (conversion)</h3><p>Before the single letter bāʾ, nūn sakinah or tanween is changed to a concealed mīm sound with ghunnah in recitation. See <a href="https://quran.com/2/33">أَنْبِئْهُمْ</a> (Al-Baqarah 2:33).</p>
<h3>4. Ikhfa (concealment)</h3><p>Ikhfa applies before the remaining fifteen letters: ص ذ ث ك ج ش ق س د ط ز ف ت ض ظ. The sound is between clear pronunciation and merging, with ghunnah. An example is <a href="https://quran.com/113/2">مِنْ شَرِّ</a> (Al-Falaq 113:2).</p>
<h2>How to practise</h2><p>Locate the nūn sakinah or tanween, identify the next letter, and match it to its group. Then listen to a proficient recitation and review the text in a mushaf. Written examples are an introduction; pronunciation and ghunnah should be learned by listening and reciting to a qualified teacher. Read the official <a href="https://awkafonline.gov.eg/content-sections/116/4995/%D8%A3%D8%AD%D9%83%D8%A7%D9%85-%D8%A7%D9%84%D9%86%D9%88%D9%86-%D8%A7%D9%84%D8%B3%D8%A7%D9%83%D9%86%D8%A9%D8%8C-%D9%88%D8%A7%D9%84%D8%AA%D9%86%D9%88%D9%8A%D9%86">Egyptian Ministry of Awqaf reference</a>, explore the <a href="/quran">Quran learning program</a>, <a href="/games">educational games</a>, and <a href="/library">digital library</a>.</p>`,
      fr: `<h2>Qu’est-ce que le nûn sākinah et le tanwīn ?</h2>
<p>Le nûn sākinah est une lettre nûn sans voyelle, qui peut se trouver au milieu ou à la fin d’un mot. Le tanwīn est un son final de nûn ajouté à un nom à la prononciation, sans être écrit comme un nûn distinct. La lettre suivante détermine l’une des quatre règles : izhār, idghām, iqlāb ou ikhfā.</p>
<h2>Les quatre règles</h2>
<h3>1. Izhār</h3><p>L’izhār s’applique devant les six lettres gutturales : hamza, hāʾ, ʿayn, ḥāʾ, ghayn et khāʾ. Un exemple coranique est <a href="https://quran.com/1/7">أَنْعَمْتَ عَلَيْهِمْ</a> (Al-Fātiḥa, 1:7).</p>
<h3>2. Idghām</h3><p>Ses six lettres sont réunies dans le mot arabe <em>yarmalūn</em>. Avec yāʾ, nūn, mīm et wāw, il comporte une ghunna ; avec lām et rāʾ, il se fait sans ghunna. Exemples : <a href="https://quran.com/111/5">مِنْ مَسَدٍ</a> et <a href="https://quran.com/2/2">هُدًى لِلْمُتَّقِينَ</a>.</p>
<h3>3. Iqlāb</h3><p>Devant l’unique lettre bāʾ, le nûn sākinah ou le tanwīn prend le son d’un mīm dissimulé avec ghunna. Voir <a href="https://quran.com/2/33">أَنْبِئْهُمْ</a> (Al-Baqara, 2:33).</p>
<h3>4. Ikhfā</h3><p>Cette règle concerne les quinze lettres restantes : ص ذ ث ك ج ش ق س د ط ز ف ت ض ظ. Le son se situe entre la prononciation claire et la fusion, avec ghunna. Exemple : <a href="https://quran.com/113/2">مِنْ شَرِّ</a> (Al-Falaq, 113:2).</p>
<h2>Conseils de révision</h2><p>Repérez le nûn sākinah ou le tanwīn, observez la lettre suivante et associez-la à son groupe. Écoutez ensuite une récitation maîtrisée et vérifiez l’exemple dans le muṣḥaf. La lecture seule ne suffit pas à maîtriser la prononciation : apprenez par écoute et récitation auprès d’un enseignant compétent. Consultez la <a href="https://awkafonline.gov.eg/content-sections/116/4995/%D8%A3%D8%AD%D9%83%D8%A7%D9%85-%D8%A7%D9%84%D9%86%D9%88%D9%86-%D8%A7%D9%84%D8%B3%D8%A7%D9%83%D9%86%D8%A9%D8%8C-%D9%88%D8%A7%D9%84%D8%AA%D9%86%D9%88%D9%8A%D9%86">référence du ministère égyptien des Awqaf</a>, le <a href="/quran">programme de lecture du Coran</a>, les <a href="/games">jeux éducatifs</a> et la <a href="/library">bibliothèque numérique</a>.</p>`
    }
  }
}

type CmsBlogPost = {
  slug: string
  title_ar: string
  title_en: string
  title_fr: string
  excerpt_ar: string
  excerpt_en: string
  excerpt_fr: string
  content_ar: string
  content_en: string
  content_fr: string
  category_ar: string
  category_en: string
  category_fr: string
  author_ar: string
  author_en: string
  author_fr: string
  read_time: number
  cover_image: string
  published_at: string | null
  updated_at?: string | null
}

function normalizeCmsPost(post: CmsBlogPost) {
  return {
    title: { ar: post.title_ar, en: post.title_en, fr: post.title_fr },
    category: { ar: post.category_ar, en: post.category_en, fr: post.category_fr },
    author: { ar: post.author_ar, en: post.author_en, fr: post.author_fr },
    date: post.published_at || post.updated_at || new Date().toISOString(),
    updatedAt: post.updated_at || undefined,
    readTime: post.read_time,
    image: post.cover_image,
    keywords: { ar: '', en: '', fr: '' },
    description: { ar: post.excerpt_ar, en: post.excerpt_en, fr: post.excerpt_fr },
    content: { ar: post.content_ar, en: post.content_en, fr: post.content_fr },
  }
}

async function getBlogPost(slug: string) {
  const canonicalSlug = getCanonicalBlogSlug(slug)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      const { data } = await supabase
        .from('blog_posts')
        .select('slug,title_ar,title_en,title_fr,excerpt_ar,excerpt_en,excerpt_fr,content_ar,content_en,content_fr,category_ar,category_en,category_fr,author_ar,author_en,author_fr,read_time,cover_image,published_at,updated_at')
        .in('slug', getStoredBlogSlugs(slug))
        .eq('is_published', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (data) {
        const cmsPost = normalizeCmsPost(data as CmsBlogPost)
        const fallback = blogPosts[canonicalSlug]
        if (!fallback) return cmsPost
        const mergeLocale = (cms: Record<string, string>, local: Record<string, string>) => ({
          ar: cms.ar?.trim() || local.ar || '',
          en: cms.en?.trim() || local.en || '',
          fr: cms.fr?.trim() || local.fr || '',
        })
        const mergeArticleContent = (cms: Record<string, string>, local: Record<string, string>) => ({
          // A legacy CMS row may contain only a teaser in content_ar/content_en/content_fr.
          // Prefer the complete editorial fallback instead of rendering a nearly empty article.
          ar: (cms.ar?.trim().length || 0) >= 400 ? cms.ar.trim() : local.ar || cms.ar || '',
          en: (cms.en?.trim().length || 0) >= 400 ? cms.en.trim() : local.en || cms.en || '',
          fr: (cms.fr?.trim().length || 0) >= 400 ? cms.fr.trim() : local.fr || cms.fr || '',
        })
        return {
          ...fallback,
          ...cmsPost,
          title: mergeLocale(cmsPost.title, fallback.title),
          category: mergeLocale(cmsPost.category, fallback.category),
          author: mergeLocale(cmsPost.author, fallback.author),
          description: mergeLocale(cmsPost.description, fallback.description),
          content: mergeArticleContent(cmsPost.content, fallback.content),
          keywords: mergeLocale(cmsPost.keywords, fallback.keywords),
          image: cmsPost.image || fallback.image,
          readTime: cmsPost.readTime || fallback.readTime,
        }
      }
    } catch (error) {
      console.warn('[blog] CMS lookup failed; using the static article when available:', error)
    }
  }

  return blogPosts[canonicalSlug]
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return { title: "Not Found" }

  const baseUrl = 'https://quran-elhafez.com'
  const articleUrl = `${baseUrl}/blog/${getCanonicalBlogSlug(slug)}`

  return {
    title: post.title.ar,
    description: post.description.ar,
    keywords: post.keywords.ar,
    alternates: getSeoAlternates(articleUrl),
    openGraph: {
      title: post.title.ar,
      description: post.description.ar,
      type: 'article',
      url: articleUrl,
      images: [{ url: post.image }],
      publishedTime: post.date,
      modifiedTime: post.updatedAt || post.date,
      authors: [post.author.ar],
      tags: post.keywords.ar ? post.keywords.ar.split(', ') : [post.category.ar],
    },
  }
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (isLegacyBlogSlug(slug)) permanentRedirect(`/blog/${getCanonicalBlogSlug(slug)}`)
  const post = await getBlogPost(slug)

  if (!post) notFound()

  return (
    <>
      <BlogArticleClient slug={slug} blogPosts={{ [slug]: post }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title.ar,
            description: post.description.ar,
            image: [`https://quran-elhafez.com${post.image.startsWith('/') ? post.image : `/${post.image}`}`],
            datePublished: post.date,
            dateModified: post.updatedAt || post.date,
            author: { "@type": "Person", name: post.author.ar },
            mainEntityOfPage: `https://quran-elhafez.com/blog/${slug}`,
          }),
        }}
      />
    </>
  )
}
