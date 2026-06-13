const { supabase } = require('../config/db');

exports.createClinic = async (req, res, next) => {
  try {
    const { schedule, paymentAccount, ...clinicData } = req.body;

    const { data: doctor } = await supabase.from('doctors').select('id').eq('user_id', req.user.id).single();
    if (!doctor) return res.status(404).json({ success: false, message: 'Create doctor profile first' });

    const { data, error } = await supabase.from('clinics').insert({
      doctor_id: doctor.id,
      clinic_name: clinicData.clinicName,
      address: clinicData.address,
      city: clinicData.city,
      phone: clinicData.phone,
      easypaisa: paymentAccount?.easypaisa,
      jazzcash: paymentAccount?.jazzcash,
      bank_name: paymentAccount?.bankName,
      account_title: paymentAccount?.accountTitle,
      account_number: paymentAccount?.accountNumber
    }).select().single();

    if (error) throw error;

    // Insert schedule
    if (schedule && schedule.length > 0) {
      const sched = schedule.map(s => ({
        clinic_id: data.id, day: s.day,
        start_time: s.startTime, end_time: s.endTime,
        slot_duration: s.slotDuration || 30,
        is_available: s.isAvailable
      }));
      await supabase.from('clinic_schedule').insert(sched);
    }

    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
};

exports.getClinics = async (req, res, next) => {
  try {
    let query = supabase.from('clinics').select('*, clinic_schedule(*), doctor:doctors(id, user_id)');
    if (req.user.role === 'doctor') {
      const { data: doctor } = await supabase.from('doctors').select('id').eq('user_id', req.user.id).single();
      if (doctor) query = query.eq('doctor_id', doctor.id);
    }
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

exports.updateClinic = async (req, res, next) => {
  try {
    const { schedule, paymentAccount, ...rest } = req.body;
    const updateData = {};
    if (rest.clinicName) updateData.clinic_name = rest.clinicName;
    if (rest.address) updateData.address = rest.address;
    if (rest.city) updateData.city = rest.city;
    if (rest.phone) updateData.phone = rest.phone;
    if (paymentAccount?.easypaisa) updateData.easypaisa = paymentAccount.easypaisa;
    if (paymentAccount?.jazzcash) updateData.jazzcash = paymentAccount.jazzcash;
    updateData.updated_at = new Date();

    const { data, error } = await supabase.from('clinics').update(updateData).eq('id', req.params.id).select().single();
    if (error) throw error;

    if (schedule && schedule.length > 0) {
      await supabase.from('clinic_schedule').delete().eq('clinic_id', req.params.id);
      const sched = schedule.map(s => ({ clinic_id: req.params.id, day: s.day, start_time: s.startTime, end_time: s.endTime, slot_duration: s.slotDuration || 30, is_available: s.isAvailable }));
      await supabase.from('clinic_schedule').insert(sched);
    }

    res.json({ success: true, data });
  } catch (error) { next(error); }
};
