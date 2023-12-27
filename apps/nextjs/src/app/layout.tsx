import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/styles/globals.css";

import { cache } from "react";
import { headers } from "next/headers";

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

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={["font-sans", fontSans.variable].join(" ")}>
        <TRPCReactProvider headersPromise={getHeaders()}>
          {props.children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
