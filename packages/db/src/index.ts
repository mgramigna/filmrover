import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const client = createClient({
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  url: process.env.DATABASE_URL!,
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  authToken: process.env.DATABASE_AUTH_TOKEN!,
});

export const db = drizzle(client);

export * from "drizzle-orm";
export * from "./schema";
