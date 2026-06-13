import { useSelector, useDispatch } from 'react-redux';
import { login, logout, register, getMe } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogin = async (data) => {
    const result = await dispatch(login(data));
    if (!result.error) {
      const role = result.payload.user.role;
      navigate(getDashboardPath(role));
    }
  };

  const handleRegister = async (data) => {
    const result = await dispatch(register(data));
    if (!result.error) {
      const role = result.payload.user.role;
      navigate(getDashboardPath(role));
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const getDashboardPath = (role) => {
    const paths = {
      patient: '/patient/dashboard',
      doctor: '/doctor/dashboard',
      assistant: '/assistant/dashboard',
      admin: '/admin/dashboard',
      superadmin: '/admin/dashboard'
    };
    return paths[role] || '/';
  };

  return { user, token, loading, error, isAuthenticated, handleLogin, handleRegister, handleLogout, getDashboardPath };
};

export default useAuth;
