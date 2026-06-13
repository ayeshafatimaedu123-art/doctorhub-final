import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments, updateAppointment } from '../../redux/slices/appointmentSlice';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';

const AppointmentQueue = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector(s => s.appointments);

  useEffect(() => {
    dispatch(fetchAppointments({ status: 'payment_verified' }));
  }, []);

  const handleConfirm = (id) =>
    dispatch(updateAppointment({ id, data: { status: 'confirmed', notes: 'Confirmed by assistant' } }));

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="page-title">Appointment Queue</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Manage confirmed appointment tokens
        </p>
      </div>

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-700 dark:text-blue-400 flex items-center gap-3">
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        Showing appointments with verified payment — confirm to finalize the patient's slot.
      </div>

      {loading ? <Spinner center /> : list.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-5xl mb-4">📋</p>
          <p className="font-semibold text-slate-900 dark:text-white mb-2">Queue is empty</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">No appointments awaiting confirmation</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header">
                  <th className="text-left px-5 py-3.5">Token</th>
                  <th className="text-left px-5 py-3.5">Patient</th>
                  <th className="text-left px-5 py-3.5">Doctor</th>
                  <th className="text-left px-5 py-3.5">Date & Time</th>
                  <th className="text-left px-5 py-3.5">Clinic</th>
                  <th className="text-left px-5 py-3.5">Status</th>
                  <th className="text-left px-5 py-3.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {list.map(a => (
                  <tr key={a._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-full flex items-center justify-center font-bold text-sm">
                        {a.tokenNumber || '—'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-primary-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {a.patientId?.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{a.patientId?.name}</p>
                          <p className="text-xs text-slate-400">{a.patientId?.phone || a.patientId?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800 dark:text-slate-200">Dr. {a.doctorId?.name}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                      <p>{a.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }) : '—'}</p>
                      <p className="text-xs">{a.appointmentTime}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-sm">
                      {a.clinicId?.clinicName || '—'}
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={a.status} /></td>
                    <td className="px-5 py-4">
                      {a.status === 'payment_verified' && (
                        <button
                          onClick={() => handleConfirm(a._id)}
                          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors active:scale-95 flex items-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                          Confirm Slot
                        </button>
                      )}
                      {a.status === 'confirmed' && (
                        <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold">✓ Confirmed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentQueue;
