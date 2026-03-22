-- ============================================================
-- SURFSWAPP — Demo Seed Data
-- Run AFTER schema.sql and rls.sql
-- Creates demo users and products with realistic data
-- NOTE: Run this via Supabase SQL Editor or supabase db seed
-- ============================================================

-- Demo user UUIDs (we insert directly into profiles; auth users created via Supabase Auth)
-- For local dev, you can create these users via the Auth UI and then run the products seed.

-- Demo products (using a placeholder user_id — replace with a real user ID from your DB)
-- The easiest approach: register via the app, get your user ID from profiles table, then run below.

-- ============================================================
-- DEMO PRODUCTS
-- Replace 'YOUR_USER_ID_HERE' with an actual UUID from your profiles table
-- ============================================================

DO $$
DECLARE
  demo_user_id UUID;
  p_id UUID;
BEGIN
  -- Use the first user in the profiles table as the demo seller
  SELECT id INTO demo_user_id FROM public.profiles LIMIT 1;

  IF demo_user_id IS NULL THEN
    RAISE NOTICE 'No users found. Register at least one user first, then re-run this seed.';
    RETURN;
  END IF;

  -- Update demo user profile
  UPDATE public.profiles
  SET
    full_name = COALESCE(full_name, 'Carlos Rider'),
    username = COALESCE(username, 'carlos_rider'),
    location = COALESCE(location, 'Tarifa, Cádiz'),
    bio = COALESCE(bio, 'Rider de kite y wing desde 2010. Vendo lo que ya no uso, con honestidad.')
  WHERE id = demo_user_id;

  -- PRODUCT 1: Shortboard surf
  INSERT INTO public.products (id, user_id, title, description, price, category, condition, brand, location, sport_type, status)
  VALUES (
    gen_random_uuid(),
    demo_user_id,
    'Tabla Surf Shortboard 6''2" Channel Islands',
    'Tabla shortboard Channel Islands Fever 6''2" x 19" x 2,5". Shaped por Al Merrick. Ideal para olas medianas con potencia. Algún ding pequeño reparado, no afecta al rendimiento. Incluye funda.',
    420,
    'surf',
    'buen_estado',
    'Channel Islands',
    'Tarifa, Cádiz',
    'surf',
    'active'
  ) RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, order_index) VALUES
    (p_id, 'https://images.unsplash.com/photo-1531722569936-825d4eee8573?w=800&q=80', 0),
    (p_id, 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80', 1);

  -- PRODUCT 2: Kite
  INSERT INTO public.products (id, user_id, title, description, price, category, condition, brand, location, sport_type, status)
  VALUES (
    gen_random_uuid(),
    demo_user_id,
    'Kite Cabrinha Switchblade 9m 2022',
    'Kite Cabrinha Switchblade 9m temporada 2022. Muy poco uso, siempre guardado en bolsa. Sin parches, bladders en perfecto estado. Perfecto para viento medio, 18-25 nudos. Incluye bolsa y bomba.',
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

  -- PRODUCT 3: Wing
  INSERT INTO public.products (id, user_id, title, description, price, category, condition, brand, location, sport_type, status)
  VALUES (
    gen_random_uuid(),
    demo_user_id,
    'Wing Duotone Slick 5m 2023',
    'Wing Duotone Slick 5m, temporada 2023. Excelente ala para foil. Maneja increíble, muy eficiente con viento suave. Pocas sesiones, impecable. Incluye funda y bolsa de transporte.',
    680,
    'wing',
    'como_nuevo',
    'Duotone',
    'Valencia',
    'wing',
    'active'
  ) RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, order_index) VALUES
    (p_id, 'https://images.unsplash.com/photo-1567359781514-81173b801d55?w=800&q=80', 0);

  -- PRODUCT 4: Foil completo
  INSERT INTO public.products (id, user_id, title, description, price, category, condition, brand, location, sport_type, status)
  VALUES (
    gen_random_uuid(),
    demo_user_id,
    'Foil Completo Slingshot Hover Glide FWake V5',
    'Foil completo Slingshot Hover Glide FWake V5. Mástil de 75cm aluminio, fuselaje largo, ala frontal 84cm y ala trasera estabilizadora. Perfecto estado, pocas sesiones de wing y surf. Vendo por cambio a carbono.',
    850,
    'foil',
    'muy_buen_estado',
    'Slingshot',
    'Barcelona',
    'foil',
    'active'
  ) RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, order_index) VALUES
    (p_id, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80', 0);

  -- PRODUCT 5: Tabla de windsurf
  INSERT INTO public.products (id, user_id, title, description, price, category, condition, brand, location, sport_type, status)
  VALUES (
    gen_random_uuid(),
    demo_user_id,
    'Tabla Windsurf Fanatic Gecko 135L 2021',
    'Tabla Fanatic Gecko 135 litros, año 2021. Tabla de freeride/freerace, muy estable y rápida. Perfecto estado, sin golpes. Footstraps y aleta incluidos. Ideal para vientos medios y riders intermedios.',
    650,
    'windsurf',
    'muy_buen_estado',
    'Fanatic',
    'Tarifa, Cádiz',
    'windsurf',
    'active'
  ) RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, order_index) VALUES
    (p_id, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', 0);

  -- PRODUCT 6: Neopreno
  INSERT INTO public.products (id, user_id, title, description, price, category, condition, brand, location, sport_type, status)
  VALUES (
    gen_random_uuid(),
    demo_user_id,
    'Neopreno O''Neill Hyperfreak 3/2mm Talla M',
    'Neopreno O''Neill Hyperfreak 3/2mm, talla M. Dos temporadas de uso, sin roturas ni desgaste significativo. Muy cómodo y flexible. Ideal para agua fresca, 16-22°C.',
    130,
    'accesorios',
    'buen_estado',
    'O''Neill',
    'San Sebastián',
    'surf',
    'active'
  ) RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, order_index) VALUES
    (p_id, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80', 0);

  -- PRODUCT 7: Arnés kite
  INSERT INTO public.products (id, user_id, title, description, price, category, condition, brand, location, sport_type, status)
  VALUES (
    gen_random_uuid(),
    demo_user_id,
    'Arnés Cintura Mystic Majestic X Talla M',
    'Arnés de cintura Mystic Majestic X, talla M. Muy cómodo, excelente soporte lumbar. Un par de temporadas de uso moderado. Sin defectos estructurales. Gancho Kite Loop incluido.',
    110,
    'accesorios',
    'buen_estado',
    'Mystic',
    'Fuerteventura',
    'kitesurf',
    'active'
  ) RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, order_index) VALUES
    (p_id, 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80', 0);

  -- PRODUCT 8: Barra kite
  INSERT INTO public.products (id, user_id, title, description, price, category, condition, brand, location, sport_type, status)
  VALUES (
    gen_random_uuid(),
    demo_user_id,
    'Barra Duotone Click Bar 52cm 2022',
    'Barra Duotone Click Bar 52cm, temporada 2022. Compatible con todos los kites Duotone. Sistema de seguridad quick release en perfecto estado. Líneas en buen estado (25m), sin kinks importantes.',
    280,
    'kitesurf',
    'muy_buen_estado',
    'Duotone',
    'Tarifa, Cádiz',
    'kitesurf',
    'active'
  ) RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, order_index) VALUES
    (p_id, 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=800&q=80', 0);

  -- PRODUCT 9: Tabla twin-tip
  INSERT INTO public.products (id, user_id, title, description, price, category, condition, brand, location, sport_type, status)
  VALUES (
    gen_random_uuid(),
    demo_user_id,
    'Tabla Twin-Tip Cabrinha Ace Wood 140x42 2021',
    'Tabla twin-tip Cabrinha Ace Wood 140x42, año 2021. Ligera y reactiva, con núcleo de madera. Perfecto estado, algún desgaste mínimo en bordes. Incluye pads y straps Cabrinha.',
    380,
    'kitesurf',
    'buen_estado',
    'Cabrinha',
    'Cádiz',
    'kitesurf',
    'active'
  ) RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, order_index) VALUES
    (p_id, 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80', 0);

  -- PRODUCT 10: Longboard surf (SOLD example)
  INSERT INTO public.products (id, user_id, title, description, price, category, condition, brand, location, sport_type, status)
  VALUES (
    gen_random_uuid(),
    demo_user_id,
    'Longboard Surf Torq 9''0" TET',
    'Longboard Torq TET 9 pies, construcción epoxi. Muy buenas olas de verano, fácil de surfear. Vendo por cambio de spot. Incluye 3 quilillas y leash.',
    490,
    'surf',
    'buen_estado',
    'Torq',
    'Zarautz, Guipúzcoa',
    'surf',
    'sold'
  ) RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, order_index) VALUES
    (p_id, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', 0);

  RAISE NOTICE 'Seed completed. % demo products created.', 10;
END;
$$;
