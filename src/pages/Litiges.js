import React, { useState } from "react";
import toast from "react-hot-toast";

const LITIGES_DATA = [
  {
    id: "LIT-012",
    ticket: "TK-0041",
    type: "livraison",
    priorite: "critique",
    statut: "escaladé",
    sujet: "Commande non reçue après 3h — coursier introuvable",
    client: { nom: "Sophie M.", id: "CLT-001" },
    boutique: "Sandro Paris",
    commande: "LV-00412",
    montant: 490,
    dateEscalade: "18/04/2026",
    heureEscalade: "15:20",
    escaladéPar: "Marie (SAV)",
    motifEscalade:
      "Coursier introuvable depuis 45 min. Client très mécontent, menace chargeback. Dépasse mes droits SAV.",
    historique: [
      {
        action: "Ticket créé",
        par: "Sophie M.",
        heure: "14:22",
        date: "18/04/2026",
      },
      {
        action: "Assigné à Marie (SAV)",
        par: "Système",
        heure: "14:23",
        date: "18/04/2026",
      },
      {
        action: "Escalade vers Admin plateforme",
        par: "Marie (SAV)",
        heure: "15:20",
        date: "18/04/2026",
      },
    ],
    decision: null,
    noteAdmin: "",
  },
  {
    id: "LIT-011",
    ticket: "TK-0038",
    type: "produit",
    priorite: "haute",
    statut: "en_cours",
    sujet: "Produit reçu endommagé — boutique conteste",
    client: { nom: "Yasmine B.", id: "CLT-003" },
    boutique: "Isabel Marant",
    commande: "LV-00390",
    montant: 450,
    dateEscalade: "16/04/2026",
    heureEscalade: "11:30",
    escaladéPar: "Lucas (SAV)",
    motifEscalade:
      "La boutique conteste la responsabilité. Client a des photos. Boutique dit que le produit était intact au départ. Besoin d'arbitrage admin.",
    historique: [
      {
        action: "Ticket créé",
        par: "Yasmine B.",
        heure: "16:30",
        date: "15/04/2026",
      },
      {
        action: "Assigné à Lucas (SAV)",
        par: "Système",
        heure: "16:31",
        date: "15/04/2026",
      },
      {
        action: "Contact boutique Isabel Marant",
        par: "Lucas (SAV)",
        heure: "09:00",
        date: "16/04/2026",
      },
      {
        action: "Escalade — boutique conteste",
        par: "Lucas (SAV)",
        heure: "11:30",
        date: "16/04/2026",
      },
    ],
    decision: null,
    noteAdmin:
      "Photos reçues par email. Déchirure couture gauche visible. Défaut de fabrication probable.",
  },
  {
    id: "LIT-010",
    ticket: "TK-0036",
    type: "remboursement",
    priorite: "normale",
    statut: "résolu",
    sujet: "Remboursement refusé par boutique après retour validé",
    client: { nom: "Nadia S.", id: "CLT-006" },
    boutique: "AMI Paris",
    commande: "LV-00374",
    montant: 290,
    dateEscalade: "12/04/2026",
    heureEscalade: "14:00",
    escaladéPar: "Marie (SAV)",
    motifEscalade:
      "Retour reçu et validé par la boutique le 10/04. Boutique bloque le remboursement sans motif valide.",
    historique: [
      {
        action: "Ticket créé",
        par: "Nadia S.",
        heure: "11:00",
        date: "10/04/2026",
      },
      {
        action: "Retour reçu confirmé",
        par: "AMI Paris",
        heure: "09:30",
        date: "11/04/2026",
      },
      {
        action: "Escalade — boutique bloque",
        par: "Marie (SAV)",
        heure: "14:00",
        date: "12/04/2026",
      },
      {
        action: "Arbitrage admin — remboursement forcé 290€",
        par: "Khalil B.",
        heure: "16:00",
        date: "12/04/2026",
      },
      {
        action: "Litige résolu",
        par: "Khalil B.",
        heure: "16:05",
        date: "12/04/2026",
      },
    ],
    decision:
      "Remboursement forcé de 290€. La boutique AMI Paris a été notifiée. Un avertissement a été ajouté à leur dossier.",
    noteAdmin: "3ème litige avec AMI Paris ce trimestre. Surveiller de près.",
  },
  {
    id: "LIT-009",
    ticket: "TK-0033",
    type: "fraude",
    priorite: "critique",
    statut: "résolu",
    sujet: "Tentative de fraude client — 3 chargebacks abusifs",
    client: { nom: "Nadia S.", id: "CLT-006" },
    boutique: "Sandro Paris",
    commande: "LV-00408",
    montant: 890,
    dateEscalade: "08/04/2026",
    heureEscalade: "10:00",
    escaladéPar: "Marie (SAV)",
    motifEscalade:
      "3ème chargeback du même client en moins d'un mois. Pattern clairement abusif. Blocage recommandé.",
    historique: [
      {
        action: "Signalement créé",
        par: "Marie (SAV)",
        heure: "10:00",
        date: "08/04/2026",
      },
      {
        action: "Escalade fraude suspectée",
        par: "Marie (SAV)",
        heure: "10:00",
        date: "08/04/2026",
      },
      {
        action: "Compte client bloqué",
        par: "Khalil B.",
        heure: "11:00",
        date: "08/04/2026",
      },
      {
        action: "Signalement plateforme de paiement",
        par: "Khalil B.",
        heure: "11:15",
        date: "08/04/2026",
      },
      {
        action: "Litige résolu — compte fermé",
        par: "Khalil B.",
        heure: "11:20",
        date: "08/04/2026",
      },
    ],
    decision:
      "Compte client définitivement bloqué. Signalement transmis à la plateforme de paiement. Chargebacks contestés.",
    noteAdmin: "",
  },
];

const TYPE_CFG = {
  livraison: {
    label: "Livraison",
    color: "#185fa5",
    bg: "#eff6ff",
    icon: "🛵",
  },
  produit: { label: "Produit", color: "#b7770d", bg: "#faeeda", icon: "📦" },
  remboursement: {
    label: "Remboursement",
    color: "#6d28d9",
    bg: "#f5f3ff",
    icon: "💸",
  },
  fraude: { label: "Fraude", color: "#c0392b", bg: "#fef2f2", icon: "⚠️" },
};

const PRIORITE_CFG = {
  critique: { label: "Critique", color: "#c0392b", bg: "#fef2f2" },
  haute: { label: "Haute", color: "#b7770d", bg: "#faeeda" },
  normale: { label: "Normale", color: "#185fa5", bg: "#eff6ff" },
};

const STATUT_CFG = {
  escaladé: {
    label: "Escaladé",
    color: "#c0392b",
    bg: "#fef2f2",
    dot: "#EF4444",
  },
  en_cours: {
    label: "En cours",
    color: "#185fa5",
    bg: "#eff6ff",
    dot: "#3B82F6",
  },
  résolu: { label: "Résolu", color: "#2e8b57", bg: "#e8f5ee", dot: "#10B981" },
};

const DECISIONS_RAPIDES = [
  "Remboursement total accordé au client",
  "Remboursement partiel accordé",
  "Litige en faveur de la boutique — remboursement refusé",
  "Compte client bloqué — fraude avérée",
  "Avertissement formel à la boutique",
  "Suspension temporaire de la boutique",
  "Dossier transmis au service juridique",
];

export default function Litiges() {
  const [litiges, setLitiges] = useState(LITIGES_DATA);
  const [selected, setSelected] = useState("LIT-012");
  const [filterStatut, setFilterStatut] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionChoisie, setDecisionChoisie] = useState("");
  const [decisionMotif, setDecisionMotif] = useState("");
  const [noteText, setNoteText] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  const lit = litiges.find((l) => l.id === selected);

  const filtres = litiges.filter(
    (l) =>
      (filterStatut === "all" || l.statut === filterStatut) &&
      (filterType === "all" || l.type === filterType)
  );

  const stats = {
    total: litiges.length,
    escaladés: litiges.filter((l) => l.statut === "escaladé").length,
    enCours: litiges.filter((l) => l.statut === "en_cours").length,
    critiques: litiges.filter(
      (l) => l.priorite === "critique" && l.statut !== "résolu"
    ).length,
    résolus: litiges.filter((l) => l.statut === "résolu").length,
  };

  const prendreEnCharge = () => {
    setLitiges((prev) =>
      prev.map((l) =>
        l.id === selected
          ? {
              ...l,
              statut: "en_cours",
              historique: [
                ...l.historique,
                {
                  action: "Pris en charge par Admin",
                  par: "Khalil B.",
                  heure: now(),
                  date: today(),
                },
              ],
            }
          : l
      )
    );
    toast.success("Litige pris en charge");
  };

  const appliquerDecision = () => {
    if (!decisionChoisie) {
      toast.error("Choisissez une décision");
      return;
    }
    if (!decisionMotif.trim()) {
      toast.error("Motif obligatoire");
      return;
    }
    setLitiges((prev) =>
      prev.map((l) =>
        l.id === selected
          ? {
              ...l,
              statut: "résolu",
              decision: `${decisionChoisie} — ${decisionMotif}`,
              historique: [
                ...l.historique,
                {
                  action: `Décision admin : ${decisionChoisie}`,
                  par: "Khalil B.",
                  heure: now(),
                  date: today(),
                },
                {
                  action: "Litige résolu",
                  par: "Khalil B.",
                  heure: now(),
                  date: today(),
                },
              ],
            }
          : l
      )
    );
    setShowDecisionModal(false);
    setDecisionChoisie("");
    setDecisionMotif("");
    toast.success("Décision enregistrée — litige résolu");
  };

  const ajouterNote = () => {
    if (!noteText.trim()) return;
    setLitiges((prev) =>
      prev.map((l) =>
        l.id === selected
          ? {
              ...l,
              noteAdmin: l.noteAdmin
                ? l.noteAdmin + "\n" + noteText.trim()
                : noteText.trim(),
            }
          : l
      )
    );
    setNoteText("");
    setShowNoteInput(false);
    toast.success("Note ajoutée");
  };

  return (
    <div className="page" style={{ padding: "44px 52px" }}>
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
          Litiges & Arbitrage
        </h1>
        <p style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}>
          Dossiers escaladés par le SAV — décisions et arbitrages admin
          plateforme
        </p>
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
          { label: "Total litiges", val: stats.total, color: "var(--noir)" },
          { label: "Escaladés", val: stats.escaladés, color: "#c0392b" },
          {
            label: "En cours d'arbitrage",
            val: stats.enCours,
            color: "#185fa5",
          },
          { label: "Critiques", val: stats.critiques, color: "#c0392b" },
          { label: "Résolus", val: stats.résolus, color: "#2e8b57" },
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "340px 1fr",
          gap: "20px",
        }}
      >
        {/* Liste */}
        <div
          style={{
            background: "#fff",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--white-3)",
            display: "flex",
            flexDirection: "column",
            maxHeight: "calc(100vh - 310px)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 14px",
              borderBottom: "1px solid var(--white-3)",
            }}
          >
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
                onClick={() => setFilterType("all")}
                style={fBtn(filterType === "all")}
              >
                Tous types
              </button>
              {Object.entries(TYPE_CFG).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setFilterType(k)}
                  style={fBtn(filterType === k, v.color, v.bg)}
                >
                  {v.icon} {v.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtres.map((l) => {
              const sc = STATUT_CFG[l.statut];
              const pc = PRIORITE_CFG[l.priorite];
              const tc = TYPE_CFG[l.type];
              const isActive = selected === l.id;
              return (
                <div
                  key={l.id}
                  onClick={() => setSelected(l.id)}
                  style={{
                    padding: "14px 16px",
                    borderBottom: "1px solid var(--white-3)",
                    cursor: "pointer",
                    background: isActive
                      ? "rgba(201,169,110,0.06)"
                      : l.statut === "escaladé"
                      ? "rgba(192,57,43,0.02)"
                      : "transparent",
                    borderLeft: isActive
                      ? "3px solid var(--gold)"
                      : `3px solid ${
                          l.statut === "escaladé" ? "#EF4444" : "transparent"
                        }`,
                    transition: "all 0.15s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "5px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "var(--gold-dark)",
                        }}
                      >
                        {l.id}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          padding: "1px 7px",
                          borderRadius: "10px",
                          background: tc.bg,
                          color: tc.color,
                          fontWeight: "600",
                        }}
                      >
                        {tc.icon} {tc.label}
                      </span>
                      {l.priorite === "critique" && (
                        <span
                          style={{
                            fontSize: "9px",
                            fontWeight: "800",
                            color: pc.color,
                            background: pc.bg,
                            padding: "1px 6px",
                            borderRadius: "10px",
                          }}
                        >
                          CRITIQUE
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        background: sc.bg,
                        color: sc.color,
                        flexShrink: 0,
                      }}
                    >
                      {sc.label}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginBottom: "3px",
                    }}
                  >
                    {l.sujet}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                    {l.client.nom} · {l.boutique} · {l.montant}€
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--gray-light)",
                      marginTop: "2px",
                    }}
                  >
                    Escaladé par {l.escaladéPar} · {l.heureEscalade}{" "}
                    {l.dateEscalade}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Détail */}
        {!lit ? (
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--white-3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "400px",
              color: "var(--gray)",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚖️</div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "22px",
                  fontWeight: "300",
                }}
              >
                Sélectionnez un litige
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-sm)",
              border: `1px solid ${
                lit.statut === "escaladé" ? "#fecaca" : "var(--white-3)"
              }`,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "20px 28px",
                borderBottom: "1px solid var(--white-3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "22px",
                      fontWeight: "300",
                      marginBottom: "6px",
                    }}
                  >
                    {lit.sujet}
                  </div>
                  <div
                    style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        background: TYPE_CFG[lit.type].bg,
                        color: TYPE_CFG[lit.type].color,
                      }}
                    >
                      {TYPE_CFG[lit.type].icon} {TYPE_CFG[lit.type].label}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        background: STATUT_CFG[lit.statut].bg,
                        color: STATUT_CFG[lit.statut].color,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: STATUT_CFG[lit.statut].dot,
                          display: "inline-block",
                          marginRight: "5px",
                        }}
                      />
                      {STATUT_CFG[lit.statut].label}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        background: PRIORITE_CFG[lit.priorite].bg,
                        color: PRIORITE_CFG[lit.priorite].color,
                      }}
                    >
                      {PRIORITE_CFG[lit.priorite].label}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  {lit.statut === "escaladé" && (
                    <button onClick={prendreEnCharge} style={bStyle("ghost")}>
                      Prendre en charge
                    </button>
                  )}
                  {lit.statut !== "résolu" && (
                    <button
                      onClick={() => setShowDecisionModal(true)}
                      style={bStyle("gold")}
                    >
                      Rendre une décision
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
              {/* Infos + Motif escalade */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <STitle>Dossier</STitle>
                  <IBox>
                    <IRow label="Commande" val={lit.commande} bold />
                    <IRow label="Montant en jeu" val={`${lit.montant}€`} bold />
                    <IRow label="Client" val={lit.client.nom} />
                    <IRow label="Boutique" val={lit.boutique} />
                    <IRow label="Ticket SAV" val={lit.ticket} mono />
                  </IBox>
                </div>
                <div>
                  <STitle>Escalade SAV</STitle>
                  <IBox>
                    <IRow label="Escaladé par" val={lit.escaladéPar} />
                    <IRow label="Date" val={lit.dateEscalade} />
                    <IRow label="Heure" val={lit.heureEscalade} />
                  </IBox>
                </div>
              </div>

              {/* Motif */}
              <div style={{ marginBottom: "20px" }}>
                <STitle>Motif de l'escalade</STitle>
                <div
                  style={{
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "var(--radius-md)",
                    padding: "14px 18px",
                    fontSize: "13px",
                    lineHeight: 1.7,
                    color: "var(--noir)",
                    fontStyle: "italic",
                  }}
                >
                  « {lit.motifEscalade} »
                </div>
              </div>

              {/* Décision admin */}
              {lit.decision && (
                <div style={{ marginBottom: "20px" }}>
                  <STitle>Décision admin</STitle>
                  <div
                    style={{
                      background: "#e8f5ee",
                      border: "1px solid #bbf7d0",
                      borderRadius: "var(--radius-md)",
                      padding: "14px 18px",
                      fontSize: "13px",
                      lineHeight: 1.7,
                      color: "#2e8b57",
                      fontWeight: "500",
                    }}
                  >
                    ✓ {lit.decision}
                  </div>
                </div>
              )}

              {/* Historique */}
              <div style={{ marginBottom: "20px" }}>
                <STitle>Historique du dossier</STitle>
                {lit.historique.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "12px",
                      marginBottom: "14px",
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
                          width: 9,
                          height: 9,
                          borderRadius: "50%",
                          background: "var(--gold)",
                          border: "2px solid var(--gold-lighter)",
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      />
                      {i < lit.historique.length - 1 && (
                        <div
                          style={{
                            width: 1,
                            flex: 1,
                            background: "var(--white-3)",
                            marginTop: 3,
                          }}
                        />
                      )}
                    </div>
                    <div style={{ paddingBottom: "3px" }}>
                      <div style={{ fontSize: "13px", fontWeight: "500" }}>
                        {h.action}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                        par {h.par} · {h.heure} · {h.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Note admin */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <STitle style={{ margin: 0 }}>
                    Note admin confidentielle
                  </STitle>
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
                    color: lit.noteAdmin ? "var(--noir)" : "var(--gray-light)",
                    fontStyle: lit.noteAdmin ? "normal" : "italic",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                    marginBottom: showNoteInput ? "10px" : 0,
                  }}
                >
                  {lit.noteAdmin || "Aucune note confidentielle."}
                </div>
                {showNoteInput && (
                  <div>
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Note confidentielle (visible admin seulement)…"
                      rows={3}
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
                        style={bStyle("ghost")}
                      >
                        Annuler
                      </button>
                      <button onClick={ajouterNote} style={bStyle("gold")}>
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

      {/* Modal décision */}
      {showDecisionModal && lit && (
        <div style={OVL} onClick={() => setShowDecisionModal(false)}>
          <div style={MDL} onClick={(e) => e.stopPropagation()}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: "300",
                marginBottom: "6px",
              }}
            >
              Rendre une décision
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "20px",
              }}
            >
              {lit.id} · {lit.sujet}
            </p>
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "var(--radius-sm)",
                padding: "10px 14px",
                fontSize: "12px",
                color: "#c0392b",
                marginBottom: "16px",
              }}
            >
              ⚠ Toute décision est définitive, horodatée et enregistrée dans le
              journal d'audit.
            </div>
            <label style={LBL}>Décision *</label>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                marginBottom: "14px",
              }}
            >
              {DECISIONS_RAPIDES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDecisionChoisie(d)}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "13px",
                    border: `1.5px solid ${
                      decisionChoisie === d ? "var(--gold)" : "var(--white-3)"
                    }`,
                    background:
                      decisionChoisie === d
                        ? "rgba(201,169,110,0.08)"
                        : "transparent",
                    color:
                      decisionChoisie === d
                        ? "var(--gold-dark)"
                        : "var(--noir)",
                    cursor: "pointer",
                    fontWeight: decisionChoisie === d ? "600" : "400",
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
            <label style={LBL}>Motif de la décision *</label>
            <textarea
              value={decisionMotif}
              onChange={(e) => setDecisionMotif(e.target.value)}
              placeholder="Justification détaillée de la décision…"
              rows={4}
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
                onClick={() => setShowDecisionModal(false)}
                style={bStyle("ghost")}
              >
                Annuler
              </button>
              <button onClick={appliquerDecision} style={bStyle("gold")}>
                Valider la décision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function STitle({ children, style }) {
  return (
    <div
      style={{
        fontSize: "10px",
        fontWeight: "700",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--gray)",
        marginBottom: "10px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
function IBox({ children }) {
  return (
    <div
      style={{
        background: "var(--gray-bg)",
        borderRadius: "var(--radius-md)",
        padding: "14px 18px",
        border: "1px solid var(--white-3)",
      }}
    >
      {children}
    </div>
  );
}
function IRow({ label, val, bold, mono }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "7px",
        gap: "12px",
      }}
    >
      <span style={{ fontSize: "12px", color: "var(--gray)", flexShrink: 0 }}>
        {label}
      </span>
      <span
        style={{
          fontSize: "12px",
          fontWeight: bold ? "700" : "500",
          textAlign: "right",
          fontFamily: mono ? "monospace" : "inherit",
          color: bold ? "var(--noir)" : "inherit",
        }}
      >
        {val}
      </span>
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
  width: "520px",
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
const now = () =>
  new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
const today = () => new Date().toLocaleDateString("fr-FR");
