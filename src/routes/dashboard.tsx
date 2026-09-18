import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Building2, ChevronDown, CircleUserRound, ClipboardCheck, ExternalLink, FileBadge2, LayoutDashboard, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Settings, ShieldCheck, UserRound, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { getOrCreateBusinessProfile, isMissingBusinessProfilesTable, type BusinessProfile } from "@/lib/business-profile";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

export function useDashboard() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function refreshProfile() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    setUserEmail(userData.user.email ?? "");
    const nextProfile = await getOrCreateBusinessProfile(userData.user.id, userData.user.email ?? "", userData.user.user_metadata?.full_name ?? "");
    setProfile(nextProfile);
  }

  useEffect(() => {
    refreshProfile().catch((error) => console.error("Could not load dashboard profile", error)).finally(() => setIsLoading(false));
  }, []);

  return { profile, refreshProfile, userEmail, isLoading };
}

const mainNav = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Domain Verification", to: "/dashboard/verification", icon: ClipboardCheck },
  { label: "Public Profile", to: "/dashboard/profile", icon: ExternalLink },
  { label: "Trust Badge", to: "/dashboard/badge", icon: FileBadge2 },
  { label: "Business Profile", to: "/dashboard/business", icon: Building2 },
] as const;

const accountNav = [
  { label: "Settings", to: "/dashboard/settings", icon: Settings },
] as const;

function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  async function refreshProfile() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    setUserEmail(userData.user.email ?? "");
    const nextProfile = await getOrCreateBusinessProfile(userData.user.id, userData.user.email ?? "", userData.user.user_metadata?.full_name ?? "");
    setProfile(nextProfile);
  }

  useEffect(() => {
    let active = true;
    async function loadDashboard() {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      if (!data.session) {
        await navigate({ to: "/auth" });
        return;
      }
      setAuthChecked(true);
      try {
        await refreshProfile();
      } catch (error) {
        console.error("Could not load dashboard profile", error);
        if (active) setProfileError(isMissingBusinessProfilesTable(error) ? "The business_profiles table is not available in Supabase yet. Apply migration 20260914030000_create_business_profiles.sql." : error instanceof Error ? error.message : "Could not load your business profile.");
      } finally {
        if (active) setIsLoading(false);
      }
    }
    loadDashboard().catch((error) => {
      console.error("Could not validate dashboard session", error);
      if (active) setIsLoading(false);
    });
    return () => { active = false; };
  }, []);

  async function handleLogout() {
    if (!window.confirm("Are you sure you want to log out?")) return;
    await supabase.auth.signOut();
    await navigate({ to: "/" });
  }

  if (!authChecked) return <div className="grid min-h-screen place-items-center bg-background px-5 text-sm text-muted-foreground">Checking your session...</div>;

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        {profileError && <div className="border-b border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-800 lg:px-8">Your account is signed in, but the business profile could not be loaded. Apply the latest Supabase migration, then refresh this page. <span className="font-medium">{profileError}</span></div>}
        <aside className={`fixed inset-y-0 left-0 z-40 hidden border-r border-border bg-surface lg:flex lg:flex-col ${sidebarCollapsed ? "lg:w-20" : "lg:w-72"}`}>
          <SidebarContent profile={profile} userEmail={userEmail} onLogout={handleLogout} currentPath={location.pathname} collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed((value) => !value)} />
        </aside>
        <div className={sidebarCollapsed ? "lg:pl-20" : "lg:pl-72"}>
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/95 px-5 backdrop-blur lg:px-8">
            <button type="button" onClick={() => setMobileOpen((open) => !open)} className="grid size-10 place-items-center rounded-md border border-border text-navy lg:hidden" aria-label="Toggle navigation">
              {mobileOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
            <Link to="/dashboard" className="flex items-center gap-2 font-bold text-navy lg:hidden"><span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground"><ShieldCheck size={17} /></span>BizVerify</Link>
            <div className="ml-auto flex items-center gap-3 text-right"><div className="hidden sm:block"><p className="text-xs text-muted-foreground">Signed in as</p><p className="max-w-52 truncate text-sm font-semibold text-navy">{userEmail}</p></div><CircleUserRound className="text-muted-foreground" size={21} /></div>
          </header>
          {mobileOpen && <div className="fixed inset-0 top-16 z-20 bg-navy/20 lg:hidden" onClick={() => setMobileOpen(false)}><div className="w-72 border-r border-border bg-surface p-4 shadow-xl" onClick={(event) => event.stopPropagation()}><SidebarContent profile={profile} userEmail={userEmail} onLogout={handleLogout} currentPath={location.pathname} collapsed={false} onNavigate={() => setMobileOpen(false)} /></div></div>}
          <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8"><Outlet /></main>
        </div>
      </div>
    </>
  );
}

function SidebarContent({ profile, userEmail, onLogout, currentPath, collapsed, onNavigate, onToggleCollapse }: { profile: BusinessProfile | null; userEmail: string; onLogout: () => void; currentPath: string; collapsed?: boolean; onNavigate?: () => void; onToggleCollapse?: () => void }) {
  return <div className="flex h-full flex-col">
    <div className={`flex items-center ${collapsed ? "justify-center px-3 py-4" : "justify-between px-4 py-4"}`}>
      <Link to="/dashboard" onClick={onNavigate} className={`flex items-center gap-3 font-bold text-navy ${collapsed ? "justify-center" : ""}`}>
        <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground"><ShieldCheck size={20} /></span>
        {!collapsed && <span className="text-lg">BizVerify</span>}
      </Link>
      {!collapsed && onToggleCollapse && <button type="button" onClick={onToggleCollapse} className="grid size-9 place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground" aria-label="Collapse sidebar"><PanelLeftClose size={17} /></button>}
      {collapsed && onToggleCollapse && <button type="button" onClick={onToggleCollapse} className="grid size-8 place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground" aria-label="Expand sidebar"><PanelLeftOpen size={16} /></button>}
    </div>
    {!collapsed && <div className="border-b border-border px-6 py-5"><div className="flex items-center gap-3"><div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-accent text-primary">{profile?.logo_url ? <img src={profile.logo_url} alt="" className="size-full object-cover" /> : <UserRound size={19} />}</div><div className="min-w-0"><p className="truncate text-sm font-semibold text-navy">{profile?.brand_name || "Your business"}</p><p className="truncate text-xs text-muted-foreground">{userEmail}</p></div></div></div>}
    <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-6" aria-label="Dashboard navigation"><NavGroup label="Main" items={mainNav} currentPath={currentPath} onNavigate={onNavigate} collapsed={collapsed} /><NavGroup label="Account" items={accountNav} currentPath={currentPath} onNavigate={onNavigate} collapsed={collapsed} /></nav>
    <div className="border-t border-border p-4"><button type="button" onClick={onLogout} className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-accent hover:text-foreground ${collapsed ? "justify-center" : ""}`}><LogOut size={17} />{!collapsed && "Logout"}</button></div>
  </div>;
}

function NavGroup({ label, items, currentPath, onNavigate, collapsed }: { label: string; items: readonly { label: string; to: string; icon: typeof LayoutDashboard }[]; currentPath: string; onNavigate?: () => void; collapsed?: boolean }) {
  return <div>{!collapsed && <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>}<div className="space-y-1">{items.map(({ label: itemLabel, to, icon: Icon }) => { const active = currentPath === to; return <Link key={to} to={to} onClick={onNavigate} className={`flex items-center rounded-md px-3 py-2.5 text-sm font-semibold transition ${collapsed ? "justify-center" : "gap-3"} ${active ? "bg-accent text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`} title={collapsed ? itemLabel : undefined}><Icon size={17} />{!collapsed && itemLabel}</Link>; })}</div></div>;
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: ReactNode }) {
  return <div className="mb-8 flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end"><div>{eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>}<h1 className="text-3xl font-bold tracking-tight text-navy">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p></div>{action}</div>;
}

export function StatusPill({ status }: { status: string }) {
  const verified = status === "verified";
  const pending = status === "pending";
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${verified ? "bg-success-soft text-success" : pending ? "bg-amber-50 text-amber-700" : "bg-muted text-muted-foreground"}`}>{verified ? "✓ Verified" : pending ? "● Verification Pending" : "○ Not Verified"}</span>;
}

export function EmptyProfileNotice() { return <div className="rounded-lg border border-border bg-surface p-8 text-center"><p className="font-semibold text-navy">Your business profile is ready to set up</p><p className="mt-2 text-sm text-muted-foreground">Add your business name and domain to activate the verification workspace.</p><Link to="/dashboard/business" className="mt-5 inline-flex rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Complete profile</Link></div>; }

export function ProfileUnavailableNotice() { return <div className="rounded-lg border border-amber-200 bg-amber-50 p-8 text-center"><p className="font-semibold text-amber-900">Business profile setup is unavailable</p><p className="mt-2 text-sm text-amber-800">Apply the Supabase migration `20260914030000_create_business_profiles.sql`, then refresh this page.</p></div>; }