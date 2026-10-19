-- Roll back migration 051 by hiding its namespaced learning rows; no rows are deleted.
BEGIN;
UPDATE public.area_content c SET is_active = FALSE, updated_at = NOW()
FROM public.site_areas a
WHERE a.id = c.area_id AND a.area_type = 'country'
  AND a.slug IN ('argentina', 'australia', 'austria', 'bahrain', 'belgium', 'brazil', 'canada', 'china', 'colombia', 'denmark', 'finland', 'france', 'germany', 'greece', 'indonesia', 'italy', 'jordan', 'kuwait', 'malaysia', 'mexico', 'netherlands', 'new-zealand', 'nigeria', 'norway', 'oman', 'poland', 'portugal', 'qatar', 'russia', 'saudi-arabia', 'senegal', 'south-africa', 'spain', 'sweden', 'switzerland', 'turkey', 'united-arab-emirates', 'united-kingdom', 'united-states', 'venezuela')
  AND c.content_key IN ('learning_name', 'learning_local_title', 'learning_local_description', 'learning_quran_title', 'learning_quran_body', 'learning_arabic_title', 'learning_arabic_body', 'learning_quran_article_title', 'learning_quran_article_body', 'learning_arabic_article_title', 'learning_arabic_article_body', 'learning_teacher_angle')
  AND c.section = 'learning';
COMMIT;
