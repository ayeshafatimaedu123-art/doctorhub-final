import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPayments } from '../../redux/slices/paymentSlice';
import { fetchAppointments } from '../../redux/slices/appointmentSlice';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';

const AssistantDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { list: payments, loading: pLoading } = useSelector(s => s.payments);
  const { list: appointments } = useSelector(s => s.appointments);

  useEffect(() => {
    dispatch(fetchPayments({ status: 'pending', limit: 5 }));
    dispatch(fetchAppointments({ status: 'payment_verified', limit: 5 }));
  }, []);

  const stats = {
    pending: payments.filter(p => p.verificationStatus === 'pending').length,
    verified: payments.filter(p => p.verificationStatus === 'verified').length,
    rejected: payments.filter(p => p.verificationStatus === 'rejected').length,
    queue: appointments.filter(a => a.status === 'payment_verified').length,
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="bg-gradient-to-br from-violet-600 to-purple-500 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium mb-1">Welcome,</p>
          <h1 className="text-2xl font-bold mb-1">{user?.name} 🗂️</h1>
          <p className="text-white/70 text-sm">
            <span className="text-white font-bold">{stats.pending}</span> payments awaiting verification
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Payments" value={stats.pending} color="amber"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard title="Verified" value={stats.verified} color="green"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard title="Rejected" value={stats.rejected} color="rose"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard title="Queue Size" value={stats.queue} color="violet"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/assistant/payments" className="bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-2xl p-5 font-semibold flex items-center gap-3 hover:shadow-lg active:scale-95 transition-all">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p>Verify Payments</p>
            <p className="text-white/70 text-xs font-normal">{stats.pending} pending</p>
          </div>
        </Link>
        <Link to="/assistant/queue" className="bg-gradient-to-br from-indigo-500 to-primary-600 text-white rounded-2xl p-5 font-semibold flex items-center gap-3 hover:shadow-lg active:scale-95 transition-all">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
          </div>
          <div>
            <p>Appointment Queue</p>
            <p className="text-white/70 text-xs font-normal">{stats.queue} confirmed</p>
          </div>
        </Link>
      </div>

      {/* Recent Pending Payments */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-slate-900 dark:text-white text-lg">Pending Verifications</h2>
          <Link to="/assistant/payments" className="text-primary-600 text-sm font-semibold">View All →</Link>
        </div>
        {pLoading ? <Spinner center /> : payments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-3xl mb-2">✅</p>
            <p className="text-slate-500 dark:text-slate-400 font-medium">All payments verified!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.slice(0, 5).map(p => (
              <div key={p._id} className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {p.patientId?.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{p.patientId?.name}</p>
                  <p className="text-xs text-slate-400">Rs. {p.amount?.toLocaleString()} • {p.paymentMethod?.replace('_', ' ')}</p>
                </div>
                <StatusBadge status={p.verificationStatus} />
                <Link to="/assistant/payments" className="btn-primary text-xs py-1.5 px-3">Verify</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssistantDashboard;
