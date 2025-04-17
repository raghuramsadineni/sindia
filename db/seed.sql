BEGIN;

DROP TRIGGER IF EXISTS sync_admin_claim ON public.user_profiles;
DROP FUNCTION IF EXISTS public.update_admin_claim();

CREATE TABLE IF NOT EXISTS public.user_profiles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  is_admin BOOLEAN DEFAULT FALSE NOT NULL
);

GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.user_profiles TO postgres, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.update_admin_claim()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('is_admin', NEW.is_admin)
  WHERE id = NEW.user_id;
  RETURN NEW;
EXCEPTION WHEN others THEN
  RAISE WARNING '[update_admin_claim] Failed to update JWT claims for user %: %', NEW.user_id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER VOLATILE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'sync_admin_claim' AND tgrelid = 'public.user_profiles'::regclass
  ) THEN
    CREATE TRIGGER sync_admin_claim
    AFTER INSERT OR UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_admin_claim();
  END IF;
END $$;

DO $$
DECLARE
  target_user_id UUID := '93ef0c64-6c53-45e8-8ae0-e03a52bf90f1';
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users WHERE id = target_user_id) THEN
    INSERT INTO public.user_profiles (user_id, is_admin)
    VALUES (target_user_id, TRUE)
    ON CONFLICT (user_id)
    DO UPDATE SET is_admin = EXCLUDED.is_admin;
    RAISE NOTICE 'Profile for user % ensured to be admin.', target_user_id;
  ELSE
    RAISE WARNING 'User % does not exist in auth.users. Cannot create or update profile.', target_user_id;
  END IF;
END $$;

COMMIT;