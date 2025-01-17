import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    url: process.env.DATABASE_URL!,
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
} satisfies Config;
