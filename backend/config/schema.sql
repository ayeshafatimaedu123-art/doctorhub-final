-- =============================================
-- DOCTOR HUB - SUPABASE SQL SCHEMA
-- Supabase Dashboard > SQL Editor mein run karo
-- =============================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'patient' CHECK (role IN ('patient','doctor','assistant','admin','superadmin')),
  phone VARCHAR(50),
  profile_image TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  reset_password_token VARCHAR(255),
  reset_password_expire TIMESTAMPTZ,
  refresh_token TEXT,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DOCTORS TABLE
CREATE TABLE IF NOT EXISTS doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  specialization VARCHAR(255) NOT NULL,
  treatment_type VARCHAR(50) CHECK (treatment_type IN ('Allopathic','Homeopathic','Herbal')),
  diseases TEXT[] DEFAULT '{}',
  experience INTEGER DEFAULT 0,
  fee DECIMAL(10,2) NOT NULL,
  qualification VARCHAR(255),
  about TEXT,
  city VARCHAR(100),
  hospital VARCHAR(255),
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT false,
  total_patients INTEGER DEFAULT 0,
  total_earnings DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DOCTOR AVAILABILITY TABLE
CREATE TABLE IF NOT EXISTS doctor_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  day VARCHAR(20) CHECK (day IN ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')),
  start_time VARCHAR(10),
  end_time VARCHAR(10),
  is_available BOOLEAN DEFAULT true
);

-- 4. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  age INTEGER,
  gender VARCHAR(20) CHECK (gender IN ('Male','Female','Other')),
  blood_group VARCHAR(10),
  address TEXT,
  city VARCHAR(100),
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(50),
  emergency_contact_relation VARCHAR(100),
  allergies TEXT[] DEFAULT '{}',
  chronic_diseases TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CLINICS TABLE
CREATE TABLE IF NOT EXISTS clinics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  clinic_name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  easypaisa VARCHAR(100),
  jazzcash VARCHAR(100),
  bank_name VARCHAR(100),
  account_title VARCHAR(255),
  account_number VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CLINIC SCHEDULE TABLE
CREATE TABLE IF NOT EXISTS clinic_schedule (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  day VARCHAR(20) CHECK (day IN ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')),
  start_time VARCHAR(10),
  end_time VARCHAR(10),
  slot_duration INTEGER DEFAULT 30,
  is_available BOOLEAN DEFAULT true
);

-- 7. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES users(id),
  doctor_id UUID REFERENCES users(id),
  clinic_id UUID REFERENCES clinics(id),
  appointment_date DATE NOT NULL,
  appointment_time VARCHAR(10) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','payment_uploaded','payment_verified','confirmed','completed','cancelled','rejected')),
  symptoms TEXT,
  notes TEXT,
  fee DECIMAL(10,2),
  token_number INTEGER,
  cancel_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. APPOINTMENT STATUS HISTORY
CREATE TABLE IF NOT EXISTS appointment_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  status VARCHAR(50),
  changed_by UUID REFERENCES users(id),
  note TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  screenshot TEXT NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'bank_transfer',
  transaction_id VARCHAR(255),
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending','verified','rejected')),
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. PRESCRIPTIONS TABLE (IMMUTABLE - cannot be updated)
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id),
  patient_id UUID REFERENCES users(id),
  doctor_id UUID REFERENCES users(id),
  diagnosis TEXT NOT NULL,
  instructions TEXT,
  follow_up_date DATE,
  is_locked BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
  -- No updated_at - prescriptions are immutable!
);

-- 11. MEDICINES TABLE (linked to prescription)
CREATE TABLE IF NOT EXISTS medicines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  dosage VARCHAR(100),
  frequency VARCHAR(100),
  duration VARCHAR(100),
  instructions TEXT
);

-- 12. MEDICAL HISTORY TABLE (IMMUTABLE - cannot be deleted)
CREATE TABLE IF NOT EXISTS medical_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES users(id),
  doctor_id UUID REFERENCES users(id),
  appointment_id UUID REFERENCES appointments(id),
  prescription_id UUID REFERENCES prescriptions(id),
  diagnosis TEXT NOT NULL,
  symptoms TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
  -- No delete allowed!
);

-- 13. MEDICAL REPORTS TABLE
CREATE TABLE IF NOT EXISTS medical_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  history_id UUID REFERENCES medical_history(id) ON DELETE CASCADE,
  file_name VARCHAR(255),
  file_url TEXT,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. ASSISTANTS TABLE
CREATE TABLE IF NOT EXISTS assistants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  assistant_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  verify_payments BOOLEAN DEFAULT true,
  manage_appointments BOOLEAN DEFAULT true,
  view_patient_records BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. AUDIT LOGS TABLE (IMMUTABLE)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  resource_id UUID,
  details JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES for performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_city ON doctors(city);
CREATE INDEX IF NOT EXISTS idx_doctors_treatment ON doctors(treatment_type);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_payments_appointment ON payments(appointment_id);
CREATE INDEX IF NOT EXISTS idx_medical_history_patient ON medical_history(patient_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);

-- =============================================
-- DISABLE DELETE on medical_history (RLS Policy)
-- =============================================
ALTER TABLE medical_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow all operations via service role (backend uses service key)
CREATE POLICY "service_role_all" ON medical_history FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON prescriptions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON audit_logs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
SELECT 'Doctor Hub Database Setup Complete! ✅' as message;
