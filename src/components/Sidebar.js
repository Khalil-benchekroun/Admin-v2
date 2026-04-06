import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { logout, admin } = useAuth();
  const [openSub, setOpenSub] = useState("dashboard");

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const menuGroups = [
    {
      id: "dashboard",
      label: "DATA VISUALISATION",
      icon: "📊",
      subItems: [
        { path: "/", label: "Vue d'ensemble" },
        { path: "/statistiques", label: "Stats par boutique" },
      ],
    },
    {
      id: "boutiques",
      label: "BOUTIQUES",
      icon: "🏪",
      subItems: [
        { path: "/boutiques", label: "Liste des boutiques" },
        { path: "/invitations", label: "Liens d'invitation" },
      ],
    },
    {
      id: "produits",
      label: "PRODUITS",
      icon: "🏷️",
      subItems: [
        { path: "/produits", label: "Catalogue global" },
        { path: "/categories", label: "Catégories" },
      ],
    },
    {
      id: "clients",
      label: "CLIENTS",
      icon: "👤",
      subItems: [
        { path: "/clients", label: "Liste des clients" },
        { path: "/clients/commandes", label: "Historique commandes" },
      ],
    },
    {
      id: "commandes",
      label: "COMMANDES",
      icon: "📦",
      subItems: [
        { path: "/commandes", label: "Toutes les commandes" },
        { path: "/retours", label: "Gestion des retours" },
      ],
    },
    {
      id: "sav",
      label: "SAV",
      icon: "💬",
      subItems: [
        { path: "/sav", label: "Chat support" },
        { path: "/reclamations", label: "Réclamations" },
      ],
    },
  ];

  return (
    <div style={{ width: "240px", height: "100vh", background: "var(--sidebar)", color: "#fff", position: "fixed", display: "flex", flexDirection: "column", zIndex: 100 }}>
      <div style={{ padding: "30px 24px 10px 24px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-display)", color: "var(--gold)", fontSize: "28px", letterSpacing: "2px", margin: 0 }}>LIVRR</h1>
        <div style={{ fontSize: "9px", color: "var(--gray-light)", letterSpacing: "1px", marginTop: "4px" }}>ESPACE ADMIN</div>
      </div>

      <div style={{ padding: "16px 24px", marginBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "35px", height: "35px", background: "var(--error)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "800", fontSize: "14px" }}>A</div>
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#fff" }}>{admin?.name || "Super Admin"}</span>
          <span style={{ fontSize: "10px", color: "var(--error)", fontWeight: "600", opacity: 0.9 }}>Administrateur</span>
        </div>
      </div>

      <nav style={{ flex: 1, overflowY: "auto", padding: "0 12px" }}>
        {menuGroups.map((group) => (
          <div key={group.id} style={{ marginBottom: "6px" }}>
            <div onClick={() => setOpenSub(openSub === group.id ? "" : group.id)}
              style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", cursor: "pointer", borderRadius: "8px", transition: "0.2s", background: openSub === group.id ? "rgba(255,255,255,0.03)" : "transparent", color: openSub === group.id ? "var(--gold)" : "rgba(255,255,255,0.6)" }}>
              <span style={{ fontSize: "16px" }}>{group.icon}</span>
              <span style={{ fontSize: "11px", fontWeight: "600" }}>{group.label}</span>
              <span style={{ marginLeft: "auto", fontSize: "10px", opacity: 0.5 }}>{openSub === group.id ? "▼" : "▶"}</span>
            </div>
            {openSub === group.id && (
              <div style={{ marginLeft: "28px", marginTop: "2px", display: "flex", flexDirection: "column", gap: "2px" }}>
                {group.subItems.map((sub, idx) => (
                  <NavLink key={sub.path + idx} to={sub.path}
                    className={({ isActive }) => isActive ? "sub-active" : "sub-link"}
                    style={{ padding: "7px 12px", fontSize: "12px", textDecoration: "none", borderRadius: "6px", color: "rgba(255,255,255,0.4)", transition: "0.2s", display: "block" }}>
                    {sub.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <button onClick={handleLogout} style={{ width: "100%", color: "var(--error)", fontSize: "12px", fontWeight: "700", cursor: "pointer", background: "none", border: "none" }}>
          ● DÉCONNEXION
        </button>
      </div>
    </div>
  );
}
