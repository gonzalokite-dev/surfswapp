-- ============================================================
-- SURFSWAPP — Row Level Security Policies
-- Run AFTER schema.sql
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages       ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES
-- ============================================================
-- Anyone can read profiles (public marketplace)
CREATE POLICY "profiles_public_read"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can only update their own profile
CREATE POLICY "profiles_owner_update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can only insert their own profile (handled by trigger, but just in case)
CREATE POLICY "profiles_owner_insert"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- PRODUCTS
-- ============================================================
-- Anyone can read active products
CREATE POLICY "products_public_read_active"
  ON public.products FOR SELECT
  USING (status = 'active' OR auth.uid() = user_id);

-- Authenticated users can insert products (their own)
CREATE POLICY "products_authenticated_insert"
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() = user_id AND auth.role() = 'authenticated');

-- Only owner can update product
CREATE POLICY "products_owner_update"
  ON public.products FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Only owner can delete product
CREATE POLICY "products_owner_delete"
  ON public.products FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- PRODUCT IMAGES
-- ============================================================
-- Anyone can read product images (public)
CREATE POLICY "product_images_public_read"
  ON public.product_images FOR SELECT
  USING (true);

-- Only product owner can insert/update/delete images
CREATE POLICY "product_images_owner_write"
  ON public.product_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE id = product_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "product_images_owner_delete"
  ON public.product_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE id = product_id AND user_id = auth.uid()
    )
  );

-- ============================================================
-- CONVERSATIONS
-- ============================================================
-- Only participants can read their conversations
CREATE POLICY "conversations_participants_read"
  ON public.conversations FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Authenticated users can create conversations (as buyer)
CREATE POLICY "conversations_buyer_insert"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = buyer_id AND auth.role() = 'authenticated');

-- Participants can update (e.g., updated_at)
CREATE POLICY "conversations_participants_update"
  ON public.conversations FOR UPDATE
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- ============================================================
-- MESSAGES
-- ============================================================
-- Only conversation participants can read messages
CREATE POLICY "messages_participants_read"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = conversation_id
      AND (buyer_id = auth.uid() OR seller_id = auth.uid())
    )
  );

-- Only sender can insert messages, must be conversation participant
CREATE POLICY "messages_participant_insert"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = conversation_id
      AND (buyer_id = auth.uid() OR seller_id = auth.uid())
    )
  );

-- ============================================================
-- STORAGE — product-images bucket
-- Run separately after creating the bucket in Supabase dashboard
-- ============================================================
-- In Supabase Dashboard → Storage → Create bucket "product-images" (public)
-- Then run these policies:

-- INSERT policy (authenticated users can upload)
-- CREATE POLICY "product_images_upload"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- SELECT policy (public read)
-- CREATE POLICY "product_images_public_read"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'product-images');

-- DELETE policy (owner only — filename starts with their user_id)
-- CREATE POLICY "product_images_owner_delete"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);
