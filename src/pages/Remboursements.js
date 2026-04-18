import React, { useState } from "react";
import toast from "react-hot-toast";

const REMB_DATA = [
  {
    id: "REMB-052",
    commande: "LV-00412",
    client: "Sophie M.",
    boutique: "Sandro Paris",
    montant: 490,
    type: "automatique",
    declencheur: "Incident livraison — coursier introuvable",
    statut: "en_cours",
    dateCreation: "18/04/2026",
    heureCreation: "15:35",
    datePrevue: "23/04/2026",
    reference: null,
    methode: "Carte bancaire",
  },
  {
    id: "REMB-051",
    commande: "LV-00390",
    client: "Yasmine B.",
    boutique: "Isabel Marant",
    montant: 450,
    type: "manuel_sav",
    declencheur: "Décision SAV — produit endommagé à réception",
    statut: "en_cours",
    dateCreation: "16/04/2026",
    heureCreation: "09:05",
    datePrevue: "21/04/2026",
    reference: null,
    methode: "Carte bancaire",
  },
  {
    id: "REMB-050",
    commande: "LV-00374",
    client: "Nadia S.",
    boutique: "AMI Paris",
    montant: 290,
    type: "manuel_admin",
    declencheur: "Arbitrage admin — boutique bloquait le remboursement",
    statut: "effectué",
    dateCreation: "10/04/2026",
    heureCreation: "10:05",
    datePrevue: "15/04/2026",
    reference: "VIR-REMB-2026-050",
    methode: "Carte bancaire",
  },
  {
    id: "REMB-049",
    commande: "LV-00360",
    client: "Sophie M.",
    boutique: "Sandro Paris",
    montant: 198,
    type: "automatique",
    declencheur: "Retour validé — changement d'avis",
    statut: "effectué",
    dateCreation: "02/04/2026",
    heureCreation: "10:20",
    datePrevue: "07/04/2026",
    reference: "VIR-REMB-2026-049",
    methode: "Carte bancaire",
  },
  {
    id: "REMB-048",
    commande: "LV-00350",
    client: "Karim T.",
    boutique: "AMI Paris",
    montant: 89,
    type: "automatique",
    declencheur: "Boutique refus — produit indisponible après acceptation",
    statut: "effectué",
    dateCreation: "29/03/2026",
    heureCreation: "14:30",
    datePrevue: "03/04/2026",
    reference: "VIR-REMB-2026-048",
    methode: "Carte bancaire",
  },
  {
    id: "REMB-047",
    commande: "LV-00340",
    client: "Emma B.",
    boutique: "Sandro Paris",
    montant: 320,
    type: "automatique",
    declencheur: "Pas de réponse boutique dans le délai imparti",
    statut: "effectué",
    dateCreation: "25/03/2026",
    heureCreation: "16:00",
    datePrevue: "30/03/2026",
    reference: "VIR-REMB-2026-047",
    methode: "Carte bancaire",
  },
  {
    id: "REMB-046",
    commande: "LV-00335",
    client: "Lucas D.",
    boutique: "By Terry",
    montant: 42,
    type: "manuel_sav",
    declencheur: "Erreur de livraison — mauvais produit envoyé",
    statut: "en_attente",
    dateCreation: "18/04/2026",
    heureCreation: "11:00",
    datePrevue: "23/04/2026",
    reference: null,
    methode: "Carte bancaire",
  },
];

const TYPE_CFG = {
  automatique: {
    label: "Automatique",
    color: "#185fa5",
    bg: "#eff6ff",
    icon: "⚡",
    desc: "Déclenché par la plateforme",
  },
  manuel_sav: {
    label: "Manuel SAV",
    color: "#6d28d9",
    bg: "#f5f3ff",
    icon: "👤",
    desc: "Décidé par le SAV",
  },
  manuel_admin: {
    label: "Manuel Admin",
    color: "#C9A96E",
    bg: "rgba(201,169,110,0.1)",
    icon: "⚖️",
    desc: "Décidé par l'admin",
  },
};

const STATUT_CFG = {
  en_attente: {
    label: "En attente",
    color: "#b7770d",
    bg: "#faeeda",
    dot: "#F59E0B",
  },
  en_cours: {
    label: "En cours",
    color: "#185fa5",
    bg: "#eff6ff",
    dot: "#3B82F6",
  },
  effectué: {
    label: "Effectué ✓",
    color: "#2e8b57",
    bg: "#e8f5ee",
    dot: "#10B981",
  },
  échoué: { label: "Échoué", color: "#c0392b", bg: "#fef2f2", dot: "#EF4444" },
};

export default function Remboursements() {
  const [rembs, setRembs] = useState(REMB_DATA);
  const [selected, setSelected] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [filterStatut, setFilterStatut] = useState("all");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [refText, setRefText] = useState("");

  const remb = selected ? rembs.find((r) => r.id === selected) : null;

  const filtres = rembs.filter(
    (r) =>
      (filterType === "all" || r.type === filterType) &&
      (filterStatut === "all" || r.statut === filterStatut)
  );

  const stats = {
    total: rembs.length,
    montantTotal: rembs.reduce((s, r) => s + r.montant, 0),
    enCours: rembs.filter(
      (r) => r.statut === "en_cours" || r.statut === "en_attente"
    ).length,
    montantEnCours: rembs
      .filter((r) => r.statut !== "effectué")
      .reduce((s, r) => s + r.montant, 0),
    effectués: rembs.filter((r) => r.statut === "effectué").length,
    automatiques: rembs.filter((r) => r.type === "automatique").length,
    manuels: rembs.filter((r) => r.type !== "automatique").length,
  };

  const confirmerVirement = () => {
    if (!refText.trim()) {
      toast.error("Référence obligatoire");
      return;
    }
    setRembs((prev) =>
      prev.map((r) =>
        r.id === selected
          ? { ...r, statut: "effectué", reference: refText.trim() }
          : r
      )
    );
    setShowConfirmModal(false);
    setRefText("");
    toast.success("Remboursement marqué comme effectué");
  };

  const exportCSV = () => {
    const rows = [
      [
        "ID",
        "Commande",
        "Client",
        "Boutique",
        "Montant",
        "Type",
        "Statut",
        "Déclencheur",
        "Date création",
        "Référence",
      ],
      ...filtres.map((r) => [
        r.id,
        r.commande,
        r.client,
        r.boutique,
        r.montant + "€",
        TYPE_CFG[r.type].label,
        STATUT_CFG[r.statut].label,
        `"${r.declencheur}"`,
        r.dateCreation,
        r.reference || "—",
      ]),
    ];
    const csv = rows.map((r) => r.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `livrr-remboursements-${new Date()
      .toLocaleDateString("fr-FR")
      .replace(/\//g, "-")}.csv`;
    a.click();
    toast.success("Export CSV téléchargé");
  };

  return (
    <div className="page" style={{ padding: "44px 52px" }}>
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
            Remboursements
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}
          >
            Automatiques, SAV et admin — suivi et confirmation des virements
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
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "12px",
          marginBottom: "28px",
        }}
      >
        {[
          {
            label: "Total remboursements",
            val: stats.total,
            color: "var(--noir)",
          },
          {
            label: "Montant total",
            val: stats.montantTotal.toLocaleString("fr-FR") + "€",
            color: "var(--noir)",
          },
          { label: "En cours / attente", val: stats.enCours, color: "#185fa5" },
          {
            label: "Montant en attente",
            val: stats.montantEnCours + "€",
            color: "#b7770d",
          },
          { label: "Automatiques", val: stats.automatiques, color: "#185fa5" },
          { label: "Manuels", val: stats.manuels, color: "#6d28d9" },
        ].map((k) => (
          <div
            key={k.label}
            style={{
              background: "#fff",
              borderRadius: "var(--radius-md)",
              padding: "16px 18px",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--white-3)",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: "700",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--gray)",
                marginBottom: "8px",
              }}
            >
              {k.label}
            </div>
            <div
              style={{
                fontSize: "22px",
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

      {/* Légende types */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {Object.entries(TYPE_CFG).map(([k, v]) => (
          <div
            key={k}
            style={{
              background: v.bg,
              borderRadius: "var(--radius-md)",
              padding: "14px 18px",
              border: `1px solid ${v.color}30`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <span style={{ fontSize: "18px" }}>{v.icon}</span>
              <span
                style={{ fontSize: "13px", fontWeight: "600", color: v.color }}
              >
                {v.label}
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "var(--gray)" }}>
              {v.desc}
            </div>
            <div
              style={{
                fontSize: "18px",
                fontFamily: "var(--font-display)",
                fontWeight: "300",
                color: v.color,
                marginTop: "4px",
              }}
            >
              {rembs.filter((r) => r.type === k).length} ·{" "}
              {rembs
                .filter((r) => r.type === k)
                .reduce((s, r) => s + r.montant, 0)}
              €
            </div>
          </div>
        ))}
      </div>

      {/* Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: "20px",
        }}
      >
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
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid var(--white-3)",
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--gray)",
              }}
            >
              Filtres
            </span>
            {["all", "automatique", "manuel_sav", "manuel_admin"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                style={fBtn(
                  filterType === t,
                  t !== "all" ? TYPE_CFG[t]?.color : null,
                  t !== "all" ? TYPE_CFG[t]?.bg : null
                )}
              >
                {t === "all"
                  ? "Tous types"
                  : TYPE_CFG[t].icon + " " + TYPE_CFG[t].label}
              </button>
            ))}
            <div
              style={{ width: 1, height: 20, background: "var(--white-3)" }}
            />
            {["all", "en_attente", "en_cours", "effectué"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatut(s)}
                style={fBtn(
                  filterStatut === s,
                  s !== "all" ? STATUT_CFG[s]?.color : null,
                  s !== "all" ? STATUT_CFG[s]?.bg : null
                )}
              >
                {s === "all" ? "Tous statuts" : STATUT_CFG[s].label}
              </button>
            ))}
          </div>

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
                  "Réf.",
                  "Client",
                  "Boutique",
                  "Montant",
                  "Type",
                  "Déclencheur",
                  "Date",
                  "Statut",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 14px",
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
              {filtres.map((r) => {
                const tc = TYPE_CFG[r.type];
                const sc = STATUT_CFG[r.statut];
                const isActive = selected === r.id;
                return (
                  <tr
                    key={r.id}
                    onClick={() => setSelected(isActive ? null : r.id)}
                    style={{
                      borderBottom: "1px solid var(--white-3)",
                      cursor: "pointer",
                      background: isActive
                        ? "rgba(201,169,110,0.04)"
                        : "transparent",
                      transition: "background 0.15s",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 14px",
                        fontWeight: "700",
                        color: "var(--gold-dark)",
                        fontSize: "11px",
                        fontFamily: "monospace",
                      }}
                    >
                      {r.id}
                    </td>
                    <td style={{ padding: "12px 14px", fontWeight: "500" }}>
                      {r.client}
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        fontSize: "12px",
                        color: "var(--gray)",
                      }}
                    >
                      {r.boutique}
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        fontWeight: "700",
                        fontSize: "14px",
                      }}
                    >
                      {r.montant}€
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          background: tc.bg,
                          color: tc.color,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {tc.icon} {tc.label}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        fontSize: "12px",
                        color: "var(--gray)",
                        maxWidth: "180px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.declencheur}
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        fontSize: "12px",
                        color: "var(--gray)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.dateCreation}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          padding: "3px 10px",
                          borderRadius: "12px",
                          background: sc.bg,
                          color: sc.color,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: sc.dot,
                          }}
                        />
                        {sc.label}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      {(r.statut === "en_cours" ||
                        r.statut === "en_attente") && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(r.id);
                            setShowConfirmModal(true);
                          }}
                          style={{
                            padding: "5px 12px",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "11px",
                            fontWeight: "600",
                            background: "#e8f5ee",
                            color: "#2e8b57",
                            border: "1px solid #bbf7d0",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Confirmer virement
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div
            style={{
              padding: "14px 18px",
              borderTop: "2px solid var(--white-3)",
              background: "var(--gray-bg)",
              display: "flex",
              justifyContent: "flex-end",
              gap: "32px",
            }}
          >
            {[
              {
                label: "Montant filtré",
                val:
                  filtres
                    .reduce((s, r) => s + r.montant, 0)
                    .toLocaleString("fr-FR") + "€",
              },
              {
                label: "En attente de virement",
                val:
                  filtres
                    .filter((r) => r.statut !== "effectué")
                    .reduce((s, r) => s + r.montant, 0)
                    .toLocaleString("fr-FR") + "€",
                color: "#b7770d",
              },
            ].map((t) => (
              <div key={t.label} style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--gray)",
                    marginBottom: "3px",
                  }}
                >
                  {t.label}
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: t.color || "var(--noir)",
                  }}
                >
                  {t.val}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Détail */}
        {!remb ? (
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--white-3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--gray)",
            }}
          >
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>💸</div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "22px",
                  fontWeight: "300",
                }}
              >
                Sélectionnez un remboursement
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--white-3)",
              display: "flex",
              flexDirection: "column",
              maxHeight: "calc(100vh - 340px)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "18px 22px",
                borderBottom: "1px solid var(--white-3)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "20px",
                  fontWeight: "300",
                  marginBottom: "6px",
                }}
              >
                {remb.id}
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    background: TYPE_CFG[remb.type].bg,
                    color: TYPE_CFG[remb.type].color,
                  }}
                >
                  {TYPE_CFG[remb.type].icon} {TYPE_CFG[remb.type].label}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    background: STATUT_CFG[remb.statut].bg,
                    color: STATUT_CFG[remb.statut].color,
                  }}
                >
                  {STATUT_CFG[remb.statut].label}
                </span>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "18px 22px" }}>
              <div
                style={{
                  background: "var(--gray-bg)",
                  borderRadius: "var(--radius-md)",
                  padding: "14px 16px",
                  border: "1px solid var(--white-3)",
                  marginBottom: "16px",
                }}
              >
                {[
                  { label: "Montant", val: remb.montant + "€", bold: true },
                  { label: "Commande", val: remb.commande },
                  { label: "Client", val: remb.client },
                  { label: "Boutique", val: remb.boutique },
                  { label: "Méthode", val: remb.methode },
                  {
                    label: "Créé le",
                    val: `${remb.dateCreation} à ${remb.heureCreation}`,
                  },
                  { label: "Date prévue", val: remb.datePrevue },
                  { label: "Référence virement", val: remb.reference || "—" },
                ].map((r) => (
                  <div
                    key={r.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                      gap: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--gray)",
                        flexShrink: 0,
                      }}
                    >
                      {r.label}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: r.bold ? "700" : "500",
                        textAlign: "right",
                        color: r.bold ? "var(--noir)" : "inherit",
                      }}
                    >
                      {r.val}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--gray)",
                    marginBottom: "8px",
                  }}
                >
                  Déclencheur
                </div>
                <div
                  style={{
                    background: TYPE_CFG[remb.type].bg,
                    border: `1px solid ${TYPE_CFG[remb.type].color}30`,
                    borderRadius: "var(--radius-sm)",
                    padding: "10px 14px",
                    fontSize: "13px",
                    color: "var(--noir)",
                    lineHeight: 1.6,
                  }}
                >
                  {TYPE_CFG[remb.type].icon} {remb.declencheur}
                </div>
              </div>
              {(remb.statut === "en_cours" || remb.statut === "en_attente") && (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  style={{
                    width: "100%",
                    padding: "11px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "12px",
                    fontWeight: "600",
                    background: "#e8f5ee",
                    color: "#2e8b57",
                    border: "1.5px solid #bbf7d0",
                    cursor: "pointer",
                  }}
                >
                  ✓ Confirmer le virement effectué
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal confirmer virement */}
      {showConfirmModal && remb && (
        <div style={OVL} onClick={() => setShowConfirmModal(false)}>
          <div
            style={{ ...MDL, width: "440px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: "300",
                marginBottom: "6px",
              }}
            >
              Confirmer le virement
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "20px",
              }}
            >
              {remb.id} · {remb.client} · <strong>{remb.montant}€</strong>
            </p>
            <div
              style={{
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: "var(--radius-sm)",
                padding: "10px 14px",
                fontSize: "12px",
                color: "#b7770d",
                marginBottom: "16px",
              }}
            >
              ⚠ Assurez-vous que le virement a bien été émis avant de confirmer.
              Cette action est irréversible.
            </div>
            <label style={LBL}>Référence de virement *</label>
            <input
              type="text"
              value={refText}
              onChange={(e) => setRefText(e.target.value)}
              placeholder="Ex. : VIR-REMB-2026-052"
              autoFocus
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1.5px solid var(--white-3)",
                borderRadius: "var(--radius-sm)",
                fontSize: "13px",
                outline: "none",
                marginBottom: "20px",
              }}
            />
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowConfirmModal(false)}
                style={bStyle("ghost")}
              >
                Annuler
              </button>
              <button onClick={confirmerVirement} style={bStyle("success")}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function fBtn(active, color, bg) {
  return {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
    border: `1.5px solid ${active ? color || "var(--gold)" : "var(--white-3)"}`,
    background: active ? bg || "rgba(201,169,110,0.08)" : "transparent",
    color: active ? color || "var(--gold-dark)" : "var(--gray)",
  };
}
function bStyle(t) {
  const s = {
    gold: { background: "var(--noir)", color: "var(--gold)", border: "none" },
    ghost: {
      background: "transparent",
      color: "var(--gray)",
      border: "1.5px solid var(--white-3)",
    },
    success: {
      background: "#e8f5ee",
      color: "#2e8b57",
      border: "1.5px solid #bbf7d0",
    },
  };
  return {
    padding: "9px 16px",
    borderRadius: "var(--radius-sm)",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    ...s[t],
  };
}
const OVL = {
  position: "fixed",
  inset: 0,
  background: "rgba(10,10,15,0.55)",
  zIndex: 200,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const MDL = {
  background: "#fff",
  borderRadius: "var(--radius-lg)",
  padding: "32px",
  width: "500px",
  boxShadow: "var(--shadow-lg)",
  maxHeight: "90vh",
  overflowY: "auto",
};
const LBL = {
  display: "block",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--gray)",
  marginBottom: "8px",
};
