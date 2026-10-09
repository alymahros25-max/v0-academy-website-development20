-- Seed only the verified public Drive documents supplied for the central library.
-- ON CONFLICT DO NOTHING preserves any later admin edits and never replaces existing content.
BEGIN;

INSERT INTO public.digital_library_documents (
  slug, title_ar, title_en, title_fr, description_ar, category, tags,
  drive_url, file_type, cover_url, is_published, sort_order
) VALUES
  (
    'al-jazariyyah-explanation',
    'شرح الجزرية', 'شرح الجزرية', 'شرح الجزرية',
    NULL, 'مواد تعليمية', ARRAY['تجويد', 'الجزرية'],
    'https://drive.google.com/file/d/1RwAzCB15XcDbG8FMl7kUpnQQ8x-1jFDm/view?usp=drivesdk',
    'pdf',
    'https://drive.google.com/thumbnail?id=1RwAzCB15XcDbG8FMl7kUpnQQ8x-1jFDm&sz=w1200',
    TRUE, 0
  ),
  (
    'quran-part-one',
    'الجزء 1', 'الجزء 1', 'الجزء 1',
    NULL, 'مواد قرآنية', ARRAY['قرآن كريم'],
    'https://drive.google.com/file/d/1NQa9-jcOiT0nidRBWBacyK886SL5D1e3/view?usp=drivesdk',
    'pdf',
    'https://drive.google.com/thumbnail?id=1NQa9-jcOiT0nidRBWBacyK886SL5D1e3&sz=w1200',
    TRUE, 1
  ),
  (
    'quran-part-two',
    'الجزء 2', 'الجزء 2', 'الجزء 2',
    NULL, 'مواد قرآنية', ARRAY['قرآن كريم'],
    'https://drive.google.com/file/d/1n9BFurh9hzRNrRGbXKrBcNgSrEOvi-FX/view?usp=drivesdk',
    'pdf',
    'https://drive.google.com/thumbnail?id=1n9BFurh9hzRNrRGbXKrBcNgSrEOvi-FX&sz=w1200',
    TRUE, 2
  ),
  (
    'surah-al-balad',
    'سورة البلد', 'سورة البلد', 'سورة البلد',
    NULL, 'مواد قرآنية', ARRAY['قرآن كريم', 'سور قصيرة'],
    'https://drive.google.com/file/d/18PzeR9-tsUv7ra2m7KEghww0hAf9JgX8/view?usp=drivesdk',
    'document',
    'https://drive.google.com/thumbnail?id=18PzeR9-tsUv7ra2m7KEghww0hAf9JgX8&sz=w1200',
    TRUE, 3
  ),
  (
    'surah-al-zalzalah-and-al-adiyat',
    'سورة الزلزلة والعاديات', 'سورة الزلزلة والعاديات', 'سورة الزلزلة والعاديات',
    NULL, 'مواد قرآنية', ARRAY['قرآن كريم', 'سور قصيرة'],
    'https://drive.google.com/file/d/1SMEbY83vbQKjvEA8xQAG2c96lzJMDlNs/view?usp=drivesdk',
    'document',
    'https://drive.google.com/thumbnail?id=1SMEbY83vbQKjvEA8xQAG2c96lzJMDlNs&sz=w1200',
    TRUE, 4
  ),
  (
    'surah-al-fatiha',
    'سورة الفاتحة', 'سورة الفاتحة', 'سورة الفاتحة',
    NULL, 'مواد قرآنية', ARRAY['قرآن كريم'],
    'https://drive.google.com/file/d/1TO8_zSRO9fu8a3Ree8mi3JSki1udEkch/view?usp=drivesdk',
    'document',
    'https://drive.google.com/thumbnail?id=1TO8_zSRO9fu8a3Ree8mi3JSki1udEkch&sz=w1200',
    TRUE, 5
  ),
  (
    'surah-al-fil-al-humazah-al-asr',
    'سورة الفيل والهمزة والعصر', 'سورة الفيل والهمزة والعصر', 'سورة الفيل والهمزة والعصر',
    NULL, 'مواد قرآنية', ARRAY['قرآن كريم', 'سور قصيرة'],
    'https://drive.google.com/file/d/1PIfVSNBnhsC5KDFGIqJ4BemZZQDwR9tR/view?usp=drivesdk',
    'document',
    'https://drive.google.com/thumbnail?id=1PIfVSNBnhsC5KDFGIqJ4BemZZQDwR9tR&sz=w1200',
    TRUE, 6
  ),
  (
    'surah-al-layl-al-shams',
    'سورة الليل والشمس', 'سورة الليل والشمس', 'سورة الليل والشمس',
    NULL, 'مواد قرآنية', ARRAY['قرآن كريم', 'سور قصيرة'],
    'https://drive.google.com/file/d/1A-VHhF5P-qcXpo1RTODOQBJLzMi0WLdJ/view?usp=drivesdk',
    'document',
    'https://drive.google.com/thumbnail?id=1A-VHhF5P-qcXpo1RTODOQBJLzMi0WLdJ&sz=w1200',
    TRUE, 7
  ),
  (
    'surah-an-nas-al-falaq-al-ikhlas',
    'سورة الناس والفلق والإخلاص', 'سورة الناس والفلق والإخلاص', 'سورة الناس والفلق والإخلاص',
    NULL, 'مواد قرآنية', ARRAY['قرآن كريم', 'سور قصيرة'],
    'https://drive.google.com/file/d/1Inf_jqW9QorTh7N3tRUrypzqZ384tUZW/view?usp=drivesdk',
    'document',
    'https://drive.google.com/thumbnail?id=1Inf_jqW9QorTh7N3tRUrypzqZ384tUZW&sz=w1200',
    TRUE, 8
  )
ON CONFLICT (slug) DO NOTHING;

COMMIT;
