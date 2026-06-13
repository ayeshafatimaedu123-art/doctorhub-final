import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { toggleSidebar } from '../../redux/slices/uiSlice';

const Sidebar = ({ links, role, logo = true }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const { sidebarOpen } = useSelector(s => s.ui);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const roleColors = {
    patient: 'from-primary-600 to-teal-500',
    doctor: 'from-indigo-600 to-primary-500',
    assistant: 'from-violet-600 to-purple-500',
    admin: 'from-rose-600 to-orange-500',
    superadmin: 'from-slate-800 to-slate-600',
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => dispatch(toggleSidebar())} />
      )}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 z-50 flex flex-col shadow-xl transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className={`p-6 bg-gradient-to-br ${roleColors[user?.role] || roleColors.patient}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                <path d="M13 8h-2v3H8v2h3v3h2v-3h3v-2h-3V8z" fill="white"/>
              </svg>
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight">Doctor Hub</span>
              <p className="text-white/70 text-xs capitalize">{user?.role} Panel</p>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-teal-400 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => window.innerWidth < 1024 && dispatch(toggleSidebar())}
            >
              <span className="w-5 h-5 flex-shrink-0">{link.icon}</span>
              <span className="text-sm">{link.label}</span>
              {link.badge && (
                <span className="ml-auto bg-primary-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{link.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 font-medium text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
