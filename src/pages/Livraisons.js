import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

// ── Mock Data ──────────────────────────────────────────────
const PARTENAIRES = {
  coursier_fr: {
    nom: "Coursier.fr",
    statut: "connecté",
    color: "#2e8b57",
    latence: "42ms",
  },
  top_chrono: {
    nom: "Top Chrono",
    statut: "connecté",
    color: "#2e8b57",
    latence: "67ms",
  },
};

const COURSIERS_DATA = [
  {
    id: 1,
    nom: "Karim M.",
    telephone: "+33 6 11 22 33 44",
    note: 4.9,
    total: 312,
    partenaire: "coursier_fr",
    statut: "en_course",
    avatar: "K",
    livActive: 2,
  },
  {
    id: 2,
    nom: "Yacine B.",
    telephone: "+33 6 55 66 77 88",
    note: 4.7,
    total: 198,
    partenaire: "coursier_fr",
    statut: "disponible",
    avatar: "Y",
    livActive: 0,
  },
  {
    id: 3,
    nom: "Thomas R.",
    telephone: "+33 6 99 88 77 66",
    note: 4.8,
    total: 245,
    partenaire: "top_chrono",
    statut: "en_course",
    avatar: "T",
    livActive: 1,
  },
  {
    id: 4,
    nom: "Mehdi S.",
    telephone: "+33 6 33 44 55 66",
    note: 4.6,
    total: 156,
    partenaire: "top_chrono",
    statut: "pause",
    avatar: "M",
    livActive: 0,
  },
  {
    id: 5,
    nom: "Lucas P.",
    telephone: "+33 6 77 11 22 33",
    note: 4.5,
    total: 89,
    partenaire: "coursier_fr",
    statut: "disponible",
    avatar: "L",
    livActive: 0,
  },
];

const LIVRAISONS_DATA = [
  {
    id: "LIV-001",
    commande: "LV-00412",
    client: "Sophie M.",
    boutique: "Sandro Paris",
    adresse: "42 Av. Montaigne, 75008",
    coursier: 1,
    statut: "en_route",
    tempsEstime: "8 min",
    heurePrise: "14:12",
    heureEstimee: "14:20",
    total: 490,
    articles: "Robe Midi × 1",
    partenaire: "coursier_fr",
    incident: null,
  },
  {
    id: "LIV-002",
    commande: "LV-00411",
    client: "Karim T.",
    boutique: "AMI Paris",
    adresse: "12 Place Vendôme, 75001",
    coursier: 3,
    statut: "en_route",
    tempsEstime: "14 min",
    heurePrise: "14:05",
    heureEstimee: "14:19",
    total: 1079,
    articles: "Pull Alexandre × 1",
    partenaire: "top_chrono",
    incident: null,
  },
  {
    id: "LIV-003",
    commande: "LV-00410",
    client: "Yasmine B.",
    boutique: "Isabel Marant",
    adresse: "8 Rue du Bac, 75007",
    coursier: null,
    statut: "prete",
    tempsEstime: "—",
    heurePrise: "14:18",
    heureEstimee: "—",
    total: 450,
    articles: "Robe Milena × 1",
    partenaire: null,
    incident: null,
  },
  {
    id: "LIV-004",
    commande: "LV-00409",
    client: "Lucas D.",
    boutique: "By Terry",
    adresse: "3 Rue Royale, 75008",
    coursier: 1,
    statut: "bloquée",
    tempsEstime: "—",
    heurePrise: "13:50",
    heureEstimee: "14:05",
    total: 280,
    articles: "Rouge Terrybly × 1",
    partenaire: "coursier_fr",
    incident: "Coursier introuvable depuis 45 min",
  },
  {
    id: "LIV-005",
    commande: "LV-00408",
    client: "Emma B.",
    boutique: "AMI Paris",
    adresse: "55 Rue de Rivoli, 75001",
    coursier: 2,
    statut: "en_route",
    tempsEstime: "22 min",
    heurePrise: "14:00",
    heureEstimee: "14:22",
    total: 320,
    articles: "Veste Tailleur × 1",
    partenaire: "coursier_fr",
    incident: null,
  },
  {
    id: "LIV-006",
    commande: "LV-00407",
    client: "Nadia S.",
    boutique: "Sandro Paris",
    adresse: "18 Bd Haussmann, 75009",
    coursier: 3,
    statut: "livrée",
    tempsEstime: "Livrée",
    heurePrise: "13:20",
    heureEstimee: "13:45",
    total: 890,
    articles: "Sac Cabas × 1",
    partenaire: "top_chrono",
    incident: null,
  },
  {
    id: "LIV-007",
    commande: "LV-00406",
    client: "Julie P.",
    boutique: "Sandro Paris",
    adresse: "7 Av. de l'Opéra, 75001",
    coursier: 4,
    statut: "livrée",
    tempsEstime: "Livrée",
    heurePrise: "13:10",
    heureEstimee: "13:38",
    total: 245,
    articles: "Foulard × 2",
    partenaire: "top_chrono",
    incident: null,
  },
];

const STATUT_LIV = {
  prete: { label: "Prête", color: "#b7770d", bg: "#faeeda", dot: "#F59E0B" },
  en_route: {
    label: "En route",
    color: "#185fa5",
    bg: "#eff6ff",
    dot: "#3B82F6",
  },
  livrée: {
    label: "Livrée ✓",
    color: "#2e8b57",
    bg: "#e8f5ee",
    dot: "#10B981",
  },
  bloquée: {
    label: "Bloquée ⚠",
    color: "#c0392b",
    bg: "#fef2f2",
    dot: "#EF4444",
  },
};

const STATUT_COURSIER = {
  disponible: {
    label: "Disponible",
    color: "#2e8b57",
    bg: "rgba(16,185,129,0.1)",
  },
  en_course: {
    label: "En course",
    color: "#185fa5",
    bg: "rgba(59,130,246,0.1)",
  },
  pause: { label: "Pause", color: "#b7770d", bg: "rgba(245,158,11,0.1)" },
};

// Compteur live temps réel
function useTimer() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 30000); // refresh toutes 30s
    return () => clearInterval(i);
  }, []);
  return tick;
}

export default function Livraisons() {
  useTimer(); // force re-render périodique pour simuler live
  const [livraisons, setLivraisons] = useState(LIVRAISONS_DATA);
  const [selected, setSelected] = useState(null);
  const [filterStatut, setFilterStatut] = useState("all");
  const [filterPartenaire, setFilterPartenaire] = useState("all");
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [dispatchCoursier, setDispatchCoursier] = useState(null);
  const [incidentMotif, setIncidentMotif] = useState("");

  const liv = selected ? livraisons.find((l) => l.id === selected) : null;

  const filtres = livraisons.filter((l) => {
    const matchStatut = filterStatut === "all" || l.statut === filterStatut;
    const matchPart =
      filterPartenaire === "all" || l.partenaire === filterPartenaire;
    return matchStatut && matchPart;
  });

  const stats = {
    enCours: livraisons.filter((l) => l.statut === "en_route").length,
    pretes: livraisons.filter((l) => l.statut === "prete").length,
    bloquees: livraisons.filter((l) => l.statut === "bloquée").length,
    livrees: livraisons.filter((l) => l.statut === "livrée").length,
    coursiersDispo: COURSIERS_DATA.filter((c) => c.statut === "disponible")
      .length,
    coursiersActifs: COURSIERS_DATA.filter((c) => c.statut === "en_course")
      .length,
  };

  const dispatchCours = (coursierIdToAssign) => {
    setLivraisons((prev) =>
      prev.map((l) =>
        l.id === selected
          ? {
              ...l,
              coursier: coursierIdToAssign,
              statut: "en_route",
              incident: null,
            }
          : l
      )
    );
    setShowDispatchModal(false);
    setDispatchCoursier(null);
    const c = COURSIERS_DATA.find((c) => c.id === coursierIdToAssign);
    toast.success(`${c?.nom} dispatché sur ${selected}`);
  };

  const signalerIncident = () => {
    if (!incidentMotif.trim()) {
      toast.error("Décrivez l'incident");
      return;
    }
    setLivraisons((prev) =>
      prev.map((l) =>
        l.id === selected
          ? { ...l, statut: "bloquée", incident: incidentMotif }
          : l
      )
    );
    setShowIncidentModal(false);
    setIncidentMotif("");
    toast.success("Incident signalé");
  };

  const marquerLivrée = () => {
    setLivraisons((prev) =>
      prev.map((l) =>
        l.id === selected
          ? { ...l, statut: "livrée", tempsEstime: "Livrée", incident: null }
          : l
      )
    );
    toast.success("Livraison marquée comme effectuée");
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
            Livraisons
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}
          >
            Suivi temps réel des livraisons et dispatch coursiers
          </p>
        </div>
        {/* Statut partenaires logistiques */}
        <div style={{ display: "flex", gap: "10px" }}>
          {Object.entries(PARTENAIRES).map(([k, p]) => (
            <div
              key={k}
              style={{
                background: "#fff",
                border: "1px solid var(--white-3)",
                borderRadius: "var(--radius-md)",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: p.color,
                  boxShadow: `0 0 6px ${p.color}`,
                }}
              />
              <div>
                <div style={{ fontSize: "12px", fontWeight: "600" }}>
                  {p.nom}
                </div>
                <div style={{ fontSize: "10px", color: "var(--gray)" }}>
                  {p.statut} · {p.latence}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        {[
          {
            label: "En route",
            val: stats.enCours,
            color: "#185fa5",
            bg: "#eff6ff",
          },
          {
            label: "Prêtes (sans coursier)",
            val: stats.pretes,
            color: "#b7770d",
            bg: "#faeeda",
          },
          {
            label: "Bloquées",
            val: stats.bloquees,
            color: "#c0392b",
            bg: "#fef2f2",
          },
          {
            label: "Livrées auj.",
            val: stats.livrees,
            color: "#2e8b57",
            bg: "#e8f5ee",
          },
          {
            label: "Coursiers actifs",
            val: stats.coursiersActifs,
            color: "#185fa5",
            bg: "#fff",
          },
          {
            label: "Coursiers dispo",
            val: stats.coursiersDispo,
            color: "#2e8b57",
            bg: "#fff",
          },
        ].map((k) => (
          <div
            key={k.label}
            style={{
              background: k.bg || "#fff",
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

      {/* Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "20px",
        }}
      >
        {/* Section principale : livraisons + détail */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Filtres + tableau livraisons */}
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--white-3)",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--white-3)",
                display: "flex",
                gap: "8px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--gray)",
                  marginRight: "4px",
                }}
              >
                Filtres
              </span>
              {["all", "prete", "en_route", "bloquée", "livrée"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatut(s)}
                  style={fBtn(
                    filterStatut === s,
                    s !== "all" ? STATUT_LIV[s]?.color : null,
                    s !== "all" ? STATUT_LIV[s]?.bg : null
                  )}
                >
                  {s === "all" ? "Toutes" : STATUT_LIV[s]?.label}
                </button>
              ))}
              <div
                style={{
                  width: 1,
                  height: 20,
                  background: "var(--white-3)",
                  margin: "0 4px",
                }}
              />
              {["all", "coursier_fr", "top_chrono"].map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPartenaire(p)}
                  style={fBtn(filterPartenaire === p)}
                >
                  {p === "all" ? "Tous partenaires" : PARTENAIRES[p]?.nom}
                </button>
              ))}
              {/* Indicateur live */}
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "11px",
                  color: "#2e8b57",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#10B981",
                    animation: "pulse 2s infinite",
                  }}
                />
                Live
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
                  {[
                    "Commande",
                    "Client",
                    "Boutique",
                    "Adresse",
                    "Coursier",
                    "Partenaire",
                    "ETA",
                    "Montant",
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
                {filtres.map((l) => {
                  const sc = STATUT_LIV[l.statut];
                  const cours = COURSIERS_DATA.find((c) => c.id === l.coursier);
                  const isActive = selected === l.id;
                  return (
                    <tr
                      key={l.id}
                      onClick={() => setSelected(isActive ? null : l.id)}
                      style={{
                        borderBottom: "1px solid var(--white-3)",
                        cursor: "pointer",
                        background: isActive
                          ? "rgba(201,169,110,0.05)"
                          : l.statut === "bloquée"
                          ? "rgba(192,57,43,0.02)"
                          : "transparent",
                        transition: "background 0.15s",
                      }}
                    >
                      <td style={{ padding: "12px 14px" }}>
                        <div
                          style={{
                            fontWeight: "700",
                            color: "var(--gold-dark)",
                            fontSize: "12px",
                          }}
                        >
                          {l.commande}
                        </div>
                        {l.incident && (
                          <div
                            style={{
                              fontSize: "10px",
                              color: "#c0392b",
                              fontWeight: "600",
                              marginTop: "2px",
                            }}
                          >
                            ⚠ Incident
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "12px 14px", fontWeight: "500" }}>
                        {l.client}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          color: "var(--gray)",
                          fontSize: "12px",
                        }}
                      >
                        {l.boutique}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          color: "var(--gray)",
                          fontSize: "12px",
                          maxWidth: "160px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {l.adresse}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        {cours ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <div
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: "50%",
                                background: "rgba(201,169,110,0.1)",
                                border: "1px solid rgba(201,169,110,0.25)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "10px",
                                fontWeight: "700",
                                color: "var(--gold-dark)",
                              }}
                            >
                              {cours.avatar}
                            </div>
                            <span style={{ fontSize: "12px" }}>
                              {cours.nom}
                            </span>
                          </div>
                        ) : (
                          <span
                            style={{
                              fontSize: "11px",
                              color: "#b7770d",
                              fontWeight: "600",
                            }}
                          >
                            ⚡ À dispatcher
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        {l.partenaire ? (
                          <span
                            style={{
                              fontSize: "11px",
                              color: "var(--gray)",
                              background: "var(--gray-bg)",
                              padding: "2px 8px",
                              borderRadius: "10px",
                            }}
                          >
                            {PARTENAIRES[l.partenaire]?.nom}
                          </span>
                        ) : (
                          <span
                            style={{
                              color: "var(--gray-light)",
                              fontSize: "12px",
                            }}
                          >
                            —
                          </span>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontWeight: "600",
                          fontSize: "13px",
                          color:
                            l.statut === "en_route" ? "#185fa5" : "var(--gray)",
                        }}
                      >
                        {l.tempsEstime}
                      </td>
                      <td style={{ padding: "12px 14px", fontWeight: "600" }}>
                        {l.total}€
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
                            gap: "5px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: sc.dot,
                            }}
                          />
                          {sc.label}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        {l.statut === "prete" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelected(l.id);
                              setShowDispatchModal(true);
                            }}
                            style={bStyle("gold")}
                          >
                            Dispatcher
                          </button>
                        )}
                        {l.statut === "bloquée" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelected(l.id);
                              setShowDispatchModal(true);
                            }}
                            style={bStyle("error")}
                          >
                            Réassigner
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Détail livraison sélectionnée */}
          {liv && (
            <div
              style={{
                background: "#fff",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-sm)",
                border: `1px solid ${
                  liv.statut === "bloquée" ? "#fecaca" : "var(--white-3)"
                }`,
              }}
            >
              <div
                style={{
                  padding: "18px 24px",
                  borderBottom: "1px solid var(--white-3)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "20px",
                      fontWeight: "300",
                      marginBottom: "4px",
                    }}
                  >
                    {liv.commande} — {liv.client}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--gray)" }}>
                    {liv.boutique} · {liv.adresse}
                  </div>
                  {liv.incident && (
                    <div
                      style={{
                        marginTop: "6px",
                        fontSize: "12px",
                        color: "#c0392b",
                        fontWeight: "600",
                        background: "#fef2f2",
                        display: "inline-block",
                        padding: "3px 10px",
                        borderRadius: "10px",
                      }}
                    >
                      ⚠ {liv.incident}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {liv.statut !== "livrée" && (
                    <>
                      <button
                        onClick={() => setShowDispatchModal(true)}
                        style={bStyle("ghost")}
                      >
                        {liv.coursier ? "Réassigner" : "Dispatcher"}
                      </button>
                      <button
                        onClick={() => setShowIncidentModal(true)}
                        style={bStyle("error")}
                      >
                        Signaler incident
                      </button>
                      <button onClick={marquerLivrée} style={bStyle("success")}>
                        Marquer livrée
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "16px",
                  padding: "18px 24px",
                }}
              >
                {[
                  { label: "Prise en charge", val: liv.heurePrise },
                  { label: "Heure estimée", val: liv.heureEstimee },
                  { label: "ETA restant", val: liv.tempsEstime },
                  { label: "Montant", val: `${liv.total}€` },
                  { label: "Articles", val: liv.articles },
                  {
                    label: "Partenaire",
                    val: liv.partenaire
                      ? PARTENAIRES[liv.partenaire]?.nom
                      : "—",
                  },
                  { label: "ID livraison", val: liv.id },
                  {
                    label: "Coursier",
                    val:
                      COURSIERS_DATA.find((c) => c.id === liv.coursier)?.nom ||
                      "Non assigné",
                  },
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
            </div>
          )}
        </div>

        {/* Colonne droite : coursiers */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--gray)",
                  marginBottom: "4px",
                }}
              >
                Coursiers
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "18px",
                  fontWeight: "300",
                }}
              >
                Flotte en temps réel
              </div>
            </div>
            {COURSIERS_DATA.map((c) => {
              const sc = STATUT_COURSIER[c.statut];
              const part = PARTENAIRES[c.partenaire];
              return (
                <div
                  key={c.id}
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--white-3)",
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
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: `${sc.bg}`,
                        border: `1.5px solid ${sc.color}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        fontWeight: "700",
                        color: sc.color,
                        flexShrink: 0,
                      }}
                    >
                      {c.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "13px", fontWeight: "500" }}>
                        {c.nom}
                      </div>
                      <div style={{ fontSize: "10px", color: "var(--gray)" }}>
                        {part?.nom} · ★ {c.note}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "700",
                        padding: "2px 8px",
                        borderRadius: "10px",
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
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "11px",
                      color: "var(--gray)",
                    }}
                  >
                    <span>{c.total} livraisons totales</span>
                    {c.statut === "en_course" && (
                      <span style={{ fontWeight: "600", color: "#185fa5" }}>
                        {c.livActive} active{c.livActive > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal : Dispatch */}
      {showDispatchModal && (
        <div style={OVL} onClick={() => setShowDispatchModal(false)}>
          <div style={MDL} onClick={(e) => e.stopPropagation()}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: "300",
                marginBottom: "6px",
              }}
            >
              {liv?.coursier
                ? "Réassigner le coursier"
                : "Dispatcher un coursier"}
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "20px",
              }}
            >
              {liv?.commande} · {liv?.client} · {liv?.adresse}
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginBottom: "20px",
              }}
            >
              {COURSIERS_DATA.filter((c) => c.statut !== "pause").map((c) => {
                const sc = STATUT_COURSIER[c.statut];
                const isSelected = dispatchCoursier === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setDispatchCoursier(c.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 14px",
                      borderRadius: "var(--radius-md)",
                      border: `2px solid ${
                        isSelected ? "var(--gold)" : "var(--white-3)"
                      }`,
                      background: isSelected
                        ? "rgba(201,169,110,0.06)"
                        : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: sc.bg,
                        border: `1.5px solid ${sc.color}40`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: "700",
                        color: sc.color,
                        flexShrink: 0,
                      }}
                    >
                      {c.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: "600" }}>
                        {c.nom}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--gray)" }}>
                        {PARTENAIRES[c.partenaire]?.nom} · ★ {c.note} ·{" "}
                        {c.total} livraisons
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        background: sc.bg,
                        color: sc.color,
                      }}
                    >
                      {sc.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => {
                  setShowDispatchModal(false);
                  setDispatchCoursier(null);
                }}
                style={bStyle("ghost")}
              >
                Annuler
              </button>
              <button
                onClick={() =>
                  dispatchCoursier && dispatchCours(dispatchCoursier)
                }
                style={{
                  ...bStyle("gold"),
                  opacity: dispatchCoursier ? 1 : 0.5,
                }}
              >
                Confirmer le dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal : Incident */}
      {showIncidentModal && (
        <div style={OVL} onClick={() => setShowIncidentModal(false)}>
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
              Signaler un incident
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "20px",
              }}
            >
              {liv?.commande} · {liv?.client}
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                marginBottom: "14px",
              }}
            >
              {[
                "Coursier introuvable",
                "Adresse incorrecte",
                "Client absent",
                "Colis endommagé",
                "Accident / empêchement",
              ].map((m) => (
                <button
                  key={m}
                  onClick={() => setIncidentMotif(m)}
                  style={{
                    textAlign: "left",
                    padding: "9px 12px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "13px",
                    border: `1.5px solid ${
                      incidentMotif === m ? "#c0392b" : "var(--white-3)"
                    }`,
                    background: incidentMotif === m ? "#fef2f2" : "transparent",
                    color: incidentMotif === m ? "#c0392b" : "var(--noir)",
                    cursor: "pointer",
                    fontWeight: incidentMotif === m ? "600" : "400",
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
            <textarea
              value={incidentMotif}
              onChange={(e) => setIncidentMotif(e.target.value)}
              placeholder="Ou décrire l'incident…"
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
                onClick={() => setShowIncidentModal(false)}
                style={bStyle("ghost")}
              >
                Annuler
              </button>
              <button onClick={signalerIncident} style={bStyle("error")}>
                Signaler l'incident
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
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
    gold: {
      background: "var(--noir)",
      color: "var(--gold)",
      border: "none",
      padding: "7px 14px",
    },
    ghost: {
      background: "transparent",
      color: "var(--gray)",
      border: "1.5px solid var(--white-3)",
      padding: "7px 14px",
    },
    error: {
      background: "#fef2f2",
      color: "var(--error)",
      border: "1.5px solid #fecaca",
      padding: "7px 14px",
    },
    success: {
      background: "#e8f5ee",
      color: "#2e8b57",
      border: "1.5px solid #bbf7d0",
      padding: "7px 14px",
    },
  };
  return {
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
  width: "540px",
  boxShadow: "var(--shadow-lg)",
  maxHeight: "90vh",
  overflowY: "auto",
};
