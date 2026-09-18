import { supabase } from "@/integrations/supabase/client";

export type VerificationStatus = "not_verified" | "pending" | "verified";

export type BusinessProfile = {
  id: string;
  user_id: string;
  brand_name: string;
  domain: string;
  description: string;
  business_email: string;
  country: string;
  logo_url: string | null;
  verification_status: VerificationStatus;
  verification_id: string;
  verification_method: string;
  dns_value: string;
  verified_at: string | null;
  email_notifications: boolean;
  badge_active: boolean;
  created_at: string;
  updated_at: string;
};

export function isMissingBusinessProfilesTable(error: { code?: string } | null | undefined) {
  return error?.code === "PGRST205" || error?.code === "42P01";
}

export async function getOrCreateBusinessProfile(userId: string, email = "", fullName = "") {
  const existing = await supabase.from("business_profiles").select("*").eq("user_id", userId).maybeSingle();
  if (existing.error) throw existing.error;
  if (existing.data) return existing.data as BusinessProfile;

  const created = await supabase
    .from("business_profiles")
    .insert({ user_id: userId, brand_name: fullName, business_email: email })
    .select("*")
    .single();
  if (created.error) throw created.error;
  return created.data as BusinessProfile;
}

export function profileUrl(verificationId: string) {
  if (typeof window === "undefined") return `/verify/${verificationId}`;
  return `${window.location.origin}/verify/${verificationId}`;
}

export function formatVerifiedDate(date: string | null) {
  if (!date) return "Not verified yet";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));
}