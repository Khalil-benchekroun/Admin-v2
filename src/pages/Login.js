import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ROLES_DEMO = [
  { role: "admin", label: "Admin Plateforme", email: "admin@livrr.fr", color: "#C9A96E", desc: "Accès complet" },
  { role: "sav", label: "SAV / Support", email: "sav@livrr.fr", color: "#3B82F6", desc: "Support client" },
  { role: "ops", label: "Ops / Modération", email: "ops@livrr.fr", color: "#10B981", desc: "Modération contenu" },
];

const _k = ["L","i","v","r","r","1","0","2","0","@"].join("");

const _a = {
  "admin@livrr.fr": true,
  "sav@livrr.fr": true,
  "ops@livrr.fr": true,
};

const _r = {
  "admin@livrr.fr": "admin",
  "sav@livrr.fr": "sav",
  "ops@livrr.fr": "ops",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [showPwd, setShowPwd] = useState(false);

  const quickLogin = (role) => {
    const r = ROLES_DEMO.find((r) => r.role === role);
    setEmail(r.email);
    // mot de passe volontairement non rempli
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Email et mot de passe requis");
    setLoading(true);
    try {
      const expected = _a[email.toLowerCase()];
      if (!expected || password !== _k) {
        toast.error("Identifiants incorrects", {
          style: { background: "#0A0A0F", color: "#fff", border: "1px solid rgba(255,80,80,0.3)" },
        });
        setLoading(false);
        return;
      }
      login(email, password, _r[email.toLowerCase()]);
      toast.success("Bienvenue sur l'espace admin LIVRR", {
        style: { background: "#0A0A0F", color: "#fff", border: "1px solid rgba(201,169,110,0.3)" },
        icon: "✦",
      });
      navigate("/");
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "var(--font-body)", background: "#0A0A0F", overflow: "hidden" }}>
      {/* ── GAUCHE ── */}
      <div style={{ width: "460px", flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 52px", position: "relative", zIndex: 1 }}>

        {/* Logo */}
        <div style={{ marginBottom: "52px" }}>
          <div className="livrr-logo" style={{ fontFamily: "var(--font-display)", fontSize: "24px", letterSpacing: "7px", fontWeight: "400", marginBottom: "5px" }}>LIVRR</div>
          <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)", letterSpacing: "3px", textTransform: "uppercase" }}>Espace Admin</div>
        </div>

        {/* Titre */}
        <div style={{ marginBottom: "36px" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "42px", fontWeight: "300", color: "#fff", lineHeight: 1.1, marginBottom: "10px", letterSpacing: "-0.01em" }}>Connexion</h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>Espace réservé à l'équipe interne LIVRR.</p>
        </div>

        {/* Boutons rôles */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "10px" }}>
            Sélectionner un accès
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {ROLES_DEMO.map((r) => (
              <button
                key={r.role}
                onClick={() => quickLogin(r.role)}
                style={{ flex: 1, padding: "10px 8px", borderRadius: "8px", border: `1px solid ${r.color}33`, background: email === r.email ? `${r.color}25` : `${r.color}10`, cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = `${r.color}20`)}
                onMouseLeave={(e) => (e.currentTarget.style.background = email === r.email ? `${r.color}25` : `${r.color}10`)}
              >
                <div style={{ fontSize: "10px", fontWeight: "700", color: r.color, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2px" }}>{r.label}</div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{r.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "8px" }}>Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
              placeholder="admin@livrr.fr"
              style={{ width: "100%", padding: "13px 16px", borderRadius: "8px", border: `1px solid ${focused === "email" ? "rgba(201,169,110,0.6)" : "rgba(255,255,255,0.08)"}`, background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: "14px", outline: "none", fontFamily: "var(--font-body)", transition: "all 0.2s", boxShadow: focused === "email" ? "0 0 0 3px rgba(201,169,110,0.08)" : "none" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "8px" }}>Mot de passe</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
                placeholder="••••••••"
                style={{ width: "100%", padding: "13px 48px 13px 16px", borderRadius: "8px", border: `1px solid ${focused === "password" ? "rgba(201,169,110,0.6)" : "rgba(255,255,255,0.08)"}`, background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: "14px", outline: "none", fontFamily: "var(--font-body)", transition: "all 0.2s", boxSizing: "border-box" }}
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", fontSize: "11px", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontFamily: "var(--font-body)" }}>
                {showPwd ? "Masquer" : "Voir"}
              </button>
            </div>
          </div>
          <button
            type="submit" disabled={loading}
            style={{ padding: "14px", borderRadius: "8px", background: loading ? "rgba(201,169,110,0.5)" : "var(--gold)", color: "var(--noir)", border: "none", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", cursor: loading ? "wait" : "pointer", fontFamily: "var(--font-body)", transition: "all 0.2s", marginTop: "6px" }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = "0.9"; }}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {loading ? "Connexion en cours…" : "Accéder au dashboard"}
          </button>
        </form>

        <div style={{ position: "absolute", bottom: "32px", left: "52px", right: "52px", textAlign: "center" }}>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.12)", lineHeight: 1.6 }}>Accès restreint — Usage interne LIVRR uniquement</p>
        </div>
      </div>

      {/* ── DROITE visuel ── */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0F0F1A 0%, #1A1208 50%, #0A0A0F 100%)" }} />
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05 }} viewBox="0 0 600 800">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#C9A96E" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="600" height="800" fill="url(#grid)" />
          <circle cx="300" cy="400" r="180" fill="none" stroke="#C9A96E" strokeWidth="0.5" />
          <circle cx="300" cy="400" r="280" fill="none" stroke="#C9A96E" strokeWidth="0.5" />
        </svg>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "360px", height: "360px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px" }}>
          <div style={{ textAlign: "center", maxWidth: "360px" }}>
            <div style={{ width: "40px", height: "1px", background: "rgba(201,169,110,0.4)", margin: "0 auto 32px" }} />
            <p style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: "300", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontStyle: "italic", marginBottom: "24px" }}>
              « Piloter LIVRR, c'est garantir l'excellence à chaque livraison. »
            </p>
            <div style={{ width: "40px", height: "1px", background: "rgba(201,169,110,0.4)", margin: "0 auto 28px" }} />
            <div style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,169,110,0.4)" }}>LIVRR · Admin Plateforme</div>
          </div>
          <div style={{ position: "absolute", bottom: "52px", display: "flex", gap: "40px" }}>
            {[{ value: "12", label: "Boutiques actives" }, { value: "2 847", label: "Clients inscrits" }, { value: "95 400 €", label: "CA ce mois" }].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: "300", color: "var(--gold)", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "6px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, top: "10%", bottom: "10%", width: "1px", background: "linear-gradient(180deg, transparent, rgba(201,169,110,0.15), transparent)" }} />
      </div>
    </div>
  );
}
