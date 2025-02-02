import { drizzle } from "drizzle-orm/libsql";
import { Resource } from "sst";

export const db = drizzle({
  connection: {
    url: Resource.DATABASE_URL.value,
    authToken: Resource.DATABASE_AUTH_TOKEN.value,
  },
});

export * from "drizzle-orm";
export * from "./schema";
