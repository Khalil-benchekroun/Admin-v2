import React, { useState } from "react";
import toast from "react-hot-toast";

// ── Plans disponibles ──────────────────────────────────────
const PLANS = {
  classic: {
    label: "Classic",
    color: "#6B7280",
    bg: "rgba(107,114,128,0.08)",
    border: "rgba(107,114,128,0.25)",
    prix: "149€/mois",
    quotaProduits: 50,
    commission: "18%",
    droits: [
      "Catalogue jusqu'à 50 produits",
      "Commandes illimitées",
      "Tableau de bord simple",
      "Support email",
    ],
  },
  signature: {
    label: "Signature",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.25)",
    prix: "299€/mois",
    quotaProduits: 200,
    commission: "15%",
    droits: [
      "Catalogue jusqu'à 200 produits",
      "Commandes illimitées",
      "Statistiques avancées",
      "Support prioritaire",
      "Marketing & coupons",
      "Page vitrine enrichie",
    ],
  },
  prestige: {
    label: "Prestige",
    color: "#C9A96E",
    bg: "rgba(201,169,110,0.08)",
    border: "rgba(201,169,110,0.3)",
    prix: "599€/mois",
    quotaProduits: null,
    commission: "12%",
    droits: [
      "Catalogue illimité",
      "Commandes illimitées",
      "Statistiques & exports",
      "Account manager dédié",
      "Marketing & coupons avancés",
      "Services & réservations",
      "QR code boutique",
      "POS intégré",
    ],
  },
};

// ── Mock Data ──────────────────────────────────────────────
const ABONNEMENTS_DATA = [
  {
    id: "AB-001",
    boutique: {
      nom: "Sandro Paris",
      email: "contact@sandro.fr",
      avatar: "S",
      ville: "Paris 8e",
    },
    plan: "prestige",
    statut: "actif",
    dateDebut: "12/01/2026",
    dateExpiration: "12/01/2027",
    renouvellement: "automatique",
    quotaUtilise: 184,
    commandesMois: 142,
    caMois: 28400,
    historique: [
      {
        action: "Abonnement Prestige activé",
        par: "Admin",
        heure: "10:00",
        date: "12/01/2026",
      },
      {
        action: "Upgrade depuis Signature",
        par: "Sandro Paris",
        heure: "09:45",
        date: "12/01/2026",
      },
    ],
    notes: "Boutique partenaire Day 1. Contrat annuel signé.",
  },
  {
    id: "AB-002",
    boutique: {
      nom: "AMI Paris",
      email: "ami@amiparis.fr",
      avatar: "A",
      ville: "Paris 3e",
    },
    plan: "signature",
    statut: "actif",
    dateDebut: "18/01/2026",
    dateExpiration: "18/01/2027",
    renouvellement: "automatique",
    quotaUtilise: 112,
    commandesMois: 98,
    caMois: 19800,
    historique: [
      {
        action: "Abonnement Signature activé",
        par: "Admin",
        heure: "14:30",
        date: "18/01/2026",
      },
    ],
    notes: "",
  },
  {
    id: "AB-003",
    boutique: {
      nom: "Isabel Marant",
      email: "contact@isabel.fr",
      avatar: "I",
      ville: "Paris 11e",
    },
    plan: "signature",
    statut: "suspendu",
    dateDebut: "25/01/2026",
    dateExpiration: "25/01/2027",
    renouvellement: "automatique",
    quotaUtilise: 98,
    commandesMois: 0,
    caMois: 0,
    historique: [
      {
        action: "Abonnement Signature activé",
        par: "Admin",
        heure: "09:00",
        date: "25/01/2026",
      },
      {
        action: "Suspension manuelle — litige en cours",
        par: "Marie (SAV)",
        heure: "11:20",
        date: "14/04/2026",
      },
    ],
    notes:
      "Suspendu suite à litige client non résolu. Réactivation après validation SAV.",
  },
  {
    id: "AB-004",
    boutique: {
      nom: "By Terry",
      email: "hello@byterry.fr",
      avatar: "B",
      ville: "Paris 1er",
    },
    plan: "classic",
    statut: "actif",
    dateDebut: "02/02/2026",
    dateExpiration: "02/02/2027",
    renouvellement: "automatique",
    quotaUtilise: 38,
    commandesMois: 54,
    caMois: 9600,
    historique: [
      {
        action: "Abonnement Classic activé",
        par: "Admin",
        heure: "16:00",
        date: "02/02/2026",
      },
    ],
    notes: "",
  },
  {
    id: "AB-005",
    boutique: {
      nom: "Rouje",
      email: "bonjour@rouje.com",
      avatar: "R",
      ville: "Paris 6e",
    },
    plan: "classic",
    statut: "en_attente",
    dateDebut: "08/04/2026",
    dateExpiration: "08/04/2027",
    renouvellement: "automatique",
    quotaUtilise: 0,
    commandesMois: 0,
    caMois: 0,
    historique: [
      {
        action: "Abonnement Classic créé — en attente activation boutique",
        par: "Admin",
        heure: "10:00",
        date: "08/04/2026",
      },
    ],
    notes:
      "Boutique en cours d'onboarding. En attente de validation du catalogue.",
  },
];

const STATUT_CFG = {
  actif: { label: "Actif", color: "#2e8b57", bg: "#e8f5ee", dot: "#10B981" },
  suspendu: {
    label: "Suspendu",
    color: "#c0392b",
    bg: "#fef2f2",
    dot: "#EF4444",
  },
  en_attente: {
    label: "En attente",
    color: "#b7770d",
    bg: "#faeeda",
    dot: "#F59E0B",
  },
  expiré: { label: "Expiré", color: "#6B7280", bg: "#f3f4f6", dot: "#9CA3AF" },
};

// ── Composant principal ────────────────────────────────────
export default function Abonnements() {
  const [abonnements, setAbonnements] = useState(ABONNEMENTS_DATA);
  const [selected, setSelected] = useState(null);
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterStatut, setFilterStatut] = useState("all");
  const [search, setSearch] = useState("");
  const [showChangePlan, setShowChangePlan] = useState(false);
  const [showSuspend, setShowSuspend] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [newPlan, setNewPlan] = useState(null);
  const [changePlanMotif, setChangePlanMotif] = useState("");
  const [suspendMotif, setSuspendMotif] = useState("");
  const [noteText, setNoteText] = useState("");
  const [onglet, setOnglet] = useState("detail");

  const ab = selected ? abonnements.find((a) => a.id === selected) : null;

  const filtres = abonnements.filter((a) => {
    const matchPlan = filterPlan === "all" || a.plan === filterPlan;
    const matchStatut = filterStatut === "all" || a.statut === filterStatut;
    const matchSearch =
      a.boutique.nom.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.boutique.email.toLowerCase().includes(search.toLowerCase());
    return matchPlan && matchStatut && matchSearch;
  });

  const stats = {
    total: abonnements.length,
    actifs: abonnements.filter((a) => a.statut === "actif").length,
    suspendus: abonnements.filter((a) => a.statut === "suspendu").length,
    mrr: abonnements
      .filter((a) => a.statut === "actif")
      .reduce((s, a) => s + parseInt(PLANS[a.plan].prix), 0),
    parPlan: {
      classic: abonnements.filter((a) => a.plan === "classic").length,
      signature: abonnements.filter((a) => a.plan === "signature").length,
      prestige: abonnements.filter((a) => a.plan === "prestige").length,
    },
  };

  const changerPlan = () => {
    if (!newPlan) {
      toast.error("Sélectionnez un plan");
      return;
    }
    if (!changePlanMotif.trim()) {
      toast.error("Le motif est obligatoire");
      return;
    }
    setAbonnements((prev) =>
      prev.map((a) =>
        a.id === selected
          ? {
              ...a,
              plan: newPlan,
              historique: [
                ...a.historique,
                {
                  action: `Plan modifié → ${PLANS[newPlan].label} — ${changePlanMotif}`,
                  par: "Vous (Admin)",
                  heure: new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  date: new Date().toLocaleDateString("fr-FR"),
                },
              ],
            }
          : a
      )
    );
    setShowChangePlan(false);
    setNewPlan(null);
    setChangePlanMotif("");
    toast.success(`Plan mis à jour → ${PLANS[newPlan].label}`);
  };

  const toggleSuspension = () => {
    if (ab.statut !== "suspendu" && !suspendMotif.trim()) {
      toast.error("Le motif est obligatoire");
      return;
    }
    const nouveauStatut = ab.statut === "suspendu" ? "actif" : "suspendu";
    setAbonnements((prev) =>
      prev.map((a) =>
        a.id === selected
          ? {
              ...a,
              statut: nouveauStatut,
              historique: [
                ...a.historique,
                {
                  action:
                    nouveauStatut === "suspendu"
                      ? `Abonnement suspendu — ${suspendMotif}`
                      : "Abonnement réactivé",
                  par: "Vous (Admin)",
                  heure: new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  date: new Date().toLocaleDateString("fr-FR"),
                },
              ],
            }
          : a
      )
    );
    setShowSuspend(false);
    setSuspendMotif("");
    toast.success(
      nouveauStatut === "suspendu"
        ? "Abonnement suspendu"
        : "Abonnement réactivé"
    );
  };

  const ajouterNote = () => {
    if (!noteText.trim()) return;
    setAbonnements((prev) =>
      prev.map((a) =>
        a.id === selected
          ? {
              ...a,
              notes: a.notes
                ? a.notes + "\n" + noteText.trim()
                : noteText.trim(),
              historique: [
                ...a.historique,
                {
                  action: "Note interne ajoutée",
                  par: "Vous (Admin)",
                  heure: new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  date: new Date().toLocaleDateString("fr-FR"),
                },
              ],
            }
          : a
      )
    );
    setNoteText("");
    setShowNote(false);
    toast.success("Note ajoutée");
  };

  return (
    <div className="page" style={{ padding: "44px 52px" }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: "36px" }}>
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
          Abonnements boutiques
        </h1>
        <p style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}>
          Plans, quotas, droits et facturation des boutiques partenaires
        </p>
      </div>

      {/* ── KPIs ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "14px",
          marginBottom: "28px",
        }}
      >
        {[
          { label: "Total boutiques", val: stats.total, color: "var(--noir)" },
          { label: "Actifs", val: stats.actifs, color: "#2e8b57" },
          { label: "Suspendus", val: stats.suspendus, color: "#c0392b" },
          {
            label: "MRR estimé",
            val: `${stats.mrr.toLocaleString("fr-FR")}€`,
            color: "var(--gold-dark)",
          },
          { label: "Classic", val: stats.parPlan.classic, color: "#6B7280" },
          {
            label: "Signature",
            val: stats.parPlan.signature,
            color: "#3B82F6",
          },
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

      {/* ── Plans overview ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "14px",
          marginBottom: "28px",
        }}
      >
        {Object.entries(PLANS).map(([key, plan]) => (
          <div
            key={key}
            style={{
              background: "#fff",
              borderRadius: "var(--radius-md)",
              padding: "20px 22px",
              border: `1.5px solid ${plan.border}`,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "12px",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: plan.color,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  {plan.label}
                </span>
                <div
                  style={{
                    fontSize: "18px",
                    fontFamily: "var(--font-display)",
                    fontWeight: "300",
                    marginTop: "2px",
                  }}
                >
                  {plan.prix}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "600",
                    color: plan.color,
                  }}
                >
                  {stats.parPlan[key]}
                </div>
                <div style={{ fontSize: "10px", color: "var(--gray)" }}>
                  boutiques
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "16px", marginBottom: "10px" }}>
              <div style={{ fontSize: "12px", color: "var(--gray)" }}>
                <span style={{ fontWeight: "600", color: "var(--noir)" }}>
                  {plan.quotaProduits ? plan.quotaProduits : "∞"}
                </span>{" "}
                produits
              </div>
              <div style={{ fontSize: "12px", color: "var(--gray)" }}>
                Commission{" "}
                <span style={{ fontWeight: "600", color: "var(--noir)" }}>
                  {plan.commission}
                </span>
              </div>
            </div>
            <div
              style={{
                borderTop: "1px solid var(--white-3)",
                paddingTop: "10px",
              }}
            >
              {plan.droits.slice(0, 3).map((d, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: "11px",
                    color: "var(--gray)",
                    marginBottom: "3px",
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      color: plan.color,
                      fontWeight: "700",
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>{" "}
                  {d}
                </div>
              ))}
              {plan.droits.length > 3 && (
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--gray-light)",
                    marginTop: "2px",
                  }}
                >
                  {(() => { const n = plan.droits.length - 3; return `+${n} autre${n > 1 ? "s" : ""} droit${n > 1 ? "s" : ""}…`; })()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Layout : liste + détail ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "380px 1fr",
          gap: "20px",
        }}
      >
        {/* ── Liste ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--white-3)",
            display: "flex",
            flexDirection: "column",
            maxHeight: "520px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid var(--white-3)",
            }}
          >
            <input
              type="text"
              placeholder="Boutique, email, ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid var(--white-3)",
                borderRadius: "var(--radius-sm)",
                fontSize: "13px",
                background: "var(--gray-bg)",
                outline: "none",
                marginBottom: "10px",
              }}
            />
            <div
              style={{
                display: "flex",
                gap: "5px",
                flexWrap: "wrap",
                marginBottom: "6px",
              }}
            >
              {["all", "classic", "signature", "prestige"].map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPlan(p)}
                  style={filterBtn(
                    filterPlan === p,
                    p !== "all" ? PLANS[p]?.color : null,
                    p !== "all" ? PLANS[p]?.bg : null
                  )}
                >
                  {p === "all" ? "Tous plans" : PLANS[p].label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              {["all", "actif", "suspendu", "en_attente"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatut(s)}
                  style={filterBtn(
                    filterStatut === s,
                    s !== "all" ? STATUT_CFG[s]?.color : null,
                    s !== "all" ? STATUT_CFG[s]?.bg : null
                  )}
                >
                  {s === "all" ? "Tous statuts" : STATUT_CFG[s]?.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtres.map((a) => {
              const plan = PLANS[a.plan];
              const statut = STATUT_CFG[a.statut];
              const isActive = selected === a.id;
              const quotaMax = PLANS[a.plan].quotaProduits;
              const quotaPct = quotaMax
                ? Math.round((a.quotaUtilise / quotaMax) * 100)
                : null;
              return (
                <div
                  key={a.id}
                  onClick={() => {
                    setSelected(a.id);
                    setOnglet("detail");
                  }}
                  style={{
                    padding: "14px 16px",
                    borderBottom: "1px solid var(--white-3)",
                    cursor: "pointer",
                    background: isActive
                      ? "rgba(201,169,110,0.06)"
                      : "transparent",
                    borderLeft: isActive
                      ? "3px solid var(--gold)"
                      : "3px solid transparent",
                    transition: "all 0.15s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "4px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: plan.bg,
                          border: `1px solid ${plan.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: "700",
                          color: plan.color,
                          flexShrink: 0,
                        }}
                      >
                        {a.boutique.avatar}
                      </div>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: "500" }}>
                          {a.boutique.nom}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                          {a.boutique.ville}
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        background: statut.bg,
                        color: statut.color,
                        flexShrink: 0,
                      }}
                    >
                      {statut.label}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        background: plan.bg,
                        color: plan.color,
                      }}
                    >
                      {plan.label}
                    </span>
                    {quotaMax && (
                      <div style={{ flex: 1, marginLeft: "10px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "3px",
                          }}
                        >
                          <span
                            style={{ fontSize: "10px", color: "var(--gray)" }}
                          >
                            Quota produits
                          </span>
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: "600",
                              color: quotaPct > 85 ? "#c0392b" : "var(--gray)",
                            }}
                          >
                            {a.quotaUtilise}/{quotaMax}
                          </span>
                        </div>
                        <div
                          style={{
                            height: 4,
                            background: "var(--white-3)",
                            borderRadius: "4px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${quotaPct}%`,
                              background:
                                quotaPct > 85
                                  ? "#c0392b"
                                  : quotaPct > 60
                                  ? "#b7770d"
                                  : plan.color,
                              borderRadius: "4px",
                              transition: "width 0.3s",
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {!quotaMax && (
                      <span
                        style={{ fontSize: "11px", color: "var(--gray-light)" }}
                      >
                        ∞ produits
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Détail ── */}
        {!ab ? (
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--white-3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "400px",
              color: "var(--gray)",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "22px",
                fontWeight: "300",
                marginBottom: "8px",
              }}
            >
              Sélectionnez un abonnement
            </div>
            <div style={{ fontSize: "13px" }}>
              Cliquez sur une boutique pour gérer son abonnement
            </div>
          </div>
        ) : (
          (() => {
            const plan = PLANS[ab.plan];
            const statut = STATUT_CFG[ab.statut];
            const quotaMax = PLANS[ab.plan].quotaProduits;
            const quotaPct = quotaMax
              ? Math.round((ab.quotaUtilise / quotaMax) * 100)
              : null;

            return (
              <div
                style={{
                  background: "#fff",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-sm)",
                  border: "1px solid var(--white-3)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: "20px 28px 0",
                    borderBottom: "1px solid var(--white-3)",
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: "10px",
                          background: plan.bg,
                          border: `1.5px solid ${plan.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                          fontWeight: "700",
                          color: plan.color,
                        }}
                      >
                        {ab.boutique.avatar}
                      </div>
                      <div>
                        <div
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "22px",
                            fontWeight: "300",
                            marginBottom: "4px",
                          }}
                        >
                          {ab.boutique.nom}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              padding: "3px 10px",
                              borderRadius: "20px",
                              background: plan.bg,
                              color: plan.color,
                            }}
                          >
                            {plan.label}
                          </span>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: "600",
                              padding: "3px 10px",
                              borderRadius: "20px",
                              background: statut.bg,
                              color: statut.color,
                            }}
                          >
                            <span
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: statut.dot,
                                display: "inline-block",
                                marginRight: "5px",
                              }}
                            />
                            {statut.label}
                          </span>
                          <span
                            style={{ fontSize: "12px", color: "var(--gray)" }}
                          >
                            {ab.boutique.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                      <button
                        onClick={() => {
                          setNewPlan(ab.plan);
                          setShowChangePlan(true);
                        }}
                        style={btnStyle("ghost")}
                      >
                        Changer de plan
                      </button>
                      <button
                        onClick={() => setShowSuspend(true)}
                        style={btnStyle(
                          ab.statut === "suspendu" ? "success" : "error"
                        )}
                      >
                        {ab.statut === "suspendu" ? "Réactiver" : "Suspendre"}
                      </button>
                    </div>
                  </div>

                  {/* Onglets */}
                  <div style={{ display: "flex", gap: "0" }}>
                    {[
                      { id: "detail", label: "Abonnement" },
                      { id: "droits", label: "Droits & quotas" },
                      {
                        id: "historique",
                        label: `Historique (${ab.historique.length})`,
                      },
                    ].map((o) => (
                      <button
                        key={o.id}
                        onClick={() => setOnglet(o.id)}
                        style={{
                          padding: "8px 18px",
                          fontSize: "12px",
                          fontWeight: "600",
                          background: "none",
                          color:
                            onglet === o.id
                              ? "var(--gold-dark)"
                              : "var(--gray)",
                          cursor: "pointer",
                          borderBottom:
                            onglet === o.id
                              ? "2px solid var(--gold)"
                              : "2px solid transparent",
                          marginBottom: "-1px",
                          transition: "all 0.15s",
                        }}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Corps */}
                <div
                  style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}
                >
                  {/* ── Onglet Abonnement ── */}
                  {onglet === "detail" && (
                    <div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          gap: "14px",
                          marginBottom: "24px",
                        }}
                      >
                        <InfoTile
                          label="Plan"
                          val={plan.label}
                          color={plan.color}
                        />
                        <InfoTile label="Prix" val={plan.prix} />
                        <InfoTile
                          label="Commission LIVRR"
                          val={plan.commission}
                        />
                        <InfoTile label="Début" val={ab.dateDebut} />
                        <InfoTile label="Expiration" val={ab.dateExpiration} />
                        <InfoTile
                          label="Renouvellement"
                          val={
                            ab.renouvellement === "automatique"
                              ? "Auto"
                              : "Manuel"
                          }
                        />
                      </div>

                      {/* Stats mois */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: "14px",
                          marginBottom: "24px",
                        }}
                      >
                        {[
                          {
                            label: "Commandes ce mois",
                            val: ab.commandesMois,
                            suffix: "",
                          },
                          {
                            label: "CA ce mois",
                            val: ab.caMois.toLocaleString("fr-FR"),
                            suffix: "€",
                          },
                          {
                            label: "Produits actifs",
                            val: ab.quotaUtilise,
                            suffix: `/${quotaMax || "∞"}`,
                          },
                        ].map((s) => (
                          <div
                            key={s.label}
                            style={{
                              background: "var(--gray-bg)",
                              borderRadius: "var(--radius-md)",
                              padding: "16px 18px",
                              border: "1px solid var(--white-3)",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "10px",
                                fontWeight: "700",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                color: "var(--gray)",
                                marginBottom: "6px",
                              }}
                            >
                              {s.label}
                            </div>
                            <div
                              style={{
                                fontSize: "24px",
                                fontFamily: "var(--font-display)",
                                fontWeight: "300",
                                color: "var(--noir)",
                              }}
                            >
                              {s.val}
                              <span
                                style={{
                                  fontSize: "14px",
                                  color: "var(--gray)",
                                }}
                              >
                                {s.suffix}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Quota bar */}
                      {quotaMax && (
                        <div style={{ marginBottom: "24px" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "6px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: "600",
                                color: "var(--noir)",
                              }}
                            >
                              Utilisation quota produits
                            </span>
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: "600",
                                color:
                                  quotaPct > 85 ? "#c0392b" : "var(--noir)",
                              }}
                            >
                              {ab.quotaUtilise} / {quotaMax} ({quotaPct}%)
                            </span>
                          </div>
                          <div
                            style={{
                              height: 8,
                              background: "var(--white-3)",
                              borderRadius: "8px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${Math.min(quotaPct, 100)}%`,
                                background:
                                  quotaPct > 85
                                    ? "#c0392b"
                                    : quotaPct > 60
                                    ? "#b7770d"
                                    : plan.color,
                                borderRadius: "8px",
                                transition: "width 0.4s",
                              }}
                            />
                          </div>
                          {quotaPct > 85 && (
                            <div
                              style={{
                                fontSize: "11px",
                                color: "#c0392b",
                                marginTop: "6px",
                                fontWeight: "600",
                              }}
                            >
                              ⚠ Quota presque atteint — recommander un upgrade
                            </div>
                          )}
                        </div>
                      )}

                      {/* Notes */}
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "8px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: "700",
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                              color: "var(--gray)",
                            }}
                          >
                            Notes internes
                          </span>
                          <button
                            onClick={() => setShowNote(true)}
                            style={{
                              fontSize: "11px",
                              fontWeight: "600",
                              color: "var(--gold-dark)",
                              padding: "3px 10px",
                              border: "1px dashed var(--gold)",
                              borderRadius: "20px",
                              cursor: "pointer",
                              background: "rgba(201,169,110,0.05)",
                            }}
                          >
                            + Ajouter
                          </button>
                        </div>
                        <div
                          style={{
                            background: "#fffbeb",
                            border: "1px solid #fde68a",
                            borderRadius: "var(--radius-md)",
                            padding: "12px 16px",
                            fontSize: "13px",
                            color: ab.notes
                              ? "var(--noir)"
                              : "var(--gray-light)",
                            fontStyle: ab.notes ? "normal" : "italic",
                            whiteSpace: "pre-wrap",
                            lineHeight: 1.6,
                          }}
                        >
                          {ab.notes || "Aucune note pour cet abonnement."}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Onglet Droits ── */}
                  {onglet === "droits" && (
                    <div>
                      <div
                        style={{
                          background: plan.bg,
                          border: `1.5px solid ${plan.border}`,
                          borderRadius: "var(--radius-md)",
                          padding: "20px 24px",
                          marginBottom: "20px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            textTransform: "uppercase",
                            letterSpacing: "0.12em",
                            color: plan.color,
                            marginBottom: "14px",
                          }}
                        >
                          Plan {plan.label} — Droits inclus
                        </div>
                        {plan.droits.map((d, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            <div
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                background: plan.color,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "10px",
                                color: "#fff",
                                fontWeight: "800",
                                flexShrink: 0,
                              }}
                            >
                              ✓
                            </div>
                            <span
                              style={{ fontSize: "13px", color: "var(--noir)" }}
                            >
                              {d}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Comparaison avec autres plans */}
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "var(--gray)",
                          marginBottom: "12px",
                        }}
                      >
                        Comparaison des plans
                      </div>
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          fontSize: "13px",
                        }}
                      >
                        <thead>
                          <tr>
                            <th style={thStyle}>Fonctionnalité</th>
                            {Object.entries(PLANS).map(([k, p]) => (
                              <th
                                key={k}
                                style={{
                                  ...thStyle,
                                  color: p.color,
                                  background:
                                    ab.plan === k ? p.bg : "transparent",
                                  borderRadius:
                                    ab.plan === k ? "4px 4px 0 0" : "0",
                                }}
                              >
                                {p.label} {ab.plan === k && "✓"}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            ["Prix", "149€/mois", "299€/mois", "599€/mois"],
                            ["Commission", "18%", "15%", "12%"],
                            ["Produits", "50", "200", "Illimité"],
                            [
                              "Statistiques",
                              "Simple",
                              "Avancées",
                              "Avancées + exports",
                            ],
                            [
                              "Support",
                              "Email",
                              "Prioritaire",
                              "Account manager",
                            ],
                            ["Marketing", "—", "✓", "✓ Avancé"],
                            ["POS", "—", "—", "✓"],
                            ["QR Code", "—", "—", "✓"],
                          ].map(([feat, ...vals]) => (
                            <tr key={feat}>
                              <td style={tdStyle}>{feat}</td>
                              {vals.map((v, i) => {
                                const keys = [
                                  "classic",
                                  "signature",
                                  "prestige",
                                ];
                                const isCurrent = keys[i] === ab.plan;
                                return (
                                  <td
                                    key={i}
                                    style={{
                                      ...tdStyle,
                                      fontWeight: isCurrent ? "600" : "400",
                                      background: isCurrent
                                        ? PLANS[keys[i]].bg
                                        : "transparent",
                                      color:
                                        v === "—"
                                          ? "var(--gray-light)"
                                          : "var(--noir)",
                                    }}
                                  >
                                    {v}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* ── Onglet Historique ── */}
                  {onglet === "historique" && (
                    <div>
                      {ab.historique.map((h, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            gap: "14px",
                            marginBottom: "20px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                background: "var(--gold)",
                                border: "2px solid var(--gold-lighter)",
                                flexShrink: 0,
                                marginTop: 2,
                              }}
                            />
                            {i < ab.historique.length - 1 && (
                              <div
                                style={{
                                  width: 1,
                                  flex: 1,
                                  background: "var(--white-3)",
                                  marginTop: 4,
                                }}
                              />
                            )}
                          </div>
                          <div style={{ paddingBottom: "4px" }}>
                            <div
                              style={{
                                fontSize: "13px",
                                fontWeight: "500",
                                color: "var(--noir)",
                                marginBottom: "2px",
                              }}
                            >
                              {h.action}
                            </div>
                            <div
                              style={{ fontSize: "11px", color: "var(--gray)" }}
                            >
                              par {h.par} · {h.heure} · {h.date}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })()
        )}
      </div>

      {/* ── Modal : Changer de plan ── */}
      {showChangePlan && ab && (
        <div style={overlayStyle} onClick={() => setShowChangePlan(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: "300",
                marginBottom: "6px",
              }}
            >
              Modifier le plan
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "24px",
              }}
            >
              {ab.boutique.nom} — actuellement sur {PLANS[ab.plan].label}
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              {Object.entries(PLANS).map(([key, plan]) => (
                <button
                  key={key}
                  onClick={() => setNewPlan(key)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 16px",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    border: `2px solid ${
                      newPlan === key ? plan.color : "var(--white-3)"
                    }`,
                    background: newPlan === key ? plan.bg : "#fff",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ textAlign: "left" }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: plan.color,
                        marginBottom: "2px",
                      }}
                    >
                      {plan.label}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--gray)" }}>
                      {plan.quotaProduits
                        ? plan.quotaProduits + " produits"
                        : "Illimité"}{" "}
                      · Commission {plan.commission}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "var(--noir)",
                    }}
                  >
                    {plan.prix}
                  </div>
                </button>
              ))}
            </div>

            <label style={labelStyle}>Motif de la modification *</label>
            <textarea
              value={changePlanMotif}
              onChange={(e) => setChangePlanMotif(e.target.value)}
              placeholder="Ex. : Quota atteint, demande boutique, offre commerciale…"
              rows={3}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1.5px solid var(--white-3)",
                borderRadius: "var(--radius-sm)",
                fontSize: "13px",
                resize: "none",
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
                onClick={() => setShowChangePlan(false)}
                style={btnStyle("ghost")}
              >
                Annuler
              </button>
              <button onClick={changerPlan} style={btnStyle("gold")}>
                Confirmer le changement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal : Suspension / Réactivation ── */}
      {showSuspend && ab && (
        <div style={overlayStyle} onClick={() => setShowSuspend(false)}>
          <div
            style={{ ...modalStyle, width: "440px" }}
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
              {ab.statut === "suspendu"
                ? "Réactiver l'abonnement"
                : "Suspendre l'abonnement"}
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "24px",
              }}
            >
              {ab.boutique.nom} · Plan {PLANS[ab.plan].label}
            </p>

            {ab.statut !== "suspendu" && (
              <>
                <div
                  style={{
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "var(--radius-sm)",
                    padding: "12px 14px",
                    fontSize: "12px",
                    color: "#c0392b",
                    marginBottom: "16px",
                  }}
                >
                  ⚠ La suspension bloque immédiatement la boutique sur la
                  plateforme. Aucune nouvelle commande ne pourra être reçue.
                </div>
                <label style={labelStyle}>Motif obligatoire *</label>
                <textarea
                  value={suspendMotif}
                  onChange={(e) => setSuspendMotif(e.target.value)}
                  placeholder="Ex. : Litige client non résolu, fraude suspectée, paiement impayé…"
                  rows={3}
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1.5px solid var(--white-3)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "13px",
                    resize: "none",
                    outline: "none",
                    marginBottom: "20px",
                  }}
                />
              </>
            )}

            {ab.statut === "suspendu" && (
              <div
                style={{
                  background: "#e8f5ee",
                  border: "1px solid #bbf7d0",
                  borderRadius: "var(--radius-sm)",
                  padding: "12px 14px",
                  fontSize: "12px",
                  color: "#2e8b57",
                  marginBottom: "20px",
                }}
              >
                ✓ La réactivation rétablit l'accès complet de la boutique à la
                plateforme selon son plan {PLANS[ab.plan].label}.
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowSuspend(false)}
                style={btnStyle("ghost")}
              >
                Annuler
              </button>
              <button
                onClick={toggleSuspension}
                style={btnStyle(ab.statut === "suspendu" ? "success" : "error")}
              >
                {ab.statut === "suspendu"
                  ? "Confirmer la réactivation"
                  : "Confirmer la suspension"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal : Note ── */}
      {showNote && (
        <div style={overlayStyle} onClick={() => setShowNote(false)}>
          <div
            style={{ ...modalStyle, width: "440px" }}
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
              Note interne
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "20px",
              }}
            >
              Visible uniquement par l'équipe LIVRR.
            </p>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Saisir une note…"
              rows={4}
              autoFocus
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1.5px solid var(--white-3)",
                borderRadius: "var(--radius-sm)",
                fontSize: "13px",
                resize: "none",
                outline: "none",
                background: "#fffbeb",
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
                onClick={() => setShowNote(false)}
                style={btnStyle("ghost")}
              >
                Annuler
              </button>
              <button onClick={ajouterNote} style={btnStyle("gold")}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helpers UI ─────────────────────────────────────────────
function InfoTile({ label, val, color }) {
  return (
    <div
      style={{
        background: "var(--gray-bg)",
        borderRadius: "var(--radius-sm)",
        padding: "12px 14px",
        border: "1px solid var(--white-3)",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--gray)",
          marginBottom: "5px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "15px",
          fontWeight: "500",
          color: color || "var(--noir)",
        }}
      >
        {val}
      </div>
    </div>
  );
}

function filterBtn(active, color, bg) {
  return {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
    border: active
      ? `1.5px solid ${color || "var(--gold)"}`
      : "1.5px solid var(--white-3)",
    background: active ? bg || "rgba(201,169,110,0.08)" : "transparent",
    color: active ? color || "var(--gold-dark)" : "var(--gray)",
  };
}

function btnStyle(type) {
  const styles = {
    gold: { background: "var(--noir)", color: "var(--gold)", border: "none" },
    ghost: {
      background: "transparent",
      color: "var(--gray)",
      border: "1.5px solid var(--white-3)",
    },
    error: {
      background: "#fef2f2",
      color: "var(--error)",
      border: "1.5px solid #fecaca",
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
    ...styles[type],
  };
}

const thStyle = {
  padding: "10px 12px",
  fontSize: "11px",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "var(--gray)",
  textAlign: "left",
  borderBottom: "2px solid var(--white-3)",
};

const tdStyle = {
  padding: "10px 12px",
  fontSize: "13px",
  color: "var(--noir)",
  borderBottom: "1px solid var(--white-3)",
};

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(10,10,15,0.55)",
  zIndex: 200,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalStyle = {
  background: "#fff",
  borderRadius: "var(--radius-lg)",
  padding: "32px",
  width: "520px",
  boxShadow: "var(--shadow-lg)",
  maxHeight: "90vh",
  overflowY: "auto",
};

const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--gray)",
  marginBottom: "8px",
};
