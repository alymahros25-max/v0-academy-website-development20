-- Harden the isolated database boundary.
-- Public reads are limited to published/active content. Administrative writes
-- remain server-only through the Supabase service role and Next.js admin APIs.

BEGIN;

REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;

-- Public country landing data.
CREATE POLICY public_read_active_site_areas ON public.site_areas
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY public_read_active_area_content ON public.area_content
  FOR SELECT TO anon, authenticated
  USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM public.site_areas a
      WHERE a.id = area_content.area_id AND a.is_active = true
    )
  );

CREATE POLICY public_read_active_area_packages ON public.area_packages
  FOR SELECT TO anon, authenticated
  USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM public.site_areas a
      WHERE a.id = area_packages.area_id AND a.is_active = true
    )
  );

CREATE POLICY public_read_active_area_faq ON public.area_faq_items
  FOR SELECT TO anon, authenticated
  USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM public.site_areas a
      WHERE a.id = area_faq_items.area_id AND a.is_active = true
    )
  );

CREATE POLICY public_read_active_area_links ON public.area_links
  FOR SELECT TO anon, authenticated
  USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM public.site_areas a
      WHERE a.id = area_links.area_id AND a.is_active = true
    )
  );

CREATE POLICY public_read_active_area_themes ON public.area_themes
  FOR SELECT TO anon, authenticated
  USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM public.site_areas a
      WHERE a.id = area_themes.area_id AND a.is_active = true
    )
  );

CREATE POLICY public_read_active_area_cities ON public.area_cities
  FOR SELECT TO anon, authenticated
  USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM public.site_areas a
      WHERE a.id = area_cities.area_id AND a.is_active = true
    )
  );

CREATE POLICY public_read_active_area_timezones ON public.area_timezones
  FOR SELECT TO anon, authenticated
  USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM public.site_areas a
      WHERE a.id = area_timezones.area_id AND a.is_active = true
    )
  );

-- Public content domains.
CREATE POLICY public_read_active_faq ON public.faq_items
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY public_read_published_blog_posts ON public.blog_posts
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY public_read_published_classroom_videos ON public.classroom_videos
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY public_read_published_library_documents ON public.digital_library_documents
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY public_read_published_educational_games ON public.educational_games
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY public_read_published_site_pages ON public.site_pages
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY public_read_enabled_widgets ON public.widget_configs
  FOR SELECT TO anon, authenticated
  USING (is_enabled = true);

CREATE POLICY public_read_theme_customizations ON public.theme_customizations
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY public_read_landing_page_configs ON public.landing_page_configs
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY public_read_legal_pages ON public.legal_pages
  FOR SELECT TO anon, authenticated
  USING (true);

COMMIT;
