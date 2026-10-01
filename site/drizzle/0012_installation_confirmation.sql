ALTER TABLE central_installation ADD COLUMN terms_version TEXT;
--> statement-breakpoint
ALTER TABLE central_installation ADD COLUMN terms_accepted_at TEXT;
--> statement-breakpoint
ALTER TABLE central_installation ADD COLUMN confirmed_terms_version TEXT;
