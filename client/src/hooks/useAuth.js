import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const useAuth = () => {
  const { user, isAuthenticated, login, logout, setToken } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return { user, isAuthenticated, login, logout: handleLogout, setToken };
};

export default useAuth;
