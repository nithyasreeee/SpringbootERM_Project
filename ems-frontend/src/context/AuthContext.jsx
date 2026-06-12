import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('ems_token');
    const savedUser = localStorage.getItem('ems_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    setLoading(false);
  }, []);

  const loginUser = (tokenVal, username, role) => {
    const userData = { username, role };
    setToken(tokenVal);
    setUser(userData);
    localStorage.setItem('ems_token', tokenVal);
    localStorage.setItem('ems_user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenVal}`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ems_token');
    localStorage.removeItem('ems_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Role helpers
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isEmployee = user?.role === 'EMPLOYEE';

  return (
    <AuthContext.Provider value={{
      user, token, loginUser, logout, loading,
      isAdmin, isSuperAdmin, isEmployee
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);