const { supabase } = require('../config/db');
const bcrypt = require('bcryptjs');

// @desc Get my assistant profile
exports.getMyAssistantProfile = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('assistants')
      .select(`*, doctor:doctors(id, specialization, user_id)`)
      .eq('assistant_id', req.user.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Assistant profile not found' });
    }
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

// @desc Create assistant
exports.createAssistant = async (req, res, next) => {
  try {
    const { assistantEmail, assistantName, tempPassword, permissions } = req.body;

    const { data: doctor } = await supabase
      .from('doctors')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    // Find or create assistant user
    let { data: assistantUser } = await supabase
      .from('users')
      .select('id, role')
      .eq('email', assistantEmail)
      .single();

    if (!assistantUser) {
      const salt = await bcrypt.genSalt(12);
      const hashed = await bcrypt.hash(tempPassword || 'assistant123', salt);
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({ name: assistantName || 'Assistant', email: assistantEmail, password: hashed, role: 'assistant' })
        .select('id')
        .single();
      if (createError) throw createError;
      assistantUser = newUser;
    } else {
      await supabase.from('users').update({ role: 'assistant' }).eq('id', assistantUser.id);
    }

    const { data: existing } = await supabase
      .from('assistants')
      .select('id')
      .eq('assistant_id', assistantUser.id)
      .single();

    if (existing) {
      return res.status(400).json({ success: false, message: 'Already an assistant' });
    }

    const { data, error } = await supabase.from('assistants').insert({
      doctor_id: doctor.id,
      assistant_id: assistantUser.id,
      verify_payments: permissions?.verifyPayments ?? true,
      manage_appointments: permissions?.manageAppointments ?? true,
      view_patient_records: permissions?.viewPatientRecords ?? false
    }).select().single();

    if (error) throw error;
    res.status(201).json({ success: true, data, message: 'Assistant assigned!' });
  } catch (error) { next(error); }
};

// @desc Get doctor's assistants
exports.getAssistants = async (req, res, next) => {
  try {
    const { data: doctor } = await supabase
      .from('doctors')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    const { data, error } = await supabase
      .from('assistants')
      .select(`*, assistant:users!assistants_assistant_id_fkey(id, name, email, phone, is_active)`)
      .eq('doctor_id', doctor.id);

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

// @desc Remove assistant
exports.removeAssistant = async (req, res, next) => {
  try {
    const { data: assistant } = await supabase
      .from('assistants')
      .select('assistant_id')
      .eq('id', req.params.id)
      .single();

    if (!assistant) {
      return res.status(404).json({ success: false, message: 'Assistant not found' });
    }

    await supabase.from('users').update({ role: 'patient' }).eq('id', assistant.assistant_id);
    await supabase.from('assistants').delete().eq('id', req.params.id);

    res.json({ success: true, message: 'Assistant removed' });
  } catch (error) { next(error); }
};