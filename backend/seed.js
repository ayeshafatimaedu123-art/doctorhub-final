require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const ws = require('ws');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: ws }
});

const seed = async () => {
  console.log('🌱 Seeding Supabase database...');

  const hash = async (pw) => bcrypt.hash(pw, 12);

  // Clear tables
  await supabase.from('clinic_schedule').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('clinics').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('doctor_availability').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('doctors').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('patients').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('✅ Cleared tables');

  // Create users
  const { data: users } = await supabase.from('users').insert([
    { name: 'Super Admin', email: 'superadmin@demo.com', password: await hash('123456'), role: 'superadmin', phone: '0300-0000001', is_active: true },
    { name: 'Admin User', email: 'admin@demo.com', password: await hash('123456'), role: 'admin', phone: '0300-0000002', is_active: true },
    { name: 'Dr Ahmad Hassan', email: 'doctor@demo.com', password: await hash('123456'), role: 'doctor', phone: '0300-1111111', is_active: true },
    { name: 'Dr Fatima Malik', email: 'doctor2@demo.com', password: await hash('123456'), role: 'doctor', phone: '0300-2222222', is_active: true },
    { name: 'Dr Usman Tariq', email: 'doctor3@demo.com', password: await hash('123456'), role: 'doctor', phone: '0300-3333333', is_active: true },
    { name: 'Ali Raza', email: 'patient@demo.com', password: await hash('123456'), role: 'patient', phone: '0300-5555555', is_active: true },
    { name: 'Ayesha Noor', email: 'patient2@demo.com', password: await hash('123456'), role: 'patient', phone: '0300-6666666', is_active: true },
    { name: 'Kamran Assistant', email: 'asst@demo.com', password: await hash('123456'), role: 'assistant', phone: '0300-8888888', is_active: true },
  ]).select();

  if (!users) { console.error('❌ Failed to create users'); return; }
  console.log(`✅ Created ${users.length} users`);

  const doc1User = users.find(u => u.email === 'doctor@demo.com');
  const doc2User = users.find(u => u.email === 'doctor2@demo.com');
  const doc3User = users.find(u => u.email === 'doctor3@demo.com');
  const pat1 = users.find(u => u.email === 'patient@demo.com');
  const pat2 = users.find(u => u.email === 'patient2@demo.com');

  // Create patients
  await supabase.from('patients').insert([
    { user_id: pat1.id, age: 32, gender: 'Male', blood_group: 'O+', city: 'Lahore' },
    { user_id: pat2.id, age: 27, gender: 'Female', blood_group: 'A+', city: 'Karachi' },
  ]);

  // Create doctors
  const { data: doctors } = await supabase.from('doctors').insert([
    { user_id: doc1User.id, specialization: 'Cardiologist', treatment_type: 'Allopathic', diseases: ['Heart Disease','Hypertension','Chest Pain','Arrhythmia'], experience: 12, fee: 2000, qualification: 'MBBS, FCPS (Cardiology)', about: 'Experienced cardiologist with 12 years practice.', city: 'Lahore', hospital: 'Services Hospital', rating: 4.8, total_reviews: 247, is_approved: true },
    { user_id: doc2User.id, specialization: 'Gynecologist', treatment_type: 'Allopathic', diseases: ['PCOS','Infertility','Prenatal Care','Hormonal Disorders'], experience: 8, fee: 1500, qualification: 'MBBS, FCPS (Gynecology)', about: 'Compassionate gynecologist.', city: 'Karachi', hospital: 'Aga Khan Hospital', rating: 4.9, total_reviews: 312, is_approved: true },
    { user_id: doc3User.id, specialization: 'Homeopathic Physician', treatment_type: 'Homeopathic', diseases: ['Skin Allergies','Migraine','Asthma','Anxiety'], experience: 15, fee: 800, qualification: 'DHMS, BHMS', about: 'Veteran homeopathic physician.', city: 'Islamabad', hospital: 'Al-Shifa Clinic', rating: 4.6, total_reviews: 189, is_approved: true },
  ]).select();

  console.log(`✅ Created ${doctors.length} doctors`);

  // Create availability
  for (const doc of doctors) {
    await supabase.from('doctor_availability').insert([
      { doctor_id: doc.id, day: 'Monday', start_time: '09:00', end_time: '17:00', is_available: true },
      { doctor_id: doc.id, day: 'Wednesday', start_time: '09:00', end_time: '17:00', is_available: true },
      { doctor_id: doc.id, day: 'Friday', start_time: '09:00', end_time: '14:00', is_available: true },
    ]);
  }

  // Create clinics
  const { data: clinics } = await supabase.from('clinics').insert([
    { doctor_id: doctors[0].id, clinic_name: 'Hassan Heart Care Center', address: '24-B Gulberg III', city: 'Lahore', phone: '042-3576123', easypaisa: '0300-1111111', jazzcash: '0300-1111111' },
    { doctor_id: doctors[1].id, clinic_name: "Fatima Women's Clinic", address: 'Block 5 Clifton', city: 'Karachi', phone: '021-3584123', easypaisa: '0300-2222222' },
    { doctor_id: doctors[2].id, clinic_name: 'Usman Homeopathic Center', address: 'F-8 Markaz', city: 'Islamabad', phone: '051-2883123', easypaisa: '0300-3333333' },
  ]).select();

  // Create clinic schedules
  for (const clinic of clinics) {
    await supabase.from('clinic_schedule').insert([
      { clinic_id: clinic.id, day: 'Monday', start_time: '09:00', end_time: '17:00', slot_duration: 30, is_available: true },
      { clinic_id: clinic.id, day: 'Wednesday', start_time: '09:00', end_time: '17:00', slot_duration: 30, is_available: true },
      { clinic_id: clinic.id, day: 'Friday', start_time: '09:00', end_time: '14:00', slot_duration: 30, is_available: true },
    ]);
  }
  console.log(`✅ Created ${clinics.length} clinics with schedules`);

  console.log('\n🎉 Seed Complete!\n');
  console.log('═══════════════════════════════════');
  console.log('  DEMO CREDENTIALS');
  console.log('═══════════════════════════════════');
  console.log('  superadmin@demo.com / 123456');
  console.log('  admin@demo.com      / 123456');
  console.log('  doctor@demo.com     / 123456');
  console.log('  doctor2@demo.com    / 123456');
  console.log('  doctor3@demo.com    / 123456');
  console.log('  patient@demo.com    / 123456');
  console.log('  patient2@demo.com   / 123456');
  console.log('  asst@demo.com       / 123456');
  console.log('═══════════════════════════════════\n');
  process.exit(0);
};

seed().catch(err => { console.error('❌ Seed failed:', err.message); process.exit(1); });
