-- RuPay Select Tracker - Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== CARDS TABLE ====================
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  bank VARCHAR(100) NOT NULL,
  last4 VARCHAR(4) NOT NULL,
  variant VARCHAR(20) DEFAULT 'select' CHECK (variant IN ('select', 'platinum', 'classic', 'gold')),
  card_name VARCHAR(255),
  issue_date DATE,
  expiry_date DATE,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== VOUCHERS TABLE ====================
CREATE TABLE vouchers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cycle_type VARCHAR(20) NOT NULL CHECK (cycle_type IN ('monthly', 'quarterly', 'half-yearly', 'yearly')),
  category VARCHAR(50),
  value DECIMAL(10, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'redeemed', 'sold', 'paused', 'expired')),
  reminder_days INTEGER DEFAULT 7,
  expiry_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== VOUCHER PERIODS TABLE ====================
CREATE TABLE voucher_periods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voucher_id UUID REFERENCES vouchers(id) ON DELETE CASCADE NOT NULL,
  period VARCHAR(20) NOT NULL,
  label VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'redeemed', 'sold', 'paused', 'expired')),
  redeemed_at TIMESTAMPTZ,
  sold_at TIMESTAMPTZ,
  sold_to VARCHAR(255),
  sold_amount DECIMAL(10, 2),
  expiry_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(voucher_id, period)
);

-- ==================== USER PROFILES TABLE ====================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  default_currency VARCHAR(3) DEFAULT 'INR',
  reminder_enabled BOOLEAN DEFAULT true,
  reminder_days INTEGER DEFAULT 7,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== ROW LEVEL SECURITY (RLS) ====================

-- Enable RLS on all tables
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE voucher_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Cards policies
CREATE POLICY "Users can view own cards" ON cards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own cards" ON cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cards" ON cards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cards" ON cards
  FOR DELETE USING (auth.uid() = user_id);

-- Vouchers policies
CREATE POLICY "Users can view own vouchers" ON vouchers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own vouchers" ON vouchers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vouchers" ON vouchers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vouchers" ON vouchers
  FOR DELETE USING (auth.uid() = user_id);

-- Voucher periods policies (users can manage periods of their vouchers)
CREATE POLICY "Users can view own voucher periods" ON voucher_periods
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM vouchers 
      WHERE vouchers.id = voucher_periods.voucher_id 
      AND vouchers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create voucher periods" ON voucher_periods
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM vouchers 
      WHERE vouchers.id = voucher_periods.voucher_id 
      AND vouchers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update voucher periods" ON voucher_periods
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM vouchers 
      WHERE vouchers.id = voucher_periods.voucher_id 
      AND vouchers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete voucher periods" ON voucher_periods
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM vouchers 
      WHERE vouchers.id = voucher_periods.voucher_id 
      AND vouchers.user_id = auth.uid()
    )
  );

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ==================== FUNCTIONS & TRIGGERS ====================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vouchers_updated_at BEFORE UPDATE ON vouchers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_voucher_periods_updated_at BEFORE UPDATE ON voucher_periods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NULL);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==================== INDEXES ====================

CREATE INDEX idx_cards_user_id ON cards(user_id);
CREATE INDEX idx_vouchers_user_id ON vouchers(user_id);
CREATE INDEX idx_vouchers_card_id ON vouchers(card_id);
CREATE INDEX idx_voucher_periods_voucher_id ON voucher_periods(voucher_id);

-- ==================== VIEWS ====================

-- View for voucher summary with card details
CREATE VIEW voucher_summary AS
SELECT 
  v.id,
  v.user_id,
  v.name,
  v.description,
  v.cycle_type,
  v.category,
  v.value,
  v.currency,
  v.status as voucher_status,
  c.bank,
  c.last4,
  c.card_name,
  COUNT(vp.id) as total_periods,
  COUNT(CASE WHEN vp.status = 'redeemed' THEN 1 END) as redeemed_periods,
  COUNT(CASE WHEN vp.status = 'sold' THEN 1 END) as sold_periods,
  COUNT(CASE WHEN vp.status = 'pending' THEN 1 END) as pending_periods
FROM vouchers v
JOIN cards c ON v.card_id = c.id
LEFT JOIN voucher_periods vp ON v.id = vp.voucher_id
GROUP BY v.id, v.user_id, v.name, v.description, v.cycle_type, v.category, v.value, v.currency, v.status, c.bank, c.last4, c.card_name;

-- View for dashboard statistics
CREATE VIEW dashboard_stats AS
SELECT 
  v.user_id,
  COUNT(DISTINCT v.id) as total_vouchers,
  COUNT(DISTINCT c.id) as total_cards,
  COUNT(CASE WHEN v.status = 'pending' THEN 1 END) as pending_vouchers,
  COUNT(CASE WHEN v.status = 'redeemed' THEN 1 END) as redeemed_vouchers,
  COUNT(CASE WHEN v.status = 'sold' THEN 1 END) as sold_vouchers,
  SUM(v.value) as total_value
FROM vouchers v
JOIN cards c ON v.card_id = c.id
GROUP BY v.user_id;