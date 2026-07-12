import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Url_backend } from '../App';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const stored = () => {
    try {
      const t = localStorage.getItem('eb_token');
      const u = localStorage.getItem('eb_user');
      return { token: t || '', user: u ? JSON.parse(u) : null };
    } catch {
      return { token: '', user: null };
    }
  };

  const [token, setToken] = useState(stored().token);
  const [user, setUser] = useState(stored().user);

  const persist = (tkn, usr) => {
    setToken(tkn);
    setUser(usr);
    localStorage.setItem('eb_token', tkn);
    localStorage.setItem('eb_user', JSON.stringify(usr));
  };

  const register = useCallback(async (name, email, password) => {
    const res = await axios.post(`${Url_backend}/api/user/register`, { name, email, password });
    if (res.data.success) {
      persist(res.data.token, res.data.user);
      toast.success('Welcome to Emerald Bistro!');
      return true;
    }
    toast.error(res.data.message);
    return false;
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await axios.post(`${Url_backend}/api/user/login`, { email, password });
    if (res.data.success) {
      persist(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      return true;
    }
    toast.error(res.data.message);
    return false;
  }, []);

  const logout = useCallback(() => {
    setToken('');
    setUser(null);
    localStorage.removeItem('eb_token');
    localStorage.removeItem('eb_user');
    toast.success('Signed out successfully');
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, register, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
