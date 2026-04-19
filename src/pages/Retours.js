import React, { useState } from "react";
import toast from "react-hot-toast";

// ── Mock Data ──────────────────────────────────────────────
const RETOURS_DATA = [
  {
    id: "RET-0021",
    commande: "LV-00409",
    client: { nom: "Lucas D.", email: "lucas.d@email.fr", avatar: "L" },
    boutique: "By Terry",
    produits: [
      {
        nom: "Rouge Terrybly Shine — #302",
        ref: "BT-0302",
        taille: null,
        qte: 1,
        prix: 42,
      },
    ],
    montantTotal: 42,
    motif: "Produit endommagé à réception",
    statut: "demande",
    dateCommande: "08/04/2026",
    dateRetour: "10/04/2026",
    delaiExpiration: "18/04/2026",
    notes: "",
    historique: [
      {
        action: "Demande de retour initiée",
        par: "Lucas D.",
        heure: "09:14",
        date: "10/04/2026",
      },
    ],
  },
  {
    id: "RET-0020",
    commande: "LV-00390",
    client: { nom: "Yasmine B.", email: "yasmine.b@email.fr", avatar: "Y" },
    boutique: "Isabel Marant",
    produits: [
      {
        nom: "Robe Milena — Écru",
        ref: "IM-0890",
        taille: "38",
        qte: 1,
        prix: 450,
      },
    ],
    montantTotal: 450,
    motif: "Produit endommagé à réception — déchirure couture gauche",
    statut: "en cours",
    dateCommande: "14/04/2026",
    dateRetour: "15/04/2026",
    delaiExpiration: "22/04/2026",
    notes: "Photos reçues par email. Défaut de fabrication confirmé.",
    historique: [
      {
        action: "Demande de retour initiée",
        par: "Yasmine B.",
        heure: "16:30",
        date: "15/04/2026",
      },
      {
        action: "Statut → En cours",
        par: "Marie (SAV)",
        heure: "09:00",
        date: "16/04/2026",
      },
      {
        action: "Note interne ajoutée — défaut confirmé",
        par: "Marie (SAV)",
        heure: "09:05",
        date: "16/04/2026",
      },
    ],
  },
  {
    id: "RET-0019",
    commande: "LV-00381",
    client: { nom: "Emma B.", email: "emma.b@email.fr", avatar: "E" },
    boutique: "Sandro Paris",
    produits: [
      {
        nom: "Veste Tailleur Tweed — Noir",
        ref: "SP-1142",
        taille: "36",
        qte: 1,
        prix: 320,
      },
      {
        nom: "Pantalon Cigarette — Noir",
        ref: "SP-1143",
        taille: "36",
        qte: 1,
        prix: 185,
      },
    ],
    montantTotal: 505,
    motif: "Taille ne correspond pas",
    statut: "reçu",
    dateCommande: "05/04/2026",
    dateRetour: "07/04/2026",
    delaiExpiration: "15/04/2026",
    notes: "Colis reçu par la boutique le 09/04. Conformité vérifiée.",
    historique: [
      {
        action: "Demande de retour initiée",
        par: "Emma B.",
        heure: "10:22",
        date: "07/04/2026",
      },
      {
        action: "Statut → En cours",
        par: "Lucas (SAV)",
        heure: "10:30",
        date: "07/04/2026",
      },
      {
        action: "Retour reçu confirmé par la boutique",
        par: "Sandro Paris",
        heure: "14:00",
        date: "09/04/2026",
      },
      {
        action: "Statut → Retour reçu / validé",
        par: "Lucas (SAV)",
        heure: "14:20",
        date: "09/04/2026",
      },
    ],
  },
  {
    id: "RET-0018",
    commande: "LV-00374",
    client: { nom: "Nadia S.", email: "nadia.s@email.fr", avatar: "N" },
    boutique: "AMI Paris",
    produits: [
      {
        nom: "Pull Alexandre — Marine",
        ref: "AMI-0221",
        taille: "S",
        qte: 1,
        prix: 290,
      },
    ],
    montantTotal: 290,
    motif: "Article ne correspond pas à la description",
    statut: "remboursement_en_cours",
    dateCommande: "02/04/2026",
    dateRetour: "04/04/2026",
    delaiExpiration: "12/04/2026",
    notes:
      "Retour validé. Remboursement déclenché le 10/04 — ref REMB-20260410-018.",
    historique: [
      {
        action: "Demande de retour initiée",
        par: "Nadia S.",
        heure: "11:00",
        date: "04/04/2026",
      },
      {
        action: "Statut → En cours",
        par: "Marie (SAV)",
        heure: "11:10",
        date: "04/04/2026",
      },
      {
        action: "Retour reçu confirmé",
        par: "AMI Paris",
        heure: "09:30",
        date: "07/04/2026",
      },
      {
        action: "Retour validé par SAV",
        par: "Marie (SAV)",
        heure: "10:00",
        date: "07/04/2026",
      },
      {
        action: "Remboursement déclenché — 290€",
        par: "Marie (SAV)",
        heure: "10:05",
        date: "10/04/2026",
      },
      {
        action: "Statut → Remboursement en cours",
        par: "Système",
        heure: "10:05",
        date: "10/04/2026",
      },
    ],
  },
  {
    id: "RET-0017",
    commande: "LV-00360",
    client: { nom: "Sophie M.", email: "sophie.m@email.fr", avatar: "S" },
    boutique: "Sandro Paris",
    produits: [
      {
        nom: "Sac Cabas Cuir — Camel",
        ref: "SP-0881",
        taille: null,
        qte: 1,
        prix: 198,
      },
    ],
    montantTotal: 198,
    motif: "Changement d'avis",
    statut: "remboursé",
    dateCommande: "28/03/2026",
    dateRetour: "30/03/2026",
    delaiExpiration: "07/04/2026",
    notes: "Remboursé intégralement le 05/04/2026.",
    historique: [
      {
        action: "Demande de retour initiée",
        par: "Sophie M.",
        heure: "15:40",
        date: "30/03/2026",
      },
      {
        action: "Statut → En cours",
        par: "Lucas (SAV)",
        heure: "15:45",
        date: "30/03/2026",
      },
      {
        action: "Retour reçu confirmé",
        par: "Sandro Paris",
        heure: "10:00",
        date: "02/04/2026",
      },
      {
        action: "Remboursement déclenché — 198€",
        par: "Lucas (SAV)",
        heure: "10:20",
        date: "02/04/2026",
      },
      {
        action: "Remboursement confirmé",
        par: "Système",
        heure: "09:00",
        date: "05/04/2026",
      },
      {
        action: "Statut → Remboursé",
        par: "Système",
        heure: "09:00",
        date: "05/04/2026",
      },
    ],
  },
];

// ── Config statuts (selon CDC) ─────────────────────────────
const STATUT_CFG = {
  demande: {
    label: "Demande de retour",
    color: "#b7770d",
    bg: "#faeeda",
    dot: "#F59E0B",
    next: ["en cours"],
  },
  en_cours: {
    label: "Retour en cours",
    color: "#185fa5",
    bg: "#eff6ff",
    dot: "#3B82F6",
    next: ["reçu"],
  },
  reçu: {
    label: "Retour reçu / validé",
    color: "#2e8b57",
    bg: "#e8f5ee",
    dot: "#10B981",
    next: ["remboursement_en_cours"],
  },
  remboursement_en_cours: {
    label: "Remboursement en cours",
    color: "#6d28d9",
    bg: "#f5f3ff",
    dot: "#8B5CF6",
    next: ["remboursé"],
  },
  remboursé: {
    label: "Remboursé",
    color: "#374151",
    bg: "#f3f4f6",
    dot: "#9CA3AF",
    next: [],
  },
};

// Normalise les clés (certains mock ont "en cours" avec espace)
function getCfg(statut) {
  const key = statut.replace(/ /g, "_");
  return STATUT_CFG[key] || STATUT_CFG["demande"];
}
function getKey(statut) {
  return statut.replace(/ /g, "_");
}

const MOTIFS_REFUS = [
  "Produit retourné endommagé par le client",
  "Délai de retour dépassé",
  "Article non conforme à la politique de retour",
  "Tentative de fraude suspectée",
];

// ── Composant principal ────────────────────────────────────
export default function Retours() {
  const [retours, setRetours] = useState(RETOURS_DATA);
  const [selected, setSelected] = useState(null);
  const [filterStatut, setFilterStatut] = useState("all");
  const [search, setSearch] = useState("");
  const [onglet, setOnglet] = useState("detail"); // detail | historique
  const [showRembModal, setShowRembModal] = useState(false);
  const [showRefusModal, setShowRefusModal] = useState(false);
  const [rembType, setRembType] = useState("total");
  const [rembMontant, setRembMontant] = useState("");
  const [rembMotif, setRembMotif] = useState("");
  const [refusMotif, setRefusMotif] = useState("");
  const [noteText, setNoteText] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  const retour = selected ? retours.find((r) => r.id === selected) : null;

  const filtres = retours.filter((r) => {
    const matchStatut =
      filterStatut === "all" || getKey(r.statut) === filterStatut;
    const matchSearch =
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.client.nom.toLowerCase().includes(search.toLowerCase()) ||
      r.boutique.toLowerCase().includes(search.toLowerCase()) ||
      r.commande.toLowerCase().includes(search.toLowerCase());
    return matchStatut && matchSearch;
  });

  const stats = {
    total: retours.length,
    demandes: retours.filter((r) => getKey(r.statut) === "demande").length,
    enCours: retours.filter((r) =>
      ["en_cours", "reçu"].includes(getKey(r.statut))
    ).length,
    remboursementEnCours: retours.filter(
      (r) => getKey(r.statut) === "remboursement_en_cours"
    ).length,
    remboursés: retours.filter((r) => getKey(r.statut) === "remboursé").length,
    montantTotal: retours
      .filter((r) => getKey(r.statut) === "remboursé")
      .reduce((s, r) => s + r.montantTotal, 0),
  };

  const avancerStatut = (newStatut) => {
    setRetours((prev) =>
      prev.map((r) =>
        r.id === selected
          ? {
              ...r,
              statut: newStatut,
              historique: [
                ...r.historique,
                {
                  action: `Statut → ${getCfg(newStatut).label}`,
                  par: "Vous (SAV)",
                  heure: new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  date: new Date().toLocaleDateString("fr-FR"),
                },
              ],
            }
          : r
      )
    );
    toast.success(`Retour mis à jour : ${getCfg(newStatut).label}`);
  };

  const declencherRemboursement = () => {
    if (!rembMotif.trim()) {
      toast.error("Le motif est obligatoire");
      return;
    }
    const montant =
      rembType === "total" ? retour.montantTotal : parseFloat(rembMontant);
    if (
      rembType === "partiel" &&
      (!rembMontant || isNaN(montant) || montant <= 0)
    ) {
      toast.error("Montant invalide");
      return;
    }
    setRetours((prev) =>
      prev.map((r) =>
        r.id === selected
          ? {
              ...r,
              statut: "remboursement_en_cours",
              notes: r.notes
                ? r.notes +
                  `\nRemboursement déclenché — ${montant}€ (${rembType}). Motif : ${rembMotif}`
                : `Remboursement déclenché — ${montant}€ (${rembType}). Motif : ${rembMotif}`,
              historique: [
                ...r.historique,
                {
                  action: `Remboursement déclenché — ${montant}€ (${rembType})`,
                  par: "Vous (SAV)",
                  heure: new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  date: new Date().toLocaleDateString("fr-FR"),
                },
                {
                  action: "Statut → Remboursement en cours",
                  par: "Système",
                  heure: new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  date: new Date().toLocaleDateString("fr-FR"),
                },
              ],
            }
          : r
      )
    );
    setShowRembModal(false);
    setRembMotif("");
    setRembMontant("");
    toast.success(`Remboursement de ${montant}€ déclenché`);
  };

  const refuserRetour = () => {
    if (!refusMotif.trim()) {
      toast.error("Le motif est obligatoire");
      return;
    }
    setRetours((prev) =>
      prev.map((r) =>
        r.id === selected
          ? {
              ...r,
              statut: "remboursé", // état terminal — retour refusé = dossier fermé
              notes: r.notes
                ? r.notes + `\n⛔ Retour refusé. Motif : ${refusMotif}`
                : `⛔ Retour refusé. Motif : ${refusMotif}`,
              historique: [
                ...r.historique,
                {
                  action: `Retour refusé — ${refusMotif}`,
                  par: "Vous (SAV)",
                  heure: new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  date: new Date().toLocaleDateString("fr-FR"),
                },
              ],
            }
          : r
      )
    );
    setShowRefusModal(false);
    setRefusMotif("");
    toast.success("Retour refusé — dossier fermé");
  };

  const ajouterNote = () => {
    if (!noteText.trim()) return;
    setRetours((prev) =>
      prev.map((r) =>
        r.id === selected
          ? {
              ...r,
              notes: r.notes
                ? r.notes + "\n" + noteText.trim()
                : noteText.trim(),
              historique: [
                ...r.historique,
                {
                  action: "Note interne ajoutée",
                  par: "Vous (SAV)",
                  heure: new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  date: new Date().toLocaleDateString("fr-FR"),
                },
              ],
            }
          : r
      )
    );
    setNoteText("");
    setShowNoteInput(false);
    toast.success("Note ajoutée");
  };

  // Actions disponibles selon statut
  const actionsDisponibles = (r) => {
    const k = getKey(r.statut);
    return {
      peutAvancer: k === "demande" || k === "en_cours" || k === "reçu",
      peutRembourser: k === "reçu",
      peutRefuser: k === "demande" || k === "en_cours",
      estTerminal: k === "remboursé" || k === "remboursement_en_cours",
    };
  };

  return (
    <div className="page" style={{ padding: "32px 36px" }}>
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
          Retours & Remboursements
        </h1>
        <p style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}>
          Gestion des demandes de retour et déclenchement des remboursements
        </p>
      </div>

      {/* ── KPIs ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {[
          {
            label: "Total retours",
            val: stats.total,
            color: "var(--noir)",
            bg: "#fff",
          },
          {
            label: "Nouvelles demandes",
            val: stats.demandes,
            color: "#b7770d",
            bg: "#faeeda",
          },
          {
            label: "En traitement",
            val: stats.enCours,
            color: "#185fa5",
            bg: "#eff6ff",
          },
          {
            label: "Remb. en cours",
            val: stats.remboursementEnCours,
            color: "#6d28d9",
            bg: "#f5f3ff",
          },
          {
            label: "Montant remboursé",
            val: `${stats.montantTotal}€`,
            color: "#2e8b57",
            bg: "#e8f5ee",
          },
        ].map((k) => (
          <div
            key={k.label}
            style={{
              background: k.bg,
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

      {/* ── Layout : liste + détail ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "340px 1fr",
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
            maxHeight: "calc(100vh - 300px)",
            overflow: "hidden",
          }}
        >
          {/* Filtres */}
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid var(--white-3)",
            }}
          >
            <input
              type="text"
              placeholder="ID retour, client, boutique…"
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
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              <button
                onClick={() => setFilterStatut("all")}
                style={filterBtn(filterStatut === "all")}
              >
                Tous
              </button>
              {Object.entries(STATUT_CFG).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setFilterStatut(k)}
                  style={filterBtn(filterStatut === k, v.color, v.bg)}
                >
                  {v.label
                    .replace("Retour ", "")
                    .replace("Remboursement", "Remb.")}
                </button>
              ))}
            </div>
          </div>

          {/* Items */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtres.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px 24px",
                  color: "var(--gray)",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>📭</div>
                <div style={{ fontSize: "13px" }}>Aucun retour trouvé</div>
              </div>
            ) : (
              filtres.map((r) => {
                const cfg = getCfg(r.statut);
                const isActive = selected === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => {
                      setSelected(r.id);
                      setOnglet("detail");
                      setShowNoteInput(false);
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
                        marginBottom: "5px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            color: "var(--gold-dark)",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {r.id}
                        </span>
                        <span
                          style={{
                            fontSize: "10px",
                            color: "var(--gray-light)",
                          }}
                        >
                          → {r.commande}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "600",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          background: cfg.bg,
                          color: cfg.color,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {cfg.label}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        marginBottom: "3px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.client.nom} — {r.boutique}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--gray)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        marginBottom: "4px",
                      }}
                    >
                      {r.motif}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "var(--noir)",
                        }}
                      >
                        {r.montantTotal}€
                      </span>
                      <span
                        style={{ fontSize: "11px", color: "var(--gray-light)" }}
                      >
                        Demande : {r.dateRetour}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Détail ── */}
        {!retour ? (
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
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>↩️</div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "22px",
                fontWeight: "300",
                marginBottom: "8px",
              }}
            >
              Sélectionnez un retour
            </div>
            <div style={{ fontSize: "13px" }}>
              Cliquez sur un retour pour gérer le dossier
            </div>
          </div>
        ) : (
          (() => {
            const cfg = getCfg(retour.statut);
            const actions = actionsDisponibles(retour);
            const keyStatut = getKey(retour.statut);
            const nextStatut = cfg.next?.[0];

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
                      marginBottom: "14px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          marginBottom: "6px",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "26px",
                            fontWeight: "300",
                          }}
                        >
                          {retour.id}
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            background: cfg.bg,
                            color: cfg.color,
                          }}
                        >
                          {cfg.label}
                        </span>
                      </div>
                      <div style={{ fontSize: "13px", color: "var(--gray)" }}>
                        Commande {retour.commande} · {retour.boutique} · Demande
                        le {retour.dateRetour}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                      {actions.peutRefuser && (
                        <button
                          onClick={() => setShowRefusModal(true)}
                          style={btnStyle("error")}
                        >
                          Refuser
                        </button>
                      )}
                      {actions.peutRembourser && (
                        <button
                          onClick={() => setShowRembModal(true)}
                          style={btnStyle("gold")}
                        >
                          Déclencher remboursement
                        </button>
                      )}
                      {actions.peutAvancer &&
                        nextStatut &&
                        !actions.peutRembourser && (
                          <button
                            onClick={() => avancerStatut(nextStatut)}
                            style={btnStyle("primary")}
                          >
                            → {STATUT_CFG[nextStatut]?.label}
                          </button>
                        )}
                      {actions.estTerminal && (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--gray-light)",
                            padding: "9px 0",
                            fontStyle: "italic",
                          }}
                        >
                          Dossier{" "}
                          {keyStatut === "remboursé"
                            ? "clôturé"
                            : "en traitement automatique"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pipeline statut */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0",
                      marginBottom: "16px",
                      overflowX: "auto",
                    }}
                  >
                    {Object.entries(STATUT_CFG).map(([k, v], i, arr) => {
                      const keys = Object.keys(STATUT_CFG);
                      const currentIdx = keys.indexOf(keyStatut);
                      const thisIdx = keys.indexOf(k);
                      const isDone = thisIdx < currentIdx;
                      const isCurrent = thisIdx === currentIdx;
                      return (
                        <React.Fragment key={k}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              minWidth: "80px",
                            }}
                          >
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: isCurrent
                                  ? v.color
                                  : isDone
                                  ? "#d1fae5"
                                  : "var(--white-3)",
                                border: `2px solid ${
                                  isCurrent
                                    ? v.color
                                    : isDone
                                    ? "#10B981"
                                    : "var(--white-3)"
                                }`,
                                color: isCurrent
                                  ? "#fff"
                                  : isDone
                                  ? "#10B981"
                                  : "var(--gray-light)",
                                fontSize: "12px",
                                fontWeight: "700",
                                flexShrink: 0,
                              }}
                            >
                              {isDone ? "✓" : thisIdx + 1}
                            </div>
                            <span
                              style={{
                                fontSize: "9px",
                                color: isCurrent
                                  ? v.color
                                  : isDone
                                  ? "#10B981"
                                  : "var(--gray-light)",
                                fontWeight: isCurrent ? "700" : "400",
                                marginTop: "4px",
                                textAlign: "center",
                                lineHeight: 1.2,
                                maxWidth: "72px",
                              }}
                            >
                              {v.label}
                            </span>
                          </div>
                          {i < arr.length - 1 && (
                            <div
                              style={{
                                flex: 1,
                                height: 2,
                                background:
                                  thisIdx < currentIdx
                                    ? "#10B981"
                                    : "var(--white-3)",
                                minWidth: "12px",
                                marginBottom: "16px",
                              }}
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* Onglets */}
                  <div style={{ display: "flex", gap: "0" }}>
                    {[
                      { id: "detail", label: "Détail" },
                      {
                        id: "historique",
                        label: `Historique (${retour.historique.length})`,
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
                  {onglet === "detail" && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "20px",
                      }}
                    >
                      {/* Infos client */}
                      <div>
                        <SectionTitle>Client</SectionTitle>
                        <InfoCard>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              marginBottom: "12px",
                            }}
                          >
                            <Avatar letter={retour.client.avatar} />
                            <div>
                              <div
                                style={{ fontSize: "14px", fontWeight: "600" }}
                              >
                                {retour.client.nom}
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "var(--gray)",
                                }}
                              >
                                {retour.client.email}
                              </div>
                            </div>
                          </div>
                          <Row label="Commande" val={retour.commande} bold />
                          <Row
                            label="Date commande"
                            val={retour.dateCommande}
                          />
                          <Row label="Date demande" val={retour.dateRetour} />
                          <Row
                            label="Expiration délai"
                            val={retour.delaiExpiration}
                          />
                        </InfoCard>
                      </div>

                      {/* Produits */}
                      <div>
                        <SectionTitle>Produit(s) retourné(s)</SectionTitle>
                        <div
                          style={{
                            background: "var(--gray-bg)",
                            borderRadius: "var(--radius-md)",
                            padding: "14px",
                            border: "1px solid var(--white-3)",
                          }}
                        >
                          {retour.produits.map((p, i) => (
                            <div
                              key={i}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                padding: i > 0 ? "10px 0 0" : "0",
                                borderTop:
                                  i > 0 ? "1px solid var(--white-3)" : "none",
                              }}
                            >
                              <div>
                                <div
                                  style={{
                                    fontSize: "13px",
                                    fontWeight: "500",
                                  }}
                                >
                                  {p.nom}
                                </div>
                                <div
                                  style={{
                                    fontSize: "11px",
                                    color: "var(--gray)",
                                  }}
                                >
                                  Réf. {p.ref}
                                  {p.taille ? ` · T. ${p.taille}` : ""} · Qté :{" "}
                                  {p.qte}
                                </div>
                              </div>
                              <div
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "600",
                                  color: "var(--noir)",
                                  flexShrink: 0,
                                }}
                              >
                                {p.prix}€
                              </div>
                            </div>
                          ))}
                          <div
                            style={{
                              borderTop: "1px solid var(--white-3)",
                              marginTop: "12px",
                              paddingTop: "10px",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: "700",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                color: "var(--gray)",
                              }}
                            >
                              Total
                            </span>
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: "600",
                                color: "var(--noir)",
                              }}
                            >
                              {retour.montantTotal}€
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Motif */}
                      <div style={{ gridColumn: "1 / -1" }}>
                        <SectionTitle>Motif du retour</SectionTitle>
                        <div
                          style={{
                            background: "#fffbeb",
                            border: "1px solid #fde68a",
                            borderRadius: "var(--radius-md)",
                            padding: "14px 18px",
                            fontSize: "13px",
                            color: "var(--noir)",
                            lineHeight: 1.6,
                          }}
                        >
                          {retour.motif}
                        </div>
                      </div>

                      {/* Notes internes */}
                      <div style={{ gridColumn: "1 / -1" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "10px",
                          }}
                        >
                          <SectionTitle style={{ margin: 0 }}>
                            Notes internes
                          </SectionTitle>
                          {!showNoteInput && (
                            <button
                              onClick={() => setShowNoteInput(true)}
                              style={{
                                fontSize: "11px",
                                fontWeight: "600",
                                color: "var(--gold-dark)",
                                padding: "4px 10px",
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
                            background: "var(--gray-bg)",
                            borderRadius: "var(--radius-md)",
                            padding: "14px 18px",
                            fontSize: "13px",
                            color: retour.notes
                              ? "var(--noir)"
                              : "var(--gray-light)",
                            lineHeight: 1.6,
                            fontStyle: retour.notes ? "normal" : "italic",
                            whiteSpace: "pre-wrap",
                            marginBottom: showNoteInput ? "10px" : 0,
                            border: "1px solid var(--white-3)",
                          }}
                        >
                          {retour.notes || "Aucune note pour ce dossier."}
                        </div>
                        {showNoteInput && (
                          <div>
                            <textarea
                              value={noteText}
                              onChange={(e) => setNoteText(e.target.value)}
                              placeholder="Saisir une note interne…"
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
                                style={{
                                  padding: "7px 16px",
                                  borderRadius: "var(--radius-sm)",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                  border: "1.5px solid var(--white-3)",
                                  background: "transparent",
                                  color: "var(--gray)",
                                  cursor: "pointer",
                                }}
                              >
                                Annuler
                              </button>
                              <button
                                onClick={ajouterNote}
                                style={{
                                  padding: "7px 16px",
                                  borderRadius: "var(--radius-sm)",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  background: "var(--noir)",
                                  color: "var(--gold)",
                                  cursor: "pointer",
                                }}
                              >
                                Enregistrer
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {onglet === "historique" && (
                    <div>
                      {retour.historique.map((h, i) => (
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
                            {i < retour.historique.length - 1 && (
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

      {/* ── Modal : Remboursement ── */}
      {showRembModal && retour && (
        <div style={overlayStyle} onClick={() => setShowRembModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: "300",
                marginBottom: "6px",
              }}
            >
              Déclencher le remboursement
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "24px",
              }}
            >
              {retour.id} · {retour.client.nom} · {retour.montantTotal}€
              éligibles
            </p>

            <label style={labelStyle}>Type de remboursement *</label>
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              {["total", "partiel"].map((t) => (
                <button
                  key={t}
                  onClick={() => setRembType(t)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "13px",
                    fontWeight: "600",
                    border: `2px solid ${
                      rembType === t ? "var(--gold)" : "var(--white-3)"
                    }`,
                    background:
                      rembType === t ? "rgba(201,169,110,0.08)" : "transparent",
                    color: rembType === t ? "var(--gold-dark)" : "var(--gray)",
                    cursor: "pointer",
                  }}
                >
                  {t === "total"
                    ? `Total — ${retour.montantTotal}€`
                    : "Partiel"}
                </button>
              ))}
            </div>

            {rembType === "partiel" && (
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Montant à rembourser (€) *</label>
                <input
                  type="number"
                  value={rembMontant}
                  onChange={(e) => setRembMontant(e.target.value)}
                  placeholder={`Max. ${retour.montantTotal}€`}
                  max={retour.montantTotal}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1.5px solid var(--white-3)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </div>
            )}

            <label style={labelStyle}>Motif obligatoire *</label>
            <textarea
              value={rembMotif}
              onChange={(e) => setRembMotif(e.target.value)}
              placeholder="Ex. : Défaut de fabrication confirmé, retour conforme…"
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
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "var(--radius-sm)",
                padding: "10px 14px",
                fontSize: "12px",
                color: "#c0392b",
                marginBottom: "20px",
              }}
            >
              ⚠ Toute action financière est horodatée, tracée et associée à
              votre compte.
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowRembModal(false)}
                style={btnStyle("ghost")}
              >
                Annuler
              </button>
              <button
                onClick={declencherRemboursement}
                style={btnStyle("gold")}
              >
                Confirmer le remboursement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal : Refus retour ── */}
      {showRefusModal && (
        <div style={overlayStyle} onClick={() => setShowRefusModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: "300",
                marginBottom: "6px",
              }}
            >
              Refuser le retour
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "24px",
              }}
            >
              Un motif obligatoire sera transmis au client et conservé dans le
              dossier.
            </p>

            <label style={labelStyle}>Motif de refus *</label>
            <div style={{ marginBottom: "12px" }}>
              {MOTIFS_REFUS.map((m) => (
                <button
                  key={m}
                  onClick={() => setRefusMotif(m)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "9px 12px",
                    marginBottom: "6px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "13px",
                    border: `1.5px solid ${
                      refusMotif === m ? "var(--error)" : "var(--white-3)"
                    }`,
                    background: refusMotif === m ? "#fef2f2" : "transparent",
                    color: refusMotif === m ? "var(--error)" : "var(--noir)",
                    cursor: "pointer",
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
            <textarea
              value={refusMotif}
              onChange={(e) => setRefusMotif(e.target.value)}
              placeholder="Ou saisir un motif personnalisé…"
              rows={2}
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
                onClick={() => setShowRefusModal(false)}
                style={btnStyle("ghost")}
              >
                Annuler
              </button>
              <button onClick={refuserRetour} style={btnStyle("error")}>
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helpers UI ─────────────────────────────────────────────
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
    primary: { background: "var(--noir)", color: "#fff", border: "none" },
    gold: { background: "var(--noir)", color: "var(--gold)", border: "none" },
    error: {
      background: "#fef2f2",
      color: "var(--error)",
      border: "1.5px solid #fecaca",
    },
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
    ...styles[type],
  };
}

function SectionTitle({ children, style }) {
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

function InfoCard({ children }) {
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

function Row({ label, val, bold }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "6px",
      }}
    >
      <span style={{ fontSize: "12px", color: "var(--gray)" }}>{label}</span>
      <span
        style={{
          fontSize: "12px",
          fontWeight: bold ? "600" : "400",
          color: "var(--noir)",
        }}
      >
        {val}
      </span>
    </div>
  );
}

function Avatar({ letter }) {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "rgba(201,169,110,0.12)",
        border: "1px solid rgba(201,169,110,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display)",
        fontSize: "16px",
        color: "var(--gold-dark)",
        flexShrink: 0,
      }}
    >
      {letter}
    </div>
  );
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

const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--gray)",
  marginBottom: "8px",
};
