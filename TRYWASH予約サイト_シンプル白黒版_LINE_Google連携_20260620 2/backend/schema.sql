-- TRY WASH reservation / admin / staff evaluation shared database.
-- Target: PostgreSQL 15+. Keep LINE secrets and DB credentials in environment variables, not in this schema.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id TEXT NOT NULL DEFAULT 'yokosuka',
  name TEXT NOT NULL,
  phone TEXT,
  postal_code TEXT,
  address TEXT,
  body_color TEXT,
  visit_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS line_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id TEXT NOT NULL DEFAULT 'yokosuka',
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  line_user_id TEXT NOT NULL UNIQUE,
  display_name TEXT,
  picture_url TEXT,
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id TEXT NOT NULL DEFAULT 'yokosuka',
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  model_name TEXT,
  vehicle_number TEXT,
  size_id TEXT,
  size_name TEXT,
  body_color TEXT,
  storage_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id TEXT NOT NULL DEFAULT 'yokosuka',
  local_id TEXT UNIQUE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  line_user_id UUID REFERENCES line_users(id) ON DELETE SET NULL,
  source TEXT NOT NULL DEFAULT 'user',
  status TEXT NOT NULL DEFAULT 'new',
  category TEXT NOT NULL,
  menu_id TEXT,
  menu_name TEXT NOT NULL,
  vehicle_size_id TEXT,
  vehicle_size_name TEXT,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  loaner_required BOOLEAN NOT NULL DEFAULT false,
  total_price INTEGER NOT NULL DEFAULT 0,
  options_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  options_summary TEXT,
  same_day_change_note TEXT,
  admin_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  change_history_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  canceled_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS reservation_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  option_id TEXT NOT NULL,
  option_name TEXT NOT NULL,
  choice_id TEXT,
  choice_name TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id TEXT NOT NULL DEFAULT 'yokosuka',
  name TEXT NOT NULL,
  role TEXT,
  employment_type TEXT,
  hire_date DATE,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS staff_work_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id TEXT NOT NULL DEFAULT 'yokosuka',
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
  staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  work_date DATE NOT NULL,
  work_started_at TIMESTAMPTZ,
  work_ended_at TIMESTAMPTZ,
  work_minutes INTEGER NOT NULL DEFAULT 0,
  work_content TEXT,
  menu_name TEXT,
  option_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS staff_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id TEXT NOT NULL DEFAULT 'yokosuka',
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
  staff_work_log_id UUID REFERENCES staff_work_logs(id) ON DELETE SET NULL,
  staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
  evaluation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  quality_score NUMERIC(3, 1) NOT NULL DEFAULT 0,
  speed_score NUMERIC(3, 1) NOT NULL DEFAULT 0,
  customer_service_score NUMERIC(3, 1) NOT NULL DEFAULT 0,
  admin_comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id TEXT NOT NULL DEFAULT 'yokosuka',
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  line_user_id UUID REFERENCES line_users(id) ON DELETE SET NULL,
  channel TEXT NOT NULL DEFAULT 'line',
  audience TEXT NOT NULL DEFAULT 'customer',
  message_type TEXT NOT NULL,
  title TEXT,
  body TEXT NOT NULL,
  send_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  created_by TEXT NOT NULL DEFAULT 'system',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_line_users_line_user_id ON line_users(line_user_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_customer_id ON vehicles(customer_id);
CREATE INDEX IF NOT EXISTS idx_reservations_period ON reservations(start_at, end_at);
CREATE INDEX IF NOT EXISTS idx_reservations_customer_id ON reservations(customer_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservation_options_reservation_id ON reservation_options(reservation_id);
CREATE INDEX IF NOT EXISTS idx_staff_work_logs_reservation_id ON staff_work_logs(reservation_id);
CREATE INDEX IF NOT EXISTS idx_staff_evaluations_staff_id ON staff_evaluations(staff_id);
CREATE INDEX IF NOT EXISTS idx_messages_send_at ON messages(status, send_at);
