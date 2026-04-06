import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = (email, password) => {
    setLoading(true);
    setTimeout(() => {
      setAdmin({ email, name: 'Super Admin', role: 'admin' });
      setLoading(false);
    }, 800);
  };

  const logout = () => setAdmin(null);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
