import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AddPrescription = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [instructions, setInstructions] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/appointments/${appointmentId}`).then(r => setAppointment(r.data.data)).catch(() => toast.error('Appointment not found'));
  }, [appointmentId]);

  const addMedicine = () => setMedicines(p => [...p, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  const removeMedicine = (i) => setMedicines(p => p.filter((_, idx) => idx !== i));
  const updateMedicine = (i, field, val) => setMedicines(p => p.map((m, idx) => idx === i ? { ...m, [field]: val } : m));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) { toast.error('Diagnosis is required'); return; }
    if (medicines.some(m => !m.name.trim())) { toast.error('All medicine names are required'); return; }
    setSubmitting(true);
    try {
      await api.post('/prescriptions', { appointmentId, diagnosis, instructions, followUpDate: followUpDate || undefined, medicines });
      toast.success('Prescription added and locked!');
      navigate('/doctor/appointments');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add prescription');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in">
      <div>
        <h1 className="page-title">Add Prescription</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">⚠️ Prescriptions are <strong>locked permanently</strong> once submitted</p>
      </div>

      {appointment && (
        <div className="card bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-teal-400 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
              {appointment.patientId?.name?.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{appointment.patientId?.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString('en-PK') : ''} • {appointment.appointmentTime}
              </p>
              {appointment.symptoms && <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">Symptoms: {appointment.symptoms}</p>}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white">Consultation Details</h3>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Diagnosis *</label>
            <input type="text" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} className="input-field" placeholder="Primary diagnosis" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Doctor's Instructions</label>
            <textarea value={instructions} onChange={e => setInstructions(e.target.value)} rows={3} className="input-field resize-none" placeholder="Rest, diet, lifestyle instructions..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Follow-up Date</label>
            <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="input-field" />
          </div>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white">Medicines</h3>
            <button type="button" onClick={addMedicine} className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Medicine
            </button>
          </div>
          {medicines.map((m, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Medicine {i + 1}</span>
                {medicines.length > 1 && <button type="button" onClick={() => removeMedicine(i)} className="text-red-500 hover:text-red-600 text-xs font-medium">Remove</button>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <input value={m.name} onChange={e => updateMedicine(i, 'name', e.target.value)} placeholder="Medicine name *" className="input-field text-sm py-2.5" required />
                </div>
                <input value={m.dosage} onChange={e => updateMedicine(i, 'dosage', e.target.value)} placeholder="Dosage (e.g. 500mg)" className="input-field text-sm py-2.5" />
                <input value={m.frequency} onChange={e => updateMedicine(i, 'frequency', e.target.value)} placeholder="Frequency (e.g. 2x daily)" className="input-field text-sm py-2.5" />
                <input value={m.duration} onChange={e => updateMedicine(i, 'duration', e.target.value)} placeholder="Duration (e.g. 7 days)" className="input-field text-sm py-2.5" />
                <input value={m.instructions} onChange={e => updateMedicine(i, 'instructions', e.target.value)} placeholder="Instructions (e.g. after meal)" className="input-field text-sm py-2.5" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-700 dark:text-amber-400">
          <strong>⚠️ Important:</strong> Once you submit this prescription, it will be permanently locked and cannot be edited. Please review carefully before submitting.
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={submitting} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
            {submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</> : '🔒 Submit & Lock Prescription'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary px-6">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddPrescription;
