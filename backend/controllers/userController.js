const { supabase } = require('../config/db');
const bcrypt = require('bcryptjs');

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const { data, error } = await supabase.from('users').update({ name, phone, updated_at: new Date() }).eq('id', req.user.id).select('id, name, email, role, phone, profile_image').single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

exports.uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image required' });
    const { data, error } = await supabase.from('users').update({ profile_image: `/uploads/profiles/${req.file.filename}`, updated_at: new Date() }).eq('id', req.user.id).select('id, name, email, profile_image').single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

exports.updatePatientProfile = async (req, res, next) => {
  try {
    const { age, gender, bloodGroup, address, city, allergies, chronicDiseases } = req.body;
    const { data: existing } = await supabase.from('patients').select('id').eq('user_id', req.user.id).single();

    let data, error;
    if (existing) {
      ({ data, error } = await supabase.from('patients').update({ age, gender, blood_group: bloodGroup, address, city, allergies: allergies || [], chronic_diseases: chronicDiseases || [], updated_at: new Date() }).eq('user_id', req.user.id).select().single());
    } else {
      ({ data, error } = await supabase.from('patients').insert({ user_id: req.user.id, age, gender, blood_group: bloodGroup, address, city, allergies: allergies || [], chronic_diseases: chronicDiseases || [] }).select().single());
    }
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { data: user } = await supabase.from('users').select('password').eq('id', req.user.id).single();
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(newPassword, salt);
    await supabase.from('users').update({ password: hashed, updated_at: new Date() }).eq('id', req.user.id);
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) { next(error); }
};
