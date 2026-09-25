-- 033: Seed the isolated Brazil landing page.
-- All rows are scoped to slug = brazil.

INSERT INTO site_areas (slug, area_type, country_code, name_ar, name_en, name_fr, currency_code, currency_symbol)
VALUES ('brazil', 'country', 'BR', 'البرازيل', 'Brazil', 'Brésil', 'BRL', 'R$')
ON CONFLICT (slug) DO UPDATE SET area_type = EXCLUDED.area_type, country_code = EXCLUDED.country_code, name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en, name_fr = EXCLUDED.name_fr, currency_code = EXCLUDED.currency_code, currency_symbol = EXCLUDED.currency_symbol, is_active = TRUE, updated_at = NOW();

INSERT INTO area_content (area_id, content_key, content_ar, content_en, content_fr, content_type, section, sort_order)
SELECT id, v.content_key, v.content_ar, v.content_en, NULL, 'text', v.section, v.sort_order FROM site_areas
JOIN (VALUES
 ('seo_title','تحفيظ القرآن وتأسيس العربية أونلاين في البرازيل | أكاديمية الحافظ','Online Quran and Arabic Foundations in Brazil | Al-Hafiz Academy','seo',0),
 ('seo_description','تعلم القرآن الكريم أو تأسيس اللغة العربية أونلاين من البرازيل بحصص فردية وباقات شهرية بالريال البرازيلي، مع تواصل باللغة العربية.','Learn Quran or Arabic foundations online from Brazil with individual lessons and monthly BRL packages.','seo',1),
 ('page_title','تعلمك يبدأ من المكان الذي أنت فيه','Your learning starts where you are','opening',0),
 ('page_description','من ساو باولو وريو دي جانيرو إلى برازيليا وسالڤادور، تعلّم القرآن أو أسّس لغتك العربية بحصص فردية أونلاين. التواصل مع الأكاديمية باللغة العربية.','From São Paulo and Rio de Janeiro to Brasília and Salvador, learn Quran or build Arabic foundations online.','opening',1),
 ('local_card_pt','A Al-Hafiz Academy oferece aulas individuais online de memorização do Alcorão e fundamentos da língua árabe para estudantes falantes de árabe no Brasil. São Paulo, Rio de Janeiro, Brasília e Salvador são referências geográficas desta página. As aulas acontecem exclusivamente online; o contato com a academia é feito em árabe. A academia não possui sede, filial ou local de ensino no Brasil.','Online Quran memorization and Arabic foundations for Arabic-speaking learners in Brazil. The Academy has no local branch or teaching location in Brazil.','local',0),
 ('custom_packages','يوجد باقات مخصصة.','Custom packages are available.','pricing',0),
 ('referral_discount','خصم 10٪ للأخوات والإحالة','10% discount for sisters and referrals','pricing',1)
) AS v(content_key,content_ar,content_en,section,sort_order) ON site_areas.slug='brazil'
ON CONFLICT (area_id,content_key) DO UPDATE SET content_ar=EXCLUDED.content_ar,content_en=EXCLUDED.content_en,section=EXCLUDED.section,sort_order=EXCLUDED.sort_order,is_active=TRUE,updated_at=NOW();

INSERT INTO area_packages (area_id,program,package_key,name_ar,name_en,description_ar,price,currency_code,sessions_per_month,features_ar,is_popular,is_active,sort_order)
SELECT id,v.program,v.package_key,v.name_ar,v.name_ar,v.description_ar,v.price,'BRL',v.sessions_per_month,v.features_ar::jsonb,v.is_popular,TRUE,v.sort_order FROM site_areas
JOIN (VALUES
 ('quran','quran-30-4','تحفيظ القرآن — 30 دقيقة — 4 حصص شهرياً','حفظ وتسميع ومراجعة فردية.',77,'["حفظ ومراجعة","خطة شهرية","تواصل بالعربية"]',4,FALSE,0),
 ('quran','quran-30-8','تحفيظ القرآن — 30 دقيقة — 8 حصص شهرياً','حفظ وتسميع ومراجعة فردية.',144,'["حفظ ومراجعة","خطة شهرية","تواصل بالعربية"]',8,TRUE,1),
 ('quran','quran-30-12','تحفيظ القرآن — 30 دقيقة — 12 حصة شهرياً','حفظ وتسميع ومراجعة فردية.',216,'["حفظ ومراجعة","خطة شهرية","تواصل بالعربية"]',12,FALSE,2),
 ('quran','quran-30-16','تحفيظ القرآن — 30 دقيقة — 16 حصة شهرياً','حفظ وتسميع ومراجعة فردية.',284,'["حفظ ومراجعة","خطة شهرية","تواصل بالعربية"]',16,FALSE,3),
 ('arabic','arabic-30-4','تأسيس اللغة العربية — 30 دقيقة — 4 حصص شهرياً','بناء أساس القراءة والفهم بالعربية.',103,'["قراءة وفهم","أساس تدريجي","تواصل بالعربية"]',4,FALSE,0),
 ('arabic','arabic-30-8','تأسيس اللغة العربية — 30 دقيقة — 8 حصص شهرياً','بناء أساس القراءة والفهم بالعربية.',185,'["قراءة وفهم","أساس تدريجي","تواصل بالعربية"]',8,TRUE,1),
 ('arabic','arabic-30-12','تأسيس اللغة العربية — 30 دقيقة — 12 حصة شهرياً','بناء أساس القراءة والفهم بالعربية.',278,'["قراءة وفهم","أساس تدريجي","تواصل بالعربية"]',12,FALSE,2),
 ('arabic','arabic-30-16','تأسيس اللغة العربية — 30 دقيقة — 16 حصة شهرياً','بناء أساس القراءة والفهم بالعربية.',371,'["قراءة وفهم","أساس تدريجي","تواصل بالعربية"]',16,FALSE,3)
) AS v(program,package_key,name_ar,description_ar,price,features_ar,sessions_per_month,is_popular,sort_order) ON site_areas.slug='brazil'
ON CONFLICT (area_id,package_key) DO UPDATE SET program=EXCLUDED.program,name_ar=EXCLUDED.name_ar,name_en=EXCLUDED.name_en,description_ar=EXCLUDED.description_ar,price=EXCLUDED.price,currency_code=EXCLUDED.currency_code,sessions_per_month=EXCLUDED.sessions_per_month,features_ar=EXCLUDED.features_ar,is_popular=EXCLUDED.is_popular,is_active=TRUE,sort_order=EXCLUDED.sort_order,updated_at=NOW();

INSERT INTO area_faq_items (area_id,question_key,question_ar,question_en,answer_ar,answer_en,sort_order)
SELECT id,v.question_key,v.question_ar,v.question_ar,v.answer_ar,v.answer_ar,v.sort_order FROM site_areas
JOIN (VALUES
 ('brazil-faq-1','هل أستطيع الدراسة من ساو باولو أو مدينة برازيلية أخرى؟','نعم، الدراسة أونلاين، ويمكنك ذكر مدينتك عند التواصل باللغة العربية. المدن المذكورة نطاق جغرافي للصفحة، ولا توجد بها مقرات أو فروع أو أماكن تدريس تابعة للأكاديمية.',0),
 ('brazil-faq-2','كيف أنظم وقت الحصة مع توقيت البرازيل؟','تستخدم الصفحة توقيت برازيليا، ويُنسق الموعد باللغة العربية وفق الوقت المتاح عند التواصل.',1),
 ('brazil-faq-3','هل الأسعار بالريال البرازيلي؟','نعم، الأسعار الظاهرة في صفحة البرازيل بالريال البرازيلي للباقات الموضحة.',2),
 ('brazil-faq-4','هل توجد باقات مخصصة؟','يوجد باقات مخصصة.',3),
 ('brazil-faq-5','بأي لغة يتم التواصل مع الأكاديمية؟','يتم التواصل مع الأكاديمية باللغة العربية.',4)
) AS v(question_key,question_ar,answer_ar,sort_order) ON site_areas.slug='brazil'
ON CONFLICT (area_id,question_key) DO UPDATE SET question_ar=EXCLUDED.question_ar,question_en=EXCLUDED.question_en,answer_ar=EXCLUDED.answer_ar,answer_en=EXCLUDED.answer_en,sort_order=EXCLUDED.sort_order,is_active=TRUE;

INSERT INTO area_links (area_id,link_key,label_ar,label_en,href,link_type,is_external,sort_order)
SELECT id,v.link_key,v.label_ar,v.label_ar,v.href,v.link_type,v.is_external,v.sort_order FROM site_areas
JOIN (VALUES ('canonical','الصفحة الرسمية','https://quran-elhafez.com/brazil','canonical',TRUE,0),('whatsapp','واتساب','https://bit.ly/4aJfOl6','external',TRUE,1),('home','الرئيسية','/','internal',FALSE,2),('games','الألعاب والمسابقات','/games','internal',FALSE,3),('library','المكتبة','/library','internal',FALSE,4)) AS v(link_key,label_ar,href,link_type,is_external,sort_order) ON site_areas.slug='brazil'
ON CONFLICT (area_id,link_key) DO UPDATE SET label_ar=EXCLUDED.label_ar,href=EXCLUDED.href,link_type=EXCLUDED.link_type,is_external=EXCLUDED.is_external,is_active=TRUE,sort_order=EXCLUDED.sort_order,updated_at=NOW();

INSERT INTO area_themes (area_id,theme_name_ar,theme_name_en,primary_color,secondary_color,accent_color,background_color,text_color)
SELECT id,'كتل البرازيل الحيوية','Brazil vibrant blocks','#087F5B','#E2F4EA','#F6C945','#FFF9E8','#14251F' FROM site_areas WHERE slug='brazil'
ON CONFLICT (area_id) DO UPDATE SET theme_name_ar=EXCLUDED.theme_name_ar,theme_name_en=EXCLUDED.theme_name_en,primary_color=EXCLUDED.primary_color,secondary_color=EXCLUDED.secondary_color,accent_color=EXCLUDED.accent_color,background_color=EXCLUDED.background_color,text_color=EXCLUDED.text_color,is_active=TRUE,updated_at=NOW();

INSERT INTO area_cities (area_id,city_key,name_ar,name_en,region_name,sort_order)
SELECT id,v.city_key,v.name_ar,v.name_en,v.region_name,v.sort_order FROM site_areas
JOIN (VALUES ('sao-paulo','ساو باولو','São Paulo','São Paulo',10),('rio-de-janeiro','ريو دي جانيرو','Rio de Janeiro','Rio de Janeiro',20),('brasilia','برازيليا','Brasília','Distrito Federal',30),('salvador','سالڤادور','Salvador','Bahia',40)) AS v(city_key,name_ar,name_en,region_name,sort_order) ON site_areas.slug='brazil'
ON CONFLICT (area_id,city_key) DO UPDATE SET name_ar=EXCLUDED.name_ar,name_en=EXCLUDED.name_en,region_name=EXCLUDED.region_name,sort_order=EXCLUDED.sort_order,is_active=TRUE;

INSERT INTO area_timezones (area_id,timezone_name,label_ar,label_en,is_primary,sort_order)
SELECT id,'America/Sao_Paulo','توقيت برازيليا (America/Sao_Paulo، UTC−03:00)','Brasilia Time (America/Sao_Paulo)',TRUE,10 FROM site_areas WHERE slug='brazil'
ON CONFLICT (area_id,timezone_name) DO UPDATE SET label_ar=EXCLUDED.label_ar,label_en=EXCLUDED.label_en,is_primary=TRUE,is_active=TRUE;
