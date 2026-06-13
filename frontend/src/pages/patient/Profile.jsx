import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { updateUser } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const PatientProfile = () => {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const [tab, setTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { name: user?.name, phone: user?.phone } });
  const { register: reg2, handleSubmit: hs2, watch, formState: { errors: e2 } } = useForm();

  const onSaveProfile = async (data) => {
    setSaving(true);
    try {
      const res = await api.put('/users/profile', data);
      dispatch(updateUser(res.data.data));
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  const onChangePassword = async (data) => {
    setSaving(true);
    try {
      await api.put('/users/change-password', data);
      toast.success('Password changed!');
    } catch (err) { toast.error(err.response?.data?.message || 'Change failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in">
      <h1 className="page-title">My Profile</h1>

      {/* Avatar Card */}
      <div className="card text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-teal-400 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-3 overflow-hidden">
          {user?.profileImage ? <img src={user.profileImage} alt="" className="w-full h-full object-cover" /> : user?.name?.charAt(0)}
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{user?.email}</p>
        <span className="inline-block mt-2 badge-status bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 capitalize">{user?.role}</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['profile', 'security'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all capitalize ${tab === t ? 'bg-primary-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>{t}</button>
        ))}
      </div>

      {tab === 'profile' && (
        <form onSubmit={handleSubmit(onSaveProfile)} className="card space-y-5">
          <h3 className="font-bold text-slate-900 dark:text-white">Personal Information</h3>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
            <input type="text" className={`input-field ${errors.name ? 'border-red-400' : ''}`} {...register('name', { required: 'Name required' })} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email</label>
            <input type="email" value={user?.email} disabled className="input-field opacity-60 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone</label>
            <input type="tel" className="input-field" placeholder="+92 300 1234567" {...register('phone')} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : 'Save Changes'}
          </button>
        </form>
      )}

      {tab === 'security' && (
        <form onSubmit={hs2(onChangePassword)} className="card space-y-5">
          <h3 className="font-bold text-slate-900 dark:text-white">Change Password</h3>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
            <input type="password" className={`input-field ${e2.currentPassword ? 'border-red-400' : ''}`} {...reg2('currentPassword', { required: 'Required' })} />
            {e2.currentPassword && <p className="text-red-500 text-xs mt-1">{e2.currentPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">New Password</label>
            <input type="password" className={`input-field ${e2.newPassword ? 'border-red-400' : ''}`} {...reg2('newPassword', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })} />
            {e2.newPassword && <p className="text-red-500 text-xs mt-1">{e2.newPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Confirm New Password</label>
            <input type="password" className={`input-field ${e2.confirmPassword ? 'border-red-400' : ''}`} {...reg2('confirmPassword', { required: 'Required', validate: v => v === watch('newPassword') || 'Passwords do not match' })} />
            {e2.confirmPassword && <p className="text-red-500 text-xs mt-1">{e2.confirmPassword.message}</p>}
          </div>
          <button type="submit" disabled={saving} className="btn-primary">Update Password</button>
        </form>
      )}
    </div>
  );
};

export default PatientProfile;
