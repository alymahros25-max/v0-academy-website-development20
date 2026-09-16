-- Remove retired homepage hero copy from the public CMS content.
-- This migration changes copy only; it does not change prices, links, payments, or country records.

UPDATE site_content
SET
  content_ar = 'تعلّم القرآن الكريم واللغة العربية أونلاين',
  content_en = 'Learn Quran and Arabic online',
  content_fr = 'Apprenez le Coran et l’arabe en ligne',
  updated_at = NOW()
WHERE key = 'hero_title';
