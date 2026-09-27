ALTER TABLE `reservations` ADD `manual_override` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `trips` ADD `cover_key` text;--> statement-breakpoint
ALTER TABLE `trips` ADD `cover_version` integer DEFAULT 0 NOT NULL;