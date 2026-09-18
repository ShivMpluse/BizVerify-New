import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">404</p>
        <h1 className="mt-4 text-4xl font-bold text-foreground">Page not found</h1>
        <p className="mt-3 text-muted-foreground">
          The page you are looking for does not exist or may have moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-95"
        >
          Go back home
        </Link>
      </div>
    </main>
  );
}
