import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Login() {
  const { login, admin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (admin) return <Navigate to="/" />;

  return (
    <div style={{ minHeight: "100vh", background: "var(--noir)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "400px", padding: "24px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontFamily: "var(--font-display)", color: "var(--gold)", fontSize: "40px", letterSpacing: "4px" }}>LIVRR</h1>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", letterSpacing: "2px", marginTop: "6px" }}>ESPACE ADMINISTRATEUR</div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "20px", padding: "32px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h2 style={{ fontFamily: "var(--font-display)", color: "#fff", fontSize: "24px", marginBottom: "24px", textAlign: "center" }}>Connexion</h2>

          <label style={{ fontSize: "11px", color: "var(--gray-light)", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>Email</label>
          <input style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none", fontFamily: "var(--font-body)", marginBottom: "16px" }}
            type="email" placeholder="admin@livrr.app" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label style={{ fontSize: "11px", color: "var(--gray-light)", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>Mot de passe</label>
          <input style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none", fontFamily: "var(--font-body)", marginBottom: "24px" }}
            type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button onClick={() => login(email, password)} disabled={loading}
            style={{ width: "100%", padding: "14px", background: "var(--gold)", color: "var(--noir)", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "var(--font-body)", letterSpacing: "1px" }}>
            {loading ? "Connexion..." : "SE CONNECTER →"}
          </button>

          <div style={{ textAlign: "center", marginTop: "16px", fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
            Mode démo : entrez n'importe quel email/mot de passe
          </div>
        </div>
      </div>
    </div>
  );
}
