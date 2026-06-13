const { supabase } = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getAnalytics = async (req, res, next) => {
  try {
    const [
      { count: totalUsers },
      { count: totalDoctors },
      { count: totalPatients },
      { count: totalAppointments },
      { count: pendingPayments },
      { data: revenueData },
      { data: recentAppointments },
      { data: statusData }
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('doctors').select('*', { count: 'exact', head: true }),
      supabase.from('patients').select('*', { count: 'exact', head: true }),
      supabase.from('appointments').select('*', { count: 'exact', head: true }),
      supabase.from('payments').select('*', { count: 'exact', head: true }).eq('verification_status', 'pending'),
      supabase.from('payments').select('amount').eq('verification_status', 'verified'),
      supabase.from('appointments').select(`
        id, status, appointment_date, fee,
        patient:users!appointments_patient_id_fkey(name),
        doctor:users!appointments_doctor_id_fkey(name)
      `).order('created_at', { ascending: false }).limit(5),
      supabase.from('appointments').select('status')
    ]);

    const totalRevenue = revenueData?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

    // Status breakdown
    const appointmentsByStatus = statusData?.reduce((acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    }, {});
    const statusArray = Object.entries(appointmentsByStatus || {}).map(([_id, count]) => ({ _id, count }));

    res.json({
      success: true,
      data: {
        totalUsers, totalDoctors, totalPatients, totalAppointments,
        totalRevenue, pendingPayments,
        recentAppointments,
        appointmentsByStatus: statusArray,
        monthlyRevenue: [],
        doctorsBySpecialization: []
      }
    });
  } catch (error) { next(error); }
};

exports.getUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase.from('users').select('id, name, email, role, phone, is_active, created_at', { count: 'exact' });
    if (role) query = query.eq('role', role);
    if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    query = query.range(offset, offset + Number(limit) - 1).order('created_at', { ascending: false });

    const { data, error, count } = await query;
    if (error) throw error;
    res.json({ success: true, data, total: count, page: Number(page), pages: Math.ceil(count / limit) });
  } catch (error) { next(error); }
};

exports.toggleUser = async (req, res, next) => {
  try {
    const { data: user } = await supabase.from('users').select('is_active').eq('id', req.params.id).single();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { data, error } = await supabase.from('users').update({ is_active: !user.is_active }).eq('id', req.params.id).select('id, name, is_active').single();
    if (error) throw error;
    res.json({ success: true, message: `User ${data.is_active ? 'activated' : 'deactivated'}`, data });
  } catch (error) { next(error); }
};

exports.approveDoctor = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('doctors').update({ is_approved: req.body.isApproved !== false }).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ success: true, data, message: `Doctor ${data.is_approved ? 'approved' : 'unapproved'}` });
  } catch (error) { next(error); }
};

exports.createAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'superadmin') return res.status(403).json({ success: false, message: 'Only superadmin can create admins' });
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const { data, error } = await supabase.from('users').insert({ ...req.body, password: hashedPassword, role: 'admin' }).select('id, name, email, role').single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
};

exports.getAuditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const { data, error, count } = await supabase.from('audit_logs').select(`
      *, user:users!audit_logs_user_id_fkey(id, name, email, role)
    `, { count: 'exact' }).range(offset, offset + Number(limit) - 1).order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data, total: count });
  } catch (error) { next(error); }
};
