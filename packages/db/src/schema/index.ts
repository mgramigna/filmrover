import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { ulid } from "ulid";

const id = (name: string) => text(name, { length: 26 });

const idColumn = (name: string) =>
  id(name)
    .primaryKey()
    .$defaultFn(() => ulid());

export const games = sqliteTable("games", {
  id: idColumn("id").primaryKey(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  startMovieId: int("start_movie_id"),
  endMovieId: int("end_movie_id"),
  startPersonId: int("start_person_id"),
  endPersonId: int("end_person_id"),
  isFinished: int("is_finished", { mode: "boolean" }),
});

export const dailyChallenge = sqliteTable("daily_challenge", {
  id: idColumn("id").primaryKey(),
  isActive: int("is_active", { mode: "boolean" }),
  startMovieId: int("start_movie_id"),
  endMovieId: int("end_movie_id"),
  startPersonId: int("start_person_id"),
  endPersonId: int("end_person_id"),
});
