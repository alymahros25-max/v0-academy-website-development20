-- 034: Seed the isolated Mexico landing page.
-- All rows are scoped to slug = mexico.

INSERT INTO site_areas (slug, area_type, country_code, name_ar, name_en, name_fr, currency_code, currency_symbol)
VALUES ('mexico', 'country', 'MX', 'المكسيك', 'Mexico', 'Mexique', 'MXN', 'MX$')
ON CONFLICT (slug) DO UPDATE SET area_type = EXCLUDED.area_type, country_code = EXCLUDED.country_code, name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en, name_fr = EXCLUDED.name_fr, currency_code = EXCLUDED.currency_code, currency_symbol = EXCLUDED.currency_symbol, is_active = TRUE, updated_at = NOW();

INSERT INTO area_content (area_id, content_key, content_ar, content_en, content_fr, content_type, section, sort_order)
SELECT id, v.content_key, v.content_ar, v.content_en, NULL, 'text', v.section, v.sort_order FROM site_areas
JOIN (VALUES
 ('seo_title','تحفيظ القرآن وتأسيس العربية أونلاين في المكسيك | أكاديمية الحافظ','Online Quran and Arabic Foundations in Mexico | Al-Hafiz Academy','seo',0),
 ('seo_description','تعلم القرآن الكريم أو تأسيس اللغة العربية أونلاين من المكسيك بحصص فردية وباقات شهرية بالبيزو المكسيكي، مع تواصل باللغة العربية.','Learn Quran or Arabic foundations online from Mexico with individual lessons and monthly MXN packages.','seo',1),
 ('page_title','اكتب بداية جديدة لتعلمك','Write a new beginning for your learning','opening',0),
 ('page_description','من مدينة مكسيكو وغوادالاخارا إلى مونتيري وبويبلا، ابدأ تحفيظ القرآن أو تأسيس العربية بحصة فردية أونلاين. التواصل مع الأكاديمية باللغة العربية.','From Mexico City and Guadalajara to Monterrey and Puebla, start Quran memorization or Arabic foundations online.','opening',1),
 ('local_card_es','Al-Hafiz Academy ofrece clases individuales en línea para la memorización del Corán y los fundamentos de la lengua árabe para estudiantes que hablan árabe en México. Ciudad de México, Guadalajara, Monterrey y Puebla son referencias geográficas de esta página. Las clases son exclusivamente en línea; la comunicación con la academia se realiza en árabe. La academia no tiene sede, sucursal ni lugar de enseñanza en México.','Online Quran memorization and Arabic foundations for Arabic-speaking learners in Mexico. The Academy has no local branch or teaching location in Mexico.','local',0),
 ('custom_packages','يوجد باقات مخصصة.','Custom packages are available.','pricing',0),
 ('referral_discount','خصم 10٪ للأخوات والإحالة','10% discount for sisters and referrals','pricing',1)
) AS v(content_key,content_ar,content_en,section,sort_order) ON site_areas.slug='mexico'
ON CONFLICT (area_id,content_key) DO UPDATE SET content_ar=EXCLUDED.content_ar,content_en=EXCLUDED.content_en,section=EXCLUDED.section,sort_order=EXCLUDED.sort_order,is_active=TRUE,updated_at=NOW();

INSERT INTO area_packages (area_id,program,package_key,name_ar,name_en,description_ar,price,currency_code,sessions_per_month,features_ar,is_popular,is_active,sort_order)
SELECT id,v.program,v.package_key,v.name_ar,v.name_ar,v.description_ar,v.price,'MXN',v.sessions_per_month,v.features_ar::jsonb,v.is_popular,TRUE,v.sort_order FROM site_areas
JOIN (VALUES
 ('quran','quran-30-4','تحفيظ القرآن — 30 دقيقة — 4 حصص شهرياً','حفظ وتسميع ومراجعة فردية.',265,'["حفظ ومراجعة","خطة شهرية","تواصل بالعربية"]',4,FALSE,0),
 ('quran','quran-30-8','تحفيظ القرآن — 30 دقيقة — 8 حصص شهرياً','حفظ وتسميع ومراجعة فردية.',494,'["حفظ ومراجعة","خطة شهرية","تواصل بالعربية"]',8,TRUE,1),
 ('quran','quran-30-12','تحفيظ القرآن — 30 دقيقة — 12 حصة شهرياً','حفظ وتسميع ومراجعة فردية.',742,'["حفظ ومراجعة","خطة شهرية","تواصل بالعربية"]',12,FALSE,2),
 ('quran','quran-30-16','تحفيظ القرآن — 30 دقيقة — 16 حصة شهرياً','حفظ وتسميع ومراجعة فردية.',971,'["حفظ ومراجعة","خطة شهرية","تواصل بالعربية"]',16,FALSE,3),
 ('arabic','arabic-30-4','تأسيس اللغة العربية — 30 دقيقة — 4 حصص شهرياً','بناء أساس القراءة والفهم بالعربية.',353,'["قراءة وفهم","أساس تدريجي","تواصل بالعربية"]',4,FALSE,0),
 ('arabic','arabic-30-8','تأسيس اللغة العربية — 30 دقيقة — 8 حصص شهرياً','بناء أساس القراءة والفهم بالعربية.',636,'["قراءة وفهم","أساس تدريجي","تواصل بالعربية"]',8,TRUE,1),
 ('arabic','arabic-30-12','تأسيس اللغة العربية — 30 دقيقة — 12 حصة شهرياً','بناء أساس القراءة والفهم بالعربية.',954,'["قراءة وفهم","أساس تدريجي","تواصل بالعربية"]',12,FALSE,2),
 ('arabic','arabic-30-16','تأسيس اللغة العربية — 30 دقيقة — 16 حصة شهرياً','بناء أساس القراءة والفهم بالعربية.',1272,'["قراءة وفهم","أساس تدريجي","تواصل بالعربية"]',16,FALSE,3)
) AS v(program,package_key,name_ar,description_ar,price,features_ar,sessions_per_month,is_popular,sort_order) ON site_areas.slug='mexico'
ON CONFLICT (area_id,package_key) DO UPDATE SET program=EXCLUDED.program,name_ar=EXCLUDED.name_ar,name_en=EXCLUDED.name_en,description_ar=EXCLUDED.description_ar,price=EXCLUDED.price,currency_code=EXCLUDED.currency_code,sessions_per_month=EXCLUDED.sessions_per_month,features_ar=EXCLUDED.features_ar,is_popular=EXCLUDED.is_popular,is_active=TRUE,sort_order=EXCLUDED.sort_order,updated_at=NOW();

INSERT INTO area_faq_items (area_id,question_key,question_ar,question_en,answer_ar,answer_en,sort_order)
SELECT id,v.question_key,v.question_ar,v.question_ar,v.answer_ar,v.answer_ar,v.sort_order FROM site_areas
JOIN (VALUES
 ('mexico-faq-1','هل يمكنني الدراسة من مدينة مكسيكية مختلفة؟','نعم، الدراسة أونلاين، ويمكنك ذكر مدينتك عند التواصل باللغة العربية. المدن المذكورة سياق جغرافي للصفحة فقط، ولا توجد بها مقرات أو فروع أو أماكن تدريس تابعة للأكاديمية.',0),
 ('mexico-faq-2','ما التوقيت المستخدم في الصفحة؟','تستخدم الصفحة توقيت وسط المكسيك، ويُنسق الموعد باللغة العربية وفق الوقت المتاح عند التواصل.',1),
 ('mexico-faq-3','هل الأسعار بالبيزو المكسيكي؟','نعم، الأسعار الظاهرة في صفحة المكسيك بالبيزو المكسيكي للباقات الموضحة.',2),
 ('mexico-faq-4','هل توجد باقات مخصصة؟','يوجد باقات مخصصة.',3),
 ('mexico-faq-5','بأي لغة يتم التواصل مع الأكاديمية؟','يتم التواصل مع الأكاديمية باللغة العربية.',4)
) AS v(question_key,question_ar,answer_ar,sort_order) ON site_areas.slug='mexico'
ON CONFLICT (area_id,question_key) DO UPDATE SET question_ar=EXCLUDED.question_ar,question_en=EXCLUDED.question_en,answer_ar=EXCLUDED.answer_ar,answer_en=EXCLUDED.answer_en,sort_order=EXCLUDED.sort_order,is_active=TRUE;

INSERT INTO area_links (area_id,link_key,label_ar,label_en,href,link_type,is_external,sort_order)
SELECT id,v.link_key,v.label_ar,v.label_ar,v.href,v.link_type,v.is_external,v.sort_order FROM site_areas
JOIN (VALUES ('canonical','الصفحة الرسمية','https://quran-elhafez.com/mexico','canonical',TRUE,0),('whatsapp','واتساب','https://bit.ly/4aJfOl6','external',TRUE,1),('home','الرئيسية','/','internal',FALSE,2),('games','الألعاب والمسابقات','/games','internal',FALSE,3),('library','المكتبة','/library','internal',FALSE,4)) AS v(link_key,label_ar,href,link_type,is_external,sort_order) ON site_areas.slug='mexico'
ON CONFLICT (area_id,link_key) DO UPDATE SET label_ar=EXCLUDED.label_ar,href=EXCLUDED.href,link_type=EXCLUDED.link_type,is_external=EXCLUDED.is_external,is_active=TRUE,sort_order=EXCLUDED.sort_order,updated_at=NOW();

INSERT INTO area_themes (area_id,theme_name_ar,theme_name_en,primary_color,secondary_color,accent_color,background_color,text_color)
SELECT id,'دفتر المكسيك القصصي','Mexico story notebook','#C2185B','#FDE4EF','#F08A24','#FFF7ED','#241A2A' FROM site_areas WHERE slug='mexico'
ON CONFLICT (area_id) DO UPDATE SET theme_name_ar=EXCLUDED.theme_name_ar,theme_name_en=EXCLUDED.theme_name_en,primary_color=EXCLUDED.primary_color,secondary_color=EXCLUDED.secondary_color,accent_color=EXCLUDED.accent_color,background_color=EXCLUDED.background_color,text_color=EXCLUDED.text_color,is_active=TRUE,updated_at=NOW();

INSERT INTO area_cities (area_id,city_key,name_ar,name_en,region_name,sort_order)
SELECT id,v.city_key,v.name_ar,v.name_en,v.region_name,v.sort_order FROM site_areas
JOIN (VALUES ('mexico-city','مدينة مكسيكو','Mexico City','Ciudad de México',10),('guadalajara','غوادالاخارا','Guadalajara','Jalisco',20),('monterrey','مونتيري','Monterrey','Nuevo León',30),('puebla','بويبلا','Puebla','Puebla',40)) AS v(city_key,name_ar,name_en,region_name,sort_order) ON site_areas.slug='mexico'
ON CONFLICT (area_id,city_key) DO UPDATE SET name_ar=EXCLUDED.name_ar,name_en=EXCLUDED.name_en,region_name=EXCLUDED.region_name,sort_order=EXCLUDED.sort_order,is_active=TRUE;

INSERT INTO area_timezones (area_id,timezone_name,label_ar,label_en,is_primary,sort_order)
SELECT id,'America/Mexico_City','توقيت وسط المكسيك (America/Mexico_City، UTC−06:00)','Central Mexico Time (America/Mexico_City)',TRUE,10 FROM site_areas WHERE slug='mexico'
ON CONFLICT (area_id,timezone_name) DO UPDATE SET label_ar=EXCLUDED.label_ar,label_en=EXCLUDED.label_en,is_primary=TRUE,is_active=TRUE;
