-- Seed the 'roles' table with all defined roles
INSERT INTO `roles` (`id`, `name`) VALUES
('admin', 'Admin'),
('supervisor', 'Supervisor'),
('technician', 'Technician'),
('asset_manager', 'Asset Manager'),
('client', 'Client');

-- Seed the first admin user
-- The password is 'admin'. The hash was generated externally.
-- In a real-world scenario, this should be a one-time setup script with a secure, randomly generated password.
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role_id`) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Default Admin', 'admin@example.com', '$2a$10$7bS.ih.pC2hedUrycQ9s9.M6nDT./v26fV0yvQd1d2s.J5.j.xYwS', 'admin');
