CREATE TABLE `central_installation` (
	`singleton` integer PRIMARY KEY NOT NULL,
	`id` text NOT NULL,
	`token` text NOT NULL,
	`next_attempt_at` integer DEFAULT 0 NOT NULL,
	`last_sent_at` integer,
	`release_json` text,
	`release_checked_at` integer DEFAULT 0 NOT NULL
);
