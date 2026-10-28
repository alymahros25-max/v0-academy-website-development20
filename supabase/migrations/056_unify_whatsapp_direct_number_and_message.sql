-- Use the verified direct WhatsApp number and store the approved message template
-- alongside the central public WhatsApp widget configuration.
BEGIN;

UPDATE public.widget_configs
SET config_json = COALESCE(config_json, '{}'::jsonb) || jsonb_build_object(
  'phone', '+201130127894',
  'messageTemplateAr', E'السلام عليكم، وصلتكم من {source}.\nالبرنامج: تحفيظ القرآن / تأسيس العربية / كلاهما\nاسم الطالب:\nالعمر:\nملاحظات:'
),
updated_at = NOW()
WHERE widget_type = 'whatsapp_button';

UPDATE public.site_settings
SET setting_value = 'https://wa.me/201130127894',
    updated_at = NOW()
WHERE setting_key IN ('whatsapp', 'whatsapp_url', 'contact_whatsapp');

UPDATE public.area_links
SET href = 'https://wa.me/201130127894',
    updated_at = NOW()
WHERE link_key = 'whatsapp';

UPDATE public.area_content
SET content_ar = '201130127894',
    content_en = '201130127894',
    content_fr = '201130127894',
    updated_at = NOW()
WHERE content_key = 'whatsapp_number';

COMMIT;
