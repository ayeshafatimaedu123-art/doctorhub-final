import { useForm } from 'react-hook-form';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useState } from 'react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async ({ password }) => {
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Link may have expired.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="w-full max-w-md animate-in">
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Reset Password</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">Enter your new password below.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">New Password</label>
              <input type="password" className={`input-field ${errors.password ? 'border-red-400' : ''}`} placeholder="Min 6 characters" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Confirm Password</label>
              <input type="password" className={`input-field ${errors.confirmPassword ? 'border-red-400' : ''}`} placeholder="Repeat password" {...register('confirmPassword', { required: 'Please confirm', validate: v => v === watch('password') || 'Passwords do not match' })} />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Resetting...</> : 'Reset Password'}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            <Link to="/login" className="text-primary-600 font-semibold">← Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
