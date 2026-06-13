import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTodayAppointments, fetchAppointments } from '../../redux/slices/appointmentSlice';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { today, list, loading } = useSelector(s => s.appointments);

  useEffect(() => {
    dispatch(fetchTodayAppointments());
    dispatch(fetchAppointments({ limit: 5 }));
  }, []);

  const stats = {
    todayCount: today.length,
    total: list.length,
    completed: list.filter(a => a.status === 'completed').length,
    pending: list.filter(a => ['confirmed', 'payment_verified'].includes(a.status)).length,
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-indigo-600 to-primary-500 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium mb-1">Welcome back, Doctor</p>
          <h1 className="text-2xl font-bold mb-1">Dr. {user?.name} 👨‍⚕️</h1>
          <p className="text-white/70 text-sm">You have <strong className="text-white">{stats.todayCount}</strong> appointments today</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Patients" value={stats.todayCount} color="primary" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard title="Total Appointments" value={stats.total} color="teal" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
        <StatCard title="Completed" value={stats.completed} color="green" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard title="Awaiting" value={stats.pending} color="amber" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
      </div>

      {/* Today's Queue */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-slate-900 dark:text-white text-lg">Today's Queue</h2>
          <Link to="/doctor/appointments" className="text-primary-600 text-sm font-semibold">View All →</Link>
        </div>
        {loading ? <Spinner center /> : today.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-slate-500 dark:text-slate-400 font-medium">No appointments today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {today.map((a, i) => (
              <div key={a._id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {a.tokenNumber || i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{a.patientId?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{a.appointmentTime} • {a.clinicId?.clinicName}</p>
                </div>
                <StatusBadge status={a.status} />
                {a.status === 'payment_verified' && (
                  <Link to={`/doctor/prescription/${a._id}`} className="btn-primary text-xs py-1.5 px-3 whitespace-nowrap">Add Rx</Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'My Profile', to: '/doctor/profile', color: 'from-indigo-500 to-primary-500', icon: '👤' },
          { label: 'My Clinics', to: '/doctor/clinics', color: 'from-teal-500 to-green-500', icon: '🏥' },
          { label: 'All Patients', to: '/doctor/patients', color: 'from-violet-500 to-purple-500', icon: '👥' },
        ].map(l => (
          <Link key={l.to} to={l.to} className={`bg-gradient-to-br ${l.color} text-white rounded-2xl p-4 text-center font-semibold text-sm hover:shadow-lg active:scale-95 transition-all`}>
            <div className="text-2xl mb-1">{l.icon}</div>
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DoctorDashboard;
