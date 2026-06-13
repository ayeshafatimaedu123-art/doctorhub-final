import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAppointments, updateAppointment } from '../../redux/slices/appointmentSlice';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';

const DoctorAppointments = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector(s => s.appointments);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { dispatch(fetchAppointments({ status: statusFilter || undefined })); }, [statusFilter]);

  const handleComplete = (id) => dispatch(updateAppointment({ id, data: { status: 'completed' } }));

  const statuses = ['', 'confirmed', 'payment_verified', 'completed', 'pending', 'cancelled'];

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">All patient appointments</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {statuses.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${statusFilter === s ? 'bg-primary-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
            {s ? s.replace('_', ' ') : 'All'}
          </button>
        ))}
      </div>

      {loading ? <Spinner center /> : list.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-slate-500 dark:text-slate-400 font-medium">No appointments found</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header">
                  <th className="text-left px-5 py-3.5">Token</th>
                  <th className="text-left px-5 py-3.5">Patient</th>
                  <th className="text-left px-5 py-3.5">Date & Time</th>
                  <th className="text-left px-5 py-3.5">Clinic</th>
                  <th className="text-left px-5 py-3.5">Fee</th>
                  <th className="text-left px-5 py-3.5">Status</th>
                  <th className="text-left px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {list.map(a => (
                  <tr key={a._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full flex items-center justify-center font-bold text-sm">
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
                          <p className="text-xs text-slate-400">{a.patientId?.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                      <p>{a.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }) : '—'}</p>
                      <p className="text-xs">{a.appointmentTime}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-sm">{a.clinicId?.clinicName || '—'}</td>
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">Rs. {a.fee?.toLocaleString()}</td>
                    <td className="px-5 py-4"><StatusBadge status={a.status} /></td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {a.status === 'payment_verified' && (
                          <Link to={`/doctor/prescription/${a._id}`} className="btn-primary text-xs py-1.5 px-3">Add Rx</Link>
                        )}
                        {a.status === 'confirmed' && (
                          <button onClick={() => handleComplete(a._id)} className="text-xs bg-green-500 hover:bg-green-600 text-white py-1.5 px-3 rounded-lg transition-colors font-semibold">Complete</button>
                        )}
                      </div>
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

export default DoctorAppointments;
