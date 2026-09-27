CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`reservation_id` text NOT NULL,
	`object_key` text NOT NULL,
	`filename` text NOT NULL,
	`mime` text NOT NULL,
	`label` text NOT NULL,
	`bytes` integer NOT NULL,
	`sha256` text NOT NULL,
	FOREIGN KEY (`reservation_id`) REFERENCES `reservations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `documents_reservation_hash` ON `documents` (`reservation_id`,`sha256`);--> statement-breakpoint
CREATE TABLE `members` (
	`trip_id` text NOT NULL,
	`email` text NOT NULL,
	`user_id` text,
	`role` text NOT NULL,
	PRIMARY KEY(`trip_id`, `email`),
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reservations` (
	`id` text PRIMARY KEY NOT NULL,
	`trip_id` text NOT NULL,
	`source_key` text NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`data` text NOT NULL,
	`fingerprint` text NOT NULL,
	`imported_at` text NOT NULL,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reservations_trip_source` ON `reservations` (`trip_id`,`source_key`);--> statement-breakpoint
CREATE TABLE `trips` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`destinations` text NOT NULL,
	`created_at` text NOT NULL
);
