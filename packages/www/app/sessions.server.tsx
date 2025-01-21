import { createCookieSessionStorage } from "@remix-run/node";
import { createThemeSessionResolver } from "remix-themes";
import { Resource } from "sst";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__remix-themes",
    domain: process.env.STAGE === "production" ? process.env.DOMAIN : undefined,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: [Resource.REMIX_COOKIE_SECRET.value],
    secure: process.env.STAGE === "production",
  },
});

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
