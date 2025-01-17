import type { Config } from "drizzle-kit";
import { Resource } from "sst";

export default {
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: Resource.DATABASE_URL.value,
    authToken: Resource.DATABASE_AUTH_TOKEN.value,
  },
} satisfies Config;
