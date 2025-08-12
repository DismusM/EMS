-- Create the 'roles' table
CREATE TABLE `roles` (
    `id` text PRIMARY KEY NOT NULL,
    `name` text NOT NULL
);

-- Create the 'users' table
CREATE TABLE `users` (
    `id` text PRIMARY KEY NOT NULL,
    `name` text NOT NULL,
    `email` text NOT NULL,
    `password_hash` text NOT NULL,
    `role_id` text NOT NULL,
    `created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
    `updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
    FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action
);

-- Create unique index for user email
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);

-- Create unique index for role name
CREATE UNIQUE INDEX `roles_name_unique` ON `roles` (`name`);
