import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerUser } from '../../redux/slices/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(s => s.auth);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { role: 'patient' } });
  const role = watch('role');

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser(data));
    if (!result.error) {
      const paths = { patient: '/patient/dashboard', doctor: '/doctor/dashboard' };
      navigate(paths[result.payload.user.role] || '/');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-primary-600 to-indigo-600 flex-col justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-teal-200 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
            </div>
            <span className="text-white font-bold text-2xl">Doctor Hub</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-6">Join Doctor Hub Today</h1>
          <p className="text-white/80 text-lg mb-10">Start your healthcare journey — whether you're a patient seeking care or a doctor ready to serve.</p>
          <div className="grid grid-cols-2 gap-4">
            {[{title:'As Patient', desc:'Search doctors, book appointments & manage health records'},{title:'As Doctor', desc:'Create your clinic, manage schedules & add prescriptions'}].map(r=>(
              <div key={r.title} className="bg-white/10 rounded-2xl p-4">
                <p className="text-white font-semibold mb-1">{r.title}</p>
                <p className="text-white/70 text-sm">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md animate-in py-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Fill in your details to get started</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Register as</label>
              <div className="grid grid-cols-2 gap-3">
                {['patient', 'doctor'].map(r => (
                  <label key={r} className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${role === r ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                    <input type="radio" value={r} {...register('role')} className="hidden" />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${role === r ? 'border-primary-500' : 'border-slate-300'}`}>
                      {role === r && <div className="w-2 h-2 rounded-full bg-primary-500" />}
                    </div>
                    <span className={`text-sm font-semibold capitalize ${role === r ? 'text-primary-700 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400'}`}>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
              <input type="text" className={`input-field ${errors.name ? 'border-red-400' : ''}`} placeholder="Dr. Ahmed Khan" {...register('name', { required: 'Name is required', minLength: { value: 3, message: 'Min 3 characters' } })} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <input type="email" className={`input-field ${errors.email ? 'border-red-400' : ''}`} placeholder="you@example.com" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
              <input type="tel" className="input-field" placeholder="+92 300 1234567" {...register('phone')} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <input type="password" className={`input-field ${errors.password ? 'border-red-400' : ''}`} placeholder="Min 6 characters" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2">
              {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
