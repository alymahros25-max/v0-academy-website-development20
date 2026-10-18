-- Unify every WhatsApp contact destination with the approved message link.
-- Existing migrations are immutable; this migration updates already-seeded rows.
DO $$
BEGIN
  IF to_regclass('public.area_links') IS NOT NULL THEN
    UPDATE public.area_links
    SET href = 'https://wa.me/message/RCJSLAJQHAWHA1', updated_at = NOW()
    WHERE link_key = 'whatsapp';
  END IF;

  IF to_regclass('public.area_content') IS NOT NULL THEN
    UPDATE public.area_content
    SET content_ar = 'RCJSLAJQHAWHA1', content_en = 'RCJSLAJQHAWHA1', updated_at = NOW()
    WHERE content_key = 'whatsapp_number';
  END IF;

  IF to_regclass('public.site_settings') IS NOT NULL THEN
    UPDATE public.site_settings
    SET setting_value = 'https://wa.me/message/RCJSLAJQHAWHA1', updated_at = NOW()
    WHERE setting_key IN ('whatsapp', 'whatsapp_url', 'contact_whatsapp');
  END IF;
END $$;
