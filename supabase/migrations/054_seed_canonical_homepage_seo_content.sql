-- Canonical homepage copy for the public CMS.
-- The application keeps an immutable emergency fallback for database outages,
-- but all editable production copy is owned by site_content.
INSERT INTO public.site_content (key, content_ar, content_en, content_fr, section, type, is_active)
VALUES
  (
    'hero_title',
    'تحفيظ القرآن وتأسيس اللغة العربية أونلاين للناطقين بالعربية',
    'Online Quran memorization and Arabic foundation lessons for Arabic speakers',
    'Mémorisation du Coran et cours de langue arabe en ligne pour les arabophones',
    'homepage', 'heading', TRUE
  ),
  (
    'hero_subtitle',
    'حصص فردية مباشرة للأطفال والكبار والمبتدئين، للحفظ والمراجعة وتصحيح التلاوة وتعلم التجويد، ولتأسيس القراءة والكتابة والإملاء باللغة العربية.',
    'One-to-one live lessons for children, adults, and beginners covering memorization, revision, recitation, Tajweed, and Arabic literacy.',
    'Cours individuels en direct pour enfants, adultes et débutants : mémorisation, révision, récitation, tajwid et bases de l’arabe.',
    'homepage', 'paragraph', TRUE
  ),
  (
    'homepage_seo_title',
    'تحفيظ القرآن وتأسيس العربية أونلاين | الحافظ المتميز',
    'Online Quran Memorization and Arabic Foundation | Al-Hafiz Academy',
    'Mémorisation du Coran et bases de l’arabe en ligne | Académie Al-Hafiz',
    'homepage', 'seo_title', TRUE
  ),
  (
    'homepage_seo_description',
    'تحفيظ القرآن وتعليم التجويد وتأسيس القراءة والكتابة العربية أونلاين بحصص فردية للأطفال والكبار والناطقين بالعربية، مع حصة تجريبية مجانية ومواعيد مرنة.',
    'Online Quran memorization, Tajweed, and Arabic literacy through one-to-one lessons for children, adults, and Arabic-speaking learners, with a free trial lesson.',
    'Mémorisation du Coran, tajwid et bases de la lecture et de l’écriture arabes en ligne, avec cours individuels et séance d’essai gratuite.',
    'homepage', 'seo_description', TRUE
  )
ON CONFLICT (key) DO UPDATE SET
  content_ar = EXCLUDED.content_ar,
  content_en = EXCLUDED.content_en,
  content_fr = EXCLUDED.content_fr,
  section = EXCLUDED.section,
  type = EXCLUDED.type,
  is_active = TRUE,
  updated_at = NOW();
