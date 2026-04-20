import React, { useState } from "react";
import { useRole } from "../hooks/useRole";

// ── Mock Data ──────────────────────────────────────────────
const LOGS_DATA = [
  {
    id: "LOG-0841",
    date: "18/04/2026",
    heure: "14:35",
    acteur: "Khalil B.",
    role: "admin",
    action: "remboursement_déclenché",
    cible: "LV-00412",
    detail: "Remboursement total 490€ — Incident livraison avéré",
    module: "finance",
    ip: "185.24.x.x",
  },
  {
    id: "LOG-0840",
    date: "18/04/2026",
    heure: "14:22",
    acteur: "Marie (SAV)",
    role: "sav",
    action: "ticket_résolu",
    cible: "TK-0041",
    detail:
      "Action appliquée : Réassigner coursier — Coursier bloqué zone piétonne",
    module: "sav",
    ip: "92.12.x.x",
  },
  {
    id: "LOG-0839",
    date: "18/04/2026",
    heure: "13:58",
    acteur: "Paul (Ops)",
    role: "ops",
    action: "produit_suspendu",
    cible: "PRD-008",
    detail: "Blazer Structuré Noir — Photos non conformes aux standards LIVRR",
    module: "moderation",
    ip: "78.45.x.x",
  },
  {
    id: "LOG-0838",
    date: "18/04/2026",
    heure: "13:40",
    acteur: "Khalil B.",
    role: "admin",
    action: "boutique_suspendue",
    cible: "BTQ-003",
    detail: "Isabel Marant — Litige client non résolu depuis 5 jours",
    module: "boutiques",
    ip: "185.24.x.x",
  },
  {
    id: "LOG-0837",
    date: "18/04/2026",
    heure: "13:12",
    acteur: "Marie (SAV)",
    role: "sav",
    action: "client_bloqué",
    cible: "CLT-006",
    detail: "Nadia S. — Chargeback abusif × 3 en moins d'un mois",
    module: "clients",
    ip: "92.12.x.x",
  },
  {
    id: "LOG-0836",
    date: "17/04/2026",
    heure: "17:45",
    acteur: "Khalil B.",
    role: "admin",
    action: "plan_modifié",
    cible: "AB-002",
    detail:
      "AMI Paris : Classic → Signature — Demande boutique + quota atteint",
    module: "abonnements",
    ip: "185.24.x.x",
  },
  {
    id: "LOG-0835",
    date: "17/04/2026",
    heure: "16:30",
    acteur: "Paul (Ops)",
    role: "ops",
    action: "signalement_résolu",
    cible: "SIG-029",
    detail: "Isabel Marant inactive — Action : Contacter la boutique",
    module: "moderation",
    ip: "78.45.x.x",
  },
  {
    id: "LOG-0834",
    date: "17/04/2026",
    heure: "15:20",
    acteur: "Marie (SAV)",
    role: "sav",
    action: "retour_validé",
    cible: "RET-0020",
    detail: "Yasmine B. — Robe Milena 450€ — Défaut de fabrication confirmé",
    module: "retours",
    ip: "92.12.x.x",
  },
  {
    id: "LOG-0833",
    date: "17/04/2026",
    heure: "14:00",
    acteur: "Khalil B.",
    role: "admin",
    action: "versement_confirmé",
    cible: "VRS-038",
    detail: "Sandro Paris — Mars 2026 — 22 968€ — Réf. VIR-2026-03-SANDRO-001",
    module: "finance",
    ip: "185.24.x.x",
  },
  {
    id: "LOG-0832",
    date: "17/04/2026",
    heure: "11:20",
    acteur: "Paul (Ops)",
    role: "ops",
    action: "boutique_suspendue",
    cible: "BTQ-003",
    detail: "Isabel Marant — Suspension temporaire pour inactivité",
    module: "boutiques",
    ip: "78.45.x.x",
  },
  {
    id: "LOG-0831",
    date: "16/04/2026",
    heure: "18:05",
    acteur: "Marie (SAV)",
    role: "sav",
    action: "ticket_créé",
    cible: "TK-0040",
    detail: "Sandro Paris — Problème accès application boutique",
    module: "sav",
    ip: "92.12.x.x",
  },
  {
    id: "LOG-0830",
    date: "16/04/2026",
    heure: "10:00",
    acteur: "Khalil B.",
    role: "admin",
    action: "zone_activée",
    cible: "paris",
    detail:
      "Zone Paris — Activation officielle plateforme — 5 boutiques partenaires",
    module: "zones",
    ip: "185.24.x.x",
  },
  {
    id: "LOG-0829",
    date: "15/04/2026",
    heure: "14:30",
    acteur: "Lucas (SAV)",
    role: "sav",
    action: "remboursement_déclenché",
    cible: "RET-0019",
    detail: "Emma B. — Retour partiel 290€ — Taille ne correspond pas",
    module: "retours",
    ip: "92.12.x.x",
  },
  {
    id: "LOG-0828",
    date: "15/04/2026",
    heure: "09:00",
    acteur: "Khalil B.",
    role: "admin",
    action: "compte_créé",
    cible: "SAV-003",
    detail: "Amina (SAV) — Rôle SAV/Support — Accès activé",
    module: "comptes",
    ip: "185.24.x.x",
  },
  {
    id: "LOG-0827",
    date: "14/04/2026",
    heure: "11:00",
    acteur: "Marie (SAV)",
    role: "sav",
    action: "commande_annulée",
    cible: "LV-00408",
    detail: "Nadia S. — Sandro Paris — 890€ — Fraude suspectée",
    module: "commandes",
    ip: "92.12.x.x",
  },
];

const ACTION_CFG = {
  remboursement_déclenché: {
    label: "Remboursement",
    color: "#c0392b",
    bg: "#fef2f2",
    icon: "💸",
  },
  ticket_résolu: {
    label: "Ticket résolu",
    color: "#2e8b57",
    bg: "#e8f5ee",
    icon: "✅",
  },
  ticket_créé: {
    label: "Ticket créé",
    color: "#185fa5",
    bg: "#eff6ff",
    icon: "🎫",
  },
  produit_suspendu: {
    label: "Produit suspendu",
    color: "#b7770d",
    bg: "#faeeda",
    icon: "🏷️",
  },
  boutique_suspendue: {
    label: "Boutique susp.",
    color: "#c0392b",
    bg: "#fef2f2",
    icon: "🏪",
  },
  client_bloqué: {
    label: "Client bloqué",
    color: "#c0392b",
    bg: "#fef2f2",
    icon: "🔒",
  },
  plan_modifié: {
    label: "Plan modifié",
    color: "#6d28d9",
    bg: "#f5f3ff",
    icon: "📋",
  },
  signalement_résolu: {
    label: "Signalement",
    color: "#2e8b57",
    bg: "#e8f5ee",
    icon: "🔍",
  },
  retour_validé: {
    label: "Retour validé",
    color: "#2e8b57",
    bg: "#e8f5ee",
    icon: "↩️",
  },
  versement_confirmé: {
    label: "Versement",
    color: "#2e8b57",
    bg: "#e8f5ee",
    icon: "💰",
  },
  zone_activée: {
    label: "Zone activée",
    color: "#185fa5",
    bg: "#eff6ff",
    icon: "📍",
  },
  commande_annulée: {
    label: "Commande ann.",
    color: "#c0392b",
    bg: "#fef2f2",
    icon: "❌",
  },
  compte_créé: {
    label: "Compte créé",
    color: "#185fa5",
    bg: "#eff6ff",
    icon: "👤",
  },
};

const ROLE_CFG = {
  admin: { label: "Admin", color: "#C9A96E" },
  sav: { label: "SAV", color: "#3B82F6" },
  ops: { label: "Ops", color: "#10B981" },
};

const MODULES = [
  "commandes",
  "retours",
  "clients",
  "boutiques",
  "finance",
  "sav",
  "moderation",
  "abonnements",
  "zones",
  "comptes",
];

export default function AuditLog() {
  const { role, estSuperAdmin } = useRole();
  // SuperAdmin voit tout. Admin voit uniquement SAV/Ops. SAV/Ops n'ont pas accès.
  const logsVisibles = estSuperAdmin
    ? LOGS_DATA
    : LOGS_DATA.filter((l) => l.role !== "admin" && l.role !== "superadmin");
  const [logs] = useState(logsVisibles);
  const [filterRole, setFilterRole] = useState("all");
  const [filterModule, setFilterModule] = useState("all");
  const [filterActeur, setFilterActeur] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const acteurs = [...new Set(logs.map((l) => l.acteur))];

  const filtres = logs.filter((l) => {
    return (
      (filterRole === "all" || l.role === filterRole) &&
      (filterModule === "all" || l.module === filterModule) &&
      (filterActeur === "all" || l.acteur === filterActeur) &&
      (l.id.toLowerCase().includes(search.toLowerCase()) ||
        l.action.toLowerCase().includes(search.toLowerCase()) ||
        l.cible.toLowerCase().includes(search.toLowerCase()) ||
        l.detail.toLowerCase().includes(search.toLowerCase()) ||
        l.acteur.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const log = selected ? logs.find((l) => l.id === selected) : null;

  const stats = {
    total: logs.length,
    admin: logs.filter((l) => l.role === "admin").length,
    sav: logs.filter((l) => l.role === "sav").length,
    ops: logs.filter((l) => l.role === "ops").length,
    critiques: logs.filter((l) =>
      [
        "remboursement_déclenché",
        "boutique_suspendue",
        "client_bloqué",
        "commande_annulée",
      ].includes(l.action)
    ).length,
  };

  const exportCSV = () => {
    const rows = [
      [
        "ID",
        "Date",
        "Heure",
        "Acteur",
        "Rôle",
        "Action",
        "Cible",
        "Détail",
        "Module",
        "IP",
      ],
      ...filtres.map((l) => [
        l.id,
        l.date,
        l.heure,
        l.acteur,
        l.role,
        l.action,
        l.cible,
        `"${l.detail}"`,
        l.module,
        l.ip,
      ]),
    ];
    const csv = rows.map((r) => r.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `livrr-audit-${new Date()
      .toLocaleDateString("fr-FR")
      .replace(/\//g, "-")}.csv`;
    a.click();
  };

  return (
    <div className="page" style={{ padding: "44px 52px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "36px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--gray)",
              marginBottom: "8px",
            }}
          >
            Administration
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "44px",
              fontWeight: "300",
              lineHeight: 1.1,
            }}
          >
            Journal d'audit
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}
          >
            Toutes les actions effectuées sur la plateforme — horodatées et
            immuables
          </p>
        </div>
        <button
          onClick={exportCSV}
          style={{
            padding: "10px 20px",
            borderRadius: "var(--radius-sm)",
            fontSize: "12px",
            fontWeight: "600",
            background: "var(--noir)",
            color: "var(--gold)",
            border: "none",
            cursor: "pointer",
          }}
        >
          ↓ Exporter CSV
        </button>
      </div>

      {/* KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "14px",
          marginBottom: "28px",
        }}
      >
        {[
          { label: "Total actions", val: stats.total, color: "var(--noir)" },
          { label: "Par Admin", val: stats.admin, color: "#C9A96E" },
          { label: "Par SAV", val: stats.sav, color: "#3B82F6" },
          { label: "Par Ops", val: stats.ops, color: "#10B981" },
          {
            label: "Actions critiques",
            val: stats.critiques,
            color: "#c0392b",
          },
        ].map((k) => (
          <div
            key={k.label}
            style={{
              background: "#fff",
              borderRadius: "var(--radius-md)",
              padding: "18px 20px",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--white-3)",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: "700",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--gray)",
                marginBottom: "8px",
              }}
            >
              {k.label}
            </div>
            <div
              style={{
                fontSize: "30px",
                fontFamily: "var(--font-display)",
                fontWeight: "300",
                color: k.color,
                lineHeight: 1,
              }}
            >
              {k.val}
            </div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div
        style={{
          background: "#fff",
          borderRadius: "var(--radius-lg)",
          padding: "16px 20px",
          boxShadow: "var(--shadow-sm)",
          border: "1px solid var(--white-3)",
          marginBottom: "16px",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Rechercher dans les logs…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid var(--white-3)",
            borderRadius: "var(--radius-sm)",
            fontSize: "13px",
            background: "var(--gray-bg)",
            outline: "none",
            minWidth: "220px",
          }}
        />
        <div style={{ width: 1, height: 24, background: "var(--white-3)" }} />
        {["all", "admin", "sav", "ops"].map((r) => (
          <button
            key={r}
            onClick={() => setFilterRole(r)}
            style={fBtn(
              filterRole === r,
              r !== "all" ? ROLE_CFG[r]?.color : null
            )}
          >
            {r === "all" ? "Tous rôles" : ROLE_CFG[r].label}
          </button>
        ))}
        <div style={{ width: 1, height: 24, background: "var(--white-3)" }} />
        <select
          value={filterModule}
          onChange={(e) => setFilterModule(e.target.value)}
          style={selectStyle}
        >
          <option value="all">Tous modules</option>
          {MODULES.map((m) => (
            <option key={m} value={m}>
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={filterActeur}
          onChange={(e) => setFilterActeur(e.target.value)}
          style={selectStyle}
        >
          <option value="all">Tous acteurs</option>
          {acteurs.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <span
          style={{ marginLeft: "auto", fontSize: "12px", color: "var(--gray)" }}
        >
          {filtres.length} entrée{filtres.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Tableau */}
      <div
        style={{
          background: "#fff",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-sm)",
          border: "1px solid var(--white-3)",
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
          }}
        >
          <thead>
            <tr style={{ background: "var(--gray-bg)" }}>
              {[
                "Horodatage",
                "Acteur",
                "Action",
                "Cible",
                "Module",
                "Détail",
                "",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "11px 16px",
                    textAlign: "left",
                    fontSize: "10px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--gray)",
                    borderBottom: "1px solid var(--white-3)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtres.map((l) => {
              const ac = ACTION_CFG[l.action] || {
                label: l.action,
                color: "#6B7280",
                bg: "#f3f4f6",
                icon: "•",
              };
              const rc = ROLE_CFG[l.role];
              const isActive = selected === l.id;
              const isCritique = [
                "remboursement_déclenché",
                "boutique_suspendue",
                "client_bloqué",
                "commande_annulée",
              ].includes(l.action);
              return (
                <tr
                  key={l.id}
                  onClick={() => setSelected(isActive ? null : l.id)}
                  style={{
                    borderBottom: "1px solid var(--white-3)",
                    cursor: "pointer",
                    background: isActive
                      ? "rgba(201,169,110,0.04)"
                      : isCritique
                      ? "rgba(192,57,43,0.015)"
                      : "transparent",
                    transition: "background 0.15s",
                  }}
                >
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "var(--noir)",
                      }}
                    >
                      {l.heure}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                      {l.date}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontSize: "13px", fontWeight: "500" }}>
                      {l.acteur}
                    </div>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "700",
                        color: rc?.color,
                      }}
                    >
                      {rc?.label}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        background: ac.bg,
                        color: ac.color,
                        whiteSpace: "nowrap",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <span>{ac.icon}</span> {ac.label}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontFamily: "monospace",
                      fontSize: "12px",
                      color: "var(--gold-dark)",
                      fontWeight: "600",
                    }}
                  >
                    {l.cible}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        background: "var(--gray-bg)",
                        color: "var(--gray)",
                        fontWeight: "500",
                      }}
                    >
                      {l.module}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      color: "var(--gray)",
                      fontSize: "12px",
                      maxWidth: "280px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {l.detail}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--gray-light)",
                        fontFamily: "monospace",
                      }}
                    >
                      {l.ip}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtres.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "48px",
              color: "var(--gray)",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔍</div>
            <div style={{ fontSize: "13px" }}>Aucun log trouvé</div>
          </div>
        )}
      </div>

      {/* Détail log sélectionné */}
      {log && (
        <div
          style={{
            marginTop: "16px",
            background: "#fff",
            borderRadius: "var(--radius-lg)",
            padding: "20px 28px",
            boxShadow: "var(--shadow-sm)",
            border: `1px solid ${
              ACTION_CFG[log.action]?.color || "var(--white-3)"
            }40`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "16px",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "18px",
                  fontWeight: "300",
                  marginBottom: "4px",
                }}
              >
                {log.id} — Détail complet
              </div>
              <div style={{ fontSize: "12px", color: "var(--gray)" }}>
                {log.date} à {log.heure} · IP {log.ip}
              </div>
            </div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "600",
                padding: "4px 12px",
                borderRadius: "20px",
                background: ACTION_CFG[log.action]?.bg || "#f3f4f6",
                color: ACTION_CFG[log.action]?.color || "#6B7280",
              }}
            >
              {ACTION_CFG[log.action]?.icon}{" "}
              {ACTION_CFG[log.action]?.label || log.action}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "12px",
            }}
          >
            {[
              { label: "Acteur", val: log.acteur },
              { label: "Rôle", val: ROLE_CFG[log.role]?.label },
              { label: "Module", val: log.module },
              { label: "Cible", val: log.cible },
            ].map((r) => (
              <div
                key={r.label}
                style={{
                  background: "var(--gray-bg)",
                  borderRadius: "var(--radius-sm)",
                  padding: "10px 12px",
                  border: "1px solid var(--white-3)",
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--gray)",
                    marginBottom: "4px",
                  }}
                >
                  {r.label}
                </div>
                <div style={{ fontSize: "13px", fontWeight: "500" }}>
                  {r.val}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: "12px",
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: "var(--radius-sm)",
              padding: "12px 16px",
              fontSize: "13px",
              color: "var(--noir)",
              lineHeight: 1.6,
            }}
          >
            <strong>Détail :</strong> {log.detail}
          </div>
          <div
            style={{
              marginTop: "8px",
              fontSize: "11px",
              color: "var(--gray-light)",
            }}
          >
            🔒 Cette entrée est immuable et ne peut pas être modifiée ou
            supprimée.
          </div>
        </div>
      )}
    </div>
  );
}

function fBtn(active, color) {
  return {
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
    border: `1.5px solid ${active ? color || "var(--gold)" : "var(--white-3)"}`,
    background: active ? `${color || "var(--gold)"}18` : "transparent",
    color: active ? color || "var(--gold-dark)" : "var(--gray)",
  };
}
const selectStyle = {
  padding: "6px 10px",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: "600",
  border: "1.5px solid var(--white-3)",
  background: "transparent",
  color: "var(--gray)",
  cursor: "pointer",
  outline: "none",
};
