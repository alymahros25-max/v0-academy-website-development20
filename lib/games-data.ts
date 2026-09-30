// 20 Educational Games Data - Complete dataset for all categories

export interface Game {
  id: string
  titleAr: string
  titleEn: string
  titleFr: string
  descriptionAr: string
  descriptionEn: string
  descriptionFr: string
  category: "letters" | "tajweed" | "quran" | "colors" | "animals" | "sirah" | "companions"
  difficulty: "easy" | "medium" | "hard"
  icon: string
  color: string
}

export const GAMES_CATALOG: Game[] = [
  // حياة النبي والصحابة (2 games - NEW)
  {
    id: "prophet-life-1",
    titleAr: "محطات من السيرة النبوية",
    titleEn: "Prophetic Biography Quiz",
    titleFr: "Quiz sur la vie prophétique",
    descriptionAr: "راجع محطات من السيرة النبوية وأسئلة عن حياة النبي محمد ﷺ في لعبة تعليمية تفاعلية.",
    descriptionEn: "Review key moments from the Prophet Muhammad’s biography in an interactive learning game.",
    descriptionFr: "Révisez des moments clés de la biographie du Prophète Muhammad dans un jeu éducatif interactif.",
    category: "sirah",
    difficulty: "medium",
    icon: "📖",
    color: "from-amber-500 to-amber-700",
  },
  {
    id: "sahabah-virtues-1",
    titleAr: "مواقف من حياة الصحابة",
    titleEn: "Stories of the Companions",
    titleFr: "Récits des compagnons",
    descriptionAr: "تعرّف إلى مواقف من حياة الصحابة من خلال أسئلة تعليمية قصيرة.",
    descriptionEn: "Explore stories from the Companions’ lives through short educational questions.",
    descriptionFr: "Découvrez des récits de la vie des compagnons à travers de courtes questions.",
    category: "companions",
    difficulty: "medium",
    icon: "⭐",
    color: "from-yellow-500 to-yellow-700",
  },

  // الحروف والكلمات (3 games)
  {
    id: "letter-match-1",
    titleAr: "مطابقة الحروف العربية وأشكالها",
    titleEn: "Match Arabic Letters and Forms",
    titleFr: "Associer les lettres arabes",
    descriptionAr: "لعبة تعليم الحروف العربية تساعد المبتدئ على مطابقة الحرف بأشكاله.",
    descriptionEn: "An Arabic alphabet game for matching letters with their written forms.",
    descriptionFr: "Un jeu sur l’alphabet arabe pour associer chaque lettre à ses formes écrites.",
    category: "letters",
    difficulty: "easy",
    icon: "🔤",
    color: "from-emerald-500 to-emerald-700",
  },
  {
    id: "word-builder-1",
    titleAr: "تركيب كلمات عربية من الحروف",
    titleEn: "Build Arabic Words from Letters",
    titleFr: "Former des mots arabes avec des lettres",
    descriptionAr: "رتّب الحروف لتكوين كلمات عربية، وتدرّب على ملاحظة بنية الكلمة وقراءتها.",
    descriptionEn: "Arrange letters to build Arabic words and practise recognising and reading word forms.",
    descriptionFr: "Remettez les lettres dans l’ordre pour former des mots arabes et vous entraîner à les lire.",
    category: "letters",
    difficulty: "medium",
    icon: "✍️",
    color: "from-blue-500 to-blue-700",
  },
  {
    id: "word-complete-1",
    titleAr: "إكمال الكلمات العربية",
    titleEn: "Complete Arabic Words",
    titleFr: "Compléter des mots arabes",
    descriptionAr: "أكمل الحروف الناقصة في كلمات عربية وتدرّب على القراءة والتهجئة.",
    descriptionEn: "Fill in missing letters in Arabic words and practise reading and spelling.",
    descriptionFr: "Complétez les lettres manquantes de mots arabes et entraînez-vous à lire et épeler.",
    category: "letters",
    difficulty: "hard",
    icon: "💭",
    color: "from-purple-500 to-purple-700",
  },

  // التجويد (3 games)
  {
    id: "tajweed-rules-1",
    titleAr: "أحكام النون الساكنة والتنوين",
    titleEn: "Noon Sakinah and Tanween Rules",
    titleFr: "Règles du nûn sākinah et du tanwīn",
    descriptionAr: "تدرّب على تمييز الإظهار والإدغام والإقلاب والإخفاء في أسئلة تجويد مبسطة.",
    descriptionEn: "Practise identifying izhar, idgham, iqlab, and ikhfa in beginner Tajweed questions.",
    descriptionFr: "Entraînez-vous à reconnaître l’izhār, l’idghām, l’iqlāb et l’ikhfā dans des questions simples.",
    category: "tajweed",
    difficulty: "medium",
    icon: "📖",
    color: "from-amber-500 to-amber-700",
  },
  {
    id: "tajweed-rules-2",
    titleAr: "تدريب تفاعلي على أحكام التجويد",
    titleEn: "Interactive Tajweed Rules Practice",
    titleFr: "Exercices interactifs de tajwid",
    descriptionAr: "راجع أحكام النون الساكنة والتنوين والميم الساكنة بأسئلة تطبيقية قصيرة.",
    descriptionEn: "Review noon sakinah, tanween, and meem sakinah rules with short practice questions.",
    descriptionFr: "Révisez les règles du nûn sākinah, du tanwīn et du mīm sākinah avec de courts exercices.",
    category: "tajweed",
    difficulty: "hard",
    icon: "🎵",
    color: "from-red-500 to-red-700",
  },
  {
    id: "tajweed-rules-3",
    titleAr: "اللام الشمسية واللام القمرية",
    titleEn: "Solar and Lunar Lam",
    titleFr: "Lām solaire et lunaire",
    descriptionAr: "تعلّم التمييز بين اللام الشمسية واللام القمرية في كلمات عربية مألوفة.",
    descriptionEn: "Learn to distinguish solar lam from lunar lam in familiar Arabic words.",
    descriptionFr: "Apprenez à distinguer le lām solaire du lām lunaire dans des mots arabes courants.",
    category: "tajweed",
    difficulty: "medium",
    icon: "⚡",
    color: "from-yellow-500 to-yellow-700",
  },

  // القرآن والتلاوة (3 games)
  {
    id: "quran-order-1",
    titleAr: "ترتيب كلمات من القرآن الكريم",
    titleEn: "Put Quran Words in Order",
    titleFr: "Remettre des mots coraniques en ordre",
    descriptionAr: "رتّب كلمات مختارة من آيات قرآنية قصيرة، وراجع مواضعها في المصحف.",
    descriptionEn: "Arrange selected words from short Quran verses and review them in the mushaf.",
    descriptionFr: "Remettez en ordre des mots choisis de courtes ayat et vérifiez-les dans le muṣḥaf.",
    category: "quran",
    difficulty: "medium",
    icon: "📜",
    color: "from-green-600 to-green-800",
  },
  {
    id: "surah-guess-1",
    titleAr: "تعرّف إلى السورة من آية قرآنية",
    titleEn: "Identify the Surah from a Quran Verse",
    titleFr: "Identifier la sourate à partir d’une ayah",
    descriptionAr: "اقرأ عبارة من القرآن واختر اسم السورة التي وردت فيها من بين الخيارات.",
    descriptionEn: "Read a Quranic phrase and choose the Surah in which it appears.",
    descriptionFr: "Lisez une phrase coranique et choisissez la sourate où elle apparaît.",
    category: "quran",
    difficulty: "easy",
    icon: "🤔",
    color: "from-cyan-500 to-cyan-700",
  },
  {
    id: "verse-match-1",
    titleAr: "إكمال الآيات القرآنية",
    titleEn: "Complete Quran Verses",
    titleFr: "Compléter des ayat du Coran",
    descriptionAr: "اختر تتمة الآية الصحيحة من الخيارات، ثم راجع نصها في المصحف.",
    descriptionEn: "Choose the correct continuation of a Quran verse, then review its text in the mushaf.",
    descriptionFr: "Choisissez la bonne suite d’une ayah, puis vérifiez son texte dans le muṣḥaf.",
    category: "quran",
    difficulty: "hard",
    icon: "✨",
    color: "from-indigo-500 to-indigo-700",
  },

  // الأشكال والألوان (2 games)
  {
    id: "shapes-colors-1",
    titleAr: "مطابقة الأشكال الهندسية",
    titleEn: "Match Geometric Shapes",
    titleFr: "Associer les formes géométriques",
    descriptionAr: "تدرّب على أسماء الأشكال الهندسية بمطابقة كل شكل بالاسم المناسب.",
    descriptionEn: "Practise shape names by matching each geometric shape with its label.",
    descriptionFr: "Entraînez-vous aux noms des formes en associant chaque forme à son nom.",
    category: "colors",
    difficulty: "easy",
    icon: "🔷",
    color: "from-pink-500 to-pink-700",
  },
  {
    id: "shapes-colors-2",
    titleAr: "لعبة تعلّم الألوان الأساسية",
    titleEn: "Learn Basic Colors",
    titleFr: "Apprendre les couleurs de base",
    descriptionAr: "اختر اللون المطلوب من الخيارات وتدرّب على التعرّف إلى الألوان الأساسية.",
    descriptionEn: "Choose the requested color and practise recognising basic colors.",
    descriptionFr: "Choisissez la couleur demandée et entraînez-vous à reconnaître les couleurs de base.",
    category: "colors",
    difficulty: "easy",
    icon: "🎨",
    color: "from-rose-500 to-rose-700",
  },

  // الحيوانات في القرآن (2 games)
  {
    id: "animals-quran-1",
    titleAr: "أسماء الحيوانات للأطفال",
    titleEn: "Animal Names for Kids",
    titleFr: "Noms d’animaux pour enfants",
    descriptionAr: "لعبة صور وأسماء تساعد الأطفال على التعرّف إلى أسماء الحيوانات باللغة العربية.",
    descriptionEn: "A picture-and-word game that helps children learn animal names in Arabic.",
    descriptionFr: "Un jeu d’images et de mots pour aider les enfants à apprendre les noms d’animaux en arabe.",
    category: "animals",
    difficulty: "easy",
    icon: "🐪",
    color: "from-orange-500 to-orange-700",
  },
  {
    id: "animals-quran-2",
    titleAr: "تعرّف إلى الحيوان المذكور في القرآن",
    titleEn: "Identify the Animal Mentioned in the Quran",
    titleFr: "Identifier l’animal mentionné dans le Coran",
    descriptionAr: "اقرأ تلميحًا مع مرجع السورة والآية، ثم اختر اسم الحيوان أو الحشرة المذكورة في القرآن.",
    descriptionEn: "Read a clue with a Surah and verse reference, then choose the animal or insect mentioned in the Quran.",
    descriptionFr: "Lisez un indice avec une référence de sourate et de verset, puis choisissez l’animal ou l’insecte mentionné dans le Coran.",
    category: "animals",
    difficulty: "medium",
    icon: "🦁",
    color: "from-lime-500 to-lime-700",
  },

  // الغزوات والسيرة (3 games)
  {
    id: "battles-sirah-1",
    titleAr: "تسلسل أحداث السيرة النبوية",
    titleEn: "Prophetic Biography Timeline",
    titleFr: "Chronologie de la vie prophétique",
    descriptionAr: "رتّب أحداثًا من السيرة النبوية ترتيبًا زمنيًا، وراجع الإجابات بعد كل جولة.",
    descriptionEn: "Put events from the Prophetic biography in chronological order and review each round.",
    descriptionFr: "Replacez des événements de la vie prophétique dans l’ordre chronologique et vérifiez vos réponses.",
    category: "sirah",
    difficulty: "medium",
    icon: "⚔️",
    color: "from-stone-600 to-stone-800",
  },
  {
    id: "sirah-timeline-1",
    titleAr: "ترتيب أحداث السيرة النبوية",
    titleEn: "Order Events in the Prophetic Biography",
    titleFr: "Ordonner les événements de la sira",
    descriptionAr: "اختبر معرفتك بتسلسل أحداث السيرة النبوية من خلال لعبة ترتيب تفاعلية.",
    descriptionEn: "Explore the sequence of events in the Prophetic biography with an interactive ordering game.",
    descriptionFr: "Explorez la chronologie de la sira dans un jeu interactif de mise en ordre.",
    category: "sirah",
    difficulty: "hard",
    icon: "⏳",
    color: "from-slate-600 to-slate-800",
  },
  {
    id: "battles-sirah-2",
    titleAr: "تعرّف إلى الحدث من وصفه",
    titleEn: "Identify a Sirah Event from Its Clue",
    titleFr: "Identifier un événement de la sira",
    descriptionAr: "اقرأ وصفًا موجزًا واختر الحدث الموافق من السيرة النبوية بين الخيارات.",
    descriptionEn: "Read a short clue and choose the matching event from the Prophetic biography.",
    descriptionFr: "Lisez un bref indice et choisissez l’événement correspondant de la sira.",
    category: "sirah",
    difficulty: "medium",
    icon: "📜",
    color: "from-gray-600 to-gray-800",
  },

  // الصحابة والتابعين (4 games)
  {
    id: "companions-cards-1",
    titleAr: "بطاقات تعلّم عن الصحابة",
    titleEn: "Companions Learning Cards",
    titleFr: "Cartes éducatives sur les compagnons",
    descriptionAr: "طابق أسماء الصحابة مع المعلومات الواردة في بطاقات المراجعة التعليمية.",
    descriptionEn: "Match Companions’ names with the information shown on learning cards.",
    descriptionFr: "Associez les noms des compagnons aux informations figurant sur les cartes.",
    category: "companions",
    difficulty: "medium",
    icon: "👥",
    color: "from-teal-500 to-teal-700",
  },
  {
    id: "companions-quiz-1",
    titleAr: "مسابقة معلومات عن الصحابة",
    titleEn: "Companions Knowledge Quiz",
    titleFr: "Quiz de connaissances sur les compagnons",
    descriptionAr: "أجب عن أسئلة تعليمية عن الصحابة، وتعرّف إلى معلومات للمراجعة والتعلّم.",
    descriptionEn: "Answer educational questions about the Companions and review what you learn.",
    descriptionFr: "Répondez à des questions éducatives sur les compagnons et révisez les informations.",
    category: "companions",
    difficulty: "hard",
    icon: "❓",
    color: "from-violet-500 to-violet-700",
  },
]

// Get games by category
export function getGamesByCategory(category: Game["category"]): Game[] {
  return GAMES_CATALOG.filter((game) => game.category === category)
}

// Get all categories
export function getCategories() {
  const categories = [...new Set(GAMES_CATALOG.map((g) => g.category))]
  return categories
}

// Get category display name
export function getCategoryName(category: Game["category"], locale: "ar" | "en" | "fr"): string {
  const names: Record<Game["category"], Record<string, string>> = {
    letters: {
      ar: "الحروف والكلمات",
      en: "Letters & Words",
      fr: "Lettres et mots",
    },
    tajweed: {
      ar: "التجويد",
      en: "Tajweed",
      fr: "Tajweed",
    },
    quran: {
      ar: "القرآن الكريم",
      en: "Quran",
      fr: "Coran",
    },
    colors: {
      ar: "الأشكال والألوان",
      en: "Shapes & Colors",
      fr: "Formes et couleurs",
    },
    animals: {
      ar: "الحيوانات",
      en: "Animals",
      fr: "Animaux",
    },
    sirah: {
      ar: "السيرة النبوية",
      en: "Prophet Biography",
      fr: "Biographie du Prophète",
    },
    companions: {
      ar: "الصحابة",
      en: "Companions",
      fr: "Compagnons",
    },
  }
  return names[category]?.[locale] || category
}
