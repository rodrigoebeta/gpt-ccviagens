CREATE TABLE `user_preferences` (
	`user_id` text PRIMARY KEY NOT NULL,
	`cover_key` text,
	`cover_version` integer DEFAULT 0 NOT NULL
);
