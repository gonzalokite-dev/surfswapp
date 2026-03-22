-- ============================================================
-- SURFSWAPP — Schema SQL
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES
-- Extends auth.users (created automatically on signup via trigger)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username      TEXT        UNIQUE,
  full_name     TEXT,
  avatar_url    TEXT,
  location      TEXT,
  bio           TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format CHECK (username ~ '^[a-z0-9_]+$')
);

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID        REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title         TEXT        NOT NULL,
  description   TEXT        NOT NULL,
  price         NUMERIC(10,2) NOT NULL CHECK (price > 0),
  category      TEXT        NOT NULL CHECK (category IN ('surf','kitesurf','windsurf','wing','foil','accesorios')),
  subcategory   TEXT,
  condition     TEXT        NOT NULL CHECK (condition IN ('como_nuevo','muy_buen_estado','buen_estado','usado','para_reparar')),
  brand         TEXT,
  location      TEXT,
  sport_type    TEXT        NOT NULL,
  status        TEXT        DEFAULT 'active' CHECK (status IN ('active','reserved','sold')),
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_user_id     ON public.products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category    ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status      ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at  ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_price       ON public.products(price);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_products_fts ON public.products
  USING gin(to_tsvector('spanish', title || ' ' || description));

-- ============================================================
-- PRODUCT IMAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.product_images (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id    UUID        REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  url           TEXT        NOT NULL,
  order_index   INTEGER     DEFAULT 0 NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);

-- ============================================================
-- CONVERSATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id    UUID        REFERENCES public.products(id) ON DELETE SET NULL,
  buyer_id      UUID        REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id     UUID        REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT no_self_conversation CHECK (buyer_id <> seller_id),
  UNIQUE (product_id, buyer_id, seller_id)
);

CREATE INDEX IF NOT EXISTS idx_conversations_buyer_id  ON public.conversations(buyer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_seller_id ON public.conversations(seller_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated   ON public.conversations(updated_at DESC);

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id   UUID        REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id         UUID        REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content           TEXT        NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 2000),
  created_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  read_at           TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id       ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at      ON public.messages(created_at ASC);

-- ============================================================
-- UPDATED_AT trigger helper
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER set_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- AUTO-UPDATE conversations.updated_at WHEN A MESSAGE IS INSERTED
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_message_inserted ON public.messages;
CREATE TRIGGER on_message_inserted
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_conversation_on_message();
