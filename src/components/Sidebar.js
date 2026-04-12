import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MENU = [
  {
    id: "dashboard",
    label: "Tableau de bord",
    subItems: [
      { path: "/", label: "Vue d'ensemble" },
      { path: "/statistiques", label: "Statistiques" },
    ],
  },
  {
    id: "boutiques",
    label: "Boutiques",
    subItems: [
      { path: "/boutiques", label: "Liste des boutiques" },
      { path: "/invitations", label: "Liens d'invitation" },
      { path: "/abonnements", label: "Abonnements" },
    ],
  },
  {
    id: "commandes",
    label: "Commandes",
    subItems: [
      { path: "/commandes", label: "Toutes les commandes" },
      { path: "/retours", label: "Retours" },
    ],
  },
  {
    id: "clients",
    label: "Clients",
    subItems: [{ path: "/clients", label: "Liste des clients" }],
  },
  {
    id: "finance",
    label: "Finance",
    subItems: [{ path: "/finance", label: "Commissions & CA" }],
  },
  {
    id: "sav",
    label: "Support & SAV",
    subItems: [
      { path: "/sav", label: "Tickets & litiges", badge: 3 },
      { path: "/moderation", label: "Modération" },
    ],
  },
  {
    id: "settings",
    label: "Paramètres",
    subItems: [
      { path: "/parametres", label: "Configuration globale" },
      { path: "/comptes", label: "Comptes admin / SAV" },
    ],
  },
];

const ROLE_CONFIG = {
  admin: { label: "Admin Plateforme", color: "var(--gold)", dot: "#C9A96E" },
  sav: { label: "SAV / Support", color: "#3B82F6", dot: "#3B82F6" },
  ops: { label: "Ops / Modération", color: "#10B981", dot: "#10B981" },
};

export default function Sidebar() {
  const { logout, admin } = useAuth();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  const getActiveGroup = () => {
    for (const g of MENU) {
      if (
        g.subItems.some(
          (s) =>
            s.path === location.pathname ||
            (s.path !== "/" && location.pathname.startsWith(s.path))
        )
      )
        return g.id;
    }
    return "dashboard";
  };

  const [openSub, setOpenSub] = useState(getActiveGroup);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const role = admin?.role || "admin";
  const roleCfg = ROLE_CONFIG[role] || ROLE_CONFIG.admin;

  return (
    <>
      <style>{`
        @keyframes sidebarFade { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }
        @keyframes itemFade    { from { opacity:0; } to { opacity:1; } }
        @keyframes subOpen     { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
        .admin-group-label { display:flex; align-items:center; justify-content:space-between; padding:7px 16px; font-size:10px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:rgba(255,255,255,0.28); transition:color 0.2s; cursor:pointer; border-radius:4px; }
        .admin-group-label:hover { color:rgba(255,255,255,0.55); }
        .admin-group-label.active { color:rgba(201,169,110,0.85); }
        .admin-sub-link { padding:8px 14px 8px 26px; font-size:12px; font-weight:400; color:rgba(255,255,255,0.35); text-decoration:none; transition:all 0.2s; display:flex; align-items:center; justify-content:space-between; border-radius:4px; }
        .admin-sub-link:hover { color:rgba(255,255,255,0.8); background:rgba(255,255,255,0.04); }
        .admin-sub-active { color:#fff !important; background:rgba(201,169,110,0.1) !important; font-weight:500 !important; border-left:1px solid rgba(201,169,110,0.45); padding-left:25px !important; display:flex; align-items:center; justify-content:space-between; }
        .admin-logout { width:100%; padding:10px 16px; background:none; border:none; cursor:pointer; font-family:var(--font-body); font-size:10px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:rgba(255,255,255,0.2); text-align:left; transition:color 0.2s; display:flex; align-items:center; gap:10px; }
        .admin-logout:hover { color:rgba(192,57,43,0.7); }
        .nav-scroll::-webkit-scrollbar { width:0; }
      `}</style>

      <div
        style={{
          width: "240px",
          height: "100vh",
          background: "#0A0A0F",
          color: "#fff",
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          zIndex: 100,
          borderRight: "1px solid rgba(255,255,255,0.05)",
          animation: mounted ? "sidebarFade 0.6s ease forwards" : "none",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            padding: "32px 24px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            className="livrr-logo"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "22px",
              letterSpacing: "7px",
              fontWeight: "400",
              marginBottom: "4px",
            }}
          >
            LIVRR
          </div>
          <div
            style={{
              fontSize: "9px",
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            Espace Admin
          </div>
        </div>

        {/* PROFIL ADMIN */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              fontSize: "9px",
              color: "rgba(255,255,255,0.22)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            Connecté en tant que
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "4px",
                flexShrink: 0,
                background: `rgba(${
                  role === "admin"
                    ? "201,169,110"
                    : role === "sav"
                    ? "59,130,246"
                    : "16,185,129"
                },0.15)`,
                border: `1px solid rgba(${
                  role === "admin"
                    ? "201,169,110"
                    : role === "sav"
                    ? "59,130,246"
                    : "16,185,129"
                },0.3)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontSize: "14px",
                color: roleCfg.color,
              }}
            >
              {(admin?.name || "A").charAt(0)}
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "#fff",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {admin?.name || "Super Admin"}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  marginTop: "2px",
                }}
              >
                <div
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: roleCfg.dot,
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    color: roleCfg.color,
                    fontWeight: "600",
                  }}
                >
                  {roleCfg.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav
          className="nav-scroll"
          style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}
        >
          {MENU.map((group, gi) => (
            <div
              key={group.id}
              style={{
                animation: mounted
                  ? `itemFade 0.4s ${0.05 + gi * 0.04}s ease both`
                  : "none",
                opacity: mounted ? 1 : 0,
              }}
            >
              <div
                className={`admin-group-label ${
                  openSub === group.id ? "active" : ""
                }`}
                onClick={() => setOpenSub(openSub === group.id ? "" : group.id)}
              >
                <span>{group.label}</span>
                <span
                  style={{
                    fontSize: "8px",
                    opacity: 0.4,
                    transition: "transform 0.25s",
                    transform: openSub === group.id ? "rotate(180deg)" : "none",
                    display: "inline-block",
                  }}
                >
                  ▾
                </span>
              </div>
              {openSub === group.id && (
                <div style={{ animation: "subOpen 0.2s ease forwards" }}>
                  {group.subItems.map((sub, idx) => (
                    <NavLink
                      key={sub.path + idx}
                      to={sub.path}
                      className={({ isActive }) =>
                        isActive ? "admin-sub-active" : "admin-sub-link"
                      }
                    >
                      <span>{sub.label}</span>
                      {sub.badge && (
                        <span
                          style={{
                            background: "var(--error)",
                            color: "#fff",
                            borderRadius: "20px",
                            padding: "1px 6px",
                            fontSize: "9px",
                            fontWeight: "800",
                          }}
                        >
                          {sub.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* DÉCONNEXION */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            padding: "12px 0",
          }}
        >
          <button
            className="admin-logout"
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Déconnexion
          </button>
        </div>
      </div>
    </>
  );
}
