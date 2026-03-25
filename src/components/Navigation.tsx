"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/progress", label: "Progress" },
  { href: "/review", label: "Weekly Review" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-black/6 bg-white/55 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="rounded-full border border-black/10 bg-black px-3 py-1 font-mono text-xs uppercase tracking-[0.32em] text-white">
              Cut
            </span>
            <div>
              <p className="text-sm font-semibold tracking-[0.08em] text-[var(--foreground)] uppercase">
                Discipline Cut
              </p>
              <p className="text-xs text-[var(--muted)]">
                Personal weight loss accountability
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex flex-wrap gap-2">
          {links.map((link) => {
            const active = isActive(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-black text-white shadow-lg shadow-black/10"
                    : "bg-white/70 text-[var(--muted)] hover:bg-white hover:text-[var(--foreground)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
