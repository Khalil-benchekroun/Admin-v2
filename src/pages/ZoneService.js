import React, { useState } from "react";
import toast from "react-hot-toast";

// ── Mock Data ──────────────────────────────────────────────
const VILLES_DATA = [
  {
    id: "paris",
    nom: "Paris",
    pays: "France",
    statut: "actif",
    lancement: "Jour 1",
    dateLancement: "01/03/2026",
    boutiques: 5,
    arrondissements: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ],
    actifs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 17],
    rayonKm: 10,
    delaiMin: 30,
    delaiMax: 90,
    coursiers: 4,
    notes: "Zone principale. Couverture centre + ouest parisien prioritaire.",
  },
  {
    id: "nice",
    nom: "Nice",
    pays: "France",
    statut: "planifié",
    lancement: "Mois 18",
    dateLancement: "01/09/2027",
    boutiques: 0,
    arrondissements: [],
    actifs: [],
    rayonKm: 8,
    delaiMin: 30,
    delaiMax: 90,
    coursiers: 0,
    notes: "Expansion Côte d'Azur — phase 2.",
  },
  {
    id: "cannes",
    nom: "Cannes",
    pays: "France",
    statut: "planifié",
    lancement: "Mois 18",
    dateLancement: "01/09/2027",
    boutiques: 0,
    arrondissements: [],
    actifs: [],
    rayonKm: 6,
    delaiMin: 30,
    delaiMax: 90,
    coursiers: 0,
    notes: "Expansion Côte d'Azur — phase 2.",
  },
  {
    id: "monaco",
    nom: "Monaco",
    pays: "Monaco",
    statut: "planifié",
    lancement: "Mois 18",
    dateLancement: "01/09/2027",
    boutiques: 0,
    arrondissements: [],
    actifs: [],
    rayonKm: 3,
    delaiMin: 20,
    delaiMax: 60,
    coursiers: 0,
    notes: "Principauté — zone premium, périmètre réduit.",
  },
];

const STATUT_CFG = {
  actif: { label: "Actif", color: "#2e8b57", bg: "#e8f5ee", dot: "#10B981" },
  planifié: {
    label: "Planifié",
    color: "#185fa5",
    bg: "#eff6ff",
    dot: "#3B82F6",
  },
  suspendu: {
    label: "Suspendu",
    color: "#c0392b",
    bg: "#fef2f2",
    dot: "#EF4444",
  },
};

// Grille 20 arrondissements Paris (4×5)
const ARR_GRID = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20],
];

export default function ZoneService() {
  const [villes, setVilles] = useState(VILLES_DATA);
  const [selected, setSelected] = useState("paris");
  const [showAddVille, setShowAddVille] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [noteText, setNoteText] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  const ville = villes.find((v) => v.id === selected);

  const toggleArrondissement = (arr) => {
    if (ville.statut !== "actif") return;
    setVilles((prev) =>
      prev.map((v) =>
        v.id === selected
          ? {
              ...v,
              actifs: v.actifs.includes(arr)
                ? v.actifs.filter((a) => a !== arr)
                : [...v.actifs, arr].sort((a, b) => a - b),
            }
          : v
      )
    );
  };

  const activerVille = (id) => {
    setVilles((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              statut: "actif",
              dateLancement: new Date().toLocaleDateString("fr-FR"),
            }
          : v
      )
    );
    toast.success("Zone activée sur la plateforme");
  };

  const suspendreVille = (id) => {
    setVilles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, statut: "suspendu" } : v))
    );
    toast.success("Zone suspendue");
  };

  const sauvegarderEdit = () => {
    setVilles((prev) =>
      prev.map((v) => (v.id === selected ? { ...v, ...editForm } : v))
    );
    setShowEditModal(false);
    toast.success("Zone mise à jour");
  };

  const ajouterNote = () => {
    if (!noteText.trim()) return;
    setVilles((prev) =>
      prev.map((v) =>
        v.id === selected
          ? {
              ...v,
              notes: v.notes
                ? v.notes + "\n" + noteText.trim()
                : noteText.trim(),
            }
          : v
      )
    );
    setNoteText("");
    setShowNoteInput(false);
    toast.success("Note ajoutée");
  };

  const stats = {
    actives: villes.filter((v) => v.statut === "actif").length,
    planifiees: villes.filter((v) => v.statut === "planifié").length,
    totalBoutiques: villes.reduce((s, v) => s + v.boutiques, 0),
    totalCoursiers: villes.reduce((s, v) => s + v.coursiers, 0),
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
            Zones de service
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}
          >
            Géographie, périmètres de livraison et expansion
          </p>
        </div>
        <button
          onClick={() => setShowAddVille(true)}
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
          + Nouvelle zone
        </button>
      </div>

      {/* KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "14px",
          marginBottom: "28px",
        }}
      >
        {[
          { label: "Zones actives", val: stats.actives, color: "#2e8b57" },
          { label: "En préparation", val: stats.planifiees, color: "#185fa5" },
          {
            label: "Boutiques partenaires",
            val: stats.totalBoutiques,
            color: "var(--gold-dark)",
          },
          {
            label: "Coursiers actifs",
            val: stats.totalCoursiers,
            color: "var(--noir)",
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

      {/* Roadmap expansion */}
      <div
        style={{
          background: "#fff",
          borderRadius: "var(--radius-lg)",
          padding: "20px 24px",
          boxShadow: "var(--shadow-sm)",
          border: "1px solid var(--white-3)",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            fontSize: "10px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--gray)",
            marginBottom: "14px",
          }}
        >
          Roadmap expansion
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0",
            overflowX: "auto",
          }}
        >
          {[
            { label: "Paris", date: "Mars 2026", done: true, color: "#2e8b57" },
            {
              label: "Nice · Cannes · Monaco",
              date: "Mois 18 — Sept. 2027",
              done: false,
              color: "#185fa5",
            },
            {
              label: "Autres villes",
              date: "V3 — à définir",
              done: false,
              color: "#9CA3AF",
            },
          ].map((e, i, arr) => (
            <React.Fragment key={e.label}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: "160px",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: e.done ? e.color : "#fff",
                    border: `2px solid ${e.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    marginBottom: "8px",
                  }}
                >
                  {e.done ? (
                    <span
                      style={{
                        color: "#fff",
                        fontWeight: "800",
                        fontSize: "13px",
                      }}
                    >
                      ✓
                    </span>
                  ) : (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: e.color,
                      }}
                    />
                  )}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    textAlign: "center",
                    marginBottom: "3px",
                  }}
                >
                  {e.label}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--gray)",
                    textAlign: "center",
                  }}
                >
                  {e.date}
                </div>
              </div>
              {i < arr.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: i === 0 ? "#2e8b57" : "var(--white-3)",
                    minWidth: "40px",
                    marginBottom: "20px",
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Layout : liste villes + détail */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "20px",
        }}
      >
        {/* Liste villes */}
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
              padding: "14px 16px",
              borderBottom: "1px solid var(--white-3)",
              fontSize: "10px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--gray)",
            }}
          >
            Zones configurées
          </div>
          {villes.map((v) => {
            const sc = STATUT_CFG[v.statut];
            const isActive = selected === v.id;
            return (
              <div
                key={v.id}
                onClick={() => setSelected(v.id)}
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
                    alignItems: "center",
                    marginBottom: "4px",
                  }}
                >
                  <div style={{ fontSize: "14px", fontWeight: "500" }}>
                    {v.nom}
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "600",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      background: sc.bg,
                      color: sc.color,
                    }}
                  >
                    {sc.label}
                  </span>
                </div>
                <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                  {v.lancement} · {v.boutiques} boutique
                  {v.boutiques > 1 ? "s" : ""}
                </div>
              </div>
            );
          })}
        </div>

        {/* Détail ville */}
        {ville && (
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
                padding: "20px 28px",
                borderBottom: "1px solid var(--white-3)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "28px",
                    fontWeight: "300",
                    marginBottom: "6px",
                  }}
                >
                  {ville.nom}
                </div>
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      padding: "3px 10px",
                      borderRadius: "20px",
                      background: STATUT_CFG[ville.statut].bg,
                      color: STATUT_CFG[ville.statut].color,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: STATUT_CFG[ville.statut].dot,
                        display: "inline-block",
                        marginRight: "5px",
                      }}
                    />
                    {STATUT_CFG[ville.statut].label}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--gray)" }}>
                    {ville.lancement} · {ville.pays}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => {
                    setEditForm({
                      rayonKm: ville.rayonKm,
                      delaiMin: ville.delaiMin,
                      delaiMax: ville.delaiMax,
                    });
                    setShowEditModal(true);
                  }}
                  style={bStyle("ghost")}
                >
                  Modifier les paramètres
                </button>
                {ville.statut === "planifié" && (
                  <button
                    onClick={() => activerVille(ville.id)}
                    style={bStyle("success")}
                  >
                    Activer la zone
                  </button>
                )}
                {ville.statut === "actif" && (
                  <button
                    onClick={() => suspendreVille(ville.id)}
                    style={bStyle("error")}
                  >
                    Suspendre
                  </button>
                )}
                {ville.statut === "suspendu" && (
                  <button
                    onClick={() => activerVille(ville.id)}
                    style={bStyle("success")}
                  >
                    Réactiver
                  </button>
                )}
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
              {/* Params */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "14px",
                  marginBottom: "28px",
                }}
              >
                {[
                  { label: "Rayon de service", val: `${ville.rayonKm} km` },
                  { label: "Délai min", val: `${ville.delaiMin} min` },
                  { label: "Délai max", val: `${ville.delaiMax} min` },
                  { label: "Date lancement", val: ville.dateLancement },
                  { label: "Boutiques actives", val: ville.boutiques },
                  { label: "Coursiers", val: ville.coursiers },
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
                        letterSpacing: "0.08em",
                        color: "var(--gray)",
                        marginBottom: "5px",
                      }}
                    >
                      {r.label}
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: "500" }}>
                      {r.val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Carte arrondissements Paris */}
              {ville.id === "paris" && (
                <div style={{ marginBottom: "24px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "10px",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "var(--gray)",
                          marginBottom: "3px",
                        }}
                      >
                        Arrondissements couverts
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--gray)" }}>
                        {ville.actifs.length} / {ville.arrondissements.length}{" "}
                        arrondissements actifs — cliquez pour activer/désactiver
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", gap: "12px", fontSize: "11px" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: "3px",
                            background: "#C9A96E",
                          }}
                        />
                        <span style={{ color: "var(--gray)" }}>Actif</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: "3px",
                            background: "var(--white-3)",
                          }}
                        />
                        <span style={{ color: "var(--gray)" }}>Inactif</span>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      flexDirection: "column",
                      gap: "6px",
                      background: "var(--gray-bg)",
                      padding: "16px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--white-3)",
                    }}
                  >
                    {ARR_GRID.map((row, ri) => (
                      <div key={ri} style={{ display: "flex", gap: "6px" }}>
                        {row.map((arr) => {
                          const isActif = ville.actifs.includes(arr);
                          return (
                            <button
                              key={arr}
                              onClick={() => toggleArrondissement(arr)}
                              title={`${arr}e arrondissement`}
                              style={{
                                width: 52,
                                height: 52,
                                borderRadius: "var(--radius-sm)",
                                border: `2px solid ${
                                  isActif ? "var(--gold)" : "var(--white-3)"
                                }`,
                                background: isActif
                                  ? "rgba(201,169,110,0.15)"
                                  : "#fff",
                                color: isActif
                                  ? "var(--gold-dark)"
                                  : "var(--gray-light)",
                                fontSize: "13px",
                                fontWeight: isActif ? "700" : "400",
                                cursor: "pointer",
                                transition: "all 0.15s",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {arr}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Zones planifiées */}
              {ville.statut === "planifié" && (
                <div
                  style={{
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    borderRadius: "var(--radius-md)",
                    padding: "16px 20px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#185fa5",
                      marginBottom: "6px",
                    }}
                  >
                    📍 Zone en préparation
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#185fa5",
                      lineHeight: 1.6,
                    }}
                  >
                    Cette zone sera activée au mois 18 de la roadmap (
                    {ville.dateLancement}). Le paramétrage peut être effectué en
                    avance et sera appliqué dès l'activation.
                  </div>
                </div>
              )}

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
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--gray)",
                    }}
                  >
                    Notes internes
                  </div>
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
                    color: ville.notes ? "var(--noir)" : "var(--gray-light)",
                    fontStyle: ville.notes ? "normal" : "italic",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                    marginBottom: showNoteInput ? "10px" : 0,
                  }}
                >
                  {ville.notes || "Aucune note."}
                </div>
                {showNoteInput && (
                  <div>
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Note interne…"
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

      {/* Modal : modifier paramètres */}
      {showEditModal && (
        <div style={OVL} onClick={() => setShowEditModal(false)}>
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
              Paramètres de zone
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "24px",
              }}
            >
              {ville?.nom}
            </p>
            {[
              {
                label: "Rayon de service (km)",
                key: "rayonKm",
                type: "number",
              },
              { label: "Délai minimum (min)", key: "delaiMin", type: "number" },
              { label: "Délai maximum (min)", key: "delaiMax", type: "number" },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: "16px" }}>
                <label style={LBL}>{f.label}</label>
                <input
                  type={f.type}
                  value={editForm[f.key] || ""}
                  onChange={(e) =>
                    setEditForm((p) => ({
                      ...p,
                      [f.key]: parseInt(e.target.value) || 0,
                    }))
                  }
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
            ))}
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
                marginTop: "8px",
              }}
            >
              <button
                onClick={() => setShowEditModal(false)}
                style={bStyle("ghost")}
              >
                Annuler
              </button>
              <button onClick={sauvegarderEdit} style={bStyle("gold")}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal : nouvelle zone */}
      {showAddVille && (
        <div style={OVL} onClick={() => setShowAddVille(false)}>
          <div
            style={{ ...MDL, width: "420px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: "300",
                marginBottom: "20px",
              }}
            >
              Nouvelle zone
            </h2>
            <div
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                lineHeight: 1.6,
                marginBottom: "20px",
              }}
            >
              La configuration d'une nouvelle zone nécessite la définition du
              périmètre géographique, du partenaire logistique local et d'un
              minimum de boutiques partenaires.
            </div>
            <div
              style={{
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: "var(--radius-sm)",
                padding: "10px 14px",
                fontSize: "12px",
                color: "#b7770d",
                marginBottom: "20px",
              }}
            >
              ⚠ L'activation d'une zone est une décision stratégique — elle
              implique un engagement logistique et commercial.
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowAddVille(false)}
                style={bStyle("ghost")}
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  setShowAddVille(false);
                  toast.success(
                    "Contactez l'équipe tech pour créer une nouvelle zone"
                  );
                }}
                style={bStyle("gold")}
              >
                Contacter l'équipe tech
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
