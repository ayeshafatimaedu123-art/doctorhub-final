import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments, updateAppointment } from '../../redux/slices/appointmentSlice';
import { uploadPayment } from '../../redux/slices/paymentSlice';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';
import { Link } from 'react-router-dom';

const PatientAppointments = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector(s => s.appointments);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentModal, setPaymentModal] = useState(null);
  const [payFile, setPayFile] = useState(null);
  const [payMethod, setPayMethod] = useState('bank_transfer');
  const [uploading, setUploading] = useState(false);

  useEffect(() => { dispatch(fetchAppointments({ status: statusFilter || undefined })); }, [statusFilter]);

  const handleCancel = (id) => {
    if (!confirm('Cancel this appointment?')) return;
    dispatch(updateAppointment({ id, data: { status: 'cancelled', cancelReason: 'Cancelled by patient' } }));
  };

  const handlePayment = async () => {
    if (!payFile) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('screenshot', payFile);
    fd.append('appointmentId', paymentModal);
    fd.append('paymentMethod', payMethod);
    await dispatch(uploadPayment(fd));
    setPaymentModal(null); setPayFile(null); setUploading(false);
    dispatch(fetchAppointments({}));
  };

  const statuses = ['', 'pending', 'payment_uploaded', 'payment_verified', 'confirmed', 'completed', 'cancelled'];

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">My Appointments</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track and manage all your appointments</p>
        </div>
        <Link to="/doctors" className="btn-primary text-sm">+ Book New</Link>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        {statuses.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${statusFilter === s ? 'bg-primary-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>
            {s ? s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'All'}
          </button>
        ))}
      </div>

      {loading ? <Spinner center /> : list.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-4">No appointments found</p>
          <Link to="/doctors" className="btn-primary">Find a Doctor</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map(a => (
            <div key={a._id} className="card hover:shadow-card-hover transition-all">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-teal-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {a.doctorId?.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Dr. {a.doctorId?.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      📅 {a.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString('en-PK', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      &nbsp;•&nbsp; ⏰ {a.appointmentTime}
                      &nbsp;•&nbsp; 🏥 {a.clinicId?.clinicName || 'Clinic'}
                    </p>
                    {a.symptoms && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Symptoms: {a.symptoms}</p>}
                    <div className="flex items-center gap-3 mt-2">
                      <StatusBadge status={a.status} />
                      <span className="text-sm font-bold text-slate-900 dark:text-white">Rs. {a.fee?.toLocaleString()}</span>
                      {a.tokenNumber && <span className="text-xs text-slate-400 dark:text-slate-500">Token #{a.tokenNumber}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {a.status === 'pending' && (
                    <button onClick={() => setPaymentModal(a._id)} className="btn-primary text-sm py-2 px-4">Upload Payment</button>
                  )}
                  {['pending', 'payment_uploaded'].includes(a.status) && (
                    <button onClick={() => handleCancel(a._id)} className="btn-danger text-sm py-2 px-4">Cancel</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Upload Modal */}
      {paymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-md animate-in">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-4">Upload Payment Screenshot</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Payment Method</label>
                <select value={payMethod} onChange={e => setPayMethod(e.target.value)} className="input-field">
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="easypaisa">EasyPaisa</option>
                  <option value="jazzcash">JazzCash</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Screenshot</label>
                <input type="file" accept="image/*" onChange={e => setPayFile(e.target.files[0])} className="input-field py-2" />
              </div>
              {payFile && <p className="text-xs text-teal-600 dark:text-teal-400">✓ {payFile.name} selected</p>}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handlePayment} disabled={!payFile || uploading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {uploading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Uploading...</> : 'Upload Payment'}
              </button>
              <button onClick={() => setPaymentModal(null)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
