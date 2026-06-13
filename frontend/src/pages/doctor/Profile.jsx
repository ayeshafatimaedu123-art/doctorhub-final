import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { fetchMyDoctorProfile, createDoctor, updateDoctor } from '../../redux/slices/doctorSlice';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

const SPECIALIZATIONS = ['General Physician','Cardiologist','Dermatologist','ENT Specialist','Gynecologist','Neurologist','Ophthalmologist','Orthopedic Surgeon','Pediatrician','Psychiatrist','Urologist','Diabetologist','Homeopathic Physician','Herbal Medicine'];
const TREATMENT_TYPES = ['Allopathic','Homeopathic','Herbal'];
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

const DoctorProfile = () => {
  const dispatch = useDispatch();
  const { myProfile, loading } = useSelector(s => s.doctors);
  const [tab, setTab] = useState('basic');
  const [diseases, setDiseases] = useState([]);
  const [diseaseInput, setDiseaseInput] = useState('');
  const [availability, setAvailability] = useState(DAYS.map(d => ({ day: d, startTime: '09:00', endTime: '17:00', isAvailable: false })));
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(fetchMyDoctorProfile());
  }, []);

  useEffect(() => {
    if (myProfile) {
      reset({ specialization: myProfile.specialization, treatmentType: myProfile.treatmentType, experience: myProfile.experience, fee: myProfile.fee, qualification: myProfile.qualification, about: myProfile.about, city: myProfile.city, hospital: myProfile.hospital });
      setDiseases(myProfile.diseases || []);
      if (myProfile.availability?.length) {
        setAvailability(DAYS.map(d => myProfile.availability.find(a => a.day === d) || { day: d, startTime: '09:00', endTime: '17:00', isAvailable: false }));
      }
    }
  }, [myProfile]);

  const addDisease = () => {
    if (diseaseInput.trim() && !diseases.includes(diseaseInput.trim())) {
      setDiseases(p => [...p, diseaseInput.trim()]);
      setDiseaseInput('');
    }
  };

  const onSubmit = async (data) => {
    const payload = { ...data, diseases, availability };
    if (myProfile) {
      dispatch(updateDoctor({ id: myProfile._id, data: payload }));
    } else {
      dispatch(createDoctor(payload));
    }
  };

  if (loading && !myProfile) return <Spinner center />;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in">
      <div>
        <h1 className="page-title">Doctor Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{myProfile ? 'Update your professional information' : 'Complete your profile to start receiving patients'}</p>
      </div>

      {!myProfile && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-700 dark:text-amber-400">
          ⚠️ Your profile is not complete. Fill in your details to appear in doctor search results.
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {['basic','diseases','availability'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all capitalize ${tab === t ? 'bg-primary-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>{t}</button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {tab === 'basic' && (
          <div className="card space-y-5">
            <h3 className="font-bold text-slate-900 dark:text-white">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Specialization *</label>
                <select className={`input-field ${errors.specialization ? 'border-red-400' : ''}`} {...register('specialization', { required: 'Required' })}>
                  <option value="">Select Specialization</option>
                  {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Treatment Type *</label>
                <select className={`input-field ${errors.treatmentType ? 'border-red-400' : ''}`} {...register('treatmentType', { required: 'Required' })}>
                  <option value="">Select Type</option>
                  {TREATMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.treatmentType && <p className="text-red-500 text-xs mt-1">{errors.treatmentType.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Qualification</label>
                <input type="text" className="input-field" placeholder="MBBS, MD, etc." {...register('qualification')} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Experience (years)</label>
                <input type="number" min="0" className="input-field" placeholder="5" {...register('experience')} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Consultation Fee (Rs) *</label>
                <input type="number" min="0" className={`input-field ${errors.fee ? 'border-red-400' : ''}`} placeholder="1000" {...register('fee', { required: 'Required', min: { value: 0, message: 'Invalid' } })} />
                {errors.fee && <p className="text-red-500 text-xs mt-1">{errors.fee.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">City</label>
                <input type="text" className="input-field" placeholder="Lahore" {...register('city')} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Hospital / Clinic Name</label>
                <input type="text" className="input-field" placeholder="Services Hospital" {...register('hospital')} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">About</label>
                <textarea rows={3} className="input-field resize-none" placeholder="Brief professional bio..." {...register('about')} />
              </div>
            </div>
            <button type="submit" className="btn-primary">Save Profile</button>
          </div>
        )}

        {tab === 'diseases' && (
          <div className="card space-y-5">
            <h3 className="font-bold text-slate-900 dark:text-white">Diseases / Conditions Treated</h3>
            <div className="flex gap-2">
              <input value={diseaseInput} onChange={e => setDiseaseInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addDisease())} type="text" className="input-field" placeholder="Type disease and press Enter or Add" />
              <button type="button" onClick={addDisease} className="btn-primary px-5 whitespace-nowrap">Add</button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              {diseases.length === 0 ? <span className="text-slate-400 text-sm">No diseases added yet</span> : diseases.map(d => (
                <span key={d} className="flex items-center gap-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-3 py-1.5 rounded-lg text-sm font-medium">
                  {d}
                  <button type="button" onClick={() => setDiseases(p => p.filter(x => x !== d))} className="text-primary-400 hover:text-red-500 transition-colors ml-1">×</button>
                </span>
              ))}
            </div>
            <button type="button" onClick={() => dispatch(updateDoctor({ id: myProfile?._id, data: { diseases } })).then(() => toast.success('Diseases updated!'))} disabled={!myProfile} className="btn-primary">Save Diseases</button>
          </div>
        )}

        {tab === 'availability' && (
          <div className="card space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white">Weekly Availability</h3>
            <div className="space-y-3">
              {availability.map((slot, i) => (
                <div key={slot.day} className={`flex items-center gap-4 p-4 rounded-xl transition-all ${slot.isAvailable ? 'bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800' : 'bg-slate-50 dark:bg-slate-800'}`}>
                  <label className="flex items-center gap-2 w-28 cursor-pointer">
                    <input type="checkbox" checked={slot.isAvailable} onChange={e => setAvailability(p => p.map((s, idx) => idx === i ? { ...s, isAvailable: e.target.checked } : s))} className="w-4 h-4 accent-primary-600" />
                    <span className={`text-sm font-semibold ${slot.isAvailable ? 'text-teal-700 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'}`}>{slot.day.slice(0, 3)}</span>
                  </label>
                  {slot.isAvailable ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input type="time" value={slot.startTime} onChange={e => setAvailability(p => p.map((s, idx) => idx === i ? { ...s, startTime: e.target.value } : s))} className="input-field py-2 text-sm flex-1" />
                      <span className="text-slate-400 text-sm">to</span>
                      <input type="time" value={slot.endTime} onChange={e => setAvailability(p => p.map((s, idx) => idx === i ? { ...s, endTime: e.target.value } : s))} className="input-field py-2 text-sm flex-1" />
                    </div>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-600 text-sm">Unavailable</span>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => dispatch(updateDoctor({ id: myProfile?._id, data: { availability } })).then(() => toast.success('Schedule updated!'))} disabled={!myProfile} className="btn-primary">Save Schedule</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default DoctorProfile;
