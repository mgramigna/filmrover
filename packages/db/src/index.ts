import { drizzle } from "drizzle-orm/libsql";

export const db = drizzle({
  connection: {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    url: process.env.DATABASE_URL!,
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
});

export * from "drizzle-orm";
export * from "./schema";
