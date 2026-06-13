const { supabase } = require('../config/db');

// @desc Create prescription (LOCKED - immutable)
// @route POST /api/prescriptions
exports.createPrescription = async (req, res, next) => {
  try {
    const { appointmentId, medicines, diagnosis, instructions, followUpDate } = req.body;

    const { data: appt } = await supabase.from('appointments').select('id, patient_id, doctor_id').eq('id', appointmentId).single();
    if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found' });
    if (appt.doctor_id !== req.user.id) return res.status(403).json({ success: false, message: 'Only treating doctor can add prescription' });

    const { data: existing } = await supabase.from('prescriptions').select('id').eq('appointment_id', appointmentId).single();
    if (existing) return res.status(400).json({ success: false, message: 'Prescription already exists' });

    // Create prescription
    const { data: prescription, error } = await supabase.from('prescriptions').insert({
      appointment_id: appointmentId,
      patient_id: appt.patient_id,
      doctor_id: req.user.id,
      diagnosis,
      instructions,
      follow_up_date: followUpDate || null,
      is_locked: true
    }).select().single();

    if (error) throw error;

    // Add medicines
    if (medicines && medicines.length > 0) {
      const meds = medicines.map(m => ({
        prescription_id: prescription.id,
        name: m.name, dosage: m.dosage,
        frequency: m.frequency, duration: m.duration,
        instructions: m.instructions
      }));
      await supabase.from('medicines').insert(meds);
    }

    // Create medical history
    await supabase.from('medical_history').insert({
      patient_id: appt.patient_id,
      doctor_id: req.user.id,
      appointment_id: appointmentId,
      prescription_id: prescription.id,
      diagnosis,
      symptoms: []
    });

    // Mark appointment completed
    await supabase.from('appointments').update({ status: 'completed', updated_at: new Date() }).eq('id', appointmentId);
    await supabase.from('appointment_history').insert({ appointment_id: appointmentId, status: 'completed', changed_by: req.user.id, note: 'Prescription added' });

    res.status(201).json({ success: true, data: prescription, message: 'Prescription created and locked!' });
  } catch (error) { next(error); }
};

// @desc Get prescriptions
// @route GET /api/prescriptions
exports.getPrescriptions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase.from('prescriptions').select(`
      *,
      patient:users!prescriptions_patient_id_fkey(id, name, email),
      doctor:users!prescriptions_doctor_id_fkey(id, name, email),
      medicines(*),
      appointment:appointments(id, appointment_date, appointment_time)
    `, { count: 'exact' });

    if (req.user.role === 'patient') query = query.eq('patient_id', req.user.id);
    else if (req.user.role === 'doctor') query = query.eq('doctor_id', req.user.id);

    query = query.range(offset, offset + Number(limit) - 1).order('created_at', { ascending: false });
    const { data, error, count } = await query;
    if (error) throw error;
    res.json({ success: true, data, total: count });
  } catch (error) { next(error); }
};

// @desc Get single prescription
// @route GET /api/prescriptions/:id
exports.getPrescription = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('prescriptions').select(`
      *, medicines(*),
      patient:users!prescriptions_patient_id_fkey(id, name, email, phone),
      doctor:users!prescriptions_doctor_id_fkey(id, name, email),
      appointment:appointments(*)
    `).eq('id', req.params.id).single();

    if (error || !data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (error) { next(error); }
};
