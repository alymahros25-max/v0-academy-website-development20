-- Part 5: verify the six canonical posts and the SEO fields.
SELECT slug, is_published, published_at, updated_at,
       length(content_ar) AS arabic_content_length,
       length(keywords_ar) AS arabic_keyword_length
FROM public.blog_posts
WHERE slug IN (
  'quran-memorization-techniques',
  'quran-memorization-tools',
  'arabic-foundation-importance',
  'online-learning-benefits',
  'easy-arabic-learning-for-children',
  'ahkam-noon-sakinah-tanween'
)
ORDER BY slug
LIMIT 100;
