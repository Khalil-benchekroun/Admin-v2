import React, { useState } from "react";
import toast from "react-hot-toast";

// ── Mock Data ──────────────────────────────────────────────
const INVITATIONS_DATA = [
  {
    id: "INV-012",
    boutique: "Jacquemus",
    email: "contact@jacquemus.com",
    plan: "prestige",
    lien: "https://livrr.fr/join/jq-prestige-2026-xK9mP",
    token: "jq-prestige-2026-xK9mP",
    statut: "envoyé",
    dateCreation: "15/04/2026",
    dateExpiration: "22/04/2026",
    dateUtilisation: null,
    crééPar: "Khalil (Admin)",
    notes: "Prospection Day 1 — décision attendue avant le 20/04.",
  },
  {
    id: "INV-011",
    boutique: "Maison Kitsuné",
    email: "retail@maisonkitsune.com",
    plan: "signature",
    lien: "https://livrr.fr/join/mk-sign-2026-aR3nL",
    token: "mk-sign-2026-aR3nL",
    statut: "utilisé",
    dateCreation: "10/04/2026",
    dateExpiration: "17/04/2026",
    dateUtilisation: "11/04/2026",
    crééPar: "Khalil (Admin)",
    notes: "Onboarding en cours.",
  },
  {
    id: "INV-010",
    boutique: "Officine Universelle Buly",
    email: "boutique@buly1803.com",
    plan: "signature",
    lien: "https://livrr.fr/join/buly-sign-2026-tW7qX",
    token: "buly-sign-2026-tW7qX",
    statut: "expiré",
    dateCreation: "01/04/2026",
    dateExpiration: "08/04/2026",
    dateUtilisation: null,
    crééPar: "Marie (SAV)",
    notes: "Pas de réponse. Renouveler.",
  },
  {
    id: "INV-009",
    boutique: "A.P.C.",
    email: "ecommerce@apc.fr",
    plan: "prestige",
    lien: "https://livrr.fr/join/apc-prest-2026-yM5kN",
    token: "apc-prest-2026-yM5kN",
    statut: "utilisé",
    dateCreation: "20/03/2026",
    dateExpiration: "27/03/2026",
    dateUtilisation: "21/03/2026",
    crééPar: "Khalil (Admin)",
    notes: "Boutique active depuis le 25/03.",
  },
  {
    id: "INV-008",
    boutique: "Merci",
    email: "contact@merci-merci.com",
    plan: "classic",
    lien: "https://livrr.fr/join/merci-class-2026-hP2bQ",
    token: "merci-class-2026-hP2bQ",
    statut: "envoyé",
    dateCreation: "16/04/2026",
    dateExpiration: "23/04/2026",
    dateUtilisation: null,
    crééPar: "Lucas (SAV)",
    notes: "",
  },
];

const PLANS = {
  classic: {
    label: "Classic",
    color: "#6B7280",
    bg: "rgba(107,114,128,0.08)",
    prix: "149€/mois",
  },
  signature: {
    label: "Signature",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.08)",
    prix: "299€/mois",
  },
  prestige: {
    label: "Prestige",
    color: "#C9A96E",
    bg: "rgba(201,169,110,0.08)",
    prix: "599€/mois",
  },
};

const STATUT_CFG = {
  envoyé: { label: "Envoyé", color: "#185fa5", bg: "#eff6ff", dot: "#3B82F6" },
  utilisé: {
    label: "Utilisé",
    color: "#2e8b57",
    bg: "#e8f5ee",
    dot: "#10B981",
  },
  expiré: { label: "Expiré", color: "#6B7280", bg: "#f3f4f6", dot: "#9CA3AF" },
};

function genToken(boutique, plan) {
  const slug = boutique.toLowerCase().replace(/\s+/g, "-").slice(0, 6);
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${slug}-${plan.slice(0, 4)}-2026-${rand}`;
}

export default function Invitations() {
  const [invitations, setInvitations] = useState(INVITATIONS_DATA);
  const [filterStatut, setFilterStatut] = useState("all");
  const [filterPlan, setFilterPlan] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState("");

  // Formulaire création
  const [form, setForm] = useState({
    boutique: "",
    email: "",
    plan: "signature",
    duree: "7",
    notes: "",
  });

  const inv = selected ? invitations.find((i) => i.id === selected) : null;

  const filtres = invitations.filter((i) => {
    const matchStatut = filterStatut === "all" || i.statut === filterStatut;
    const matchPlan = filterPlan === "all" || i.plan === filterPlan;
    const matchSearch =
      i.boutique.toLowerCase().includes(search.toLowerCase()) ||
      i.email.toLowerCase().includes(search.toLowerCase()) ||
      i.id.toLowerCase().includes(search.toLowerCase());
    return matchStatut && matchPlan && matchSearch;
  });

  const stats = {
    total: invitations.length,
    envoyés: invitations.filter((i) => i.statut === "envoyé").length,
    utilisés: invitations.filter((i) => i.statut === "utilisé").length,
    expirés: invitations.filter((i) => i.statut === "expiré").length,
    tauxConv: Math.round(
      (invitations.filter((i) => i.statut === "utilisé").length /
        invitations.length) *
        100
    ),
  };

  const creerInvitation = () => {
    if (!form.boutique.trim()) {
      toast.error("Nom de la boutique requis");
      return;
    }
    if (!form.email.trim() || !form.email.includes("@")) {
      toast.error("Email invalide");
      return;
    }

    const token = genToken(form.boutique, form.plan);
    const today = new Date();
    const expiry = new Date(today);
    expiry.setDate(expiry.getDate() + parseInt(form.duree));

    const newInv = {
      id: `INV-${String(invitations.length + 1).padStart(3, "0")}`,
      boutique: form.boutique,
      email: form.email,
      plan: form.plan,
      lien: `https://livrr.fr/join/${token}`,
      token,
      statut: "envoyé",
      dateCreation: today.toLocaleDateString("fr-FR"),
      dateExpiration: expiry.toLocaleDateString("fr-FR"),
      dateUtilisation: null,
      crééPar: "Vous (Admin)",
      notes: form.notes,
    };

    setInvitations((prev) => [newInv, ...prev]);
    setForm({
      boutique: "",
      email: "",
      plan: "signature",
      duree: "7",
      notes: "",
    });
    setShowCreateModal(false);
    setSelected(newInv.id);
    toast.success(`Invitation créée pour ${newInv.boutique}`);
  };

  const copierLien = (lien) => {
    navigator.clipboard
      .writeText(lien)
      .then(() => toast.success("Lien copié !"))
      .catch(() => toast.error("Échec de la copie"));
  };

  const renouvelerInvitation = () => {
    if (!inv) return;
    const today = new Date();
    const expiry = new Date(today);
    expiry.setDate(expiry.getDate() + 7);
    const newToken = genToken(inv.boutique, inv.plan);

    setInvitations((prev) =>
      prev.map((i) =>
        i.id === selected
          ? {
              ...i,
              statut: "envoyé",
              token: newToken,
              lien: `https://livrr.fr/join/${newToken}`,
              dateCreation: today.toLocaleDateString("fr-FR"),
              dateExpiration: expiry.toLocaleDateString("fr-FR"),
              dateUtilisation: null,
            }
          : i
      )
    );
    toast.success("Invitation renouvelée — nouveau lien généré");
  };

  const ajouterNote = () => {
    if (!noteText.trim()) return;
    setInvitations((prev) =>
      prev.map((i) =>
        i.id === selected
          ? {
              ...i,
              notes: i.notes
                ? i.notes + "\n" + noteText.trim()
                : noteText.trim(),
            }
          : i
      )
    );
    setNoteText("");
    setShowNoteInput(false);
    toast.success("Note ajoutée");
  };

  return (
    <div className="page" style={{ padding: "44px 52px" }}>
      {/* ── Header ── */}
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
            Liens d'invitation
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}
          >
            Génération et suivi des invitations boutiques partenaires
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: "11px 22px",
            borderRadius: "var(--radius-sm)",
            fontSize: "13px",
            fontWeight: "600",
            background: "var(--noir)",
            color: "var(--gold)",
            border: "none",
            cursor: "pointer",
            letterSpacing: "0.05em",
          }}
        >
          + Créer une invitation
        </button>
      </div>

      {/* ── KPIs ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "14px",
          marginBottom: "28px",
        }}
      >
        {[
          { label: "Total", val: stats.total, color: "var(--noir)" },
          { label: "Envoyés", val: stats.envoyés, color: "#185fa5" },
          { label: "Utilisés", val: stats.utilisés, color: "#2e8b57" },
          { label: "Expirés", val: stats.expirés, color: "#6B7280" },
          {
            label: "Taux conversion",
            val: stats.tauxConv + "%",
            color: "var(--gold-dark)",
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

      {/* ── Layout ── */}
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
            maxHeight: "calc(100vh - 320px)",
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
              <button
                onClick={() => setFilterStatut("all")}
                style={fBtn(filterStatut === "all")}
              >
                Tous
              </button>
              {Object.entries(STATUT_CFG).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setFilterStatut(k)}
                  style={fBtn(filterStatut === k, v.color, v.bg)}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              <button
                onClick={() => setFilterPlan("all")}
                style={fBtn(filterPlan === "all")}
              >
                Tous plans
              </button>
              {Object.entries(PLANS).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setFilterPlan(k)}
                  style={fBtn(filterPlan === k, v.color, v.bg)}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtres.map((i) => {
              const plan = PLANS[i.plan];
              const statut = STATUT_CFG[i.statut];
              const isActive = selected === i.id;
              const isExpiringSoon =
                i.statut === "envoyé" &&
                (() => {
                  const [d, m, y] = i.dateExpiration.split("/");
                  const diff =
                    (new Date(`${y}-${m}-${d}`) - new Date()) /
                    (1000 * 60 * 60 * 24);
                  return diff <= 2;
                })();
              return (
                <div
                  key={i.id}
                  onClick={() => {
                    setSelected(i.id);
                    setShowNoteInput(false);
                  }}
                  style={{
                    padding: "13px 16px",
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
                        gap: "6px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "var(--gold-dark)",
                        }}
                      >
                        {i.id}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "600",
                          padding: "2px 7px",
                          borderRadius: "10px",
                          background: plan.bg,
                          color: plan.color,
                        }}
                      >
                        {plan.label}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        padding: "2px 8px",
                        borderRadius: "10px",
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
                      fontSize: "13px",
                      fontWeight: "500",
                      marginBottom: "2px",
                    }}
                  >
                    {i.boutique}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--gray)",
                      marginBottom: "4px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {i.email}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        color: isExpiringSoon ? "#c0392b" : "var(--gray-light)",
                        fontWeight: isExpiringSoon ? "700" : "400",
                      }}
                    >
                      {i.statut === "utilisé"
                        ? `Utilisé le ${i.dateUtilisation}`
                        : `Expire le ${i.dateExpiration}`}
                      {isExpiringSoon && " ⚠"}
                    </span>
                    <span
                      style={{ fontSize: "10px", color: "var(--gray-light)" }}
                    >
                      {i.crééPar}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Détail ── */}
        {!inv ? (
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
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔗</div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "22px",
                fontWeight: "300",
                marginBottom: "8px",
              }}
            >
              Sélectionnez une invitation
            </div>
            <div style={{ fontSize: "13px" }}>Ou créez-en une nouvelle</div>
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
            }}
          >
            <div
              style={{
                padding: "22px 28px",
                borderBottom: "1px solid var(--white-3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        color: "var(--gold-dark)",
                      }}
                    >
                      {inv.id}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        background: PLANS[inv.plan].bg,
                        color: PLANS[inv.plan].color,
                      }}
                    >
                      {PLANS[inv.plan].label}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        background: STATUT_CFG[inv.statut].bg,
                        color: STATUT_CFG[inv.statut].color,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: STATUT_CFG[inv.statut].dot,
                        }}
                      />
                      {STATUT_CFG[inv.statut].label}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "26px",
                      fontWeight: "300",
                      marginBottom: "4px",
                    }}
                  >
                    {inv.boutique}
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--gray)" }}>
                    {inv.email}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  {(inv.statut === "envoyé" || inv.statut === "expiré") && (
                    <button
                      onClick={renouvelerInvitation}
                      style={btnStyle("ghost")}
                    >
                      Renouveler
                    </button>
                  )}
                  {inv.statut === "envoyé" && (
                    <button
                      onClick={() => copierLien(inv.lien)}
                      style={btnStyle("gold")}
                    >
                      📋 Copier le lien
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
              {/* Lien */}
              <div style={{ marginBottom: "22px" }}>
                <Label>Lien d'invitation</Label>
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <div
                    style={{
                      flex: 1,
                      background: "var(--gray-bg)",
                      border: "1px solid var(--white-3)",
                      borderRadius: "var(--radius-sm)",
                      padding: "10px 14px",
                      fontSize: "12px",
                      color:
                        inv.statut === "utilisé"
                          ? "var(--gray-light)"
                          : "var(--noir)",
                      fontFamily: "monospace",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {inv.lien}
                  </div>
                  <button
                    onClick={() => copierLien(inv.lien)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "12px",
                      fontWeight: "600",
                      border: "1.5px solid var(--white-3)",
                      background: "transparent",
                      color: "var(--gray)",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    📋
                  </button>
                </div>
              </div>

              {/* Infos */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "14px",
                  marginBottom: "22px",
                }}
              >
                {[
                  {
                    label: "Plan invité",
                    val: `${PLANS[inv.plan].label} — ${PLANS[inv.plan].prix}`,
                  },
                  { label: "Créé par", val: inv.crééPar },
                  { label: "Date de création", val: inv.dateCreation },
                  { label: "Date d'expiration", val: inv.dateExpiration },
                  ...(inv.dateUtilisation
                    ? [{ label: "Utilisé le", val: inv.dateUtilisation }]
                    : []),
                  { label: "Token", val: inv.token, mono: true },
                ].map((r) => (
                  <div
                    key={r.label}
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
                      {r.label}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        fontFamily: r.mono ? "monospace" : "inherit",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <Label style={{ margin: 0 }}>Notes</Label>
                  {!showNoteInput && (
                    <button
                      onClick={() => setShowNoteInput(true)}
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
                  )}
                </div>
                <div
                  style={{
                    background: "#fffbeb",
                    border: "1px solid #fde68a",
                    borderRadius: "var(--radius-md)",
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: inv.notes ? "var(--noir)" : "var(--gray-light)",
                    fontStyle: inv.notes ? "normal" : "italic",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                    marginBottom: showNoteInput ? "10px" : 0,
                  }}
                >
                  {inv.notes || "Aucune note."}
                </div>
                {showNoteInput && (
                  <div>
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Ajouter une note…"
                      rows={2}
                      autoFocus
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1.5px solid var(--gold)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "13px",
                        resize: "none",
                        outline: "none",
                        marginBottom: "8px",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        onClick={() => {
                          setShowNoteInput(false);
                          setNoteText("");
                        }}
                        style={btnStyle("ghost")}
                      >
                        Annuler
                      </button>
                      <button onClick={ajouterNote} style={btnStyle("gold")}>
                        Enregistrer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Modal : Créer invitation ── */}
      {showCreateModal && (
        <div style={overlayStyle} onClick={() => setShowCreateModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: "300",
                marginBottom: "6px",
              }}
            >
              Nouvelle invitation
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "24px",
              }}
            >
              Le lien sera généré automatiquement et unique.
            </p>

            <Label>Nom de la boutique *</Label>
            <input
              type="text"
              value={form.boutique}
              onChange={(e) => setForm({ ...form, boutique: e.target.value })}
              placeholder="Ex. : Jacquemus"
              style={inputStyle}
            />

            <Label>Email de contact *</Label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="contact@boutique.fr"
              style={inputStyle}
            />

            <Label>Plan proposé</Label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              {Object.entries(PLANS).map(([k, p]) => (
                <button
                  key={k}
                  onClick={() => setForm({ ...form, plan: k })}
                  style={{
                    flex: 1,
                    padding: "10px 8px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    border: `2px solid ${
                      form.plan === k ? p.color : "var(--white-3)"
                    }`,
                    background: form.plan === k ? p.bg : "transparent",
                    color: form.plan === k ? p.color : "var(--gray)",
                    transition: "all 0.15s",
                  }}
                >
                  <div>{p.label}</div>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: "400",
                      marginTop: "2px",
                    }}
                  >
                    {p.prix}
                  </div>
                </button>
              ))}
            </div>

            <Label>Durée de validité</Label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              {["3", "7", "14", "30"].map((d) => (
                <button
                  key={d}
                  onClick={() => setForm({ ...form, duree: d })}
                  style={{
                    flex: 1,
                    padding: "9px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    border: `1.5px solid ${
                      form.duree === d ? "var(--gold)" : "var(--white-3)"
                    }`,
                    background:
                      form.duree === d
                        ? "rgba(201,169,110,0.08)"
                        : "transparent",
                    color:
                      form.duree === d ? "var(--gold-dark)" : "var(--gray)",
                  }}
                >
                  {d}j
                </button>
              ))}
            </div>

            <Label>Notes (optionnel)</Label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Contexte de la prospection, conditions particulières…"
              rows={3}
              style={{ ...inputStyle, resize: "none", marginBottom: "20px" }}
            />

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowCreateModal(false)}
                style={btnStyle("ghost")}
              >
                Annuler
              </button>
              <button onClick={creerInvitation} style={btnStyle("gold")}>
                Générer le lien
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────
function Label({ children, style }) {
  return (
    <div
      style={{
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--gray)",
        marginBottom: "8px",
        ...style,
      }}
    >
      {children}
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

function btnStyle(type) {
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
    ...s[type],
  };
}

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
  width: "500px",
  boxShadow: "var(--shadow-lg)",
  maxHeight: "90vh",
  overflowY: "auto",
};
const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1.5px solid var(--white-3)",
  borderRadius: "var(--radius-sm)",
  fontSize: "13px",
  outline: "none",
  marginBottom: "16px",
  display: "block",
};
