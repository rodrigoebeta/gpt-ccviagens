CREATE TABLE `trip_uploads` (
	`id` text PRIMARY KEY NOT NULL,
	`trip_id` text NOT NULL,
	`object_keys` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `trip_uploads_trip` ON `trip_uploads` (`trip_id`);