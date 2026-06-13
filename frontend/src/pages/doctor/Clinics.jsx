import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

const DoctorClinics = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [schedule, setSchedule] = useState(DAYS.map(d => ({ day: d, startTime: '09:00', endTime: '17:00', slotDuration: 30, isAvailable: false })));
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const loadClinics = () => {
    setLoading(true);
    api.get('/clinics').then(r => setClinics(r.data.data)).catch(() => toast.error('Failed to load clinics')).finally(() => setLoading(false));
  };

  useEffect(() => { loadClinics(); }, []);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await api.post('/clinics', { ...data, schedule });
      toast.success('Clinic created!');
      setShowForm(false);
      reset();
      loadClinics();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create clinic');
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">My Clinics</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your clinic locations and schedules</p>
        </div>
        <button onClick={() => setShowForm(p => !p)} className="btn-primary text-sm">
          {showForm ? 'Cancel' : '+ Add Clinic'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5 animate-in">
          <h3 className="font-bold text-slate-900 dark:text-white">New Clinic</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Clinic Name *</label>
              <input type="text" className={`input-field ${errors.clinicName ? 'border-red-400' : ''}`} placeholder="Al-Shifa Medical Center" {...register('clinicName', { required: 'Clinic name required' })} />
              {errors.clinicName && <p className="text-red-500 text-xs mt-1">{errors.clinicName.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Address *</label>
              <input type="text" className={`input-field ${errors.address ? 'border-red-400' : ''}`} placeholder="Street address" {...register('address', { required: 'Address required' })} />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">City *</label>
              <input type="text" className={`input-field ${errors.city ? 'border-red-400' : ''}`} placeholder="Lahore" {...register('city', { required: 'City required' })} />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone</label>
              <input type="tel" className="input-field" placeholder="0300-1234567" {...register('phone')} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Bank / EasyPaisa Account</label>
              <input type="text" className="input-field" placeholder="EasyPaisa: 0300-XXXXXXX" {...register('paymentAccount.easypaisa')} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">JazzCash Account</label>
              <input type="text" className="input-field" placeholder="JazzCash: 0300-XXXXXXX" {...register('paymentAccount.jazzcash')} />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-3 text-sm">Clinic Schedule</h4>
            <div className="space-y-2">
              {schedule.map((slot, i) => (
                <div key={slot.day} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${slot.isAvailable ? 'bg-teal-50 dark:bg-teal-900/10' : 'bg-slate-50 dark:bg-slate-800'}`}>
                  <label className="flex items-center gap-2 w-28 cursor-pointer">
                    <input type="checkbox" checked={slot.isAvailable} onChange={e => setSchedule(p => p.map((s, idx) => idx === i ? { ...s, isAvailable: e.target.checked } : s))} className="w-4 h-4 accent-primary-600" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{slot.day.slice(0, 3)}</span>
                  </label>
                  {slot.isAvailable && (
                    <div className="flex items-center gap-2 flex-1">
                      <input type="time" value={slot.startTime} onChange={e => setSchedule(p => p.map((s, idx) => idx === i ? { ...s, startTime: e.target.value } : s))} className="input-field py-2 text-sm flex-1" />
                      <span className="text-slate-400 text-xs">to</span>
                      <input type="time" value={slot.endTime} onChange={e => setSchedule(p => p.map((s, idx) => idx === i ? { ...s, endTime: e.target.value } : s))} className="input-field py-2 text-sm flex-1" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : 'Create Clinic'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      {loading ? <Spinner center /> : clinics.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-5xl mb-4">🏥</p>
          <p className="font-semibold text-slate-900 dark:text-white mb-2">No clinics added yet</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Add your clinic to start accepting appointments</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {clinics.map(c => (
            <div key={c._id} className="card hover:shadow-card-hover transition-all">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{c.clinicName}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{c.address}, {c.city}</p>
                  {c.phone && <p className="text-sm text-primary-600 dark:text-primary-400">{c.phone}</p>}
                </div>
                <span className={`ml-auto badge-status ${c.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-500'}`}>
                  {c.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              {c.schedule?.filter(s => s.isAvailable).length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Available Days</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.schedule.filter(s => s.isAvailable).map(s => (
                      <span key={s.day} className="text-xs bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 px-2.5 py-1 rounded-lg font-medium">
                        {s.day.slice(0, 3)} {s.startTime}–{s.endTime}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {(c.paymentAccount?.easypaisa || c.paymentAccount?.jazzcash) && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  {c.paymentAccount.easypaisa && <p>📱 EasyPaisa: {c.paymentAccount.easypaisa}</p>}
                  {c.paymentAccount.jazzcash && <p>📱 JazzCash: {c.paymentAccount.jazzcash}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorClinics;
