
-- Table: organizations
CREATE TABLE organizations (
  id NUMBER PRIMARY KEY,
  name VARCHAR2(255),
  contact_email VARCHAR2(255),
  phone VARCHAR2(20),
  address CLOB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE SEQUENCE seq_organizations START WITH 1 INCREMENT BY 1;

-- Table: users
CREATE TABLE users (
  id NUMBER PRIMARY KEY,
  email VARCHAR2(255) UNIQUE NOT NULL,
  password_hash VARCHAR2(255),
  name VARCHAR2(255),
  phone VARCHAR2(20),
  role VARCHAR2(50) DEFAULT 'guest',
  is_verified NUMBER(1) DEFAULT 0,
  registered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE SEQUENCE seq_users START WITH 1 INCREMENT BY 1;

-- Table: user_organizations
CREATE TABLE user_organizations (
  id NUMBER PRIMARY KEY,
  user_id NUMBER,
  organization_id NUMBER,
  role VARCHAR2(50)
);
CREATE SEQUENCE seq_user_organizations START WITH 1 INCREMENT BY 1;

-- Table: events
CREATE TABLE events (
  id NUMBER PRIMARY KEY,
  organization_id NUMBER,
  name VARCHAR2(255),
  description CLOB,
  event_date DATE,
  location VARCHAR2(255)
);
CREATE SEQUENCE seq_events START WITH 1 INCREMENT BY 1;

-- Table: event_settings
CREATE TABLE event_settings (
  id NUMBER PRIMARY KEY,
  event_id NUMBER,
  setting_key VARCHAR2(100) NOT NULL,
  setting_value CLOB,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE SEQUENCE seq_event_settings START WITH 1 INCREMENT BY 1;

-- Table: tickets
CREATE TABLE tickets (
  id NUMBER PRIMARY KEY,
  event_id NUMBER,
  name VARCHAR2(255),
  price NUMBER(10, 2),
  type VARCHAR2(50),
  total NUMBER,
  sold NUMBER,
  start_sale_date TIMESTAMP,
  end_sale_date TIMESTAMP,
  is_active NUMBER(1) DEFAULT 1
);
CREATE SEQUENCE seq_tickets START WITH 1 INCREMENT BY 1;

-- Table: orders
CREATE TABLE orders (
  id NUMBER PRIMARY KEY,
  user_id NUMBER,
  status VARCHAR2(50),
  payment_method VARCHAR2(50),
  amount NUMBER(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE SEQUENCE seq_orders START WITH 1 INCREMENT BY 1;

-- Table: order_items
CREATE TABLE order_items (
  id NUMBER PRIMARY KEY,
  order_id NUMBER,
  ticket_id NUMBER,
  quantity NUMBER,
  price_snapshot NUMBER(10, 2)
);
CREATE SEQUENCE seq_order_items START WITH 1 INCREMENT BY 1;

-- Table: payments
CREATE TABLE payments (
  id NUMBER PRIMARY KEY,
  order_id NUMBER,
  gateway VARCHAR2(50),
  status VARCHAR2(50),
  txn_code VARCHAR2(100),
  paid_at TIMESTAMP
);
CREATE SEQUENCE seq_payments START WITH 1 INCREMENT BY 1;

-- Table: checkin_logs
CREATE TABLE checkin_logs (
  id NUMBER PRIMARY KEY,
  user_id NUMBER,
  ticket_id NUMBER,
  event_id NUMBER,
  checkin_time TIMESTAMP,
  verified_by VARCHAR2(100)
);
CREATE SEQUENCE seq_checkin_logs START WITH 1 INCREMENT BY 1;

-- Table: promo_codes
CREATE TABLE promo_codes (
  id NUMBER PRIMARY KEY,
  code VARCHAR2(100) UNIQUE NOT NULL,
  description CLOB,
  discount_type VARCHAR2(50),
  discount_value NUMBER(10, 2),
  max_uses NUMBER DEFAULT 1,
  uses NUMBER DEFAULT 0,
  valid_from TIMESTAMP,
  valid_until TIMESTAMP,
  is_active NUMBER(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE SEQUENCE seq_promo_codes START WITH 1 INCREMENT BY 1;

-- Table: order_promos
CREATE TABLE order_promos (
  id NUMBER PRIMARY KEY,
  order_id NUMBER,
  promo_code_id NUMBER,
  discount_applied NUMBER(10, 2)
);
CREATE SEQUENCE seq_order_promos START WITH 1 INCREMENT BY 1;

-- Table: referral_codes
CREATE TABLE referral_codes (
  id NUMBER PRIMARY KEY,
  user_id NUMBER,
  code VARCHAR2(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE SEQUENCE seq_referral_codes START WITH 1 INCREMENT BY 1;

-- Table: email_logs
CREATE TABLE email_logs (
  id NUMBER PRIMARY KEY,
  user_id NUMBER,
  event_id NUMBER,
  email_type VARCHAR2(50),
  subject VARCHAR2(255),
  status VARCHAR2(50),
  sent_at TIMESTAMP,
  error_message CLOB
);
CREATE SEQUENCE seq_email_logs START WITH 1 INCREMENT BY 1;

-- Table: webhook_logs
CREATE TABLE webhook_logs (
  id NUMBER PRIMARY KEY,
  target_url VARCHAR2(500),
  event_type VARCHAR2(50),
  order_id NUMBER,
  event_id NUMBER,
  user_id NUMBER,
  payload CLOB,
  status_code NUMBER,
  response_text CLOB,
  triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE SEQUENCE seq_webhook_logs START WITH 1 INCREMENT BY 1;

-- Table: webhook_subscriptions
CREATE TABLE webhook_subscriptions (
  id NUMBER PRIMARY KEY,
  organization_id NUMBER,
  target_url VARCHAR2(500),
  event_type VARCHAR2(50),
  is_active NUMBER(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE SEQUENCE seq_webhook_subscriptions START WITH 1 INCREMENT BY 1;

-- Table: tracking_visits
CREATE TABLE tracking_visits (
  id NUMBER PRIMARY KEY,
  user_id NUMBER,
  event_id NUMBER,
  utm_source VARCHAR2(100),
  utm_medium VARCHAR2(100),
  utm_campaign VARCHAR2(100),
  utm_content VARCHAR2(100),
  referrer_url CLOB,
  landing_page CLOB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE SEQUENCE seq_tracking_visits START WITH 1 INCREMENT BY 1;

-- Foreign Keys
ALTER TABLE user_organizations ADD FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE user_organizations ADD FOREIGN KEY (organization_id) REFERENCES organizations(id);
ALTER TABLE events ADD FOREIGN KEY (organization_id) REFERENCES organizations(id);
ALTER TABLE event_settings ADD FOREIGN KEY (event_id) REFERENCES events(id);
ALTER TABLE tickets ADD FOREIGN KEY (event_id) REFERENCES events(id);
ALTER TABLE orders ADD FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE order_items ADD FOREIGN KEY (order_id) REFERENCES orders(id);
ALTER TABLE order_items ADD FOREIGN KEY (ticket_id) REFERENCES tickets(id);
ALTER TABLE payments ADD FOREIGN KEY (order_id) REFERENCES orders(id);
ALTER TABLE checkin_logs ADD FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE checkin_logs ADD FOREIGN KEY (ticket_id) REFERENCES tickets(id);
ALTER TABLE checkin_logs ADD FOREIGN KEY (event_id) REFERENCES events(id);
ALTER TABLE order_promos ADD FOREIGN KEY (order_id) REFERENCES orders(id);
ALTER TABLE order_promos ADD FOREIGN KEY (promo_code_id) REFERENCES promo_codes(id);
ALTER TABLE referral_codes ADD FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE email_logs ADD FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE email_logs ADD FOREIGN KEY (event_id) REFERENCES events(id);
ALTER TABLE webhook_logs ADD FOREIGN KEY (order_id) REFERENCES orders(id);
ALTER TABLE webhook_logs ADD FOREIGN KEY (event_id) REFERENCES events(id);
ALTER TABLE webhook_logs ADD FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE webhook_subscriptions ADD FOREIGN KEY (organization_id) REFERENCES organizations(id);
ALTER TABLE tracking_visits ADD FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE tracking_visits ADD FOREIGN KEY (event_id) REFERENCES events(id);
