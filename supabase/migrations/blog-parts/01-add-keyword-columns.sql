-- Part 1: add the SEO keyword columns safely.
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS keywords_ar text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS keywords_en text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS keywords_fr text NOT NULL DEFAULT '';
