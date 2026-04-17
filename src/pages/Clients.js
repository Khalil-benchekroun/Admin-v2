import React, { useState } from "react";
import toast from "react-hot-toast";

// ── Mock Data ──────────────────────────────────────────────
const CLIENTS_DATA = [
  {
    id: "CLT-001",
    nom: "Sophie M.",
    prenom: "Sophie",
    email: "sophie.m@email.fr",
    avatar: "S",
    telephone: "+33 6 12 34 56 78",
    adresse: "24 rue du Faubourg Saint-Honoré, Paris 8e",
    dateInscription: "15/01/2026",
    statut: "actif",
    abonnement: "premium",
    fidelite: { niveau: "Gold", points: 2840 },
    commandes: [
      {
        id: "LV-00412",
        boutique: "Sandro Paris",
        montant: 490,
        statut: "bloquée",
        date: "17/04/2026",
      },
      {
        id: "LV-00360",
        boutique: "Sandro Paris",
        montant: 198,
        statut: "livrée",
        date: "28/03/2026",
      },
      {
        id: "LV-00310",
        boutique: "By Terry",
        montant: 120,
        statut: "livrée",
        date: "10/03/2026",
      },
    ],
    totalDepense: 808,
    nbCommandes: 3,
    panierMoyen: 269,
    notes: "Cliente VIP — partenaire influenceuse.",
    signalements: 0,
  },
  {
    id: "CLT-002",
    nom: "Karim T.",
    prenom: "Karim",
    email: "karim.t@email.fr",
    avatar: "K",
    telephone: "+33 6 98 76 54 32",
    adresse: "8 avenue Montaigne, Paris 8e",
    dateInscription: "22/01/2026",
    statut: "actif",
    abonnement: null,
    fidelite: { niveau: "Silver", points: 1240 },
    commandes: [
      {
        id: "LV-00411",
        boutique: "AMI Paris",
        montant: 1079,
        statut: "livrée",
        date: "09/04/2026",
      },
      {
        id: "LV-00398",
        boutique: "AMI Paris",
        montant: 290,
        statut: "retour",
        date: "01/04/2026",
      },
    ],
    totalDepense: 1369,
    nbCommandes: 2,
    panierMoyen: 684,
    notes: "",
    signalements: 0,
  },
  {
    id: "CLT-003",
    nom: "Yasmine B.",
    prenom: "Yasmine",
    email: "yasmine.b@email.fr",
    avatar: "Y",
    telephone: "+33 7 11 22 33 44",
    adresse: "55 rue de Rivoli, Paris 1er",
    dateInscription: "03/02/2026",
    statut: "actif",
    abonnement: "premium",
    fidelite: { niveau: "Gold", points: 3100 },
    commandes: [
      {
        id: "LV-00410",
        boutique: "Isabel Marant",
        montant: 450,
        statut: "livrée",
        date: "09/04/2026",
      },
      {
        id: "LV-00390",
        boutique: "Isabel Marant",
        montant: 450,
        statut: "retour",
        date: "14/04/2026",
      },
      {
        id: "LV-00345",
        boutique: "Sandro Paris",
        montant: 280,
        statut: "livrée",
        date: "18/03/2026",
      },
    ],
    totalDepense: 1180,
    nbCommandes: 3,
    panierMoyen: 393,
    notes: "2 retours récents sur Isabel Marant — surveiller.",
    signalements: 1,
  },
  {
    id: "CLT-004",
    nom: "Lucas D.",
    prenom: "Lucas",
    email: "lucas.d@email.fr",
    avatar: "L",
    telephone: "+33 6 55 44 33 22",
    adresse: "12 rue des Martyrs, Paris 9e",
    dateInscription: "14/02/2026",
    statut: "actif",
    abonnement: null,
    fidelite: { niveau: "Bronze", points: 420 },
    commandes: [
      {
        id: "LV-00409",
        boutique: "By Terry",
        montant: 280,
        statut: "retour",
        date: "08/04/2026",
      },
    ],
    totalDepense: 280,
    nbCommandes: 1,
    panierMoyen: 280,
    notes: "",
    signalements: 0,
  },
  {
    id: "CLT-005",
    nom: "Emma B.",
    prenom: "Emma",
    email: "emma.b@email.fr",
    avatar: "E",
    telephone: "+33 6 77 88 99 00",
    adresse: "3 place des Vosges, Paris 4e",
    dateInscription: "08/03/2026",
    statut: "actif",
    abonnement: "premium",
    fidelite: { niveau: "Silver", points: 960 },
    commandes: [
      {
        id: "LV-00407",
        boutique: "AMI Paris",
        montant: 320,
        statut: "en cours",
        date: "08/04/2026",
      },
      {
        id: "LV-00381",
        boutique: "Sandro Paris",
        montant: 505,
        statut: "retour",
        date: "05/04/2026",
      },
    ],
    totalDepense: 825,
    nbCommandes: 2,
    panierMoyen: 412,
    notes: "",
    signalements: 0,
  },
  {
    id: "CLT-006",
    nom: "Nadia S.",
    prenom: "Nadia",
    email: "nadia.s@email.fr",
    avatar: "N",
    telephone: "+33 6 23 45 67 89",
    adresse: "18 boulevard Haussmann, Paris 9e",
    dateInscription: "20/03/2026",
    statut: "bloqué",
    abonnement: null,
    fidelite: { niveau: "Bronze", points: 0 },
    commandes: [
      {
        id: "LV-00408",
        boutique: "Sandro Paris",
        montant: 890,
        statut: "annulée",
        date: "08/04/2026",
      },
      {
        id: "LV-00374",
        boutique: "AMI Paris",
        montant: 290,
        statut: "retour",
        date: "02/04/2026",
      },
    ],
    totalDepense: 0,
    nbCommandes: 2,
    panierMoyen: 0,
    notes: "Compte bloqué — suspicion de fraude (chargeback abusif).",
    signalements: 3,
  },
];

const STATUT_CFG = {
  actif: { label: "Actif", color: "#2e8b57", bg: "#e8f5ee", dot: "#10B981" },
  bloqué: { label: "Bloqué", color: "#c0392b", bg: "#fef2f2", dot: "#EF4444" },
  inactif: {
    label: "Inactif",
    color: "#6B7280",
    bg: "#f3f4f6",
    dot: "#9CA3AF",
  },
};

const FIDELITE_CFG = {
  Bronze: { color: "#92400e", bg: "rgba(146,64,14,0.08)" },
  Silver: { color: "#6B7280", bg: "rgba(107,114,128,0.08)" },
  Gold: { color: "#C9A96E", bg: "rgba(201,169,110,0.1)" },
};

const COMMANDE_STATUT = {
  "en cours": { label: "En cours", color: "#185fa5", bg: "#eff6ff" },
  livrée: { label: "Livrée", color: "#2e8b57", bg: "#e8f5ee" },
  retour: { label: "Retour", color: "#b7770d", bg: "#faeeda" },
  annulée: { label: "Annulée", color: "#6B7280", bg: "#f3f4f6" },
  bloquée: { label: "Bloquée", color: "#c0392b", bg: "#fef2f2" },
};

export default function Clients() {
  const [clients, setClients] = useState(CLIENTS_DATA);
  const [selected, setSelected] = useState(null);
  const [filterStatut, setFilterStatut] = useState("all");
  const [search, setSearch] = useState("");
  const [onglet, setOnglet] = useState("profil");
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showSignalModal, setShowSignalModal] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [blockMotif, setBlockMotif] = useState("");
  const [signalMotif, setSignalMotif] = useState("");
  const [noteText, setNoteText] = useState("");

  const client = selected ? clients.find((c) => c.id === selected) : null;

  const filtres = clients.filter((c) => {
    const matchStatut = filterStatut === "all" || c.statut === filterStatut;
    const matchSearch =
      c.nom.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    return matchStatut && matchSearch;
  });

  const stats = {
    total: clients.length,
    actifs: clients.filter((c) => c.statut === "actif").length,
    bloqués: clients.filter((c) => c.statut === "bloqué").length,
    premium: clients.filter((c) => c.abonnement === "premium").length,
    panierMoyenGlobal: Math.round(
      clients.reduce((s, c) => s + c.panierMoyen, 0) / clients.length
    ),
  };

  const toggleBlocage = () => {
    if (client.statut !== "bloqué" && !blockMotif.trim()) {
      toast.error("Motif obligatoire");
      return;
    }
    const newStatut = client.statut === "bloqué" ? "actif" : "bloqué";
    setClients((prev) =>
      prev.map((c) =>
        c.id === selected
          ? {
              ...c,
              statut: newStatut,
              notes: c.notes
                ? c.notes +
                  (newStatut === "bloqué"
                    ? `\nBloqué — ${blockMotif}`
                    : "\nCompte débloqué.")
                : newStatut === "bloqué"
                ? `Bloqué — ${blockMotif}`
                : "Compte débloqué.",
            }
          : c
      )
    );
    setShowBlockModal(false);
    setBlockMotif("");
    toast.success(newStatut === "bloqué" ? "Compte bloqué" : "Compte débloqué");
  };

  const signalerClient = () => {
    if (!signalMotif.trim()) {
      toast.error("Motif obligatoire");
      return;
    }
    setClients((prev) =>
      prev.map((c) =>
        c.id === selected
          ? {
              ...c,
              signalements: c.signalements + 1,
              notes: c.notes
                ? c.notes + `\nSignalement : ${signalMotif}`
                : `Signalement : ${signalMotif}`,
            }
          : c
      )
    );
    setShowSignalModal(false);
    setSignalMotif("");
    toast.success("Signalement enregistré");
  };

  const ajouterNote = () => {
    if (!noteText.trim()) return;
    setClients((prev) =>
      prev.map((c) =>
        c.id === selected
          ? {
              ...c,
              notes: c.notes
                ? c.notes + "\n" + noteText.trim()
                : noteText.trim(),
            }
          : c
      )
    );
    setNoteText("");
    setShowNoteInput(false);
    toast.success("Note ajoutée");
  };

  const exportRGPD = () => {
    if (!client) return;
    const data = {
      identite: {
        nom: client.nom,
        email: client.email,
        telephone: client.telephone,
        adresse: client.adresse,
      },
      compte: {
        dateInscription: client.dateInscription,
        statut: client.statut,
        abonnement: client.abonnement,
      },
      commandes: client.commandes,
      fidelite: client.fidelite,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `livrr-rgpd-${client.id}-${new Date()
      .toLocaleDateString("fr-FR")
      .replace(/\//g, "-")}.json`;
    a.click();
    toast.success("Export RGPD téléchargé");
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
          Clients
        </h1>
        <p style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}>
          Liste, profils, historique commandes et gestion RGPD
        </p>
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
          { label: "Total clients", val: stats.total, color: "var(--noir)" },
          { label: "Actifs", val: stats.actifs, color: "#2e8b57" },
          { label: "Bloqués", val: stats.bloqués, color: "#c0392b" },
          {
            label: "Abonnés Premium",
            val: stats.premium,
            color: "var(--gold-dark)",
          },
          {
            label: "Panier moyen",
            val: stats.panierMoyenGlobal + "€",
            color: "#185fa5",
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

      {/* ── Layout : liste + détail ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "360px 1fr",
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
              placeholder="Nom, email, ID client…"
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
            <div style={{ display: "flex", gap: "5px" }}>
              {["all", "actif", "bloqué"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatut(s)}
                  style={filterBtn(
                    filterStatut === s,
                    s !== "all" ? STATUT_CFG[s]?.color : null,
                    s !== "all" ? STATUT_CFG[s]?.bg : null
                  )}
                >
                  {s === "all" ? "Tous" : STATUT_CFG[s].label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtres.map((c) => {
              const st = STATUT_CFG[c.statut];
              const fidCfg = FIDELITE_CFG[c.fidelite.niveau];
              const isActive = selected === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelected(c.id);
                    setOnglet("profil");
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
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "6px",
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background:
                          c.signalements > 0
                            ? "#fef2f2"
                            : "rgba(201,169,110,0.1)",
                        border: `1.5px solid ${
                          c.signalements > 0
                            ? "#fecaca"
                            : "rgba(201,169,110,0.25)"
                        }`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        fontWeight: "700",
                        color:
                          c.signalements > 0 ? "#c0392b" : "var(--gold-dark)",
                        flexShrink: 0,
                      }}
                    >
                      {c.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: "500",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {c.nom}
                        </div>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: "600",
                            padding: "2px 7px",
                            borderRadius: "10px",
                            background: st.bg,
                            color: st.color,
                            flexShrink: 0,
                            marginLeft: "6px",
                          }}
                        >
                          {st.label}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--gray)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.email}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "600",
                          padding: "2px 7px",
                          borderRadius: "10px",
                          background: fidCfg.bg,
                          color: fidCfg.color,
                        }}
                      >
                        {c.fidelite.niveau}
                      </span>
                      {c.abonnement && (
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: "600",
                            padding: "2px 7px",
                            borderRadius: "10px",
                            background: "rgba(201,169,110,0.1)",
                            color: "var(--gold-dark)",
                          }}
                        >
                          Premium
                        </span>
                      )}
                      {c.signalements > 0 && (
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: "700",
                            color: "#c0392b",
                          }}
                        >
                          ⚠ {c.signalements}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--gray)" }}>
                      {c.nbCommandes} cmd · {c.totalDepense}€
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Détail ── */}
        {!client ? (
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
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>👤</div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "22px",
                fontWeight: "300",
                marginBottom: "8px",
              }}
            >
              Sélectionnez un client
            </div>
            <div style={{ fontSize: "13px" }}>
              Cliquez sur un client pour voir son profil
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
            }}
          >
            {/* Header client */}
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
                <div
                  style={{ display: "flex", alignItems: "center", gap: "14px" }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background:
                        client.signalements > 0
                          ? "#fef2f2"
                          : "rgba(201,169,110,0.1)",
                      border: `2px solid ${
                        client.signalements > 0
                          ? "#fecaca"
                          : "rgba(201,169,110,0.3)"
                      }`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      fontWeight: "700",
                      color:
                        client.signalements > 0
                          ? "#c0392b"
                          : "var(--gold-dark)",
                    }}
                  >
                    {client.avatar}
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
                      {client.nom}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          background: STATUT_CFG[client.statut].bg,
                          color: STATUT_CFG[client.statut].color,
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: STATUT_CFG[client.statut].dot,
                            display: "inline-block",
                            marginRight: "5px",
                          }}
                        />
                        {STATUT_CFG[client.statut].label}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          background: FIDELITE_CFG[client.fidelite.niveau].bg,
                          color: FIDELITE_CFG[client.fidelite.niveau].color,
                        }}
                      >
                        {client.fidelite.niveau} · {client.fidelite.points} pts
                      </span>
                      {client.abonnement && (
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "600",
                            padding: "3px 10px",
                            borderRadius: "20px",
                            background: "rgba(201,169,110,0.1)",
                            color: "var(--gold-dark)",
                          }}
                        >
                          Premium
                        </span>
                      )}
                      {client.signalements > 0 && (
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            color: "#c0392b",
                          }}
                        >
                          ⚠ {client.signalements} signalement
                          {client.signalements > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <button
                    onClick={exportRGPD}
                    style={btnStyle("ghost")}
                    title="Export données RGPD"
                  >
                    ↓ RGPD
                  </button>
                  <button
                    onClick={() => setShowSignalModal(true)}
                    style={btnStyle("warning")}
                  >
                    Signaler
                  </button>
                  <button
                    onClick={() => setShowBlockModal(true)}
                    style={btnStyle(
                      client.statut === "bloqué" ? "success" : "error"
                    )}
                  >
                    {client.statut === "bloqué" ? "Débloquer" : "Bloquer"}
                  </button>
                </div>
              </div>

              {/* Onglets */}
              <div style={{ display: "flex" }}>
                {[
                  { id: "profil", label: "Profil" },
                  {
                    id: "commandes",
                    label: `Commandes (${client.commandes.length})`,
                  },
                  { id: "notes", label: "Notes internes" },
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
                        onglet === o.id ? "var(--gold-dark)" : "var(--gray)",
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
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
              {/* ── Profil ── */}
              {onglet === "profil" && (
                <div>
                  {/* Stats */}
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
                        label: "Total dépensé",
                        val: client.totalDepense.toLocaleString("fr-FR") + "€",
                        color: "var(--noir)",
                      },
                      {
                        label: "Commandes",
                        val: client.nbCommandes,
                        color: "var(--noir)",
                      },
                      {
                        label: "Panier moyen",
                        val: client.panierMoyen + "€",
                        color: "var(--gold-dark)",
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
                            color: s.color,
                          }}
                        >
                          {s.val}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Infos contact */}
                  <div style={{ marginBottom: "20px" }}>
                    <SectionTitle>Informations de contact</SectionTitle>
                    <div
                      style={{
                        background: "var(--gray-bg)",
                        borderRadius: "var(--radius-md)",
                        padding: "16px 18px",
                        border: "1px solid var(--white-3)",
                      }}
                    >
                      <InfoRow label="Email" val={client.email} />
                      <InfoRow label="Téléphone" val={client.telephone} />
                      <InfoRow
                        label="Adresse principale"
                        val={client.adresse}
                      />
                      <InfoRow
                        label="Inscription"
                        val={client.dateInscription}
                      />
                      <InfoRow label="ID client" val={client.id} mono />
                    </div>
                  </div>

                  {/* Fidélité */}
                  <div>
                    <SectionTitle>Programme de fidélité</SectionTitle>
                    <div
                      style={{
                        background: "var(--gray-bg)",
                        borderRadius: "var(--radius-md)",
                        padding: "16px 18px",
                        border: "1px solid var(--white-3)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "12px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: FIDELITE_CFG[client.fidelite.niveau].color,
                          }}
                        >
                          Niveau {client.fidelite.niveau}
                        </span>
                        <span style={{ fontSize: "16px", fontWeight: "700" }}>
                          {client.fidelite.points.toLocaleString("fr-FR")} pts
                        </span>
                      </div>
                      {/* Barre progression vers le niveau suivant */}
                      {client.fidelite.niveau !== "Gold" &&
                        (() => {
                          const cibles = { Bronze: 1000, Silver: 3000 };
                          const prochainNiveau =
                            client.fidelite.niveau === "Bronze"
                              ? "Silver"
                              : "Gold";
                          const cible = cibles[client.fidelite.niveau];
                          const pct = Math.min(
                            Math.round((client.fidelite.points / cible) * 100),
                            100
                          );
                          return (
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  marginBottom: "4px",
                                  fontSize: "11px",
                                  color: "var(--gray)",
                                }}
                              >
                                <span>Vers {prochainNiveau}</span>
                                <span>
                                  {client.fidelite.points}/{cible} pts
                                </span>
                              </div>
                              <div
                                style={{
                                  height: 6,
                                  background: "var(--white-3)",
                                  borderRadius: "6px",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    height: "100%",
                                    width: `${pct}%`,
                                    background: "var(--gold)",
                                    borderRadius: "6px",
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })()}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Commandes ── */}
              {onglet === "commandes" && (
                <div>
                  {client.commandes.map((cmd, i) => {
                    const st =
                      COMMANDE_STATUT[cmd.statut] ||
                      COMMANDE_STATUT["en cours"];
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "14px 16px",
                          borderRadius: "var(--radius-md)",
                          background: "var(--gray-bg)",
                          border: "1px solid var(--white-3)",
                          marginBottom: "10px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "4px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "13px",
                                fontWeight: "700",
                                color: "var(--gold-dark)",
                              }}
                            >
                              {cmd.id}
                            </span>
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: "600",
                                padding: "2px 8px",
                                borderRadius: "10px",
                                background: st.bg,
                                color: st.color,
                              }}
                            >
                              {st.label}
                            </span>
                          </div>
                          <div
                            style={{ fontSize: "12px", color: "var(--gray)" }}
                          >
                            {cmd.boutique} · {cmd.date}
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "var(--noir)",
                          }}
                        >
                          {cmd.montant}€
                        </div>
                      </div>
                    );
                  })}
                  <div
                    style={{
                      marginTop: "16px",
                      paddingTop: "14px",
                      borderTop: "1px solid var(--white-3)",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--gray)",
                        fontWeight: "600",
                      }}
                    >
                      Total dépensé
                    </span>
                    <span style={{ fontSize: "16px", fontWeight: "700" }}>
                      {client.totalDepense}€
                    </span>
                  </div>
                </div>
              )}

              {/* ── Notes ── */}
              {onglet === "notes" && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
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
                      background: "#fffbeb",
                      border: "1px solid #fde68a",
                      borderRadius: "var(--radius-md)",
                      padding: "16px 18px",
                      fontSize: "13px",
                      color: client.notes ? "var(--noir)" : "var(--gray-light)",
                      fontStyle: client.notes ? "normal" : "italic",
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.7,
                      marginBottom: showNoteInput ? "12px" : 0,
                    }}
                  >
                    {client.notes || "Aucune note pour ce client."}
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
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Modal : Blocage ── */}
      {showBlockModal && client && (
        <div style={overlayStyle} onClick={() => setShowBlockModal(false)}>
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
              {client.statut === "bloqué"
                ? "Débloquer le compte"
                : "Bloquer le compte"}
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "20px",
              }}
            >
              {client.nom} · {client.email}
            </p>
            {client.statut !== "bloqué" && (
              <>
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
                  ⚠ Le client ne pourra plus passer de commandes sur la
                  plateforme.
                </div>
                <label style={labelStyle}>Motif obligatoire *</label>
                <textarea
                  value={blockMotif}
                  onChange={(e) => setBlockMotif(e.target.value)}
                  placeholder="Ex. : Chargeback abusif, fraude suspectée, comportement inapproprié…"
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
            {client.statut === "bloqué" && (
              <div
                style={{
                  background: "#e8f5ee",
                  border: "1px solid #bbf7d0",
                  borderRadius: "var(--radius-sm)",
                  padding: "10px 14px",
                  fontSize: "12px",
                  color: "#2e8b57",
                  marginBottom: "20px",
                }}
              >
                ✓ Le client retrouvera l'accès complet à la plateforme.
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
                onClick={() => setShowBlockModal(false)}
                style={btnStyle("ghost")}
              >
                Annuler
              </button>
              <button
                onClick={toggleBlocage}
                style={btnStyle(
                  client.statut === "bloqué" ? "success" : "error"
                )}
              >
                {client.statut === "bloqué"
                  ? "Confirmer le déblocage"
                  : "Confirmer le blocage"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal : Signalement ── */}
      {showSignalModal && client && (
        <div style={overlayStyle} onClick={() => setShowSignalModal(false)}>
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
              Signaler le client
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "20px",
              }}
            >
              {client.nom} · {client.signalements} signalement(s) existant(s)
            </p>
            <label style={labelStyle}>Motif du signalement *</label>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                marginBottom: "12px",
              }}
            >
              {[
                "Chargeback abusif",
                "Comportement inapproprié envers la boutique",
                "Tentative de fraude",
                "Faux avis ou signalement",
                "Multiples retours injustifiés",
              ].map((m) => (
                <button
                  key={m}
                  onClick={() => setSignalMotif(m)}
                  style={{
                    textAlign: "left",
                    padding: "9px 12px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "13px",
                    border: `1.5px solid ${
                      signalMotif === m ? "#c0392b" : "var(--white-3)"
                    }`,
                    background: signalMotif === m ? "#fef2f2" : "transparent",
                    color: signalMotif === m ? "#c0392b" : "var(--noir)",
                    cursor: "pointer",
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
            <textarea
              value={signalMotif}
              onChange={(e) => setSignalMotif(e.target.value)}
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
                onClick={() => setShowSignalModal(false)}
                style={btnStyle("ghost")}
              >
                Annuler
              </button>
              <button onClick={signalerClient} style={btnStyle("error")}>
                Enregistrer le signalement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helpers UI ─────────────────────────────────────────────
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

function InfoRow({ label, val, mono }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "8px",
        gap: "16px",
      }}
    >
      <span style={{ fontSize: "12px", color: "var(--gray)", flexShrink: 0 }}>
        {label}
      </span>
      <span
        style={{
          fontSize: "12px",
          fontWeight: "500",
          color: "var(--noir)",
          textAlign: "right",
          fontFamily: mono ? "monospace" : "inherit",
        }}
      >
        {val}
      </span>
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
    warning: {
      background: "#faeeda",
      color: "#b7770d",
      border: "1.5px solid #fde68a",
    },
  };
  return {
    padding: "8px 14px",
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
const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--gray)",
  marginBottom: "8px",
};
