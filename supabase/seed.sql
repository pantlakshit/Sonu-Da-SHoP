-- DIGITAL SHOWROOM OS - DEMO SEED DATA
-- Berinag Tiles Showroom

-- 1. SHOP SETTINGS
INSERT INTO shop_settings (
  id,
  shop_name,
  tagline,
  logo_url,
  description,
  phone,
  whatsapp,
  address,
  maps_url,
  opening_hours,
  instagram_url,
  facebook_url,
  hero_image_url
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'BERINAG TILES',
  'Premium Architectural Materials & Digital Showroom',
  NULL,
  'Discover curated tile designs, colours and architectural finishes before you visit our physical showroom in Berinag, Uttarakhand.',
  '+91 94120 78456',
  '+91 94120 78456',
  'Main Market, Near State Bank, Berinag, Pithoragarh, Uttarakhand 262531',
  'https://maps.google.com/?q=Berinag+Uttarakhand',
  'Mon - Sun: 9:00 AM - 7:30 PM',
  'https://instagram.com/berinagtiles',
  'https://facebook.com/berinagtiles',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB2gbf1XGyyziojK0lIUe-0R8sYLQJxJOD9XBwwjqyCDRIJQv5XNmG0l3mfPZw2F79XfytuPe0P6hh6M5WbJll9Z8yc4GwZSYEVAvXyNADfcJjYl2BBDIionywoX8LFCgnMcF0KgDr4sVNEPJCgNJfYRIREN4FRjwkO_n84W-nl9BgOA6CxfCva6MNAAlOnnblIxHdbW2wFZgUawgsP0qHW1VRc3FCH9j22kHzf4X2HV1CG_IRctFfY'
) ON CONFLICT (id) DO NOTHING;

-- 2. CATEGORIES
INSERT INTO categories (id, name, slug, description, image_url, active, sort_order) VALUES
('11111111-0000-0000-0000-000000000001', 'Floor Tiles', 'floor-tiles', 'Large format vitrified and ceramic tiles engineered for durability and heavy footfall.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxPfdj2baKcPdVgfeTk417ep_UeMOQEH3RFx9NIJHNSZeHSYyiK-OH1kriNS_fTEFU1TWwylcdv8bHHXvtkRnA8qe1PLu89OnAHrppEIWvMIAFALsxFjgtENFtQi_HoNCSD6OZ750ETkmDZqwRTrN0OXJJx8dGUeRiQuGjKwS4lYuDB0TWMvtG0JYTNuspHcCYgp_J9zubo9GkGTtOEpiRkes4jGXEGgQtWYmooE6BEuV0AZPTD0LT', true, 1),
('11111111-0000-0000-0000-000000000002', 'Wall Tiles', 'wall-tiles', 'Refined decorative, geometric, and textured wall tiles for bathrooms and feature backsplashes.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtMGdeFRqwGB_lMNlLr3PJtsD_x6KlatCo4a36XmpKkdLYhbrfKsrAUkHAGn0g_-2TBezfphuZLBRje2yjLpCK_0a9vtBL0LPlwrTPOkk5CRDofEzDCJeJ_mbtiEU7Lv3OZk3xGbHMP7tvJMldECLX4tag2UbIjplabipuUfs9qkdd8J_qgBqFVRxMJO7cBYjKb7qe-MIJu0JeES7TDHR-D4FF0ENeQeuipBpX6HQo0fUaCE-E7l-9', true, 2),
('11111111-0000-0000-0000-000000000003', 'Outdoor & Parking', 'outdoor-tiles', 'Heavy-duty weather-resistant paving slabs and rustic natural stone textures.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZq8O2KN9tbddrBtvh3Ek5Vwsm9bo4zH7GFD60bE7JnnGgAqbqyu9odR9qWSUl1d2jBsC_5sO6nOME4f7ohKBhZMSX18YWIjX7vZWwnYtMT-IrLrfRMtp-BlUb_4fYSRdeRl0yn6UTSJdj1HqaOyN3bbvAYsGtURgdL7_0ccxeWbRg5gwXftdP7sU2Lm0AakfxVPVhp5ynapsniwyHYvfMttnjtqFvosq4ZHladzcdEYmjWmEMByST', true, 3),
('11111111-0000-0000-0000-000000000004', 'Marble & Slabs', 'marble-slabs', 'High-end porcelain slabs and bookmatched marble finishes for luxury living spaces.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZcY5q_1Q58R6e73KtRKTBJHS4IcLimkdH8yXiTX_6gnMLyDCRGgemVvwU9Crrq07ZIOVfkxzqW8kTuw0G4Rx2ifOp5yhjFMzHjEdfbjrAC9klOpwzk45EsJA1B4JV_FdUVq11q7cR_OKpSa4LsnyOoG9EoPYK9ItjMHwBM8vT_BMjyNaLqFyBPrW_BOwce43kw3sOg-jPAxK3RT2jNjmUUCKwh1TG0-6XmbfYtAlhBxDvfOLtRMrv', true, 4),
('11111111-0000-0000-0000-000000000005', 'Wood Look Planks', 'wood-planks', 'Hyper-realistic ceramic timber planks combining organic warmth with zero maintenance.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcwFfs4NegHlCbvNlygWJIl1AyiuRJvbK2hPJH73L2nhTxz35ooJDopJWoBr0lGj3fRWOpejuOI12GhqPglWMLaFtscRMeJG5uETaLy6C2Otbnf9Kb6pRH_k1Iyk1spZwhJG5ZvKa5U9ueAKqYTgdz3gCv6xTkSzy46nAI5cmNXmUFOXfBZmfgwChoYsuNo7aBSklTcQJ2h4tWLL7aeSKkkifcf2UBDOzHS-4EZAaZ55dSP7MR1zHo', true, 5)
ON CONFLICT (id) DO NOTHING;

-- 3. PRODUCTS & PRODUCT IMAGES
-- (Product 1: Oasis Marble 4D)
INSERT INTO products (
  id, name, slug, reference_code, brand, category_id,
  price, price_unit, size, thickness, finish, color,
  material, look, space, description, availability,
  status, featured
) VALUES (
  '22222222-0000-0000-0000-000000000001',
  'Oasis Marble 4D',
  'oasis-marble-4d',
  'WP-482',
  'Kajaria Eternity',
  '11111111-0000-0000-0000-000000000004',
  78.00,
  'sq.ft',
  '600 x 1200 mm (4x2 ft)',
  '9 mm',
  'High Gloss',
  'White / Gold Grey',
  'Glazed Vitrified',
  'Marble',
  'Living Room, Bathroom',
  'The Oasis Marble 4D series brings the timeless elegance of natural Statuario marble into modern spaces. Utilizing advanced 4D printing technology, this tile offers unparalleled depth and continuous veining, creating seamless, expansive surfaces suitable for premium residential and commercial applications.',
  'available',
  'published',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
('22222222-0000-0000-0000-000000000001', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8GfVJJZJmZ9ZSSrVYM3rnPOvMs9FxiHJGEYhjRh6ZmoAEqYEIZBnt95fca9ub-4Xd4tD7D0UJbjF9yuTBeMsX09gRqsPvlgSIzcl22aWrXbi9hvJJa1v9jb47Jv6h1jpuP4VLmDZOJAGl3EgXrT9G99f1O1vVbZZf1xUcd7z8yYcaUHLcN6QNuIpqJ6RX3hztvOgSQl9ZzFQSUNuABldyafnPO2lKr5kfeuj4SLbOI_ee3c8M-3jG', 'Oasis Marble 4D primary texture slab shot', 1, true),
('22222222-0000-0000-0000-000000000001', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbdPJXicJVybsNfOAUJmwd1gKkn7w9X3vO_XDFruPkgu5vIFKe2KDx2EAk8IoQEsa1Z4LV6PBdBcOqtqpkMPqjvbIn6w3Uc9HwixtRer8bFcS_z8Il_f-e-iUFXBSniFBs3RDVkpKMBis-yPuC78y0e6rZ66-iidaJQnKf_Ah_RoxgfQ60oQh2zKA0POLni-V91_W5nz5ueFIQVB6tTzxBuM36yWHCQNvT3ZN1Aj6R5hsRrFM6LUbn', 'Oasis Marble 4D bathroom ambient application', 2, false);

-- (Product 2: Nordic Oak Plank)
INSERT INTO products (
  id, name, slug, reference_code, brand, category_id,
  price, price_unit, size, thickness, finish, color,
  material, look, space, description, availability,
  status, featured
) VALUES (
  '22222222-0000-0000-0000-000000000002',
  'Nordic Oak Plank',
  'nordic-oak-plank',
  'WD-110',
  'Somany Granito',
  '11111111-0000-0000-0000-000000000005',
  95.00,
  'sq.ft',
  '200 x 1200 mm',
  '10 mm',
  'Matte',
  'Honey Blonde Oak',
  'Full Body Vitrified',
  'Wood',
  'Bedroom, Living Room',
  'Authentic Scandinavian natural oak texture with tactile woodgrain ridges. Water-resistant, termite-proof, and ideal for high-traffic rooms seeking organic timber warmth.',
  'available',
  'published',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
('22222222-0000-0000-0000-000000000002', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqlx5aIIre4fa6RNJStFHmm91sPEZA9P5dt2kkOBcceDOmJLQ7FrzBm4_qiwYxxrRymEd7WP5Uw4sREOglo1fpdAlqHJA5WOAzVTHyT2R2tz6MgMKjcxz9V9eDTX2fd21hOWFOcyImayBI0N2-YaeMcUkeuF43cfoLjsRTsI2g3LMk7LrhW7Fd11PxjDUDqNZX-k50mLHu_ZUNIkFu8zKBHE0pObJzQWxk3Uct5WsIFzFz2kq5Da71', 'Nordic Oak Plank detail', 1, true);

-- (Product 3: Urban Cement)
INSERT INTO products (
  id, name, slug, reference_code, brand, category_id,
  price, price_unit, size, thickness, finish, color,
  material, look, space, description, availability,
  status, featured
) VALUES (
  '22222222-0000-0000-0000-000000000003',
  'Urban Cement Grey',
  'urban-cement-grey',
  'CN-304',
  'Simpolo',
  '11111111-0000-0000-0000-000000000001',
  65.00,
  'sq.ft',
  '600 x 600 mm',
  '9 mm',
  'Satin',
  'Light Greige',
  'Glazed Vitrified',
  'Concrete',
  'Living Room, Commercial, Kitchen',
  'Micro-textured architectural cement tile with subtle tonal gradation. Creates minimalist, seamless industrial loft interiors.',
  'available',
  'published',
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
('22222222-0000-0000-0000-000000000003', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA36n8xNhgDpb1CX-UgrkIRrhJekl5kbE-Iuwpe3rygE58TOl4h9PiZZUPSUjChKiB5V0BW2a740eUFhrKd1RZSKORsvnU7EyT80G0fkyt4gs0HnQtjaFj4Dc7Wmz6FVw3qujO1dHffOKiweEMMQ_xTFzQKkQBsvFlpDHPaRWxvkC5cvwIkW3yJa1LL3ZcqSepsHSwvabRD357YUT6Tp5Ve3A7meUQR34XQP7QIqDDdF_Z5lbm9gYqf', 'Urban Cement tile texture', 1, true);

-- (Product 4: Volcanic Slate)
INSERT INTO products (
  id, name, slug, reference_code, brand, category_id,
  price, price_unit, size, thickness, finish, color,
  material, look, space, description, availability,
  status, featured
) VALUES (
  '22222222-0000-0000-0000-000000000004',
  'Volcanic Slate Natural',
  'volcanic-slate-natural',
  'ST-992',
  'RAK Ceramics',
  '11111111-0000-0000-0000-000000000003',
  110.00,
  'sq.ft',
  '600 x 1200 mm',
  '12 mm',
  'Textured / Honed',
  'Deep Charcoal Slate',
  'Porcelain Slab',
  'Stone',
  'Outdoor, Balcony, Commercial',
  'Rugged cleft stone textures mimicking volcanic rock. R11 anti-skid rating engineered for mountain verandas, patios, and wet areas in hill architecture.',
  'available',
  'published',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
('22222222-0000-0000-0000-000000000004', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZq8O2KN9tbddrBtvh3Ek5Vwsm9bo4zH7GFD60bE7JnnGgAqbqyu9odR9qWSUl1d2jBsC_5sO6nOME4f7ohKBhZMSX18YWIjX7vZWwnYtMT-IrLrfRMtp-BlUb_4fYSRdeRl0yn6UTSJdj1HqaOyN3bbvAYsGtURgdL7_0ccxeWbRg5gwXftdP7sU2Lm0AakfxVPVhp5ynapsniwyHYvfMttnjtqFvosq4ZHladzcdEYmjWmEMByST', 'Volcanic Slate texture', 1, true);

-- (Product 5: Calacatta Gold Polished)
INSERT INTO products (
  id, name, slug, reference_code, brand, category_id,
  price, price_unit, size, thickness, finish, color,
  material, look, space, description, availability,
  status, featured
) VALUES (
  '22222222-0000-0000-0000-000000000005',
  'Calacatta Gold Polished',
  'calacatta-gold-polished',
  'BRN-2015',
  'Antolini Grand Slabs',
  '11111111-0000-0000-0000-000000000004',
  125.00,
  'sq.ft',
  '800 x 1600 mm',
  '9.5 mm',
  'Polished',
  'Pure White & Amber Gold',
  'Glazed Vitrified Slab',
  'Marble',
  'Living Room, Master Bath',
  'Prestigious Italian marble aesthetics with dramatic flowing veins of amber gold and smoky graphite. High-reflectivity nano-mirror polish.',
  'available',
  'published',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
('22222222-0000-0000-0000-000000000005', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMTrbJiZzoTa8FgUGwe8ElzarkQD2xtGD0D9k7edS_zEGXizS63DICllRG87uConGR6VtYCpJ3KM6wsbyOV2WFtLHozQkWs3WWLw3hQrjfeU5-2cqT0Fy3UoBTzE5Cvvy7pq1D4XxQSGp85dCas7wSpcWNJukvQkvkCNJeirIK-uQ0oh6umrpeLPsMJysgIAyfa4NF1GFFvYqE78GKOEKP5oUNJXvcisgXGG6msYMFdI3hhuSYufTQ', 'Calacatta Gold macro shot', 1, true);

-- (Product 6: Origami White 3D)
INSERT INTO products (
  id, name, slug, reference_code, brand, category_id,
  price, price_unit, size, thickness, finish, color,
  material, look, space, description, availability,
  status, featured
) VALUES (
  '22222222-0000-0000-0000-000000000006',
  'Origami White 3D Relief',
  'origami-white-3d-relief',
  'WT-402',
  'Orient Bell',
  '11111111-0000-0000-0000-000000000002',
  72.00,
  'sq.ft',
  '300 x 900 mm',
  '11 mm',
  'Satin Matte',
  'Alabaster White',
  'Ceramic Wall Tile',
  '3D',
  'Bathroom, Living Room Accent',
  'Faceted 3D relief surface creating dynamic plays of light and shadow throughout the day. Perfect for architectural accent walls.',
  'low_stock',
  'published',
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
('22222222-0000-0000-0000-000000000006', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtMGdeFRqwGB_lMNlLr3PJtsD_x6KlatCo4a36XmpKkdLYhbrfKsrAUkHAGn0g_-2TBezfphuZLBRje2yjLpCK_0a9vtBL0LPlwrTPOkk5CRDofEzDCJeJ_mbtiEU7Lv3OZk3xGbHMP7tvJMldECLX4tag2UbIjplabipuUfs9qkdd8J_qgBqFVRxMJO7cBYjKb7qe-MIJu0JeES7TDHR-D4FF0ENeQeuipBpX6HQo0fUaCE-E7l-9', 'Origami White 3D faceted tile', 1, true);

-- (Product 7: Rustic Terracotta Square)
INSERT INTO products (
  id, name, slug, reference_code, brand, category_id,
  price, price_unit, size, thickness, finish, color,
  material, look, space, description, availability,
  status, featured
) VALUES (
  '22222222-0000-0000-0000-000000000007',
  'Rustic Terracotta Square',
  'rustic-terracotta-square',
  'BRN-0988',
  'Heritage Clay',
  '11111111-0000-0000-0000-000000000001',
  58.00,
  'sq.ft',
  '300 x 300 mm',
  '12 mm',
  'Natural Matte',
  'Warm Terracotta',
  'Terracotta Ceramic',
  'Terracotta',
  'Courtyard, Kitchen, Balcony',
  'Handcrafted Mediterranean feel with subtle edge variations and natural clay warmth.',
  'available',
  'published',
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
('22222222-0000-0000-0000-000000000007', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfbLt-Epdmab6xi65WuYpMOCVoIP24XblBe-DJ9frEtUM76Gy1-U12hX89KSDdC6P0uYO-7eC68_YAljnLJYI-FS3qO-vv0v1ZXZOdFW0y1C3BWq7eW_GyQ9R07Yn1zeJOVyO9WpfiKmxB_UFADH_WatrxMoQ-XykgFCYSSrzMh_t7LKWffr_ecrDx5R3kwrp9MuRD0pOHgLabFeytEzIk8kC-f5JuCVuAE3QixMpIMpI_6_Is0KI-', 'Rustic Terracotta tile', 1, true);

-- (Product 8: Basaltina Honed)
INSERT INTO products (
  id, name, slug, reference_code, brand, category_id,
  price, price_unit, size, thickness, finish, color,
  material, look, space, description, availability,
  status, featured
) VALUES (
  '22222222-0000-0000-0000-000000000008',
  'Basaltina Honed',
  'basaltina-honed',
  'BRN-3301',
  'RAK Ceramics',
  '11111111-0000-0000-0000-000000000003',
  88.00,
  'sq.ft',
  '600 x 1200 mm',
  '10 mm',
  'Honed',
  'Charcoal Grey',
  'Glazed Vitrified',
  'Stone',
  'Living Room, Bathroom, Commercial',
  'Minimalist volcanic stone aesthetic with subtle microscopic pitting and smooth honed surface.',
  'available',
  'published',
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
('22222222-0000-0000-0000-000000000008', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZDLVwcH5qmn2UxK9MeHm1YBtep9PH1Rjv5tF6Xv6_jW12cUs1mQjkyQXHXsnrtM-AFFkLzn_7Vpy1_kP_YDIjml5ivw9Z-QIJoCZv_YCDw-Pou6o2xkfSWk5lQSAgD1TPjWvF_qMWrO3AKjfku4kxaSYCTu2Ie7kRg17kKw07jfC7uc9V0G7rov2I5NXVni6Lv2uSx3th9dYXmsiiVRLExMcetjWiaCwG8K3OzzLTcDMaQdS2s4hY', 'Basaltina Honed tile', 1, true);

-- (Product 9: Nero Imperial)
INSERT INTO products (
  id, name, slug, reference_code, brand, category_id,
  price, price_unit, size, thickness, finish, color,
  material, look, space, description, availability,
  status, featured
) VALUES (
  '22222222-0000-0000-0000-000000000009',
  'Nero Imperial Polished',
  'nero-imperial-polished',
  'NM-710',
  'Kajaria Eternity',
  '11111111-0000-0000-0000-000000000004',
  85.00,
  'sq.ft',
  '800 x 1600 mm',
  '9.5 mm',
  'High Gloss',
  'Deep Black & Stark White',
  'Glazed Vitrified Slab',
  'Marble',
  'Living Room, Bathroom Accent',
  'Dramatic Nero Marquina black marble reproduction featuring sharp, lightning-like white veins across an obsidian black background.',
  'available',
  'published',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
('22222222-0000-0000-0000-000000000009', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBADn9SbCFVO8XKRnSRo1lrGkFt83ywwKMIPHQWEMlawlH38iF1p0_NzdSHhr4AjH4UDfbyXJsutp5TnrFW6cmazSNSQ1XK7dMUoSngls74ZCbvt8EctCfF-LzvaBG_mHfzWZ0gBl0kK1IYFUeOv9nNyOna_3eKqFPDj8JkyQdGSzdWrInJHsFLted8OAI5swjvcNA8_pzyShOV2OcNdvkSm6oQWWyzpPcUEtaLq2e02KY3svD4rMj', 'Nero Imperial polished tile', 1, true);

-- (Product 10: Carrara Mist)
INSERT INTO products (
  id, name, slug, reference_code, brand, category_id,
  price, price_unit, size, thickness, finish, color,
  material, look, space, description, availability,
  status, featured
) VALUES (
  '22222222-0000-0000-0000-000000000010',
  'Carrara Mist',
  'carrara-mist',
  'CR-102',
  'Simpolo',
  '11111111-0000-0000-0000-000000000001',
  65.00,
  'sq.ft',
  '600 x 600 mm',
  '9 mm',
  'Matte',
  'Soft White & Smoky Grey',
  'Ceramic Tile',
  'Marble',
  'Bathroom, Kitchen',
  'Soft smoky veining on chalk white ground. Matte satin touch ideal for serene, bright mountain bathrooms.',
  'available',
  'published',
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
('22222222-0000-0000-0000-000000000010', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyBX7KbkL8vIb4qY1bMLzJZDqA2CJHn0wuY_-8UTXmoRmbWIm8g0a1_zjsPEZgGTzyximG27rNfT6YhIes3u51pFo6_E_2bsNtvv2UGSjyD9Iwn9UGr92YJJa3dS-LEaolKedPGWjyltRUjC2QT-gf3w4O_R-PfTPWxHXjs4nScUQgJkllI7Xlb0jIpzzXYEL8ukNATOm_iPqNlJhI2XKBODI0aV9wrSxNhJDoR6oyDM7XTSyVfrSO', 'Carrara Mist square tile', 1, true);
