import React, { useState } from "react";
import toast from "react-hot-toast";

const FACTURES_DATA = [
  {
    id: "FAC-2026-042",
    boutique: "Sandro Paris",
    plan: "prestige",
    montant: 599,
    statut: "payée",
    periode: "Avril 2026",
    dateEmission: "01/04/2026",
    datePaiement: "01/04/2026",
    reference: "PAY-SP-2026-04",
    methode: "Prélèvement SEPA",
  },
  {
    id: "FAC-2026-041",
    boutique: "AMI Paris",
    plan: "signature",
    montant: 299,
    statut: "impayée",
    periode: "Avril 2026",
    dateEmission: "01/04/2026",
    datePaiement: null,
    reference: null,
    methode: "Prélèvement SEPA",
  },
  {
    id: "FAC-2026-040",
    boutique: "By Terry",
    plan: "classic",
    montant: 149,
    statut: "payée",
    periode: "Avril 2026",
    dateEmission: "01/04/2026",
    datePaiement: "01/04/2026",
    reference: "PAY-BT-2026-04",
    methode: "Prélèvement SEPA",
  },
  {
    id: "FAC-2026-039",
    boutique: "Isabel Marant",
    plan: "signature",
    montant: 299,
    statut: "suspendue",
    periode: "Avril 2026",
    dateEmission: "01/04/2026",
    datePaiement: null,
    reference: null,
    methode: "Prélèvement SEPA",
  },
  {
    id: "FAC-2026-038",
    boutique: "Sandro Paris",
    plan: "prestige",
    montant: 599,
    statut: "payée",
    periode: "Mars 2026",
    dateEmission: "01/03/2026",
    datePaiement: "01/03/2026",
    reference: "PAY-SP-2026-03",
    methode: "Prélèvement SEPA",
  },
  {
    id: "FAC-2026-037",
    boutique: "AMI Paris",
    plan: "signature",
    montant: 299,
    statut: "payée",
    periode: "Mars 2026",
    dateEmission: "01/03/2026",
    datePaiement: "02/03/2026",
    reference: "PAY-AMI-2026-03",
    methode: "Prélèvement SEPA",
  },
  {
    id: "FAC-2026-036",
    boutique: "By Terry",
    plan: "classic",
    montant: 149,
    statut: "payée",
    periode: "Mars 2026",
    dateEmission: "01/03/2026",
    datePaiement: "01/03/2026",
    reference: "PAY-BT-2026-03",
    methode: "Prélèvement SEPA",
  },
  {
    id: "FAC-2026-035",
    boutique: "Isabel Marant",
    plan: "signature",
    montant: 299,
    statut: "payée",
    periode: "Mars 2026",
    dateEmission: "01/03/2026",
    datePaiement: "01/03/2026",
    reference: "PAY-IM-2026-03",
    methode: "Prélèvement SEPA",
  },
];

const STATUT_CFG = {
  payée: { label: "Payée ✓", color: "#2e8b57", bg: "#e8f5ee", dot: "#10B981" },
  impayée: {
    label: "Impayée",
    color: "#c0392b",
    bg: "#fef2f2",
    dot: "#EF4444",
  },
  suspendue: {
    label: "Suspendue",
    color: "#6B7280",
    bg: "#f3f4f6",
    dot: "#9CA3AF",
  },
  en_cours: {
    label: "En cours",
    color: "#185fa5",
    bg: "#eff6ff",
    dot: "#3B82F6",
  },
};

const PLAN_COLOR = {
  prestige: "#C9A96E",
  signature: "#3B82F6",
  classic: "#6B7280",
};

export default function Facturation() {
  const [factures, setFactures] = useState(FACTURES_DATA);
  const [selected, setSelected] = useState(null);
  const [filterStatut, setFilterStatut] = useState("all");
  const [filterPeriode, setFilterPeriode] = useState("all");
  const [showRelanceModal, setShowRelanceModal] = useState(false);
  const [showLienModal, setShowLienModal] = useState(false);

  const fac = selected ? factures.find((f) => f.id === selected) : null;
  const periodes = [...new Set(factures.map((f) => f.periode))];

  const filtres = factures.filter(
    (f) =>
      (filterStatut === "all" || f.statut === filterStatut) &&
      (filterPeriode === "all" || f.periode === filterPeriode)
  );

  const stats = {
    mrr: factures
      .filter((f) => f.periode === "Avril 2026" && f.statut === "payée")
      .reduce((s, f) => s + f.montant, 0),
    impayées: factures.filter((f) => f.statut === "impayée").length,
    montantImpayé: factures
      .filter((f) => f.statut === "impayée")
      .reduce((s, f) => s + f.montant, 0),
    total: factures
      .filter((f) => f.periode === "Avril 2026")
      .reduce((s, f) => s + f.montant, 0),
  };

  const marquerPayée = (id) => {
    setFactures((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              statut: "payée",
              datePaiement: new Date().toLocaleDateString("fr-FR"),
              reference: `PAY-MANUEL-${Date.now()}`,
            }
          : f
      )
    );
    toast.success("Facture marquée comme payée");
  };

  const envoyerRelance = () => {
    setShowRelanceModal(false);
    toast.success(`Email de relance envoyé à ${fac?.boutique}`);
  };

  const exportCSV = () => {
    const rows = [
      [
        "ID",
        "Boutique",
        "Plan",
        "Montant",
        "Statut",
        "Période",
        "Date émission",
        "Date paiement",
        "Référence",
      ],
      ...filtres.map((f) => [
        f.id,
        f.boutique,
        f.plan,
        f.montant + "€",
        STATUT_CFG[f.statut].label,
        f.periode,
        f.dateEmission,
        f.datePaiement || "—",
        f.reference || "—",
      ]),
    ];
    const csv = rows.map((r) => r.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `livrr-facturation-${new Date()
      .toLocaleDateString("fr-FR")
      .replace(/\//g, "-")}.csv`;
    a.click();
    toast.success("Export CSV téléchargé");
  };

  return (
    <div className="page" style={{ padding: "32px 36px" }}>
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
            Facturation boutiques
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}
          >
            Abonnements mensuels, historique des paiements et relances
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "14px",
          marginBottom: "28px",
        }}
      >
        {[
          {
            label: "MRR (abonnements)",
            val: stats.mrr.toLocaleString("fr-FR") + "€",
            color: "var(--gold-dark)",
          },
          {
            label: "Total facturé (mois)",
            val: stats.total.toLocaleString("fr-FR") + "€",
            color: "var(--noir)",
          },
          { label: "Factures impayées", val: stats.impayées, color: "#c0392b" },
          {
            label: "Montant impayé",
            val: stats.montantImpayé + "€",
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
                fontSize: "28px",
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
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
            {["all", "payée", "impayée", "suspendue"].map((s) => (
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
            <div
              style={{ width: 1, height: 20, background: "var(--white-3)" }}
            />
            <select
              value={filterPeriode}
              onChange={(e) => setFilterPeriode(e.target.value)}
              style={{
                padding: "5px 10px",
                borderRadius: "20px",
                fontSize: "11px",
                fontWeight: "600",
                border: "1.5px solid var(--white-3)",
                background: "transparent",
                color: "var(--gray)",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="all">Toutes périodes</option>
              {periodes.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
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
                  "Réf. facture",
                  "Boutique",
                  "Plan",
                  "Montant",
                  "Période",
                  "Émission",
                  "Paiement",
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
              {filtres.map((f) => {
                const sc = STATUT_CFG[f.statut];
                const pc = PLAN_COLOR[f.plan];
                const isActive = selected === f.id;
                return (
                  <tr
                    key={f.id}
                    onClick={() => setSelected(isActive ? null : f.id)}
                    style={{
                      borderBottom: "1px solid var(--white-3)",
                      cursor: "pointer",
                      background: isActive
                        ? "rgba(201,169,110,0.04)"
                        : f.statut === "impayée"
                        ? "rgba(192,57,43,0.01)"
                        : "transparent",
                      transition: "background 0.15s",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 14px",
                        fontFamily: "monospace",
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "var(--gold-dark)",
                      }}
                    >
                      {f.id}
                    </td>
                    <td style={{ padding: "12px 14px", fontWeight: "500" }}>
                      {f.boutique}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          color: pc,
                        }}
                      >
                        {f.plan.charAt(0).toUpperCase() + f.plan.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", fontWeight: "700" }}>
                      {f.montant}€
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        fontSize: "12px",
                        color: "var(--gray)",
                      }}
                    >
                      {f.periode}
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        fontSize: "12px",
                        color: "var(--gray)",
                      }}
                    >
                      {f.dateEmission}
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        fontSize: "12px",
                        color: f.datePaiement ? "#2e8b57" : "var(--gray-light)",
                        fontWeight: f.datePaiement ? "500" : "400",
                      }}
                    >
                      {f.datePaiement || "—"}
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
                      {f.statut === "impayée" && (
                        <div style={{ display: "flex", gap: "4px" }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelected(f.id);
                              setShowRelanceModal(true);
                            }}
                            style={{
                              padding: "4px 10px",
                              borderRadius: "var(--radius-sm)",
                              fontSize: "11px",
                              fontWeight: "600",
                              background: "#faeeda",
                              color: "#b7770d",
                              border: "1px solid #fde68a",
                              cursor: "pointer",
                            }}
                          >
                            Relancer
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              marquerPayée(f.id);
                            }}
                            style={{
                              padding: "4px 10px",
                              borderRadius: "var(--radius-sm)",
                              fontSize: "11px",
                              fontWeight: "600",
                              background: "#e8f5ee",
                              color: "#2e8b57",
                              border: "1px solid #bbf7d0",
                              cursor: "pointer",
                            }}
                          >
                            ✓
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div
            style={{
              padding: "12px 18px",
              borderTop: "2px solid var(--white-3)",
              background: "var(--gray-bg)",
              display: "flex",
              justifyContent: "flex-end",
              gap: "24px",
            }}
          >
            {[
              {
                label: "Total filtré",
                val:
                  filtres
                    .reduce((s, f) => s + f.montant, 0)
                    .toLocaleString("fr-FR") + "€",
              },
              {
                label: "Payé",
                val:
                  filtres
                    .filter((f) => f.statut === "payée")
                    .reduce((s, f) => s + f.montant, 0)
                    .toLocaleString("fr-FR") + "€",
                color: "#2e8b57",
              },
              {
                label: "Impayé",
                val:
                  filtres
                    .filter((f) => f.statut === "impayée")
                    .reduce((s, f) => s + f.montant, 0)
                    .toLocaleString("fr-FR") + "€",
                color: "#c0392b",
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
                    marginBottom: "2px",
                  }}
                >
                  {t.label}
                </div>
                <div
                  style={{
                    fontSize: "15px",
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
      </div>

      {/* Modal relance */}
      {showRelanceModal && fac && (
        <div style={OVL} onClick={() => setShowRelanceModal(false)}>
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
              Email de relance
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "20px",
              }}
            >
              {fac.boutique} · {fac.montant}€ · {fac.periode}
            </p>
            <div
              style={{
                background: "var(--gray-bg)",
                borderRadius: "var(--radius-md)",
                padding: "14px 16px",
                fontSize: "13px",
                lineHeight: 1.7,
                marginBottom: "20px",
                color: "var(--noir)",
                border: "1px solid var(--white-3)",
              }}
            >
              <strong>Objet :</strong> Facture impayée — {fac.periode} — LIVRR
              <br />
              <br />
              Bonjour,
              <br />
              <br />
              Nous vous contactons concernant votre facture d'abonnement{" "}
              {fac.plan} pour la période {fac.periode}, d'un montant de{" "}
              <strong>{fac.montant}€</strong> TTC, restée impayée à ce jour.
              <br />
              <br />
              Merci de procéder au règlement dans les meilleurs délais pour
              maintenir votre accès à la plateforme.
              <br />
              <br />
              L'équipe LIVRR
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowRelanceModal(false)}
                style={bStyle("ghost")}
              >
                Annuler
              </button>
              <button onClick={envoyerRelance} style={bStyle("gold")}>
                Envoyer la relance
              </button>
            </div>
          </div>
        </div>
      )}

      {showLienModal && fac && (
        <div style={OVL} onClick={() => setShowLienModal(false)}>
          <div
            style={{ ...MDL, width: "420px" }}
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
              Lien de paiement
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "20px",
              }}
            >
              {fac.boutique} · {fac.montant}€
            </p>
            <div
              style={{
                background: "var(--gray-bg)",
                border: "1px solid var(--white-3)",
                borderRadius: "var(--radius-sm)",
                padding: "12px 14px",
                fontFamily: "monospace",
                fontSize: "12px",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>https://pay.livrr.fr/{fac.id.toLowerCase()}</span>
              <button
                onClick={() => {
                  toast.success("Lien copié");
                }}
                style={{
                  padding: "3px 8px",
                  borderRadius: "6px",
                  fontSize: "10px",
                  fontWeight: "600",
                  border: "1px solid var(--white-3)",
                  background: "#fff",
                  color: "var(--gray)",
                  cursor: "pointer",
                }}
              >
                Copier
              </button>
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowLienModal(false)}
                style={bStyle("ghost")}
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  setShowLienModal(false);
                  toast.success(`Lien de paiement envoyé à ${fac.boutique}`);
                }}
                style={bStyle("gold")}
              >
                Envoyer par email
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
