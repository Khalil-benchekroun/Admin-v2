import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = (email, password) => {
    setLoading(true);
    setTimeout(() => {
      // Détecte le rôle selon l'email pour la démo
      let role = "admin";
      if (email.includes("sav")) role = "sav";
      else if (email.includes("ops")) role = "ops";

      const NOMS = {
        admin: "Khalil B.",
        sav: "Marie (SAV)",
        ops: "Paul (Ops)",
      };

      setAdmin({ email, name: NOMS[role], role });
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
