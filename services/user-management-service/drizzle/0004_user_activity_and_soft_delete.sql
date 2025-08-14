-- Add soft-delete columns to users
ALTER TABLE users ADD COLUMN is_deleted integer NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN deleted_at integer;

-- Create user_activity table
CREATE TABLE IF NOT EXISTS user_activity (
  id text PRIMARY KEY NOT NULL,
  user_id text NOT NULL,
  actor_user_id text,
  action text NOT NULL,
  before_json text,
  after_json text,
  created_at integer NOT NULL DEFAULT (strftime('%s', 'now')),
  CONSTRAINT user_activity_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT user_activity_actor_fk FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
);
