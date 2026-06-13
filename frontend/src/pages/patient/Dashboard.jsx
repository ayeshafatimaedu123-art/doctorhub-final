import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAppointments } from '../../redux/slices/appointmentSlice';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';

const PatientDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { list: appointments, loading } = useSelector(s => s.appointments);

  useEffect(() => { dispatch(fetchAppointments({ limit: 5 })); }, []);

  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(a => ['confirmed','payment_verified'].includes(a.status)).length,
    completed: appointments.filter(a => a.status === 'completed').length,
    pending: appointments.filter(a => ['pending','payment_uploaded'].includes(a.status)).length,
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Welcome */}
      <div className="bg-gradient-to-br from-primary-600 to-teal-500 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium mb-1">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'},</p>
          <h1 className="text-2xl font-bold mb-1">{user?.name} 👋</h1>
          <p className="text-white/70 text-sm">Manage your health appointments and medical records from here.</p>
        </div>
        <Link to="/doctors" className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-white/30 transition-all text-sm hidden sm:block">
          Find a Doctor →
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Appointments" value={stats.total} color="primary" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
        <StatCard title="Upcoming" value={stats.upcoming} color="teal" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard title="Completed" value={stats.completed} color="green" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard title="Pending" value={stats.pending} color="amber" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Find Doctor', to: '/doctors', color: 'from-primary-500 to-primary-600', icon: '🔍' },
          { label: 'My Appointments', to: '/patient/appointments', color: 'from-teal-500 to-teal-600', icon: '📅' },
          { label: 'Prescriptions', to: '/patient/prescriptions', color: 'from-violet-500 to-violet-600', icon: '💊' },
          { label: 'Medical History', to: '/patient/history', color: 'from-rose-500 to-rose-600', icon: '📋' },
        ].map(a => (
          <Link key={a.to} to={a.to} className={`bg-gradient-to-br ${a.color} rounded-2xl p-5 text-white font-semibold flex flex-col gap-2 hover:shadow-lg active:scale-95 transition-all`}>
            <span className="text-2xl">{a.icon}</span>
            <span className="text-sm">{a.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-slate-900 dark:text-white text-lg">Recent Appointments</h2>
          <Link to="/patient/appointments" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">View All →</Link>
        </div>
        {loading ? <Spinner center /> : appointments.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-3">📅</p>
            <p className="text-slate-500 dark:text-slate-400 font-medium">No appointments yet</p>
            <Link to="/doctors" className="btn-primary mt-4 inline-block text-sm">Book Appointment</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="table-header"><th className="text-left px-4 py-3 rounded-l-lg">Doctor</th><th className="text-left px-4 py-3">Date</th><th className="text-left px-4 py-3">Clinic</th><th className="text-left px-4 py-3">Fee</th><th className="text-left px-4 py-3 rounded-r-lg">Status</th></tr></thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {appointments.map(a => (
                  <tr key={a._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3.5"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-teal-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{a.doctorId?.name?.charAt(0)}</div><span className="font-medium text-slate-900 dark:text-white">Dr. {a.doctorId?.name}</span></div></td>
                    <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400">{a.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }) : '—'}</td>
                    <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400">{a.clinicId?.clinicName || '—'}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900 dark:text-white">Rs. {a.fee?.toLocaleString()}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
