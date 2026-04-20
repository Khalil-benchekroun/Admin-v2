import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const SESSION_KEY = "livrr_admin_session";

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) setAdmin(JSON.parse(saved));
    } catch (e) {
      localStorage.removeItem(SESSION_KEY);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    setLoading(true);
    setTimeout(() => {
      // Détection du rôle selon l'email — ordre important
      let role = "admin";
      if (email.includes("superadmin")) role = "superadmin";
      else if (email.includes("sav")) role = "sav";
      else if (email.includes("ops")) role = "ops";

      const NOMS = {
        superadmin: "Khalil B.",
        admin: "Admin",
        sav: "Marie (SAV)",
        ops: "Paul (Ops)",
      };

      const session = { email, name: NOMS[role] || email.split("@")[0], role };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setAdmin(session);
      setLoading(false);
    }, 800);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
