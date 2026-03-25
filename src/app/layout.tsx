import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Discipline Cut",
    template: "%s | Discipline Cut",
  },
  description:
    "A personal weight loss accountability dashboard focused on consistency, streaks, and clean daily tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="relative min-h-screen overflow-x-hidden">
          <div className="discipline-grid pointer-events-none absolute inset-0 opacity-35" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/35 to-transparent" />
          <Navigation />
          <main className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
