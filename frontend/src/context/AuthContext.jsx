import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get('/auth/me')
       .then(res => setUser(res.data.user))
       .catch(() => setUser(null));
  }, []);

  const logout = () => {
    api.post('/auth/logout').then(() => setUser(null));
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
