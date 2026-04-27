import React, { useState } from "react";

const HISTORIQUE_DATA = [
  {
    id: "REC-088",
    date: "18/04/2026",
    heure: "15:20",
    client: "Sophie M.",
    boutique: "Sandro Paris",
    type: "livraison",
    sujet: "Commande non reçue après 3h",
    resolution: "escalade",
    statut: "escaladé",
    montant: 490,
    tempResolution: null,
    assigné: "Marie (SAV)",
  },
  {
    id: "REC-087",
    date: "18/04/2026",
    heure: "09:15",
    client: "Rouje (boutique)",
    boutique: "Rouje",
    type: "technique",
    sujet: "Problème accès application",
    resolution: "résolu",
    statut: "résolu",
    montant: null,
    tempResolution: "2h15",
    assigné: "Lucas (SAV)",
  },
  {
    id: "REC-086",
    date: "16/04/2026",
    heure: "11:30",
    client: "Yasmine B.",
    boutique: "Isabel Marant",
    type: "produit",
    sujet: "Produit endommagé — déchirure couture",
    resolution: "remboursement",
    statut: "résolu",
    montant: 450,
    tempResolution: "18h",
    assigné: "Lucas (SAV)",
  },
  {
    id: "REC-085",
    date: "15/04/2026",
    heure: "14:30",
    client: "Lucas D.",
    boutique: "By Terry",
    type: "produit",
    sujet: "Description produit trompeuse",
    resolution: "en_cours",
    statut: "en_cours",
    montant: null,
    tempResolution: null,
    assigné: "Marie (SAV)",
  },
  {
    id: "REC-084",
    date: "14/04/2026",
    heure: "11:00",
    client: "Nadia S.",
    boutique: "Multiple",
    type: "fraude",
    sujet: "Tentative fraude — 3 chargebacks",
    resolution: "blocage",
    statut: "résolu",
    montant: 890,
    tempResolution: "1h20",
    assigné: "Khalil B.",
  },
  {
    id: "REC-083",
    date: "12/04/2026",
    heure: "14:00",
    client: "By Terry (boutique)",
    boutique: "By Terry",
    type: "litige",
    sujet: "Commande annulée sans notification",
    resolution: "compensation",
    statut: "résolu",
    montant: 15,
    tempResolution: "4h25",
    assigné: "Lucas (SAV)",
  },
  {
    id: "REC-082",
    date: "10/04/2026",
    heure: "09:45",
    client: "Karim T.",
    boutique: "AMI Paris",
    type: "remboursement",
    sujet: "Remboursement non reçu après retour",
    resolution: "remboursement",
    statut: "résolu",
    montant: 89,
    tempResolution: "25min",
    assigné: "Marie (SAV)",
  },
  {
    id: "REC-081",
    date: "08/04/2026",
    heure: "10:00",
    client: "Nadia S.",
    boutique: "Sandro Paris",
    type: "commande",
    sujet: "Commande annulée — client mécontent",
    resolution: "remboursement",
    statut: "résolu",
    montant: 890,
    tempResolution: "1h",
    assigné: "Marie (SAV)",
  },
  {
    id: "REC-080",
    date: "05/04/2026",
    heure: "14:22",
    client: "Emma B.",
    boutique: "AMI Paris",
    type: "livraison",
    sujet: "Retard livraison > 2h",
    resolution: "geste_commercial",
    statut: "résolu",
    montant: 10,
    tempResolution: "45min",
    assigné: "Lucas (SAV)",
  },
  {
    id: "REC-079",
    date: "02/04/2026",
    heure: "11:15",
    client: "Sophie M.",
    boutique: "Sandro Paris",
    type: "produit",
    sujet: "Taille incorrecte reçue",
    resolution: "retour",
    statut: "résolu",
    montant: 198,
    tempResolution: "3h",
    assigné: "Marie (SAV)",
  },
];

const TYPE_CFG = {
  livraison:     { label: "Livraison",     color: "#185fa5", bg: "#eff6ff", icon: "🛵" },
  produit:       { label: "Produit",       color: "#b7770d", bg: "#faeeda", icon: "📦" },
  remboursement: { label: "Remboursement", color: "#6d28d9", bg: "#f5f3ff", icon: "💸" },
  fraude:        { label: "Fraude",        color: "#c0392b", bg: "#fef2f2", icon: "⚠️" },
  litige:        { label: "Litige",        color: "#c0392b", bg: "#fef2f2", icon: "⚖️" },
  commande:      { label: "Commande",      color: "#2e8b57", bg: "#e8f5ee", icon: "🛍️" },
  technique:     { label: "Technique",     color: "#6B7280", bg: "#f3f4f6", icon: "⚙️" },
};

const RESOLUTION_CFG = {
  résolu:           { label: "Résolu",           color: "#2e8b57", bg: "#e8f5ee" },
  remboursement:    { label: "Remboursé",         color: "#2e8b57", bg: "#e8f5ee" },
  escalade:         { label: "Escaladé",          color: "#c0392b", bg: "#fef2f2" },
  en_cours:         { label: "En cours",          color: "#185fa5", bg: "#eff6ff" },
  blocage:          { label: "Compte bloqué",     color: "#c0392b", bg: "#fef2f2" },
  compensation:     { label: "Compensation",      color: "#6d28d9", bg: "#f5f3ff" },
  retour:           { label: "Retour accepté",    color: "#b7770d", bg: "#faeeda" },
  geste_commercial: { label: "Geste commercial",  color: "#b7770d", bg: "#faeeda" },
};

export default function HistoriqueReclamations() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterRes, setFilterRes] = useState("all");
  const [selected, setSelected] = useState(null);

  // ✅ POINT 9 — rec est toujours calculé, quel que soit le statut
  const rec = selected ? HISTORIQUE_DATA.find((r) => r.id === selected) : null;

  const filtres = HISTORIQUE_DATA.filter(
    (r) =>
      (filterType === "all" || r.type === filterType) &&
      (filterRes === "all" || r.resolution === filterRes || r.statut === filterRes) &&
      (r.id.toLowerCase().includes(search.toLowerCase()) ||
        r.client.toLowerCase().includes(search.toLowerCase()) ||
        r.boutique.toLowerCase().includes(search.toLowerCase()) ||
        r.sujet.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    total: HISTORIQUE_DATA.length,
    résolus: HISTORIQUE_DATA.filter((r) =>
      ["résolu", "remboursement", "blocage", "compensation", "retour", "geste_commercial"].includes(r.resolution)
    ).length,
    montantTotal: HISTORIQUE_DATA.filter((r) => r.montant).reduce((s, r) => s + r.montant, 0),
    tempsGlobal: "2h18",
    tauxResolution: "89%",
  };

  const exportCSV = () => {
    const rows = [
      ["ID", "Date", "Heure", "Client", "Boutique", "Type", "Sujet", "Résolution", "Montant", "Temps résol.", "Assigné"],
      ...filtres.map((r) => [
        r.id, r.date, r.heure, r.client, r.boutique,
        TYPE_CFG[r.type]?.label,
        r.sujet,
        RESOLUTION_CFG[r.resolution]?.label || r.resolution,
        r.montant ? r.montant + "€" : "—",
        r.tempResolution || "—",
        r.assigné,
      ]),
    ];
    const csv = rows.map((r) => r.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `livrr-reclamations-${new Date().toLocaleDateString("fr-FR").replace(/\//g, "-")}.csv`;
    a.click();
  };

  return (
    <div className="page" style={{ padding: "32px 36px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "36px" }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gray)", marginBottom: "8px" }}>Administration</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "44px", fontWeight: "300", lineHeight: 1.1 }}>Historique des réclamations</h1>
          <p style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}>Journal complet de toutes les réclamations — ouvertes, résolues et escaladées</p>
        </div>
        <button onClick={exportCSV} style={{ padding: "10px 20px", borderRadius: "var(--radius-sm)", fontSize: "12px", fontWeight: "600", background: "var(--noir)", color: "var(--gold)", border: "none", cursor: "pointer" }}>
          ↓ Exporter CSV
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px", marginBottom: "18px" }}>
        {[
          { label: "Total réclamations",   val: stats.total,           color: "var(--noir)" },
          { label: "Résolues",             val: stats.résolus,         color: "#2e8b57" },
          { label: "Taux de résolution",   val: stats.tauxResolution,  color: "#2e8b57" },
          { label: "Temps moyen résol.",   val: stats.tempsGlobal,     color: "#185fa5" },
          { label: "Montant total traité", val: `${stats.montantTotal.toLocaleString("fr-FR")}€`, color: "var(--gold-dark)" },
        ].map((k) => (
          <div key={k.label} style={{ background: "#fff", borderRadius: "var(--radius-md)", padding: "18px 20px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--white-3)" }}>
            <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gray)", marginBottom: "8px" }}>{k.label}</div>
            <div style={{ fontSize: "26px", fontFamily: "var(--font-display)", fontWeight: "300", color: k.color, lineHeight: 1 }}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", padding: "14px 18px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--white-3)", marginBottom: "16px", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
        <input type="text" placeholder="ID, client, boutique, sujet…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: "8px 12px", border: "1px solid var(--white-3)", borderRadius: "var(--radius-sm)", fontSize: "13px", background: "var(--gray-bg)", outline: "none", minWidth: "200px" }} />
        <div style={{ width: 1, height: 20, background: "var(--white-3)" }} />
        <button onClick={() => setFilterType("all")} style={fBtn(filterType === "all")}>Tous types</button>
        {Object.entries(TYPE_CFG).map(([k, v]) => (
          <button key={k} onClick={() => setFilterType(k)} style={fBtn(filterType === k, v.color, v.bg)}>{v.icon} {v.label}</button>
        ))}
        <div style={{ width: 1, height: 20, background: "var(--white-3)" }} />
        <button onClick={() => setFilterRes("all")} style={fBtn(filterRes === "all")}>Tous statuts</button>
        <button onClick={() => setFilterRes("résolu")} style={fBtn(filterRes === "résolu", "#2e8b57", "#e8f5ee")}>✓ Résolu</button>
        <button onClick={() => setFilterRes("en_cours")} style={fBtn(filterRes === "en_cours", "#185fa5", "#eff6ff")}>En cours</button>
        <button onClick={() => setFilterRes("escalade")} style={fBtn(filterRes === "escalade", "#c0392b", "#fef2f2")}>Escaladé</button>
        <span style={{ marginLeft: "auto", fontSize: "12px", color: "var(--gray)" }}>{filtres.length} réclamation{filtres.length > 1 ? "s" : ""}</span>
      </div>

      {/* ✅ POINT 9 — Layout tableau + panneau détail côte à côte */}
      <div style={{ display: "grid", gridTemplateColumns: rec ? "1fr 380px" : "1fr", gap: "16px", alignItems: "start" }}>

        {/* Tableau */}
        <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--white-3)", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "640px" }}>
            <thead>
              <tr style={{ background: "var(--gray-bg)" }}>
                {["ID", "Date", "Client / Boutique", "Type", "Sujet", "Assigné", "Temps", "Résolution"].map((h) => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gray)", borderBottom: "1px solid var(--white-3)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtres.map((r) => {
                const tc = TYPE_CFG[r.type];
                const rc = RESOLUTION_CFG[r.resolution] || RESOLUTION_CFG["résolu"];
                const isActive = selected === r.id;
                return (
                  <tr
                    key={r.id}
                    // ✅ POINT 9 — clic sur n'importe quelle ligne ouvre le détail
                    onClick={() => setSelected(isActive ? null : r.id)}
                    style={{ borderBottom: "1px solid var(--white-3)", cursor: "pointer", background: isActive ? "rgba(201,169,110,0.06)" : "transparent", transition: "background 0.15s" }}
                  >
                    <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: "11px", fontWeight: "600", color: "var(--gold-dark)" }}>{r.id}</td>
                    <td style={{ padding: "10px 12px", fontSize: "11px", color: "var(--gray)", whiteSpace: "nowrap" }}>{r.heure}<br />{r.date}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ fontSize: "12px", fontWeight: "500" }}>{r.client}</div>
                      <div style={{ fontSize: "11px", color: "var(--gray)" }}>{r.boutique}</div>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "600", padding: "2px 7px", borderRadius: "10px", background: tc.bg, color: tc.color, whiteSpace: "nowrap" }}>{tc.icon} {tc.label}</span>
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: "12px", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.sujet}</td>
                    <td style={{ padding: "10px 12px", fontSize: "11px", color: "var(--gray)", whiteSpace: "nowrap" }}>{r.assigné}</td>
                    <td style={{ padding: "10px 12px", fontSize: "11px", color: r.tempResolution ? "#2e8b57" : "var(--gray-light)", fontWeight: r.tempResolution ? "600" : "400", whiteSpace: "nowrap" }}>{r.tempResolution || "—"}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "10px", background: rc.bg, color: rc.color, whiteSpace: "nowrap" }}>{rc.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtres.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px", color: "var(--gray)" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔍</div>
              <div style={{ fontSize: "13px" }}>Aucune réclamation trouvée</div>
            </div>
          )}
        </div>

        {/* ✅ POINT 9 — Panneau détail complet */}
        {rec && (
          <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--white-3)", position: "sticky", top: "20px" }}>
            {/* Header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--white-3)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold-dark)", marginBottom: "4px" }}>
                  {TYPE_CFG[rec.type]?.icon} {TYPE_CFG[rec.type]?.label} — {rec.id}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: "300", lineHeight: 1.3 }}>{rec.sujet}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "var(--gray)", flexShrink: 0, marginLeft: "8px" }}>✕</button>
            </div>

            <div style={{ padding: "16px 20px" }}>
              {/* Statut + résolution */}
              <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
                {(() => {
                  const rc = RESOLUTION_CFG[rec.resolution] || RESOLUTION_CFG["résolu"];
                  return (
                    <span style={{ fontSize: "12px", fontWeight: "600", padding: "4px 12px", borderRadius: "20px", background: rc.bg, color: rc.color }}>{rc.label}</span>
                  );
                })()}
                {(() => {
                  const tc = TYPE_CFG[rec.type];
                  return (
                    <span style={{ fontSize: "12px", fontWeight: "600", padding: "4px 12px", borderRadius: "20px", background: tc.bg, color: tc.color }}>{tc.icon} {tc.label}</span>
                  );
                })()}
              </div>

              {/* Infos principales */}
              <div style={{ background: "var(--gray-bg)", borderRadius: "var(--radius-md)", padding: "14px 16px", border: "1px solid var(--white-3)", marginBottom: "14px" }}>
                {[
                  { l: "Client",    v: rec.client },
                  { l: "Boutique",  v: rec.boutique },
                  { l: "Assigné à", v: rec.assigné },
                  { l: "Date",      v: `${rec.date} à ${rec.heure}` },
                  { l: "Montant",   v: rec.montant ? `${rec.montant}€` : "—", bold: !!rec.montant },
                  { l: "Temps de résolution", v: rec.tempResolution || "En cours", color: rec.tempResolution ? "#2e8b57" : "#185fa5" },
                ].map((row) => (
                  <div key={row.l} style={{ display: "flex", justifyContent: "space-between", marginBottom: "7px", gap: "12px" }}>
                    <span style={{ fontSize: "12px", color: "var(--gray)", flexShrink: 0 }}>{row.l}</span>
                    <span style={{ fontSize: "12px", fontWeight: row.bold ? "700" : "500", textAlign: "right", color: row.color || (row.bold ? "var(--gold-dark)" : "var(--noir)") }}>{row.v}</span>
                  </div>
                ))}
              </div>

              {/* Sujet complet */}
              <div style={{ marginBottom: "14px" }}>
                <div style={DETAIL_TITLE}>Sujet</div>
                <div style={{ background: "#f8f8f6", border: "1px solid var(--white-3)", borderRadius: "var(--radius-sm)", padding: "10px 14px", fontSize: "13px", color: "var(--noir)", lineHeight: 1.6 }}>
                  {rec.sujet}
                </div>
              </div>

              {/* Résolution détaillée */}
              <div>
                <div style={DETAIL_TITLE}>Résolution</div>
                {(() => {
                  const rc = RESOLUTION_CFG[rec.resolution] || RESOLUTION_CFG["résolu"];
                  const isOpen = rec.resolution === "en_cours" || rec.resolution === "escalade";
                  return (
                    <div style={{ background: isOpen ? "#eff6ff" : "#e8f5ee", border: `1px solid ${isOpen ? "#bfdbfe" : "#bbf7d0"}`, borderRadius: "var(--radius-sm)", padding: "10px 14px", fontSize: "13px", color: isOpen ? "#185fa5" : "#2e8b57", fontWeight: "500" }}>
                      {isOpen ? "⏳ " : "✓ "}{rc.label}
                      {rec.montant && !isOpen ? ` — ${rec.montant}€` : ""}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function fBtn(active, color, bg) {
  return { padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", cursor: "pointer", border: `1.5px solid ${active ? color || "var(--gold)" : "var(--white-3)"}`, background: active ? bg || "rgba(201,169,110,0.08)" : "transparent", color: active ? color || "var(--gold-dark)" : "var(--gray)" };
}

const DETAIL_TITLE = { fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gray)", marginBottom: "8px" };
