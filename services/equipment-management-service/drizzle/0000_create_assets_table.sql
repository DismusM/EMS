-- Create the 'assets' table
CREATE TABLE `assets` (
    `id` text PRIMARY KEY NOT NULL,
    `name` text NOT NULL,
    `model` text,
    `serial_number` text NOT NULL,
    `location` text,
    `status` text NOT NULL, -- e.g., 'OPERATIONAL', 'IN_REPAIR', 'DECOMMISSIONED'
    `purchase_date` integer, -- Stored as a Unix timestamp
    `created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
    `updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);

-- Create an index on status for faster querying
CREATE INDEX `assets_status_idx` ON `assets` (`status`);

-- Create a unique index on serial_number to prevent duplicates
CREATE UNIQUE INDEX `assets_serial_number_unique` ON `assets` (`serial_number`);
