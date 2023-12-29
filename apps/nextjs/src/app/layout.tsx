import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/styles/globals.css";

import { cache } from "react";
import { headers } from "next/headers";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { TRPCReactProvider } from "@/trpc/react";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_ENV === "production"
      ? "https://example.com/todo-prod-url"
      : "http://localhost:3000",
  ),
  title: "FilmRover",
  description: "Wikipedia game, but for movies!",
  openGraph: {
    title: "FilmRover",
    description: "Wikipedia game, but for movies!",
    url: "https://exmaple.com/todo-prod-url",
    siteName: "FilmRover",
  },
};

// Lazy load headers
const getHeaders = cache(() => Promise.resolve(headers()));

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn([
          "font-sans",
          fontSans.variable,
          "dark bg-gradient-to-b from-slate-800 to-slate-950 text-white",
        ])}
      >
        <TRPCReactProvider headersPromise={getHeaders()}>
          <nav className="flex h-12 items-center bg-slate-900">
            <Link
              href="/"
              className="ml-4 text-xl font-extrabold tracking-tight"
            >
              FilmRover
            </Link>
          </nav>
          <main className="flex h-[calc(100dvh-48px)] flex-col items-center overflow-y-scroll">
            {children}
          </main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
