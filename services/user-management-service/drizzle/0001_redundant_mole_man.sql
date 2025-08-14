ALTER TABLE `users` ADD `status` text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `status_changed_at` integer;