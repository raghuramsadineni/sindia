BEGIN;

DROP TABLE IF EXISTS public.media;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  public_url TEXT NOT NULL,
  sort_order INT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('gallery', 'menu'))
);

REVOKE ALL ON public.media FROM anon, authenticated;
GRANT SELECT ON public.media TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.media TO authenticated;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read media" ON public.media;
DROP POLICY IF EXISTS "Admins can insert media" ON public.media;
DROP POLICY IF EXISTS "Admins can update media" ON public.media;
DROP POLICY IF EXISTS "Admins can delete media" ON public.media;

CREATE POLICY "Public can read media"
  ON public.media
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert media"
  ON public.media
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can update media"
  ON public.media
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid() AND is_admin = TRUE
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can delete media"
  ON public.media
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid() AND is_admin = TRUE
    )
  );

COMMIT;
