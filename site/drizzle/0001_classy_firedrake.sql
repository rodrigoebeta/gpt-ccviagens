CREATE TABLE `place_lists` (
	`id` text PRIMARY KEY NOT NULL,
	`trip_id` text NOT NULL,
	`name` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `place_lists_trip` ON `place_lists` (`trip_id`);--> statement-breakpoint
CREATE TABLE `places` (
	`id` text PRIMARY KEY NOT NULL,
	`trip_id` text NOT NULL,
	`data` text NOT NULL,
	`date` text,
	`position` real DEFAULT 0 NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `places_trip_date` ON `places` (`trip_id`,`date`);--> statement-breakpoint
CREATE TABLE `reservation_changes` (
	`id` text PRIMARY KEY NOT NULL,
	`reservation_id` text NOT NULL,
	`data` text NOT NULL,
	`changed_at` text NOT NULL,
	`action` text NOT NULL,
	FOREIGN KEY (`reservation_id`) REFERENCES `reservations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`trip_id` text NOT NULL,
	`reservation_id` text NOT NULL,
	`object_key` text NOT NULL,
	`reason` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`base_fingerprint` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `reviews_trip_status` ON `reviews` (`trip_id`,`status`);--> statement-breakpoint
ALTER TABLE `reservations` ADD `status` text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE `reservations` ADD `updated_at` text;