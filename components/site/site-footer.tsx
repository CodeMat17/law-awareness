import Image from "next/image";
import Link from "next/link";
import { footerColumns } from "@/lib/content/data";
import { ThemeToggle } from "./theme-toggle";

const social = [
  { label: "YouTube", href: "https://youtube.com" },
  { label: "X", href: "https://x.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Instagram", href: "https://instagram.com" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="overflow-x-clip border-t border-hairline bg-surface">
      <div className="rail py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_2.3fr] lg:gap-16">
          <div>
            <Link
              href="/"
              aria-label="Law Awareness TV, home"
              className="inline-flex items-center gap-3"
            >
              <Image
                src="/logo-2.webp"
                alt=""
                width={931}
                height={268}
                className="h-7 w-auto rounded object-contain invert dark:invert-0"
              />
            
            </Link>
            <p className="mt-2 max-w-xs text-[0.88rem] leading-relaxed text-muted-foreground">
              A Nigerian digital legal education, awareness, compliance and
              legal-media platform.
            </p>
            <p className="text-eyebrow mt-6 text-brand-ink">
              Know · Protect · Act
            </p>
            {/* <div className="mt-6 flex items-center gap-3">
              <ThemeToggle />
              <span className="text-[0.8rem] font-semibold text-muted-foreground">
                Light / dark
              </span>
            </div> */}
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {footerColumns.map((column) => (
              <div key={column.heading}>
                <h2 className="text-eyebrow text-foreground">{column.heading}</h2>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={`${column.heading}-${link.href}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="text-[0.85rem] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8rem] text-muted-foreground">
            © {year} Law Awareness TV. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {/*
              Admin entry point. The proxy protects /admin, so an
              unauthenticated click lands on the sign-in page and comes back
              here once the session exists.
            */}
            <li>
              <Link
                href="/admin"
                className="text-[0.8rem] font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Admin
              </Link>
            </li>
            {social.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.8rem] font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
