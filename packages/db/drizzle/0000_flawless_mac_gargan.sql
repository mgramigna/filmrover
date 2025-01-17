CREATE TABLE `daily_challenge` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`is_active` integer,
	`start_movie_id` integer,
	`end_movie_id` integer,
	`start_person_id` integer,
	`end_person_id` integer
);
--> statement-breakpoint
CREATE TABLE `games` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`start_movie_id` integer,
	`end_movie_id` integer,
	`start_person_id` integer,
	`end_person_id` integer,
	`is_finished` integer
);
