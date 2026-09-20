import Link from "next/link";
import { ArrowRight } from "lucide-react";

const suggestions = [
  { label: "Know the Law", href: "/know-the-law" },
  { label: "Your Rights", href: "/your-rights" },
  { label: "Business & Enterprise", href: "/business" },
  { label: "Legal Help", href: "/legal-help" },
];

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-20 text-center">
      <div
        aria-hidden
        className="bg-ledger mask-fade-b pointer-events-none absolute inset-x-0 top-0 h-96 opacity-40"
      />
      <p className="text-eyebrow relative text-brand-ink">Error 404</p>
      <h1 className="text-h1 relative mt-4 max-w-2xl text-foreground">
        This page is not in the library
      </h1>
      <p className="relative mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
        The link may be old, or the page may have moved. These sections are a
        good place to pick the thread back up.
      </p>
      <div className="relative mt-8 flex flex-wrap justify-center gap-2.5">
        {suggestions.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-hairline bg-card px-4 py-2.5 text-[0.85rem] font-bold text-foreground transition-colors hover:border-primary/45"
          >
            {item.label}
          </Link>
        ))}
      </div>
      <Link
        href="/"
        className="relative mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-[0.92rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
      >
        Back to home
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
