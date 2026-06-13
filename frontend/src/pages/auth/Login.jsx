import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(s => s.auth);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const getDashboard = (role) => ({ patient: '/patient/dashboard', doctor: '/doctor/dashboard', assistant: '/assistant/dashboard', admin: '/admin/dashboard', superadmin: '/admin/dashboard' }[role] || '/');

  const onSubmit = async (data) => {
    const result = await dispatch(login(data));
    if (!result.error) navigate(getDashboard(result.payload.user.role));
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-700 via-primary-600 to-teal-500 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>
            </div>
            <span className="text-white font-bold text-2xl">Doctor Hub</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-6">Your Health, Our Priority</h1>
          <p className="text-white/80 text-lg leading-relaxed mb-10">Connect with qualified Allopathic, Homeopathic & Herbal doctors. Book appointments and manage your complete medical history securely.</p>
          <div className="space-y-4">
            {['Verified Doctors', 'Secure Medical Records', 'Easy Appointment Booking', 'Complete Prescription History'].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-white/90 font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/50 text-sm relative z-10">© 2024 Doctor Hub. All rights reserved.</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-in">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">Doctor Hub</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome back</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                className={`input-field ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                placeholder="you@example.com"
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700 font-medium">Forgot password?</Link>
              </div>
              <input
                type="password"
                className={`input-field ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                placeholder="••••••••"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base">
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">Create account</Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
              <div><span className="font-medium">Patient:</span> patient@demo.com / 123456</div>
              <div><span className="font-medium">Doctor:</span> doctor@demo.com / 123456</div>
              <div><span className="font-medium">Admin:</span> admin@demo.com / 123456</div>
              <div><span className="font-medium">Assistant:</span> asst@demo.com / 123456</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
