import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const profileUpdateSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters.").max(100, "Full name is too long."),
  phone: z
    .string()
    .trim()
    .max(30, "Phone number is too long.")
    .refine((value) => value === "" || /^[+\d\s().-]+$/.test(value), "Enter a valid phone number."),
});

export const getAccount = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ data: profile, error: profileError }, { data: roles, error: rolesError }] = await Promise.all([
      context.supabase
        .from("profiles")
        .select("id, full_name, email, phone, created_at, updated_at")
        .eq("id", context.userId)
        .maybeSingle(),
      context.supabase.from("user_roles").select("role").eq("user_id", context.userId),
    ]);

    if (profileError) throw new Error("We could not load your profile.");
    if (rolesError) throw new Error("We could not load your account permissions.");

    return {
      profile,
      roles: (roles ?? []).map((item) => item.role),
      userId: context.userId,
    };
  });

export const updateAccountProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => profileUpdateSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { data: profile, error } = await context.supabase
      .from("profiles")
      .update({ full_name: data.fullName, phone: data.phone || null })
      .eq("id", context.userId)
      .select("id, full_name, email, phone, created_at, updated_at")
      .single();

    if (error) throw new Error("We could not save your profile.");
    return { profile };
  });

export const getAdminProfiles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: ownRoles, error: roleError } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);

    if (roleError) throw new Error("We could not verify your admin permissions.");
    if (!ownRoles?.some((item) => item.role === "admin")) {
      throw new Error("You do not have permission to view the admin dashboard.");
    }

    const { data: profiles, error } = await context.supabase
      .from("profiles")
      .select("id, full_name, email, phone, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) throw new Error("We could not load the admin dashboard.");
    return { profiles: profiles ?? [] };
  });