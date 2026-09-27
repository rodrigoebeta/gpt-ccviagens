CREATE TABLE `day_orders` (
	`trip_id` text NOT NULL,
	`day` text NOT NULL,
	`event_ids` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	PRIMARY KEY(`trip_id`, `day`),
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE no action
);
