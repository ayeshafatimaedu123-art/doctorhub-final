import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const PIE_COLORS = ['#0ea5e9','#14b8a6','#8b5cf6','#f59e0b','#ef4444','#10b981','#f97316'];

const AdminDashboard = () => {
  const { user } = useSelector(s => s.auth);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics').then(r => setAnalytics(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner center size="lg" />;
  if (!analytics) return <div className="text-center text-slate-500 py-20">Failed to load analytics</div>;

  const revenueData = analytics.monthlyRevenue.map(r => ({
    name: MONTHS[r._id.month - 1],
    revenue: r.revenue,
    appointments: r.count
  }));

  const statusData = analytics.appointmentsByStatus.map(s => ({
    name: s._id?.replace('_', ' '),
    value: s.count
  }));

  const specializationData = analytics.doctorsBySpecialization.slice(0, 6).map(s => ({
    name: s._id,
    count: s.count
  }));

  return (
    <div className="space-y-6 animate-in">
      {/* Welcome */}
      <div className="bg-gradient-to-br from-rose-600 to-orange-500 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium mb-1">Admin Panel</p>
          <h1 className="text-2xl font-bold mb-1">{user?.name} 🛡️</h1>
          <p className="text-white/70 text-sm capitalize">{user?.role} — Complete system oversight</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={analytics.totalUsers} color="primary"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
        <StatCard title="Total Doctors" value={analytics.totalDoctors} color="teal"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} />
        <StatCard title="Appointments" value={analytics.totalAppointments} color="violet"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
        <StatCard title="Total Revenue" value={`Rs. ${(analytics.totalRevenue / 1000).toFixed(1)}K`} color="amber"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
      </div>

      {/* Pending Payments Alert */}
      {analytics.pendingPayments > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-amber-700 dark:text-amber-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span className="font-semibold text-sm">{analytics.pendingPayments} payments pending verification</span>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="card lg:col-span-2">
          <h3 className="font-bold text-slate-900 dark:text-white mb-5">Monthly Revenue</h3>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip formatter={v => [`Rs. ${v.toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="revenue" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="flex items-center justify-center h-48 text-slate-400">No revenue data yet</div>}
        </div>

        {/* Appointment Status Pie */}
        <div className="card">
          <h3 className="font-bold text-slate-900 dark:text-white mb-5">Appointment Status</h3>
          {statusData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {statusData.map((s, i) => (
                  <div key={s.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-slate-600 dark:text-slate-400 capitalize">{s.name}</span>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <div className="flex items-center justify-center h-48 text-slate-400">No data yet</div>}
        </div>
      </div>

      {/* Doctors by Specialization */}
      {specializationData.length > 0 && (
        <div className="card">
          <h3 className="font-bold text-slate-900 dark:text-white mb-5">Doctors by Specialization</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={specializationData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" fill="#14b8a6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Appointments */}
      <div className="card">
        <h3 className="font-bold text-slate-900 dark:text-white mb-5">Recent Appointments</h3>
        {analytics.recentAppointments?.length === 0 ? (
          <p className="text-slate-400 text-center py-6">No appointments yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="table-header">
                <th className="text-left px-4 py-3 rounded-l-lg">Patient</th>
                <th className="text-left px-4 py-3">Doctor</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Fee</th>
                <th className="text-left px-4 py-3 rounded-r-lg">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {analytics.recentAppointments.map(a => (
                  <tr key={a._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-white">{a.patientId?.name}</td>
                    <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400">Dr. {a.doctorId?.name}</td>
                    <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400">{a.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }) : '—'}</td>
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

export default AdminDashboard;
