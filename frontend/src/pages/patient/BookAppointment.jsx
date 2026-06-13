import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctor } from '../../redux/slices/doctorSlice';
import { createAppointment } from '../../redux/slices/appointmentSlice';
import { useForm } from 'react-hook-form';
import Spinner from '../../components/common/Spinner';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selected: doctor, loading } = useSelector(s => s.doctors);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selectedClinic, setSelectedClinic] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { dispatch(fetchDoctor(doctorId)); }, [doctorId]);

  const onSubmit = async (data) => {
    if (!selectedClinic) { alert('Please select a clinic'); return; }
    setSubmitting(true);
    const result = await dispatch(createAppointment({ ...data, doctorId: doctor.userId._id, clinicId: selectedClinic }));
    setSubmitting(false);
    if (!result.error) navigate('/patient/appointments');
  };

  if (loading || !doctor) return <Spinner center size="lg" />;
  const u = doctor.userId;

  return (
    <div className="max-w-2xl mx-auto animate-in space-y-6">
      <div>
        <h1 className="page-title">Book Appointment</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Fill in the details to book your consultation</p>
      </div>

      {/* Doctor Summary */}
      <div className="card bg-gradient-to-br from-primary-50 to-teal-50 dark:from-primary-900/20 dark:to-teal-900/20 border-primary-100 dark:border-primary-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-teal-500 flex items-center justify-center text-white font-bold text-xl">
            {u?.name?.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Dr. {u?.name}</h3>
            <p className="text-primary-600 dark:text-primary-400 text-sm">{doctor.specialization} • {doctor.treatmentType}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-slate-500 dark:text-slate-400">Consultation Fee</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">Rs. {doctor.fee?.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5">
        {/* Select Clinic */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Clinic *</label>
          {doctor.clinics?.length > 0 ? (
            <div className="space-y-2">
              {doctor.clinics.map(c => (
                <label key={c._id} className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${selectedClinic === c._id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                  <input type="radio" name="clinic" value={c._id} onChange={() => setSelectedClinic(c._id)} className="hidden" />
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${selectedClinic === c._id ? 'border-primary-500' : 'border-slate-300'}`}>
                    {selectedClinic === c._id && <div className="w-2 h-2 rounded-full bg-primary-500" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{c.clinicName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{c.address}, {c.city}</p>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-amber-500 text-sm bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl">No clinics available for this doctor.</p>
          )}
        </div>

        {/* Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Appointment Date *</label>
            <input type="date" min={new Date().toISOString().split('T')[0]} className={`input-field ${errors.appointmentDate ? 'border-red-400' : ''}`}
              {...register('appointmentDate', { required: 'Date is required' })} />
            {errors.appointmentDate && <p className="text-red-500 text-xs mt-1">{errors.appointmentDate.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Preferred Time *</label>
            <input type="time" className={`input-field ${errors.appointmentTime ? 'border-red-400' : ''}`}
              {...register('appointmentTime', { required: 'Time is required' })} />
            {errors.appointmentTime && <p className="text-red-500 text-xs mt-1">{errors.appointmentTime.message}</p>}
          </div>
        </div>

        {/* Symptoms */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Symptoms / Reason for Visit</label>
          <textarea rows={3} placeholder="Describe your symptoms briefly..." className="input-field resize-none"
            {...register('symptoms')} />
        </div>

        {/* Notice */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-700 dark:text-amber-400">
          <strong>Note:</strong> After booking, you must upload a payment screenshot to confirm your appointment. The assistant will verify and confirm.
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={submitting || !selectedClinic} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
            {submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Booking...</> : 'Book Appointment'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary px-6">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default BookAppointment;
