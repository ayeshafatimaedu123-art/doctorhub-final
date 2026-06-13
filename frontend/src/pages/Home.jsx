import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const { isAuthenticated, user } = useSelector(s => s.auth);
  const dashboardPath = { patient: '/patient/dashboard', doctor: '/doctor/dashboard', assistant: '/assistant/dashboard', admin: '/admin/dashboard', superadmin: '/admin/dashboard' }[user?.role] || '/patient/dashboard';

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-teal-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white">Doctor Hub</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/doctors" className="hidden sm:block text-slate-600 dark:text-slate-400 hover:text-primary-600 font-medium text-sm transition-colors">Find Doctors</Link>
            {isAuthenticated ? (
              <Link to={dashboardPath} className="btn-primary py-2 text-sm">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn-secondary py-2 text-sm">Login</Link>
                <Link to="/register" className="btn-primary py-2 text-sm">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-slate-50 via-primary-50/30 to-teal-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-sm font-semibold px-4 py-2 rounded-full border border-primary-200 dark:border-primary-800 mb-8">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
            Pakistan's Trusted Healthcare Platform
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
            Find the Right{' '}
            <span className="text-gradient">Doctor</span>
            <br />for Your Health
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect with verified Allopathic, Homeopathic & Herbal doctors. Book appointments, upload payments, and manage your complete medical history — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/doctors" className="btn-primary text-base py-3.5 px-8 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Search Doctors
            </Link>
            <Link to="/register" className="btn-secondary text-base py-3.5 px-8">Create Free Account</Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[{v:'500+',l:'Verified Doctors'},{v:'10K+',l:'Patients Served'},{v:'3',l:'Treatment Types'},{v:'99%',l:'Satisfaction Rate'}].map(s => (
              <div key={s.l} className="text-center">
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{s.v}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Treatment Types */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Treatment Types Available</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Choose from multiple healthcare approaches</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { type: 'Allopathic', icon: '💊', desc: 'Modern evidence-based medicine with qualified MBBS doctors and specialists.', color: 'from-blue-500 to-primary-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
              { type: 'Homeopathic', icon: '🌿', desc: 'Natural healing using highly diluted substances that stimulate the body\'s self-healing.', color: 'from-green-500 to-teal-500', bg: 'bg-green-50 dark:bg-green-900/10' },
              { type: 'Herbal', icon: '🍃', desc: 'Traditional plant-based medicine using herbs, roots and natural remedies.', color: 'from-teal-500 to-emerald-500', bg: 'bg-teal-50 dark:bg-teal-900/10' },
            ].map(t => (
              <div key={t.type} className={`card ${t.bg} hover:shadow-card-hover group`}>
                <div className={`w-16 h-16 bg-gradient-to-br ${t.color} rounded-2xl flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform`}>{t.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t.type}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-5">{t.desc}</p>
                <Link to={`/doctors?treatmentType=${t.type}`} className="text-primary-600 dark:text-primary-400 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  View Doctors <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Simple 4-step process to get your consultation</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Search Doctor', desc: 'Find doctors by disease, specialization, or city', icon: '🔍' },
              { step: 2, title: 'Book Appointment', desc: 'Select date, time and book your slot instantly', icon: '📅' },
              { step: 3, title: 'Pay & Confirm', desc: 'Upload payment screenshot for assistant verification', icon: '💳' },
              { step: 4, title: 'Get Prescription', desc: 'Doctor adds digital prescription to your medical history', icon: '📋' },
            ].map((s, i) => (
              <div key={s.step} className="text-center relative">
                {i < 3 && <div className="hidden md:block absolute top-8 left-3/4 w-1/2 h-0.5 bg-gradient-to-r from-primary-200 to-primary-100 dark:from-primary-800 dark:to-primary-900" />}
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-teal-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg">{s.icon}</div>
                <div className="w-7 h-7 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center mx-auto -mt-2 mb-4 relative z-10">{s.step}</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary-600 to-teal-500 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10"><div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl" /></div>
            <h2 className="text-4xl font-bold mb-4 relative z-10">Ready to Start?</h2>
            <p className="text-white/80 text-lg mb-8 relative z-10">Join thousands of patients managing their health on Doctor Hub.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link to="/register" className="bg-white text-primary-700 font-bold px-8 py-3.5 rounded-xl hover:bg-white/90 transition-all active:scale-95">Get Started Free</Link>
              <Link to="/doctors" className="bg-white/20 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/30 border border-white/30 transition-all active:scale-95">Browse Doctors</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-teal-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
            </div>
            <span className="font-bold text-slate-900 dark:text-white">Doctor Hub</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">© 2024 Doctor Hub. Built as FYP — BSCS Final Year Project.</p>
          <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <Link to="/doctors" className="hover:text-primary-600 transition-colors">Find Doctors</Link>
            <Link to="/login" className="hover:text-primary-600 transition-colors">Login</Link>
            <Link to="/register" className="hover:text-primary-600 transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
