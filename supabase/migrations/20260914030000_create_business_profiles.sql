CREATE TABLE public.business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL DEFAULT '',
  domain TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  business_email TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  logo_url TEXT,
  verification_status TEXT NOT NULL DEFAULT 'not_verified' CHECK (verification_status IN ('not_verified', 'pending', 'verified')),
  verification_id TEXT NOT NULL UNIQUE DEFAULT ('BV-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6))),
  verification_method TEXT NOT NULL DEFAULT 'DNS TXT Record',
  dns_value TEXT NOT NULL DEFAULT ('bizverify-verification=' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12))),
  verified_at TIMESTAMPTZ,
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  badge_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.business_profiles TO authenticated;
GRANT SELECT ON public.business_profiles TO anon;
GRANT ALL ON public.business_profiles TO service_role;

ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own business profile"
  ON public.business_profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR verification_status = 'verified');

CREATE POLICY "Visitors can view verified business profiles"
  ON public.business_profiles FOR SELECT TO anon
  USING (verification_status = 'verified');

CREATE POLICY "Users can create their own business profile"
  ON public.business_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business profile"
  ON public.business_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER business_profiles_updated_at
  BEFORE UPDATE ON public.business_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.delete_my_account()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_my_account() TO authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_my_account() FROM anon, PUBLIC;