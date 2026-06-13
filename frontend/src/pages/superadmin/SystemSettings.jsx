import { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const SystemSettings = () => {
  const { user } = useSelector(s => s.auth);
  const [activeTab, setActiveTab] = useState('create-admin');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  if (user?.role !== 'superadmin') {
    return (
      <div className="card text-center py-16">
        <p className="text-5xl mb-4">🚫</p>
        <p className="font-bold text-slate-900 dark:text-white">Super Admin Only</p>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">This section requires superadmin access.</p>
      </div>
    );
  }

  const onCreateAdmin = async (data) => {
    setLoading(true);
    try {
      await api.post('/admin/create-admin', { ...data, role: 'admin' });
      toast.success('Admin account created successfully!');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create admin');
    } finally { setLoading(false); }
  };

  const tabs = [
    { id: 'create-admin', label: 'Create Admin', icon: '👤' },
    { id: 'system-info', label: 'System Info', icon: '⚙️' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center text-white text-sm">👑</div>
          <h1 className="page-title">System Settings</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Super Admin controls — full system access</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === t.id ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {activeTab === 'create-admin' && (
        <form onSubmit={handleSubmit(onCreateAdmin)} className="card space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Create Admin Account</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Only superadmins can create admins</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name *</label>
              <input type="text" className={`input-field ${errors.name ? 'border-red-400' : ''}`} placeholder="Admin Name" {...register('name', { required: 'Name required', minLength: { value: 3, message: 'Min 3 chars' } })} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address *</label>
              <input type="email" className={`input-field ${errors.email ? 'border-red-400' : ''}`} placeholder="admin@hospital.com" {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone</label>
              <input type="tel" className="input-field" placeholder="+92-300-0000000" {...register('phone')} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Temporary Password *</label>
              <input type="password" className={`input-field ${errors.password ? 'border-red-400' : ''}`} placeholder="Min 6 chars" {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 chars' } })} />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-400">
            ⚠️ The new admin should change their password on first login.
          </div>

          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating...</> : 'Create Admin Account'}
          </button>
        </form>
      )}

      {activeTab === 'system-info' && (
        <div className="card space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white">System Information</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: 'Platform', value: 'Doctor Hub v1.0.0' },
              { label: 'Stack', value: 'MERN (MongoDB, Express, React, Node)' },
              { label: 'Auth', value: 'JWT + Refresh Tokens' },
              { label: 'Security', value: 'Helmet, CORS, Rate Limiting' },
              { label: 'Storage', value: 'MongoDB Atlas + Multer' },
              { label: 'Frontend', value: 'React + Vite + Tailwind CSS' },
              { label: 'Deployment', value: 'Vercel (FE) + Render (BE)' },
              { label: 'Build', value: 'FYP — BSCS Final Year Project' },
            ].map(item => (
              <div key={item.label} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide font-semibold mb-1">{item.label}</p>
                <p className="font-medium text-slate-900 dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-teal-50 dark:from-primary-900/10 dark:to-teal-900/10 border border-primary-100 dark:border-primary-800 rounded-xl p-4 text-sm">
            <p className="font-semibold text-primary-700 dark:text-primary-400 mb-1">Logged in as Super Admin</p>
            <p className="text-primary-600 dark:text-primary-500">{user?.email}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemSettings;
