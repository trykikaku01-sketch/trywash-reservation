export const schemaStatements = [
  "CREATE TABLE IF NOT EXISTS reservations (store_id TEXT NOT NULL, local_id TEXT NOT NULL, start_at TEXT NOT NULL, end_at TEXT NOT NULL, booking_json TEXT NOT NULL, updated_at TEXT NOT NULL, PRIMARY KEY (store_id, local_id))",
  "CREATE INDEX IF NOT EXISTS idx_reservations_store_start ON reservations (store_id, start_at)",
  "CREATE TABLE IF NOT EXISTS messages (store_id TEXT NOT NULL, id TEXT NOT NULL, reservation_id TEXT, message_json TEXT NOT NULL, send_at TEXT, status TEXT NOT NULL DEFAULT 'pending', updated_at TEXT NOT NULL, PRIMARY KEY (store_id, id))",
  "CREATE INDEX IF NOT EXISTS idx_messages_store_send ON messages (store_id, status, send_at)",
  "CREATE TABLE IF NOT EXISTS line_users (store_id TEXT NOT NULL, line_user_id TEXT NOT NULL, line_user_json TEXT NOT NULL, updated_at TEXT NOT NULL, PRIMARY KEY (store_id, line_user_id))",
  "CREATE TABLE IF NOT EXISTS staff_evaluation_snapshots (store_id TEXT PRIMARY KEY, snapshot_json TEXT NOT NULL, updated_at TEXT NOT NULL)",
];
