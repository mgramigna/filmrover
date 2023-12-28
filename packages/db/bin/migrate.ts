import { migrate } from "drizzle-orm/libsql/migrator";

import { db } from "../src";

await migrate(db, { migrationsFolder: "drizzle" });
