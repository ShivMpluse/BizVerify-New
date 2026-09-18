import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search.mode === "signup" ? ("signup" as const) : undefined,
  }),
  head: () => ({ meta: [{ title: "Sign in | BizVerify" }] }),
  component: Auth,
});

function Auth() {
  const { mode } = useSearch({ from: "/auth" });
  const isSignUp = mode === "signup";
  const [email, setEmail] = useState("");
  const [rememberEmail, setRememberEmail] = useState(true);
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedEmail = window.localStorage.getItem("bizverify-remembered-email");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    if (rememberEmail) {
      window.localStorage.setItem("bizverify-remembered-email", email);
    } else {
      window.localStorage.removeItem("bizverify-remembered-email");
    }
    setIsSubmitting(true);
    const result = isSignUp
      ? await supabase.auth.signUp({ email, password, options: { data: { business_name: businessName, full_name: businessName } } })
      : await supabase.auth.signInWithPassword({ email, password });
    setIsSubmitting(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    if (isSignUp && !result.data.session) {
      setMessage("Check your email to confirm your account, then sign in.");
      return;
    }
    window.location.assign("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12 text-foreground">
      <div className="grid w-full max-w-5xl overflow-hidden border border-border bg-surface shadow-2xl md:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden flex-col justify-between bg-navy p-10 text-white md:flex">
          <Link to="/" className="flex items-center gap-2 font-bold"><span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground"><ShieldCheck size={20} /></span><span className="text-xl">BizVerify</span></Link>
          <div><p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Digital trust, made visible</p><h1 className="max-w-sm text-4xl font-bold leading-tight">Your verified business identity starts here.</h1><p className="mt-5 max-w-sm text-sm leading-6 text-slate-300">Create a profile, verify your domain, and give customers a trust signal they can check.</p></div>
          <p className="text-xs text-slate-400">Secure account access powered by Supabase</p>
        </section>
        <section className="p-7 sm:p-10">
          <div className="mb-8 md:hidden"><Link to="/" className="flex items-center gap-2 font-bold text-navy"><span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground"><ShieldCheck size={20} /></span><span className="text-xl">BizVerify</span></Link></div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Welcome to BizVerify</p>
          <h2 className="mt-3 text-3xl font-bold text-navy">{isSignUp ? "Create your account" : "Sign in to your account"}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{isSignUp ? "Start building trust around your business." : "Continue managing your verified business profile."}</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {isSignUp && <label className="block text-sm font-medium text-navy">Business name<input value={businessName} onChange={(event) => setBusinessName(event.target.value)} required className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>}
            <label className="block text-sm font-medium text-navy">Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
            <label className="block text-sm font-medium text-navy">Password<div className="relative mt-2"><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} autoComplete={isSignUp ? "new-password" : "current-password"} className="block w-full rounded-md border border-input bg-background px-3 py-3 pr-11 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} title={showPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground transition hover:text-foreground">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
            {!isSignUp && <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" checked={rememberEmail} onChange={(event) => setRememberEmail(event.target.checked)} className="size-4 rounded border-input accent-primary" />Remember email</label>}
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            {message && <p role="status" className="text-sm text-primary">{message}</p>}
            <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}{!isSubmitting && <ArrowRight size={17} />}</button>
          </form>
          <p className="mt-7 text-center text-sm text-muted-foreground">{isSignUp ? "Already have an account?" : "New to BizVerify?"}{" "}<Link to="/auth" search={isSignUp ? {} : { mode: "signup" }} className="font-semibold text-primary hover:underline">{isSignUp ? "Sign in" : "Create an account"}</Link></p>
        </section>
      </div>
    </main>
  );
}