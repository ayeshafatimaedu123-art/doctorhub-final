const { supabase } = require('../config/db');

// @desc Upload payment
// @route POST /api/payments
exports.uploadPayment = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Screenshot required' });
    const { appointmentId, paymentMethod, transactionId } = req.body;

    const { data: appt } = await supabase.from('appointments').select('id, patient_id, fee').eq('id', appointmentId).single();
    if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found' });
    if (appt.patient_id !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });

    const { data: existing } = await supabase.from('payments').select('id').eq('appointment_id', appointmentId).single();
    if (existing) return res.status(400).json({ success: false, message: 'Payment already uploaded' });

    const screenshotUrl = `/uploads/payments/${req.file.filename}`;
    const { data, error } = await supabase.from('payments').insert({
      appointment_id: appointmentId,
      patient_id: req.user.id,
      amount: appt.fee,
      screenshot: screenshotUrl,
      payment_method: paymentMethod || 'bank_transfer',
      transaction_id: transactionId,
      verification_status: 'pending'
    }).select().single();

    if (error) throw error;

    await supabase.from('appointments').update({ status: 'payment_uploaded', updated_at: new Date() }).eq('id', appointmentId);
    await supabase.from('appointment_history').insert({ appointment_id: appointmentId, status: 'payment_uploaded', changed_by: req.user.id, note: 'Payment uploaded' });

    res.status(201).json({ success: true, data, message: 'Payment uploaded! Awaiting verification.' });
  } catch (error) { next(error); }
};

// @desc Get payments
// @route GET /api/payments
exports.getPayments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase.from('payments').select(`
      *,
      patient:users!payments_patient_id_fkey(id, name, email, phone),
      appointment:appointments(id, appointment_date, appointment_time),
      verified_by_user:users!payments_verified_by_fkey(id, name)
    `, { count: 'exact' });

    if (req.user.role === 'patient') query = query.eq('patient_id', req.user.id);
    if (status) query = query.eq('verification_status', status);
    query = query.range(offset, offset + Number(limit) - 1).order('created_at', { ascending: false });

    const { data, error, count } = await query;
    if (error) throw error;
    res.json({ success: true, data, total: count });
  } catch (error) { next(error); }
};

// @desc Verify or reject payment
// @route PUT /api/payments/:id/verify
exports.verifyPayment = async (req, res, next) => {
  try {
    const { action, rejectionReason } = req.body;

    const { data: payment } = await supabase.from('payments').select('id, appointment_id').eq('id', req.params.id).single();
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    const newStatus = action === 'verify' ? 'verified' : 'rejected';
    const { data, error } = await supabase.from('payments').update({
      verification_status: newStatus,
      verified_by: req.user.id,
      verified_at: new Date(),
      rejection_reason: rejectionReason || null,
      updated_at: new Date()
    }).eq('id', req.params.id).select().single();

    if (error) throw error;

    const apptStatus = action === 'verify' ? 'payment_verified' : 'pending';
    await supabase.from('appointments').update({ status: apptStatus, updated_at: new Date() }).eq('id', payment.appointment_id);
    await supabase.from('appointment_history').insert({
      appointment_id: payment.appointment_id, status: apptStatus,
      changed_by: req.user.id, note: action === 'verify' ? 'Payment verified' : `Rejected: ${rejectionReason}`
    });

    res.json({ success: true, data, message: `Payment ${newStatus}` });
  } catch (error) { next(error); }
};
