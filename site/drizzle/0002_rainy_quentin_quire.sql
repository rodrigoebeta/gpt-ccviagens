CREATE TABLE `integration_settings` (
	`name` text PRIMARY KEY NOT NULL,
	`instance_id` text NOT NULL,
	`next_request_at` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `place_search_cache` (
	`query_hash` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`expires_at` integer NOT NULL
);
