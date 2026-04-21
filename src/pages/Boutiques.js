import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useDemandes } from "../context/DemandesContext";

// ── Data ───────────────────────────────────────────────────
const BOUTIQUES = [
  {
    id: 1,
    name: "Sandro Paris",
    email: "contact@sandro.fr",
    abonnement: "prestige",
    statut: "active",
    ca: 28400,
    orders: 142,
    note: 4.9,
    ville: "Paris 8e",
    dateInscription: "12/01/2026",
    responsable: "Marie Leclerc",
    telephone: "+33 1 45 67 89 00",
    iban: "FR76 3000 6000 0123 4567 890 89",
    delaiPrep: "10 min",
    tauxLivraison: 96,
    siret: "44123456700001",
  },
  {
    id: 2,
    name: "AMI Paris",
    email: "ami@amiparis.fr",
    abonnement: "signature",
    statut: "active",
    ca: 19800,
    orders: 98,
    note: 4.7,
    ville: "Paris 3e",
    dateInscription: "18/01/2026",
    responsable: "Alexandre M.",
    telephone: "+33 1 44 78 90 12",
    iban: "FR76 3000 6000 0987 6543 210 34",
    delaiPrep: "12 min",
    tauxLivraison: 94,
    siret: "77234567800023",
  },
  {
    id: 3,
    name: "Isabel Marant",
    email: "contact@isabel.fr",
    abonnement: "signature",
    statut: "inactive",
    ca: 15200,
    orders: 76,
    note: 4.8,
    ville: "Paris 11e",
    dateInscription: "25/01/2026",
    responsable: "Julie D.",
    telephone: "+33 1 43 55 67 89",
    iban: "FR76 3000 6000 0456 7890 123 45",
    delaiPrep: "15 min",
    tauxLivraison: 89,
    siret: "55345678900034",
  },
  {
    id: 4,
    name: "By Terry",
    email: "hello@byterry.fr",
    abonnement: "classic",
    statut: "active",
    ca: 9600,
    orders: 54,
    note: 4.6,
    ville: "Paris 1er",
    dateInscription: "02/02/2026",
    responsable: "Terry B.",
    telephone: "+33 1 42 60 52 31",
    iban: "FR76 3000 6000 0111 2222 333 44",
    delaiPrep: "8 min",
    tauxLivraison: 92,
    siret: "33456789000045",
  },
  {
    id: 5,
    name: "Rouje",
    email: "bonjour@rouje.com",
    abonnement: "classic",
    statut: "pending",
    ca: 0,
    orders: 0,
    note: 0,
    ville: "Paris 6e",
    dateInscription: "08/04/2026",
    responsable: "Jeanne D.",
    telephone: "+33 6 78 90 12 34",
    iban: "",
    delaiPrep: "—",
    tauxLivraison: 0,
    siret: "88123456700012",
  },
];

// Produits par boutique
const PRODUITS_B = {
  1: [
    {
      id: "SP-001",
      nom: "Robe Midi Fleurie",
      prix: 245,
      stock: 8,
      categorie: "Mode",
      statut: "actif",
    },
    {
      id: "SP-002",
      nom: "Trench Camel",
      prix: 390,
      stock: 3,
      categorie: "Mode",
      statut: "actif",
    },
    {
      id: "SP-003",
      nom: "Blazer Structuré Noir",
      prix: 280,
      stock: 0,
      categorie: "Mode",
      statut: "inactif",
    },
    {
      id: "SP-004",
      nom: "Sac Cabas Cuir Camel",
      prix: 490,
      stock: 5,
      categorie: "Accessoires",
      statut: "actif",
    },
    {
      id: "SP-005",
      nom: "Foulard Soie Imprimé",
      prix: 120,
      stock: 12,
      categorie: "Accessoires",
      statut: "actif",
    },
  ],
  2: [
    {
      id: "AMI-001",
      nom: "Pull Alexandre",
      prix: 295,
      stock: 6,
      categorie: "Mode",
      statut: "actif",
    },
    {
      id: "AMI-002",
      nom: "Veste Tailleur",
      prix: 480,
      stock: 2,
      categorie: "Mode",
      statut: "actif",
    },
    {
      id: "AMI-003",
      nom: "T-shirt Logo AMI",
      prix: 120,
      stock: 15,
      categorie: "Mode",
      statut: "actif",
    },
  ],
  3: [
    {
      id: "IM-001",
      nom: "Robe Milena",
      prix: 450,
      stock: 4,
      categorie: "Mode",
      statut: "actif",
    },
    {
      id: "IM-002",
      nom: "Sneakers Étoile",
      prix: 280,
      stock: 7,
      categorie: "Mode",
      statut: "actif",
    },
    {
      id: "IM-003",
      nom: "Blouson Denim",
      prix: 390,
      stock: 0,
      categorie: "Mode",
      statut: "inactif",
    },
  ],
  4: [
    {
      id: "BT-001",
      nom: "Rouge Terrybly #302",
      prix: 42,
      stock: 20,
      categorie: "Beauté",
      statut: "actif",
    },
    {
      id: "BT-002",
      nom: "Sérum Éclat Visage",
      prix: 98,
      stock: 11,
      categorie: "Beauté",
      statut: "actif",
    },
    {
      id: "BT-003",
      nom: "Palette Yeux Or",
      prix: 65,
      stock: 8,
      categorie: "Beauté",
      statut: "actif",
    },
  ],
  5: [],
};

// Commandes par boutique
const COMMANDES_B = {
  1: [
    {
      id: "LV-00412",
      client: "Sophie M.",
      montant: 490,
      statut: "bloquée",
      date: "20/04/2026",
    },
    {
      id: "LV-00360",
      client: "Sophie M.",
      montant: 198,
      statut: "livrée",
      date: "28/03/2026",
    },
    {
      id: "LV-00310",
      client: "Emma B.",
      montant: 390,
      statut: "livrée",
      date: "10/03/2026",
    },
    {
      id: "LV-00245",
      client: "Karim T.",
      montant: 280,
      statut: "livrée",
      date: "02/02/2026",
    },
    {
      id: "LV-00198",
      client: "Yasmine B.",
      montant: 490,
      statut: "retour",
      date: "15/01/2026",
    },
  ],
  2: [
    {
      id: "LV-00411",
      client: "Karim T.",
      montant: 1079,
      statut: "livrée",
      date: "09/04/2026",
    },
    {
      id: "LV-00398",
      client: "Lucas D.",
      montant: 290,
      statut: "retour",
      date: "01/04/2026",
    },
    {
      id: "LV-00350",
      client: "Emma B.",
      montant: 480,
      statut: "livrée",
      date: "18/03/2026",
    },
  ],
  3: [
    {
      id: "LV-00410",
      client: "Yasmine B.",
      montant: 450,
      statut: "livrée",
      date: "09/04/2026",
    },
    {
      id: "LV-00390",
      client: "Yasmine B.",
      montant: 450,
      statut: "retour",
      date: "14/04/2026",
    },
  ],
  4: [
    {
      id: "LV-00409",
      client: "Lucas D.",
      montant: 280,
      statut: "livrée",
      date: "08/04/2026",
    },
    {
      id: "LV-00385",
      client: "Sophie M.",
      montant: 42,
      statut: "livrée",
      date: "22/03/2026",
    },
  ],
  5: [],
};

// Clients par boutique (clients ayant commandé)
const CLIENTS_B = {
  1: [
    {
      nom: "Sophie M.",
      commandes: 3,
      total: 1168,
      derniere: "20/04/2026",
      note: 5.0,
    },
    {
      nom: "Emma B.",
      commandes: 1,
      total: 390,
      derniere: "10/03/2026",
      note: 4.5,
    },
    {
      nom: "Karim T.",
      commandes: 1,
      total: 280,
      derniere: "02/02/2026",
      note: 4.8,
    },
    {
      nom: "Yasmine B.",
      commandes: 1,
      total: 490,
      derniere: "15/01/2026",
      note: 3.5,
    },
  ],
  2: [
    {
      nom: "Karim T.",
      commandes: 2,
      total: 1369,
      derniere: "09/04/2026",
      note: 4.9,
    },
    {
      nom: "Lucas D.",
      commandes: 1,
      total: 290,
      derniere: "01/04/2026",
      note: 4.2,
    },
    {
      nom: "Emma B.",
      commandes: 1,
      total: 480,
      derniere: "18/03/2026",
      note: 4.7,
    },
  ],
  3: [
    {
      nom: "Yasmine B.",
      commandes: 2,
      total: 900,
      derniere: "14/04/2026",
      note: 4.5,
    },
  ],
  4: [
    {
      nom: "Lucas D.",
      commandes: 1,
      total: 280,
      derniere: "08/04/2026",
      note: 4.6,
    },
    {
      nom: "Sophie M.",
      commandes: 1,
      total: 42,
      derniere: "22/03/2026",
      note: 5.0,
    },
  ],
  5: [],
};

const ABONNEMENT_CFG = {
  classic: {
    label: "Classic",
    color: "#6B7280",
    bg: "rgba(107,114,128,0.1)",
    quota: 30,
  },
  signature: {
    label: "Signature",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.1)",
    quota: 100,
  },
  prestige: {
    label: "Prestige",
    color: "#C9A96E",
    bg: "rgba(201,169,110,0.1)",
    quota: 300,
  },
};

const STATUT_CFG = {
  active: { label: "Active", color: "#2e8b57", bg: "#e8f5ee", dot: "#10B981" },
  inactive: {
    label: "Inactive",
    color: "#c0392b",
    bg: "#fef2f2",
    dot: "#EF4444",
  },
  pending: {
    label: "En attente",
    color: "#b7770d",
    bg: "#faeeda",
    dot: "#F59E0B",
  },
  suspended: {
    label: "Suspendue",
    color: "#6B7280",
    bg: "#f3f4f6",
    dot: "#9CA3AF",
  },
};

const CMD_STATUT = {
  livrée: { color: "#2e8b57", bg: "#e8f5ee" },
  bloquée: { color: "#c0392b", bg: "#fef2f2" },
  retour: { color: "#b7770d", bg: "#faeeda" },
  "en cours": { color: "#185fa5", bg: "#eff6ff" },
};

export default function Boutiques() {
  const { admin } = useAuth();
  const { ajouterDemande } = useDemandes();
  const role = admin?.role || "admin";
  const isAdmin = role === "admin" || role === "superadmin";

  const [boutiques, setBoutiques] = useState(BOUTIQUES);
  const [selected, setSelected] = useState(null);
  const [onglet, setOnglet] = useState("infos");
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState("all");
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [msgTarget, setMsgTarget] = useState(null);
  const [showDemandeModal, setShowDemandeModal] = useState(false);
  const [demandeMotif, setDemandeMotif] = useState("");
  const [demandeCible, setDemandeCible] = useState(null);

  const filtered = boutiques.filter(
    (b) =>
      (filterStatut === "all" || b.statut === filterStatut) &&
      (b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.ville.toLowerCase().includes(search.toLowerCase()))
  );

  const b = boutiques.find((x) => x.id === selected);
  const produits = PRODUITS_B[selected] || [];
  const commandes = COMMANDES_B[selected] || [];
  const clients = CLIENTS_B[selected] || [];
  const ab = b ? ABONNEMENT_CFG[b.abonnement] : null;

  const stats = {
    active: boutiques.filter((x) => x.statut === "active").length,
    inactive: boutiques.filter((x) => x.statut === "inactive").length,
    pending: boutiques.filter((x) => x.statut === "pending").length,
  };

  const changeStatut = (id, newStatut) => {
    setBoutiques((prev) =>
      prev.map((x) => (x.id === id ? { ...x, statut: newStatut } : x))
    );
    toast.success(
      {
        active: "Boutique réactivée ✓",
        inactive: "Boutique désactivée",
        suspended: "Boutique suspendue",
      }[newStatut] || "Statut mis à jour"
    );
  };

  const demanderSuspension = () => {
    if (!demandeMotif.trim()) {
      toast.error("Motif obligatoire");
      return;
    }
    const bt = boutiques.find((x) => x.id === demandeCible);
    ajouterDemande({
      type: "suspension_boutique",
      cible: bt?.name,
      cibleId: demandeCible,
      motif: demandeMotif,
      demandePar: admin?.name || role,
      role,
    });
    setShowDemandeModal(false);
    setDemandeMotif("");
    setDemandeCible(null);
    toast.success("Demande de suspension envoyée à l'admin");
  };

  const ouvrirDemandeSuspension = (id) => {
    setDemandeCible(id);
    setShowDemandeModal(true);
  };

  return (
    <div className="page" style={{ padding: "32px 36px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "24px",
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
            Boutiques & Marques
          </h1>
        </div>
      </div>

      {/* KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {[
          {
            label: "Total boutiques",
            val: boutiques.length,
            color: "var(--noir)",
          },
          { label: "Actives", val: stats.active, color: "#2e8b57" },
          { label: "Inactives", val: stats.inactive, color: "#c0392b" },
          { label: "En attente", val: stats.pending, color: "#b7770d" },
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
                marginBottom: "6px",
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
          gridTemplateColumns: selected ? "320px 1fr" : "1fr",
          gap: "20px",
        }}
      >
        {/* Liste boutiques */}
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
              padding: "12px 16px",
              borderBottom: "1px solid var(--white-3)",
            }}
          >
            <input
              type="text"
              placeholder="Rechercher une boutique…"
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
                marginBottom: "8px",
              }}
            />
            <div style={{ display: "flex", gap: "5px" }}>
              {["all", "active", "inactive", "pending", "suspended"].map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatut(s)}
                    style={{
                      padding: "3px 10px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: "600",
                      cursor: "pointer",
                      border: `1.5px solid ${
                        filterStatut === s ? "var(--gold)" : "var(--white-3)"
                      }`,
                      background:
                        filterStatut === s
                          ? "rgba(201,169,110,0.08)"
                          : "transparent",
                      color:
                        filterStatut === s ? "var(--gold-dark)" : "var(--gray)",
                    }}
                  >
                    {s === "all" ? "Toutes" : STATUT_CFG[s]?.label || s}
                  </button>
                )
              )}
            </div>
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
                {["Boutique", "Plan", "CA", "Cmds", "Note", "Statut", ""].map(
                  (h) => (
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
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((bt) => {
                const sc = STATUT_CFG[bt.statut];
                const ac = ABONNEMENT_CFG[bt.abonnement];
                const isActive = selected === bt.id;
                return (
                  <tr
                    key={bt.id}
                    onClick={() => {
                      setSelected(isActive ? null : bt.id);
                      setOnglet("infos");
                    }}
                    style={{
                      borderBottom: "1px solid var(--white-3)",
                      cursor: "pointer",
                      background: isActive
                        ? "rgba(201,169,110,0.04)"
                        : "transparent",
                      transition: "background 0.15s",
                    }}
                  >
                    <td style={{ padding: "13px 14px" }}>
                      <div style={{ fontWeight: "600" }}>{bt.name}</div>
                      <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                        {bt.ville}
                      </div>
                    </td>
                    <td style={{ padding: "13px 14px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          background: ac.bg,
                          color: ac.color,
                        }}
                      >
                        {ac.label}
                      </span>
                    </td>
                    <td style={{ padding: "13px 14px", fontWeight: "600" }}>
                      {bt.ca > 0 ? `${bt.ca.toLocaleString("fr-FR")}€` : "—"}
                    </td>
                    <td style={{ padding: "13px 14px", color: "var(--gray)" }}>
                      {bt.orders}
                    </td>
                    <td
                      style={{
                        padding: "13px 14px",
                        color: "#b7770d",
                        fontWeight: "600",
                      }}
                    >
                      {bt.note > 0 ? `★ ${bt.note}` : "—"}
                    </td>
                    <td style={{ padding: "13px 14px" }}>
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
                    <td style={{ padding: "13px 14px" }}>
                      <div style={{ display: "flex", gap: "4px" }}>
                        {bt.statut === "active" &&
                          (isAdmin ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                changeStatut(bt.id, "suspended");
                              }}
                              style={btnSm("error")}
                            >
                              Suspendre
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                ouvrirDemandeSuspension(bt.id);
                              }}
                              style={btnSm("warn")}
                            >
                              ⚑ Demander
                            </button>
                          ))}
                        {(bt.statut === "inactive" ||
                          bt.statut === "suspended") &&
                          isAdmin && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                changeStatut(bt.id, "active");
                              }}
                              style={btnSm("success")}
                            >
                              Réactiver
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* FICHE BOUTIQUE avec onglets */}
        {b && (
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
            {/* Header fiche */}
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid var(--white-3)",
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
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "26px",
                      fontWeight: "300",
                      marginBottom: "6px",
                    }}
                  >
                    {b.name}
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
                        background: STATUT_CFG[b.statut].bg,
                        color: STATUT_CFG[b.statut].color,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: STATUT_CFG[b.statut].dot,
                        }}
                      />
                      {STATUT_CFG[b.statut].label}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        background: ab.bg,
                        color: ab.color,
                      }}
                    >
                      {ab.label}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--gray)",
                        padding: "3px 8px",
                      }}
                    >
                      📍 {b.ville}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => {
                      setMsgTarget(b);
                      setShowMsgModal(true);
                    }}
                    style={bStyle("ghost")}
                  >
                    💬 Message
                  </button>
                  {b.statut === "active" &&
                    (isAdmin ? (
                      <button
                        onClick={() => changeStatut(b.id, "suspended")}
                        style={bStyle("error")}
                      >
                        Suspendre
                      </button>
                    ) : (
                      <button
                        onClick={() => ouvrirDemandeSuspension(b.id)}
                        style={bStyle("warn")}
                      >
                        ⚑ Demander suspension
                      </button>
                    ))}
                  {(b.statut === "inactive" || b.statut === "suspended") &&
                    isAdmin && (
                      <button
                        onClick={() => changeStatut(b.id, "active")}
                        style={bStyle("success")}
                      >
                        Réactiver
                      </button>
                    )}
                  <button
                    onClick={() => setSelected(null)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "16px",
                      color: "var(--gray)",
                      padding: "4px",
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Onglets */}
              <div
                style={{
                  display: "flex",
                  gap: "0",
                  borderBottom: "1px solid var(--white-3)",
                  marginBottom: "-1px",
                }}
              >
                {[
                  { id: "infos", label: "Informations" },
                  { id: "produits", label: `Produits (${produits.length})` },
                  { id: "commandes", label: `Commandes (${commandes.length})` },
                  { id: "clients", label: `Clients (${clients.length})` },
                  { id: "ca", label: "CA & Finance" },
                ].map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setOnglet(o.id)}
                    style={{
                      padding: "8px 16px",
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

            {/* Contenu onglets */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
              {/* ── Infos ── */}
              {onglet === "infos" && (
                <div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                      marginBottom: "20px",
                    }}
                  >
                    {[
                      { label: "Responsable", val: b.responsable },
                      { label: "Email", val: b.email },
                      { label: "Téléphone", val: b.telephone },
                      { label: "SIRET", val: b.siret, mono: true },
                      { label: "Date inscription", val: b.dateInscription },
                      { label: "Délai préparation", val: b.delaiPrep },
                      {
                        label: "Taux de livraison",
                        val: b.tauxLivraison > 0 ? `${b.tauxLivraison}%` : "—",
                      },
                      {
                        label: "IBAN",
                        val: b.iban || "Non renseigné",
                        mono: true,
                      },
                    ].map((r) => (
                      <div
                        key={r.label}
                        style={{
                          background: "var(--gray-bg)",
                          borderRadius: "var(--radius-sm)",
                          padding: "11px 14px",
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
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: "500",
                            fontFamily: r.mono ? "monospace" : "inherit",
                            color:
                              r.val === "Non renseigné"
                                ? "var(--gray-light)"
                                : "var(--noir)",
                            fontSize: r.mono ? "11px" : "13px",
                          }}
                        >
                          {r.val}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Quota produits */}
                  <div
                    style={{
                      background: "var(--gray-bg)",
                      borderRadius: "var(--radius-md)",
                      padding: "14px 16px",
                      border: "1px solid var(--white-3)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--gray)",
                          fontWeight: "500",
                        }}
                      >
                        Quota produits — plan {ab.label}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: ab.color,
                        }}
                      >
                        {produits.length} / {ab.quota}
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
                          width: `${Math.min(
                            (produits.length / ab.quota) * 100,
                            100
                          )}%`,
                          background:
                            produits.length / ab.quota > 0.9
                              ? "#c0392b"
                              : ab.color,
                          borderRadius: "8px",
                          transition: "width 0.4s",
                        }}
                      />
                    </div>
                    {produits.length / ab.quota > 0.9 && (
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#c0392b",
                          fontWeight: "600",
                          marginTop: "6px",
                        }}
                      >
                        ⚠ Quota presque atteint
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Produits ── */}
              {onglet === "produits" && (
                <div>
                  {produits.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "var(--gray)",
                      }}
                    >
                      <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                        📦
                      </div>
                      <div>Aucun produit</div>
                    </div>
                  ) : (
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
                            "Produit",
                            "Catégorie",
                            "Prix",
                            "Stock",
                            "Statut",
                          ].map((h) => (
                            <th
                              key={h}
                              style={{
                                padding: "9px 12px",
                                textAlign: "left",
                                fontSize: "10px",
                                fontWeight: "700",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                color: "var(--gray)",
                                borderBottom: "1px solid var(--white-3)",
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {produits.map((p) => (
                          <tr
                            key={p.id}
                            style={{ borderBottom: "1px solid var(--white-3)" }}
                          >
                            <td
                              style={{
                                padding: "11px 12px",
                                fontFamily: "monospace",
                                fontSize: "11px",
                                color: "var(--gold-dark)",
                                fontWeight: "600",
                              }}
                            >
                              {p.id}
                            </td>
                            <td
                              style={{
                                padding: "11px 12px",
                                fontWeight: "500",
                              }}
                            >
                              {p.nom}
                            </td>
                            <td style={{ padding: "11px 12px" }}>
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: "600",
                                  padding: "2px 8px",
                                  borderRadius: "10px",
                                  background: "var(--gray-bg)",
                                  color: "var(--gray)",
                                  border: "1px solid var(--white-3)",
                                }}
                              >
                                {p.categorie}
                              </span>
                            </td>
                            <td
                              style={{
                                padding: "11px 12px",
                                fontWeight: "600",
                              }}
                            >
                              {p.prix}€
                            </td>
                            <td
                              style={{
                                padding: "11px 12px",
                                color:
                                  p.stock === 0
                                    ? "#c0392b"
                                    : p.stock < 5
                                    ? "#b7770d"
                                    : "#2e8b57",
                                fontWeight: "600",
                              }}
                            >
                              {p.stock === 0 ? "Rupture" : p.stock}
                            </td>
                            <td style={{ padding: "11px 12px" }}>
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: "600",
                                  padding: "2px 8px",
                                  borderRadius: "10px",
                                  background:
                                    p.statut === "actif"
                                      ? "#e8f5ee"
                                      : "#f3f4f6",
                                  color:
                                    p.statut === "actif"
                                      ? "#2e8b57"
                                      : "#6B7280",
                                }}
                              >
                                {p.statut === "actif" ? "Actif" : "Inactif"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* ── Commandes ── */}
              {onglet === "commandes" && (
                <div>
                  {commandes.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "var(--gray)",
                      }}
                    >
                      <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                        🛍️
                      </div>
                      <div>Aucune commande</div>
                    </div>
                  ) : (
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
                            "Commande",
                            "Client",
                            "Montant",
                            "Date",
                            "Statut",
                          ].map((h) => (
                            <th
                              key={h}
                              style={{
                                padding: "9px 12px",
                                textAlign: "left",
                                fontSize: "10px",
                                fontWeight: "700",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                color: "var(--gray)",
                                borderBottom: "1px solid var(--white-3)",
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {commandes.map((c) => {
                          const cs = CMD_STATUT[c.statut] || {
                            color: "#6B7280",
                            bg: "#f3f4f6",
                          };
                          return (
                            <tr
                              key={c.id}
                              style={{
                                borderBottom: "1px solid var(--white-3)",
                              }}
                            >
                              <td
                                style={{
                                  padding: "11px 12px",
                                  fontFamily: "monospace",
                                  fontSize: "11px",
                                  color: "var(--gold-dark)",
                                  fontWeight: "700",
                                }}
                              >
                                {c.id}
                              </td>
                              <td
                                style={{
                                  padding: "11px 12px",
                                  fontWeight: "500",
                                }}
                              >
                                {c.client}
                              </td>
                              <td
                                style={{
                                  padding: "11px 12px",
                                  fontWeight: "700",
                                }}
                              >
                                {c.montant}€
                              </td>
                              <td
                                style={{
                                  padding: "11px 12px",
                                  fontSize: "12px",
                                  color: "var(--gray)",
                                }}
                              >
                                {c.date}
                              </td>
                              <td style={{ padding: "11px 12px" }}>
                                <span
                                  style={{
                                    fontSize: "11px",
                                    fontWeight: "600",
                                    padding: "2px 8px",
                                    borderRadius: "10px",
                                    background: cs.bg,
                                    color: cs.color,
                                  }}
                                >
                                  {c.statut}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* ── Clients ── */}
              {onglet === "clients" && (
                <div>
                  {clients.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "var(--gray)",
                      }}
                    >
                      <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                        👥
                      </div>
                      <div>Aucun client</div>
                    </div>
                  ) : (
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
                            "Client",
                            "Commandes",
                            "Total dépensé",
                            "Dernière commande",
                            "Note moyenne",
                          ].map((h) => (
                            <th
                              key={h}
                              style={{
                                padding: "9px 12px",
                                textAlign: "left",
                                fontSize: "10px",
                                fontWeight: "700",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                color: "var(--gray)",
                                borderBottom: "1px solid var(--white-3)",
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {clients
                          .sort((a, z) => z.total - a.total)
                          .map((c, i) => (
                            <tr
                              key={c.nom}
                              style={{
                                borderBottom: "1px solid var(--white-3)",
                              }}
                            >
                              <td style={{ padding: "11px 12px" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  {i === 0 && (
                                    <span style={{ fontSize: "12px" }}>🥇</span>
                                  )}
                                  <span style={{ fontWeight: "600" }}>
                                    {c.nom}
                                  </span>
                                </div>
                              </td>
                              <td
                                style={{
                                  padding: "11px 12px",
                                  color: "var(--gray)",
                                }}
                              >
                                {c.commandes}
                              </td>
                              <td
                                style={{
                                  padding: "11px 12px",
                                  fontWeight: "700",
                                  color: "var(--gold-dark)",
                                }}
                              >
                                {c.total.toLocaleString("fr-FR")}€
                              </td>
                              <td
                                style={{
                                  padding: "11px 12px",
                                  fontSize: "12px",
                                  color: "var(--gray)",
                                }}
                              >
                                {c.derniere}
                              </td>
                              <td
                                style={{
                                  padding: "11px 12px",
                                  color: "#b7770d",
                                  fontWeight: "600",
                                }}
                              >
                                ★ {c.note}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* ── CA & Finance ── */}
              {onglet === "ca" && (
                <div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "12px",
                      marginBottom: "20px",
                    }}
                  >
                    {[
                      {
                        label: "CA brut total",
                        val:
                          b.ca > 0 ? `${b.ca.toLocaleString("fr-FR")}€` : "—",
                        color: "var(--gold-dark)",
                      },
                      {
                        label: "Commission LIVRR (20%)",
                        val:
                          b.ca > 0
                            ? `${Math.round(b.ca * 0.2).toLocaleString(
                                "fr-FR"
                              )}€`
                            : "—",
                        color: "#c0392b",
                      },
                      {
                        label: "Net boutique (80%)",
                        val:
                          b.ca > 0
                            ? `${Math.round(b.ca * 0.8).toLocaleString(
                                "fr-FR"
                              )}€`
                            : "—",
                        color: "#2e8b57",
                      },
                      {
                        label: "Commandes totales",
                        val: b.orders,
                        color: "#185fa5",
                      },
                      {
                        label: "Panier moyen",
                        val:
                          b.orders > 0 && b.ca > 0
                            ? `${Math.round(b.ca / b.orders)}€`
                            : "—",
                        color: "var(--noir)",
                      },
                      {
                        label: "Taux de livraison",
                        val: b.tauxLivraison > 0 ? `${b.tauxLivraison}%` : "—",
                        color:
                          b.tauxLivraison >= 95
                            ? "#2e8b57"
                            : b.tauxLivraison >= 90
                            ? "#b7770d"
                            : "#c0392b",
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        style={{
                          background: "var(--gray-bg)",
                          borderRadius: "var(--radius-sm)",
                          padding: "14px 16px",
                          border: "1px solid var(--white-3)",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "10px",
                            fontWeight: "700",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: "var(--gray)",
                            marginBottom: "6px",
                          }}
                        >
                          {s.label}
                        </div>
                        <div
                          style={{
                            fontSize: "22px",
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
                  <div
                    style={{
                      background: "#fffbeb",
                      border: "1px solid #fde68a",
                      borderRadius: "var(--radius-md)",
                      padding: "12px 16px",
                      fontSize: "12px",
                      color: "#b7770d",
                      lineHeight: 1.6,
                    }}
                  >
                    ℹ️ Les données financières sont calculées sur la totalité de
                    la période d'activité de la boutique. Pour un export
                    détaillé, rendez-vous dans Finance → Commissions & CA.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal message */}
      {showMsgModal && (
        <div style={OVL} onClick={() => setShowMsgModal(false)}>
          <div style={MDL} onClick={(e) => e.stopPropagation()}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "26px",
                fontWeight: "300",
                marginBottom: "6px",
              }}
            >
              Message à {msgTarget?.name}
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "16px",
              }}
            >
              {msgTarget?.email}
            </p>
            <textarea
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              placeholder="Votre message…"
              rows={5}
              autoFocus
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1.5px solid var(--white-3)",
                borderRadius: "var(--radius-sm)",
                fontSize: "13px",
                resize: "none",
                outline: "none",
                marginBottom: "16px",
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
                onClick={() => setShowMsgModal(false)}
                style={bStyle("ghost")}
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  toast.success(`Message envoyé à ${msgTarget?.name}`);
                  setShowMsgModal(false);
                  setMsgText("");
                }}
                style={bStyle("gold")}
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal demande suspension */}
      {showDemandeModal && (
        <div style={OVL} onClick={() => setShowDemandeModal(false)}>
          <div
            style={{ ...MDL, width: "480px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "26px",
                fontWeight: "300",
                marginBottom: "6px",
              }}
            >
              Demande de suspension
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "16px",
              }}
            >
              {boutiques.find((x) => x.id === demandeCible)?.name}
            </p>
            <div
              style={{
                background: "#faeeda",
                border: "1px solid #fde68a",
                borderRadius: "var(--radius-sm)",
                padding: "10px 14px",
                fontSize: "12px",
                color: "#b7770d",
                marginBottom: "14px",
              }}
            >
              ⚑ La suspension sera appliquée uniquement après validation par
              l'Admin Plateforme.
            </div>
            <label style={LBL}>Motif *</label>
            <textarea
              value={demandeMotif}
              onChange={(e) => setDemandeMotif(e.target.value)}
              placeholder="Expliquez pourquoi…"
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
                onClick={() => {
                  setShowDemandeModal(false);
                  setDemandeMotif("");
                }}
                style={bStyle("ghost")}
              >
                Annuler
              </button>
              <button
                onClick={demanderSuspension}
                style={{
                  padding: "9px 16px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  background: "#b7770d",
                  color: "#fff",
                  border: "none",
                }}
              >
                Envoyer à l'admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function bStyle(t) {
  const s = {
    gold: { background: "var(--noir)", color: "var(--gold)", border: "none" },
    ghost: {
      background: "transparent",
      color: "var(--gray)",
      border: "1.5px solid var(--white-3)",
    },
    error: {
      background: "#fef2f2",
      color: "#c0392b",
      border: "1.5px solid #fecaca",
    },
    success: {
      background: "#e8f5ee",
      color: "#2e8b57",
      border: "1.5px solid #bbf7d0",
    },
    warn: {
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
    ...s[t],
  };
}
function btnSm(t) {
  const s = {
    error: {
      background: "#fef2f2",
      color: "#c0392b",
      border: "1px solid #fecaca",
    },
    success: {
      background: "#e8f5ee",
      color: "#2e8b57",
      border: "1px solid #bbf7d0",
    },
    warn: {
      background: "#faeeda",
      color: "#b7770d",
      border: "1px solid #fde68a",
    },
  };
  return {
    padding: "4px 10px",
    borderRadius: "var(--radius-sm)",
    fontSize: "11px",
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
