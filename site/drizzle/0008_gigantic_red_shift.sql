CREATE TABLE `reservation_locations` (
	`key` text PRIMARY KEY NOT NULL,
	`trip_id` text NOT NULL,
	`reservation_id` text NOT NULL,
	`input_hash` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`point` text,
	`note` text DEFAULT '' NOT NULL,
	`lease` text,
	`lease_until` integer DEFAULT 0 NOT NULL,
	`retry_at` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reservation_id`) REFERENCES `reservations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `reservation_locations_trip` ON `reservation_locations` (`trip_id`);