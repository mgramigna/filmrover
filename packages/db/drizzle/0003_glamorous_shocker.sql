CREATE TABLE `daily_challenge` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`is_active` integer,
	`start_movie_id` integer,
	`end_movie_id` integer,
	`start_person_id` integer,
	`end_person_id` integer
);
