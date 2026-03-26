import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('centralconnect_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (payload) => {
    localStorage.setItem('centralconnect_user', JSON.stringify(payload));
    setUser(payload);
  };

  const logout = () => {
    localStorage.removeItem('centralconnect_user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
