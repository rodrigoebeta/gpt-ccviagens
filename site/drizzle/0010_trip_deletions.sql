CREATE TABLE `trip_deletions` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`confirm_name` text NOT NULL,
	`object_keys` text NOT NULL,
	`created_at` text NOT NULL
);
