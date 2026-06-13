const { supabase } = require('../config/db');

// @desc Create appointment
// @route POST /api/appointments
exports.createAppointment = async (req, res, next) => {
  try {
    const { doctorId, clinicId, appointmentDate, appointmentTime, symptoms } = req.body;

    // Get doctor fee
    const { data: doctor } = await supabase.from('doctors').select('fee').eq('user_id', doctorId).single();
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    // Get token number
    const { count } = await supabase.from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('doctor_id', doctorId).eq('clinic_id', clinicId)
      .eq('appointment_date', appointmentDate)
      .neq('status', 'cancelled');

    const { data, error } = await supabase.from('appointments').insert({
      patient_id: req.user.id,
      doctor_id: doctorId,
      clinic_id: clinicId,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      symptoms,
      fee: doctor.fee,
      token_number: (count || 0) + 1,
      status: 'pending'
    }).select().single();

    if (error) throw error;

    // Add status history
    await supabase.from('appointment_history').insert({
      appointment_id: data.id, status: 'pending',
      changed_by: req.user.id, note: 'Appointment created'
    });

    res.status(201).json({ success: true, data, message: 'Appointment booked! Upload payment screenshot.' });
  } catch (error) { next(error); }
};

// @desc Get appointments
// @route GET /api/appointments
exports.getAppointments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase.from('appointments').select(`
      *,
      patient:users!appointments_patient_id_fkey(id, name, email, phone, profile_image),
      doctor:users!appointments_doctor_id_fkey(id, name, email, profile_image),
      clinic:clinics(id, clinic_name, address, city)
    `, { count: 'exact' });

    if (req.user.role === 'patient') query = query.eq('patient_id', req.user.id);
    else if (req.user.role === 'doctor') query = query.eq('doctor_id', req.user.id);
    if (status) query = query.eq('status', status);

    query = query.range(offset, offset + Number(limit) - 1).order('appointment_date', { ascending: false });

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ success: true, data, total: count, page: Number(page), pages: Math.ceil(count / limit) });
  } catch (error) { next(error); }
};

// @desc Get single appointment
// @route GET /api/appointments/:id
exports.getAppointment = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('appointments').select(`
      *,
      patient:users!appointments_patient_id_fkey(id, name, email, phone, profile_image),
      doctor:users!appointments_doctor_id_fkey(id, name, email, profile_image),
      clinic:clinics(*)
    `).eq('id', req.params.id).single();

    if (error || !data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

// @desc Update appointment status
// @route PUT /api/appointments/:id
exports.updateAppointment = async (req, res, next) => {
  try {
    const { status, notes, cancelReason } = req.body;

    const validTransitions = {
      patient: ['cancelled'],
      doctor: ['completed'],
      assistant: ['payment_verified', 'confirmed', 'rejected'],
      admin: ['confirmed', 'cancelled', 'completed', 'rejected'],
      superadmin: ['pending', 'payment_uploaded', 'payment_verified', 'confirmed', 'completed', 'cancelled', 'rejected']
    };

    if (status && !validTransitions[req.user.role]?.includes(status)) {
      return res.status(403).json({ success: false, message: 'Not authorized for this status change' });
    }

    const updateData = { updated_at: new Date() };
    if (status) updateData.status = status;
    if (notes) updateData.notes = notes;
    if (cancelReason) updateData.cancel_reason = cancelReason;

    const { data, error } = await supabase.from('appointments').update(updateData).eq('id', req.params.id).select().single();
    if (error) throw error;

    await supabase.from('appointment_history').insert({
      appointment_id: req.params.id, status: status || data.status,
      changed_by: req.user.id, note: notes || cancelReason
    });

    res.json({ success: true, data });
  } catch (error) { next(error); }
};

// @desc Today's appointments for doctor
// @route GET /api/appointments/today
exports.getTodayAppointments = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase.from('appointments').select(`
      *,
      patient:users!appointments_patient_id_fkey(id, name, email, phone, profile_image),
      clinic:clinics(id, clinic_name)
    `)
      .eq('doctor_id', req.user.id)
      .eq('appointment_date', today)
      .in('status', ['confirmed', 'payment_verified'])
      .order('token_number');

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) { next(error); }
};
