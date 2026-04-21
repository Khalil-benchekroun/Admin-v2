import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Données searchables
const INDEX = [
  // Boutiques
  {
    type: "boutique",
    id: "b1",
    titre: "Sandro Paris",
    sous: "Paris 8e · Prestige · Active",
    url: "/boutiques",
    icon: "🏪",
  },
  {
    type: "boutique",
    id: "b2",
    titre: "AMI Paris",
    sous: "Paris 3e · Signature · Active",
    url: "/boutiques",
    icon: "🏪",
  },
  {
    type: "boutique",
    id: "b3",
    titre: "Isabel Marant",
    sous: "Paris 11e · Signature · Inactive",
    url: "/boutiques",
    icon: "🏪",
  },
  {
    type: "boutique",
    id: "b4",
    titre: "By Terry",
    sous: "Paris 1er · Classic · Active",
    url: "/boutiques",
    icon: "🏪",
  },
  {
    type: "boutique",
    id: "b5",
    titre: "Rouje",
    sous: "Paris 6e · Classic · En attente",
    url: "/boutiques",
    icon: "🏪",
  },
  // Commandes
  {
    type: "commande",
    id: "c1",
    titre: "LV-00412",
    sous: "Sophie M. · Sandro Paris · 490€ · Bloquée",
    url: "/commandes",
    icon: "🛍️",
  },
  {
    type: "commande",
    id: "c2",
    titre: "LV-00411",
    sous: "Karim T. · AMI Paris · 1079€ · Livrée",
    url: "/commandes",
    icon: "🛍️",
  },
  {
    type: "commande",
    id: "c3",
    titre: "LV-00410",
    sous: "Yasmine B. · Isabel Marant · 450€ · Livrée",
    url: "/commandes",
    icon: "🛍️",
  },
  {
    type: "commande",
    id: "c4",
    titre: "LV-00409",
    sous: "Lucas D. · By Terry · 280€ · Retour",
    url: "/commandes",
    icon: "🛍️",
  },
  // Clients
  {
    type: "client",
    id: "cl1",
    titre: "Sophie M.",
    sous: "CLT-001 · Bronze · 3 commandes",
    url: "/clients",
    icon: "👤",
  },
  {
    type: "client",
    id: "cl2",
    titre: "Karim T.",
    sous: "CLT-002 · Silver · 2 commandes",
    url: "/clients",
    icon: "👤",
  },
  {
    type: "client",
    id: "cl3",
    titre: "Yasmine B.",
    sous: "CLT-003 · Bronze · 2 commandes",
    url: "/clients",
    icon: "👤",
  },
  {
    type: "client",
    id: "cl4",
    titre: "Lucas D.",
    sous: "CLT-004 · Bronze · 2 commandes",
    url: "/clients",
    icon: "👤",
  },
  {
    type: "client",
    id: "cl5",
    titre: "Nadia S.",
    sous: "CLT-006 · Bloqué · Fraude",
    url: "/clients",
    icon: "👤",
  },
  // Pages
  {
    type: "page",
    id: "p1",
    titre: "Dashboard",
    sous: "Vue d'ensemble live",
    url: "/",
    icon: "📊",
  },
  {
    type: "page",
    id: "p2",
    titre: "Statistiques",
    sous: "CA, classement boutiques, export",
    url: "/statistiques",
    icon: "📈",
  },
  {
    type: "page",
    id: "p3",
    titre: "Finance",
    sous: "Commissions & versements",
    url: "/finance",
    icon: "💰",
  },
  {
    type: "page",
    id: "p4",
    titre: "SAV",
    sous: "Tickets & support",
    url: "/sav",
    icon: "🎫",
  },
  {
    type: "page",
    id: "p5",
    titre: "Litiges & Arbitrage",
    sous: "Dossiers escaladés",
    url: "/litiges",
    icon: "⚖️",
  },
  {
    type: "page",
    id: "p6",
    titre: "Modération",
    sous: "Signalements & actions",
    url: "/moderation",
    icon: "🔍",
  },
  {
    type: "page",
    id: "p7",
    titre: "Zones de service",
    sous: "Paris, Nice, Cannes, Monaco",
    url: "/zones",
    icon: "📍",
  },
  {
    type: "page",
    id: "p8",
    titre: "Journal d'audit",
    sous: "Toutes les actions plateforme",
    url: "/audit",
    icon: "📜",
  },
  {
    type: "page",
    id: "p9",
    titre: "Comptes & accès",
    sous: "Admin, SAV, Ops",
    url: "/comptes",
    icon: "👥",
  },
  {
    type: "page",
    id: "p10",
    titre: "Activité équipe",
    sous: "Suivi actions par membre",
    url: "/activite",
    icon: "📋",
  },
  {
    type: "page",
    id: "p11",
    titre: "Remboursements",
    sous: "Virements en cours",
    url: "/remboursements",
    icon: "💸",
  },
  {
    type: "page",
    id: "p12",
    titre: "Notifications",
    sous: "Templates et canaux",
    url: "/notifications",
    icon: "🔔",
  },
  // Tickets SAV
  {
    type: "ticket",
    id: "t1",
    titre: "TK-0041",
    sous: "By Terry · Accès application · En cours",
    url: "/sav",
    icon: "🎫",
  },
  {
    type: "ticket",
    id: "t2",
    titre: "TK-0040",
    sous: "Sandro Paris · Retard livraison · Résolu",
    url: "/sav",
    icon: "🎫",
  },
];

const TYPE_COLOR = {
  boutique: {
    color: "#C9A96E",
    bg: "rgba(201,169,110,0.1)",
    label: "Boutique",
  },
  commande: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)", label: "Commande" },
  client: { color: "#3B82F6", bg: "rgba(59,130,246,0.1)", label: "Client" },
  page: { color: "#6B7280", bg: "rgba(107,114,128,0.08)", label: "Page" },
  ticket: { color: "#EF4444", bg: "rgba(239,68,68,0.08)", label: "Ticket" },
};

const RACCOURCIS = [
  { key: "D", label: "Dashboard", url: "/" },
  { key: "B", label: "Boutiques", url: "/boutiques" },
  { key: "C", label: "Commandes", url: "/commandes" },
  { key: "F", label: "Finance", url: "/finance" },
  { key: "S", label: "SAV", url: "/sav" },
  { key: "M", label: "Modération", url: "/moderation" },
];

export default function RechercheGlobale({ onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const resultats =
    query.length < 1
      ? []
      : INDEX.filter(
          (item) =>
            item.titre.toLowerCase().includes(query.toLowerCase()) ||
            item.sous.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  const naviguer = (url) => {
    navigate(url);
    onClose();
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, resultats.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      }
      if (e.key === "Enter" && resultats[selected])
        naviguer(resultats[selected].url);

      // Raccourcis directs (sans recherche)
      if (!query && e.altKey) {
        const r = RACCOURCIS.find((x) => x.key === e.key.toUpperCase());
        if (r) {
          naviguer(r.url);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [resultats, selected, query]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,10,15,0.7)",
        zIndex: 500,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "80px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "600px",
          background: "#fff",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
          overflow: "hidden",
        }}
      >
        {/* Input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 20px",
            borderBottom: "1px solid var(--white-3)",
          }}
        >
          <span style={{ fontSize: "18px", opacity: 0.4 }}>🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher boutique, commande, client, page…"
            style={{
              flex: 1,
              fontSize: "16px",
              border: "none",
              outline: "none",
              background: "transparent",
              color: "var(--noir)",
            }}
          />
          <span
            style={{
              fontSize: "11px",
              color: "var(--gray-light)",
              background: "var(--gray-bg)",
              padding: "3px 8px",
              borderRadius: "6px",
              border: "1px solid var(--white-3)",
            }}
          >
            Esc
          </span>
        </div>

        {/* Résultats */}
        {resultats.length > 0 && (
          <div ref={listRef} style={{ maxHeight: "400px", overflowY: "auto" }}>
            {resultats.map((r, i) => {
              const tc = TYPE_COLOR[r.type];
              return (
                <div
                  key={r.id}
                  onClick={() => naviguer(r.url)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 20px",
                    cursor: "pointer",
                    background:
                      i === selected ? "rgba(201,169,110,0.06)" : "transparent",
                    borderLeft:
                      i === selected
                        ? "3px solid var(--gold)"
                        : "3px solid transparent",
                    transition: "all 0.1s",
                  }}
                  onMouseEnter={() => setSelected(i)}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "10px",
                      background: tc.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      flexShrink: 0,
                    }}
                  >
                    {r.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "var(--noir)",
                        marginBottom: "2px",
                      }}
                    >
                      {r.titre}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--gray)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.sous}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "600",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      background: tc.bg,
                      color: tc.color,
                      flexShrink: 0,
                    }}
                  >
                    {tc.label}
                  </span>
                  {i === selected && (
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--gray-light)",
                        flexShrink: 0,
                      }}
                    >
                      ↵
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pas de résultats */}
        {query.length > 0 && resultats.length === 0 && (
          <div
            style={{
              padding: "32px",
              textAlign: "center",
              color: "var(--gray)",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔍</div>
            <div style={{ fontSize: "13px" }}>
              Aucun résultat pour "{query}"
            </div>
          </div>
        )}

        {/* Raccourcis quand pas de recherche */}
        {query.length === 0 && (
          <div style={{ padding: "16px 20px" }}>
            <div
              style={{
                fontSize: "10px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--gray)",
                marginBottom: "12px",
              }}
            >
              Navigation rapide — Alt + touche
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {RACCOURCIS.map((r) => (
                <button
                  key={r.key}
                  onClick={() => naviguer(r.url)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--white-3)",
                    background: "var(--gray-bg)",
                    cursor: "pointer",
                    fontSize: "12px",
                    color: "var(--noir)",
                    fontWeight: "500",
                  }}
                >
                  <span
                    style={{
                      background: "var(--noir)",
                      color: "var(--gold)",
                      fontSize: "10px",
                      fontWeight: "800",
                      padding: "1px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {r.key}
                  </span>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            padding: "10px 20px",
            borderTop: "1px solid var(--white-3)",
            display: "flex",
            gap: "16px",
            fontSize: "11px",
            color: "var(--gray-light)",
          }}
        >
          <span>↑↓ Naviguer</span>
          <span>↵ Ouvrir</span>
          <span>Esc Fermer</span>
          <span style={{ marginLeft: "auto" }}>
            Alt+lettre pour accès direct
          </span>
        </div>
      </div>
    </div>
  );
}
