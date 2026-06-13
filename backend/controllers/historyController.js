// ============ MEDICAL HISTORY ============
const { supabase } = require('../config/db');

exports.getMedicalHistory = async (req, res, next) => {
  try {
    const { patientId, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase.from('medical_history').select(`
      *,
      patient:users!medical_history_patient_id_fkey(id, name, email),
      doctor:users!medical_history_doctor_id_fkey(id, name, email),
      prescription:prescriptions(id, diagnosis, medicines(*)),
      reports:medical_reports(*)
    `, { count: 'exact' });

    if (req.user.role === 'patient') query = query.eq('patient_id', req.user.id);
    else if (req.user.role === 'doctor') {
      query = query.eq('doctor_id', req.user.id);
      if (patientId) query = query.eq('patient_id', patientId);
    } else if (patientId) query = query.eq('patient_id', patientId);

    query = query.range(offset, offset + Number(limit) - 1).order('created_at', { ascending: false });
    const { data, error, count } = await query;
    if (error) throw error;
    res.json({ success: true, data, total: count });
  } catch (error) { next(error); }
};

exports.addMedicalHistory = async (req, res, next) => {
  try {
    const { patientId, diagnosis, symptoms, notes, appointmentId } = req.body;
    const { data, error } = await supabase.from('medical_history').insert({
      patient_id: patientId, doctor_id: req.user.id,
      diagnosis, symptoms: symptoms || [], notes, appointment_id: appointmentId
    }).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
};

exports.uploadReport = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'File required' });
    const { data, error } = await supabase.from('medical_reports').insert({
      history_id: req.params.id,
      file_name: req.file.originalname,
      file_url: `/uploads/reports/${req.file.filename}`,
      uploaded_by: req.user.id
    }).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) { next(error); }
};
