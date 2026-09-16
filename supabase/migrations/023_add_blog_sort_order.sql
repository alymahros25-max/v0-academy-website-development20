ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS blog_posts_sort_order_idx
  ON public.blog_posts (is_published, sort_order, published_at DESC);

UPDATE public.blog_posts
SET sort_order = ranked.position
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY published_at DESC NULLS LAST, created_at DESC) - 1 AS position
  FROM public.blog_posts
) AS ranked
WHERE public.blog_posts.id = ranked.id;
