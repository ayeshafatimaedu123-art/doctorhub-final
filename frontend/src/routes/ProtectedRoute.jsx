import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const paths = {
      patient: '/patient/dashboard',
      doctor: '/doctor/dashboard',
      assistant: '/assistant/dashboard',
      admin: '/admin/dashboard',
      superadmin: '/admin/dashboard'
    };
    return <Navigate to={paths[user?.role] || '/'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
