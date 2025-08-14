-- Add new columns to assets
ALTER TABLE assets ADD COLUMN department TEXT;
ALTER TABLE assets ADD COLUMN building TEXT;
ALTER TABLE assets ADD COLUMN room TEXT;
ALTER TABLE assets ADD COLUMN custodian_id TEXT;
ALTER TABLE assets ADD COLUMN custodian_name TEXT;

-- Create asset_activity table for audit trail
CREATE TABLE IF NOT EXISTS asset_activity (
  id TEXT PRIMARY KEY NOT NULL,
  asset_id TEXT NOT NULL,
  action TEXT NOT NULL,
  actor_user_id TEXT,
  before_json TEXT,
  after_json TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);
