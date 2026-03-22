-- ============================================================
-- SURFSWAPP — Demo Seed Data (v2)
-- Run AFTER schema.sql and rls.sql
-- ============================================================
-- INSTRUCTIONS:
-- 1. Register at least one user via the SURFSWAPP app (/registro)
-- 2. Open Supabase Dashboard → SQL Editor
-- 3. Run this script — it will use the first registered user
--    as the demo seller for all products
-- ============================================================

DO $$
DECLARE
  demo_user_id UUID;
  p_id UUID;
BEGIN
  -- Use the first user in the profiles table as the demo seller
  SELECT id INTO demo_user_id FROM public.profiles ORDER BY created_at ASC LIMIT 1;

  IF demo_user_id IS NULL THEN
    RAISE NOTICE 'No users found. Register at least one user via the app first, then re-run this seed.';
    RETURN;
  END IF;

  RAISE NOTICE 'Using demo user: %', demo_user_id;

  -- Update demo user profile (only if fields are empty)
  UPDATE public.profiles
  SET
    full_name  = COALESCE(NULLIF(full_name, ''), 'Carlos Rider'),
    username   = COALESCE(NULLIF(username, ''), 'carlos_rider'),
    location   = COALESCE(NULLIF(location, ''), 'Tarifa, Cádiz'),
    bio        = COALESCE(NULLIF(bio, ''), 'Rider de kite y wing desde 2010. Vendo lo que ya no uso, siempre con honestidad.')
  WHERE id = demo_user_id;

  -- ============================================================
  -- PRODUCT 1: Shortboard Firewire Helium 5'10
  -- ============================================================
  INSERT INTO public.products (id, user_id, title, description, price, category, condition, brand, location, sport_type, status)
  VALUES (
    gen_random_uuid(),
    demo_user_id,
    'Shortboard 5''10 Firewire Helium',
    'Tabla shortboard Firewire Helium 5''10" x 18,5" x 2,25". Construcción de fibra de vidrio + EPS, increíblemente ligera. Ideal para olas de calidad de 1 a 1,5 metros. Tres quilillas FCS II incluidas. Un pequeño ding en el rail trasero ya reparado, no afecta al rendimiento. Precio negociable para venta rápida.',
    380,
    'surf',
    'como_nuevo',
    'Firewire',
    'Tarifa, Cádiz',
    'surf',
    'active'
  ) RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, order_index) VALUES
    (p_id, 'https://images.unsplash.com/photo-1531722569936-825d4eee8573?w=800&q=80', 0),
    (p_id, 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80', 1);

  -- ============================================================
  -- PRODUCT 2: Tabla Fish 6'2 Torq
  -- ============================================================
  INSERT INTO public.products (id, user_id, title, description, price, category, condition, brand, location, sport_type, status)
  VALUES (
    gen_random_uuid(),
    demo_user_id,
    'Tabla Fish 6''2 Torq TET',
    'Fish Torq TET 6''2" construcción epoxi. Muy divertida en olas pequeñas, muy padleadora gracias al volumen extra. Dos temporadas de uso cuidadoso. Sin golpes relevantes, algunas marcas superficiales de uso normal. Incluye tres quilinas Future y un leash de repuesto.',
    290,
    'surf',
    'buen_estado',
    'Torq',
    'Barcelona',
    'surf',
    'active'
  ) RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, order_index) VALUES
    (p_id, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', 0);

  -- ============================================================
  -- PRODUCT 3: Kite Cabrinha Switchblade 9m 2022
  -- ============================================================
  INSERT INTO public.products (id, user_id, title, description, price, category, condition, brand, location, sport_type, status)
  VALUES (
    gen_random_uuid(),
    demo_user_id,
    'Kite Cabrinha Switchblade 9m 2022',
    'Kite Cabrinha Switchblade 9m temporada 2022 en excelente estado. Muy poco uso, siempre guardado en bolsa seca. Sin parches, todas las bladders en perfecto estado, sin fugas. Perfecto para viento medio entre 18 y 25 nudos. Ideal para freeriding y body drag. Incluye bolsa de transporte original y bomba Cabrinha.',
    750,
    'kitesurf',
    'muy_buen_estado',
    'Cabrinha',
    'Tarifa, Cádiz',
    'kitesurf',
    'active'
  ) RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, order_index) VALUES
    (p_id, 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800&q=80', 0);

  -- ============================================================
  -- PRODUCT 4: Barra Cabrinha Overdrive 24m
  -- ============================================================
  INSERT INTO public.products (id, user_id, title, description, price, category, condition, brand, location, sport_type, status)
  VALUES (
    gen_random_uuid(),
    demo_user_id,
    'Barra Cabrinha Overdrive 24m 2022',
    'Barra Cabrinha Overdrive 52cm con líneas de 24m, temporada 2022. Compatible con todos los kites Cabrinha y muchas otras marcas. Sistema de quick release en perfecto estado, comprobado antes de vender. Líneas revisadas, sin kinks ni roturas. Barra en buen estado con marcas normales de uso. Vendo por actualización a barra más nueva.',
    280,
    'kitesurf',
    'buen_estado',
    'Cabrinha',
    'Tarifa, Cádiz',
    'kitesurf',
    'active'
  ) RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, order_index) VALUES
    (p_id, 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=800&q=80', 0);

  -- ============================================================
  -- PRODUCT 5: Twin-tip Cabrinha Ace 138x41
  -- ============================================================
  INSERT INTO public.products (id, user_id, title, description, price, category, condition, brand, location, sport_type, status)
  VALUES (
    gen_random_uuid(),
    demo_user_id,
    'Twin-tip Cabrinha Ace 138x41 2021',
    'Tabla twin-tip Cabrinha Ace 138x41cm, año 2021. Núcleo de madera de alta densidad, ligera y muy reactiva en el agua. Perfecta para todos los niveles intermedios y avanzados. Estado impecable, muy pocas sesiones. Algunas marcas mínimas en los bordes pero sin golpes en la estructura. Incluye pads y straps Cabrinha originales.',
    350,
    'kitesurf',
    'muy_buen_estado',
    'Cabrinha',
    'Valencia',
    'kitesurf',
    'active'
  ) RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, order_index) VALUES
    (p_id, 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80', 0);

  -- ============================================================
  -- PRODUCT 6: Wing Duotone Unit 5m 2023
  -- ============================================================
  INSERT INTO public.products (id, user_id, title, description, price, category, condition, brand, location, sport_type, status)
  VALUES (
    gen_random_uuid(),
    demo_user_id,
    'Wing Duotone Unit 5m 2023',
    'Wing Duotone Unit 5m temporada 2023. Ala de uso dual: foil y bodyboard. Excelente estabilidad en el viento, muy fácil de usar para principiantes y muy eficiente para riders intermedios. Estado prácticamente nuevo, apenas 3 sesiones. Sin desgaste, costuras en perfecto estado. Incluye funda de transporte original y bolsa de almacenaje.',
    680,
    'wing',
    'como_nuevo',
    'Duotone',
    'Mallorca',
    'wing',
    'active'
  ) RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, order_index) VALUES
    (p_id, 'https://images.unsplash.com/photo-1567359781514-81173b801d55?w=800&q=80', 0);

  -- ============================================================
  -- PRODUCT 7: Foil completo Slingshot Hover Glide
  -- ============================================================
  INSERT INTO public.products (id, user_id, title, description, price, category, condition, brand, location, sport_type, status)
  VALUES (
    gen_random_uuid(),
    demo_user_id,
    'Foil completo Slingshot Hover Glide FWake V5',
    'Foil completo Slingshot Hover Glide FWake V5 en muy buen estado. Set completo: mástil de 75cm en aluminio anodizado, fuselaje largo, ala frontal de 84cm de envergadura y ala trasera estabilizadora. Perfecto para iniciarse en el foil de wing y surf. Vendo porque cambio a setup de carbono. Pocas sesiones de uso, sin golpes en las alas.',
    850,
    'foil',
    'buen_estado',
    'Slingshot',
    'Cádiz',
    'foil',
    'active'
  ) RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, order_index) VALUES
    (p_id, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80', 0);

  -- ============================================================
  -- PRODUCT 8: Tabla windsurf Fanatic Gecko 135L
  -- ============================================================
  INSERT INTO public.products (id, user_id, title, description, price, category, condition, brand, location, sport_type, status)
  VALUES (
    gen_random_uuid(),
    demo_user_id,
    'Tabla windsurf Fanatic Gecko 135L 2020',
    'Tabla Fanatic Gecko 135 litros año 2020. Tabla freeride polivalente, muy estable y rápida. Ideal para riders de nivel medio que quieran mejorar en vientos de 15 a 30 nudos. Construida en plástico duradero, sin golpes estructurales. Footstraps y aleta Fanatic 42cm incluidos. Algún arañazo superficial por uso normal.',
    620,
    'windsurf',
    'usado',
    'Fanatic',
    'Tarifa, Cádiz',
    'windsurf',
    'active'
  ) RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, order_index) VALUES
    (p_id, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', 0);

  -- ============================================================
  -- PRODUCT 9: Vela Severne Turbo 7.8m
  -- ============================================================
  INSERT INTO public.products (id, user_id, title, description, price, category, condition, brand, location, sport_type, status)
  VALUES (
    gen_random_uuid(),
    demo_user_id,
    'Vela Severne Turbo GT 7.8m 2021',
    'Vela Severne Turbo GT 7.8m temporada 2021. Vela freerace de alta velocidad, muy potente y directa. Compatible con mástil 460cm SDM constant curve. Dos temporadas de uso moderado, sin roturas en el panel ni en las costuras. Ideal para vientos de Tarifa o Levante. Vendo por cambio de tabla. Inclyo bolsa de transporte.',
    320,
    'windsurf',
    'buen_estado',
    'Severne',
    'Tarifa, Cádiz',
    'windsurf',
    'active'
  ) RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, order_index) VALUES
    (p_id, 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80', 0);

  -- ============================================================
  -- PRODUCT 10: Neopreno Manera Seafarer 4/3
  -- ============================================================
  INSERT INTO public.products (id, user_id, title, description, price, category, condition, brand, location, sport_type, status)
  VALUES (
    gen_random_uuid(),
    demo_user_id,
    'Neopreno Manera Seafarer 4/3 Talla M',
    'Neopreno Manera Seafarer 4/3mm talla M (altura 175-180cm, 70-78kg). Neopreno de kite/surf con cremallera trasera. Dos temporadas de uso, en muy buen estado. Sin roturas ni desgaste en las costuras. Interior de neopreno suave Superstretch para máxima libertad de movimiento. Ideal para aguas de 14-18°C.',
    130,
    'accesorios',
    'buen_estado',
    'Manera',
    'Santander',
    'kitesurf',
    'active'
  ) RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, order_index) VALUES
    (p_id, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80', 0);

  -- ============================================================
  -- PRODUCT 11: Arnés cintura ION Core
  -- ============================================================
  INSERT INTO public.products (id, user_id, title, description, price, category, condition, brand, location, sport_type, status)
  VALUES (
    gen_random_uuid(),
    demo_user_id,
    'Arnés cintura ION Core 2022 Talla M',
    'Arnés de cintura ION Core talla M, temporada 2022. Construcción Prespape muy cómoda y con excelente soporte lumbar. Perfecto para sesiones largas de kitesurf o wingfoil. Estado muy bueno, correas y hebillas funcionando perfectamente. Gancho en buen estado, sin desgaste excesivo. Vendo por cambio a arnés asiento.',
    95,
    'accesorios',
    'muy_buen_estado',
    'ION',
    'Tarifa, Cádiz',
    'kitesurf',
    'active'
  ) RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, order_index) VALUES
    (p_id, 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800&q=80', 0);

  -- ============================================================
  -- PRODUCT 12: Longboard Torq 9'0 (SOLD example)
  -- ============================================================
  INSERT INTO public.products (id, user_id, title, description, price, category, condition, brand, location, sport_type, status)
  VALUES (
    gen_random_uuid(),
    demo_user_id,
    'Longboard Torq 9''0" TET Classic',
    'Longboard Torq TET Classic 9 pies en construcción epoxi reforzada. Ideal para olas largas y suaves de verano. Muy padleador y estable, perfecto para principiantes o para días de olas pequeñas. Tres sesiones en el agua, estado impecable. Incluye tres quilinas y leash de longboard. Vendo por mudanza a ciudad sin playa.',
    490,
    'surf',
    'usado',
    'Torq',
    'San Sebastián',
    'surf',
    'sold'
  ) RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, order_index) VALUES
    (p_id, 'https://images.unsplash.com/photo-1531722569936-825d4eee8573?w=800&q=80', 0);

  RAISE NOTICE 'Seed completado. 12 productos demo creados para el usuario %.', demo_user_id;

END;
$$;
