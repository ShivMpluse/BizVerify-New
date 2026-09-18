"use client";

import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleCheck,
  Code2,
  Globe2,
  Menu,
  Rocket,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const steps = [
  ["Create Your Business Profile", "Add your business name, domain, and essential details."],
  ["Verify Your Domain", "Add a unique TXT record to your domain's DNS settings."],
  ["Get Your Verified Badge", "Your badge becomes available as soon as verification completes."],
  ["Let Customers Verify", "Embed your badge with a click-through public verification profile."],
];

const useCases = [
  { title: "Startups", text: "Establish credibility from day one and give prospects confidence in every interaction.", icon: Rocket },
  { title: "E-commerce", text: "Reassure shoppers that they are buying from the legitimate website behind your brand.", icon: ShoppingBag },
  { title: "SaaS & IT", text: "Add an independent trust signal to sales pages, dashboards, and documentation.", icon: Code2 },
  { title: "Agencies", text: "Show clients that your online identity belongs to the business they hired.", icon: Users },
  { title: "B2B Businesses", text: "Make vendor checks faster with a clear, shareable public verification record.", icon: Building2 },
];

const faqs = [
  ["How does DNS verification work?", "We provide a unique TXT record for your business. Add it to your domain's DNS settings, then BizVerify checks that record to confirm control of the domain."],
  ["Where can I display the BizVerify badge?", "You can place the badge on your website footer, checkout, contact page, customer portal, or any page where visitors benefit from a clear trust signal."],
  ["Is BizVerify a government certification?", "No. BizVerify is an independent domain ownership verification service and is not a government certification, license, or endorsement."],
  ["What does “Domain Verified” mean?", "It means the business completed a technical check proving control of the website domain shown on its public verification profile."],
  ["How long does verification take?", "Most checks complete within minutes after the TXT record is visible. DNS changes can occasionally take longer to propagate."],
  ["Can customers verify my badge?", "Yes. Every badge links to a public profile where customers can confirm your domain, active status, verification date, and BizVerify ID."],
  ["What happens if the DNS record is removed?", "Periodic checks can detect the missing record. Your status may be paused until domain ownership is verified again."],
];

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || isInView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isInView, options]);

  return { ref, isInView };
}

function ScrollReveal({ children, className }: { children: ReactNode; className?: string }) {
  const { ref, isInView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export default function Index() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8" aria-label="Main navigation">
          <a href="#top" className="flex items-center gap-2 font-bold text-navy"><span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground"><ShieldCheck size={18} /></span><span className="text-lg">BizVerify</span></a>
          <div className="hidden items-center gap-8 md:flex">
            {[["How it Works", "#how"], ["Features", "#features"], ["Use Cases", "#use-cases"], ["FAQ", "#faq"]].map(([label, href]) => <a key={href} href={href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{label}</a>)}
          </div>
          <div className="hidden items-center gap-2 md:flex"><a href="/auth" className="px-4 py-2 text-sm font-semibold text-foreground">Login</a><a href="/auth?mode=signup" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-95">Get Verified</a></div>
          <details className="relative md:hidden">
            <summary className="grid size-10 list-none place-items-center rounded-md text-foreground [&::-webkit-details-marker]:hidden" aria-label="Open menu"><Menu /></summary>
            <div className="absolute right-0 top-12 z-50 w-56 border border-border bg-surface p-4 shadow-xl">
              <a href="#how" className="block py-3 text-sm font-semibold">How it Works</a>
              <a href="#features" className="block py-3 text-sm font-semibold">Features</a>
              <a href="#use-cases" className="block py-3 text-sm font-semibold">Use Cases</a>
              <a href="#faq" className="block py-3 text-sm font-semibold">FAQ</a>
              <a href="/auth" className="mt-2 block border-t border-border pt-3 text-sm font-semibold">Login</a>
              <a href="/auth?mode=signup" className="mt-3 block rounded-md bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground">Get Verified</a>
            </div>
          </details>
        </nav>
      </header>

      <section id="top" className="relative border-b border-border bg-surface pt-20 lg:pt-28">
        <div className="grid-fade pointer-events-none absolute inset-0 opacity-70" />
        <ScrollReveal>
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-28">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm"><CheckCircle2 size={14} className="text-success" /> DNS-powered business verification</div>
              <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] text-navy sm:text-6xl lg:text-7xl">Verify Your Domain.<br /><span className="text-primary">Build Digital Trust.</span></h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">BizVerify helps businesses verify ownership of their website domain and showcase their verified status with a professional digital trust badge.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href="#cta" className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">Get Verified <ArrowRight size={17} /></a><a href="#how" className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-accent">How It Works</a></div>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground"><span className="flex items-center gap-1.5"><Check size={14} className="text-success" /> No code required</span><span className="flex items-center gap-1.5"><Check size={14} className="text-success" /> Verify in minutes</span><span className="flex items-center gap-1.5"><Check size={14} className="text-success" /> Public trust profile</span></div>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="rounded-lg border border-border bg-surface shadow-2xl shadow-navy/10">
                <div className="flex h-11 items-center gap-2 border-b border-border px-4"><span className="size-2.5 rounded-full bg-border" /><span className="size-2.5 rounded-full bg-border" /><span className="size-2.5 rounded-full bg-border" /><div className="ml-3 flex h-7 flex-1 items-center rounded-md bg-muted px-3 text-[10px] text-muted-foreground"><Globe2 size={11} className="mr-2" />abccompany.com</div></div>
                <div className="min-h-72 bg-hero-wash p-6 sm:p-10"><div className="rounded-md bg-surface p-6 shadow-lg"><div className="flex items-start justify-between gap-3"><div><div className="mb-1 text-xs text-muted-foreground">Business website</div><div className="font-bold text-navy">ABC Technologies</div></div><div className="grid size-9 place-items-center rounded-md bg-success-soft text-success"><ShieldCheck size={20} /></div></div><div className="my-5 h-px bg-border" /><div className="flex items-center gap-3"><span className="status-pulse size-2.5 rounded-full bg-success" /><div><p className="text-sm font-semibold">This domain is verified</p><p className="mt-0.5 text-xs text-muted-foreground">Verified by BizVerify · Sep 2026</p></div></div></div></div>
              </div>
              <div className="absolute -bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-md border border-border bg-surface px-4 py-3 shadow-xl"><BadgeCheck className="text-success" size={24} /><div><p className="text-xs font-bold text-navy">BizVerify Verified</p><p className="text-[10px] text-muted-foreground">Click to validate</p></div></div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="border-b border-border bg-background">
        <ScrollReveal>
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-8 text-center md:flex-row md:text-left lg:px-8"><div><p className="font-bold text-navy">Build Trust With a Verified Badge</p><p className="mt-1 text-sm text-muted-foreground">Secure, DNS-based verification customers can check.</p></div><div className="flex flex-wrap justify-center gap-2">{["Simple", "Transparent", "Verifiable"].map((item) => <span key={item} className="rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground shadow-sm"><Check size={13} className="mr-1.5 inline text-success" />{item}</span>)}</div></div>
        </ScrollReveal>
      </section>

      <section id="how" className="bg-surface py-20 lg:py-28">
        <ScrollReveal>
          <div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-widest text-primary">Four simple steps</p><h2 className="mt-3 text-3xl font-bold text-navy sm:text-4xl">How BizVerify Works</h2><p className="mt-4 text-muted-foreground">From profile to public proof—without paperwork or lengthy reviews.</p></div><div className="relative mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4"><div className="absolute left-[12%] right-[12%] top-7 hidden border-t border-dashed border-primary/30 lg:block" />{steps.map(([title, text], i) => <article key={title} className="group relative rounded-lg border border-border bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-navy/5"><div className="relative z-10 mb-6 grid size-14 place-items-center rounded-md border border-primary/20 bg-accent text-sm font-bold text-primary">0{i + 1}</div><h3 className="font-bold text-navy">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p></article>)}</div></div>
        </ScrollReveal>
      </section>

      <section id="features" className="border-y border-border bg-background py-20 lg:py-28">
        <ScrollReveal>
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Proof that stays public</p><h2 className="mt-3 text-3xl font-bold text-navy sm:text-4xl">One badge. Four clear signals.</h2><p className="mt-4 max-w-xl leading-7 text-muted-foreground">Give every visitor a simple way to confirm they are dealing with the right business on the right domain.</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{[[Globe2, "Domain Verified"], [Building2, "Business Profile"], [CircleCheck, "Active Status"], [BadgeCheck, "Verification Date"]].map(([Icon, text]) => { const FeatureIcon = Icon as typeof Globe2; return <div key={text as string} className="flex items-center gap-3 rounded-md border border-border bg-surface p-4 text-sm font-semibold shadow-sm"><span className="grid size-9 place-items-center rounded-md bg-success-soft text-success"><FeatureIcon size={18} /></span>{text as string}</div>})}</div></div>
            <div className="rounded-lg border border-border bg-surface p-3 shadow-2xl shadow-navy/10"><div className="rounded-md border border-border"><div className="flex items-center justify-between border-b border-border p-5"><div><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Public verification profile</p><h3 className="mt-1 font-bold text-navy">ABC Technologies Pvt. Ltd.</h3></div><span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1.5 text-xs font-bold text-success"><BadgeCheck size={14} /> Domain Verified</span></div><dl className="divide-y divide-border p-5">{[["Website", "abccompany.com"], ["Status", "Active"], ["Verified", "September 2026"], ["Verification ID", "BV-982143"]].map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4 py-4"><dt className="text-sm text-muted-foreground">{label}</dt><dd className="flex items-center gap-2 text-right text-sm font-semibold text-foreground">{label === "Status" && <span className="status-pulse size-2 rounded-full bg-success" />}{value}</dd></div>)}</dl><div className="mx-5 mb-5 flex items-center gap-2 rounded-md bg-muted px-4 py-3 text-xs text-muted-foreground"><ShieldCheck size={16} className="text-primary" /> This profile is cryptographically linked to the domain above.</div></div></div></div>
        </ScrollReveal>
      </section>

      <section id="use-cases" className="bg-surface py-20 lg:py-28">
        <ScrollReveal>
          <div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="text-center"><p className="text-xs font-bold uppercase tracking-widest text-primary">Built for credibility</p><h2 className="mt-3 text-3xl font-bold text-navy sm:text-4xl">Designed For Modern Businesses</h2></div><div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{useCases.map((item, i) => <details key={item.title} open={i === 0} className="group relative overflow-hidden rounded-lg border border-border bg-navy text-primary-foreground shadow-xl"><summary className="flex cursor-pointer list-none items-center gap-3 p-6 text-left font-semibold [&::-webkit-details-marker]:hidden"><span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground"><item.icon size={19} /></span><span>{item.title}</span><ChevronDown className="ml-auto shrink-0 text-primary-foreground/60 transition-transform group-open:rotate-180" size={18} /></summary><div className="px-6 pb-6"><p className="leading-7 text-primary-foreground/70">{item.text}</p><a href="#cta" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary-foreground">Verify your business <ArrowRight size={16} /></a></div></details>)}</div></div>
        </ScrollReveal>
      </section>

      <section id="faq" className="border-t border-border bg-background py-20 lg:py-28">
        <ScrollReveal>
          <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[.7fr_1.3fr] lg:px-8"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">FAQ</p><h2 className="mt-3 text-3xl font-bold text-navy sm:text-4xl">Questions, answered.</h2><p className="mt-4 leading-7 text-muted-foreground">Everything you need to understand domain verification and your public badge.</p></div><div className="border-t border-border">{faqs.map(([q, a], i) => <details key={q} open={i === 0} className="group border-b border-border"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-semibold text-navy [&::-webkit-details-marker]:hidden"><span>{q}</span><ChevronDown size={18} className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180 group-open:text-primary" /></summary><div className="pb-5"><p className="pr-10 text-sm leading-6 text-muted-foreground">{a}</p></div></details>)}</div></div>
        </ScrollReveal>
      </section>

      <section id="cta" className="bg-surface px-5 py-16 lg:px-8">
        <ScrollReveal>
          <div className="mx-auto max-w-7xl overflow-hidden rounded-lg bg-navy px-6 py-14 text-center text-primary-foreground sm:px-12"><ShieldCheck className="mx-auto text-primary" size={32} /><h2 className="mt-5 text-3xl font-bold sm:text-4xl">Simple Verification. Visible Trust.</h2><p className="mx-auto mt-4 max-w-xl text-primary-foreground/70">Your customers shouldn't have to guess whether they're visiting the right business website.</p><a href="#top" className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg transition hover:-translate-y-0.5">Get Verified Now <ArrowRight size={17} /></a></div>
        </ScrollReveal>
      </section>

      <footer className="border-t border-border bg-background"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8"><div><a href="#top" className="flex items-center gap-2 font-bold text-navy"><span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground"><ShieldCheck size={18} /></span>BizVerify</a><p className="mt-4 text-sm text-muted-foreground">Create. Verify. Build Trust.</p></div><div><p className="text-xs font-bold uppercase tracking-wider text-navy">Product</p><div className="mt-4 grid gap-3 text-sm text-muted-foreground"><a href="#how">How it Works</a><a href="#features">Features</a><a href="#use-cases">Use Cases</a></div></div><div><p className="text-xs font-bold uppercase tracking-wider text-navy">Company</p><div className="mt-4 grid gap-3 text-sm text-muted-foreground"><a href="#faq">FAQ</a><a href="#">Privacy</a><a href="#">Terms</a></div></div><div><p className="text-xs font-bold uppercase tracking-wider text-navy">System status</p><div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><span className="status-pulse size-2 rounded-full bg-success" /> All systems operational</div><p className="mt-5 text-xs leading-5 text-muted-foreground">Independent domain verification. Not a government certification or endorsement.</p></div></div><div className="border-t border-border"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8"><p>© 2026 BizVerify. All rights reserved.</p><p>Domain trust, made visible.</p></div></div></footer>
    </main>
  );
}
