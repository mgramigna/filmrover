PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_daily_challenge` (
	`id` text(26) PRIMARY KEY NOT NULL,
	`is_active` integer,
	`start_movie_id` integer,
	`end_movie_id` integer,
	`start_person_id` integer,
	`end_person_id` integer
);
--> statement-breakpoint
INSERT INTO `__new_daily_challenge`("id", "is_active", "start_movie_id", "end_movie_id", "start_person_id", "end_person_id") SELECT "id", "is_active", "start_movie_id", "end_movie_id", "start_person_id", "end_person_id" FROM `daily_challenge`;--> statement-breakpoint
DROP TABLE `daily_challenge`;--> statement-breakpoint
ALTER TABLE `__new_daily_challenge` RENAME TO `daily_challenge`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_games` (
	`id` text(26) PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`start_movie_id` integer,
	`end_movie_id` integer,
	`start_person_id` integer,
	`end_person_id` integer,
	`is_finished` integer
);
--> statement-breakpoint
INSERT INTO `__new_games`("id", "created_at", "start_movie_id", "end_movie_id", "start_person_id", "end_person_id", "is_finished") SELECT "id", "created_at", "start_movie_id", "end_movie_id", "start_person_id", "end_person_id", "is_finished" FROM `games`;--> statement-breakpoint
DROP TABLE `games`;--> statement-breakpoint
ALTER TABLE `__new_games` RENAME TO `games`;