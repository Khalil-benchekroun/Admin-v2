import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const SESSION_KEY = "livrr_admin_session";

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true); // true au démarrage pour lire le localStorage

  // ── Au démarrage : restaurer la session depuis localStorage ──
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setAdmin(parsed);
      }
    } catch (e) {
      localStorage.removeItem(SESSION_KEY);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    setLoading(true);
    setTimeout(() => {
      // Détecte le rôle selon l'email
      let role = "admin";
      if (email.includes("sav")) role = "sav";
      else if (email.includes("ops")) role = "ops";

      const NOMS = {
        admin: "Khalil B.",
        sav: "Marie (SAV)",
        ops: "Paul (Ops)",
      };

      const session = { email, name: NOMS[role], role };

      // Persister en localStorage
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
