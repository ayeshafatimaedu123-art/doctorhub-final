const { supabase } = require('../config/db');

// @desc Get all doctors with filters
// @route GET /api/doctors
exports.getDoctors = async (req, res, next) => {
  try {
    const { disease, specialization, city, treatmentType, minFee, maxFee, experience, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase.from('doctors').select(`
      *, 
      users!doctors_user_id_fkey(id, name, email, phone, profile_image),
      clinics(id, clinic_name, address, city, phone)
    `, { count: 'exact' }).eq('is_approved', true);

    if (specialization) query = query.ilike('specialization', `%${specialization}%`);
    if (city) query = query.ilike('city', `%${city}%`);
    if (treatmentType) query = query.eq('treatment_type', treatmentType);
    if (experience) query = query.gte('experience', Number(experience));
    if (minFee) query = query.gte('fee', Number(minFee));
    if (maxFee) query = query.lte('fee', Number(maxFee));
    if (disease) query = query.contains('diseases', [disease]);
    if (search) query = query.or(`specialization.ilike.%${search}%,city.ilike.%${search}%,hospital.ilike.%${search}%`);

    query = query.range(offset, offset + Number(limit) - 1).order('created_at', { ascending: false });

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ success: true, data, total: count, page: Number(page), pages: Math.ceil(count / limit) });
  } catch (error) { next(error); }
};

// @desc Get single doctor
// @route GET /api/doctors/:id
exports.getDoctor = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('doctors').select(`
      *,
      users!doctors_user_id_fkey(id, name, email, phone, profile_image),
      clinics(*),
      doctor_availability(*)
    `).eq('id', req.params.id).single();

    if (error || !data) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

// @desc Get my doctor profile
// @route GET /api/doctors/my-profile
exports.getMyDoctorProfile = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('doctors').select(`
      *, clinics(*), doctor_availability(*)
    `).eq('user_id', req.user.id).single();

    if (error || !data) return res.status(404).json({ success: false, message: 'Profile not found' });
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

// @desc Create doctor profile
// @route POST /api/doctors
exports.createDoctor = async (req, res, next) => {
  try {
    const { availability, ...doctorData } = req.body;

    const { data: existing } = await supabase.from('doctors').select('id').eq('user_id', req.user.id).single();
    if (existing) return res.status(400).json({ success: false, message: 'Doctor profile already exists' });

    const { data, error } = await supabase.from('doctors').insert({
      user_id: req.user.id,
      specialization: doctorData.specialization,
      treatment_type: doctorData.treatmentType,
      diseases: doctorData.diseases || [],
      experience: doctorData.experience || 0,
      fee: doctorData.fee,
      qualification: doctorData.qualification,
      about: doctorData.about,
      city: doctorData.city,
      hospital: doctorData.hospital
    }).select().single();

    if (error) throw error;

    // Insert availability
    if (availability && availability.length > 0) {
      const avail = availability.map(a => ({ doctor_id: data.id, day: a.day, start_time: a.startTime, end_time: a.endTime, is_available: a.isAvailable }));
      await supabase.from('doctor_availability').insert(avail);
    }

    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
};

// @desc Update doctor profile
// @route PUT /api/doctors/:id
exports.updateDoctor = async (req, res, next) => {
  try {
    const { availability, diseases, ...rest } = req.body;

    const updateData = {};
    if (rest.specialization) updateData.specialization = rest.specialization;
    if (rest.treatmentType) updateData.treatment_type = rest.treatmentType;
    if (rest.experience !== undefined) updateData.experience = rest.experience;
    if (rest.fee) updateData.fee = rest.fee;
    if (rest.qualification) updateData.qualification = rest.qualification;
    if (rest.about) updateData.about = rest.about;
    if (rest.city) updateData.city = rest.city;
    if (rest.hospital) updateData.hospital = rest.hospital;
    if (diseases) updateData.diseases = diseases;
    updateData.updated_at = new Date();

    const { data, error } = await supabase.from('doctors').update(updateData).eq('id', req.params.id).select().single();
    if (error) throw error;

    // Update availability
    if (availability && availability.length > 0) {
      await supabase.from('doctor_availability').delete().eq('doctor_id', req.params.id);
      const avail = availability.map(a => ({ doctor_id: req.params.id, day: a.day, start_time: a.startTime, end_time: a.endTime, is_available: a.isAvailable }));
      await supabase.from('doctor_availability').insert(avail);
    }

    res.json({ success: true, data });
  } catch (error) { next(error); }
};

// @desc Delete doctor
// @route DELETE /api/doctors/:id
exports.deleteDoctor = async (req, res, next) => {
  try {
    const { error } = await supabase.from('doctors').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Doctor deleted' });
  } catch (error) { next(error); }
};
