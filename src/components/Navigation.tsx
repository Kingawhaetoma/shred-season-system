"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/progress", label: "Trajectory" },
  { href: "/review", label: "Weekly Audit" },
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
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[rgba(246,243,238,0.92)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="space-y-1.5">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="type-eyebrow type-eyebrow-accent tracking-[0.4em]">
              Shred Season
            </span>
          </Link>
          <p className="text-[13px] leading-5 tracking-[0.01em] text-[var(--secondary)]">
            Private performance system
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-1.5 rounded-full border border-[var(--border)] bg-[rgba(251,250,247,0.56)] p-1">
          {links.map((link) => {
            const active = isActive(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`type-nav-link nav-link font-medium ${
                  active
                    ? "nav-link-active"
                    : ""
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
