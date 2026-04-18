import React, { useState } from "react";
import toast from "react-hot-toast";

// ── Mock Data ──────────────────────────────────────────────
const PRODUITS_DATA = [
  {
    id: "PRD-001",
    nom: "Robe Midi Fleurie",
    boutique: "Sandro Paris",
    categorie: "Mode",
    prix: 490,
    stock: 8,
    statut: "actif",
    validation: "validé",
    signalements: 0,
    dateAjout: "12/01/2026",
    ref: "SP-0011",
    photo: "👗",
    quota: { utilise: 184, max: null },
  },
  {
    id: "PRD-002",
    nom: "Trench Camel",
    boutique: "Sandro Paris",
    categorie: "Mode",
    prix: 345,
    stock: 3,
    statut: "actif",
    validation: "validé",
    signalements: 0,
    dateAjout: "12/01/2026",
    ref: "SP-0012",
    photo: "🧥",
    quota: { utilise: 184, max: null },
  },
  {
    id: "PRD-003",
    nom: "Pull Alexandre — Marine",
    boutique: "AMI Paris",
    categorie: "Mode",
    prix: 290,
    stock: 12,
    statut: "actif",
    validation: "validé",
    signalements: 0,
    dateAjout: "18/01/2026",
    ref: "AMI-0221",
    photo: "👕",
    quota: { utilise: 112, max: 200 },
  },
  {
    id: "PRD-004",
    nom: "Robe Milena — Noir",
    boutique: "Isabel Marant",
    categorie: "Mode",
    prix: 450,
    stock: 2,
    statut: "actif",
    validation: "en_attente",
    signalements: 1,
    dateAjout: "25/01/2026",
    ref: "IM-0891",
    photo: "👗",
    quota: { utilise: 98, max: 200 },
  },
  {
    id: "PRD-005",
    nom: "Rouge Terrybly — #302",
    boutique: "By Terry",
    categorie: "Beauté",
    prix: 42,
    stock: 24,
    statut: "actif",
    validation: "validé",
    signalements: 0,
    dateAjout: "02/02/2026",
    ref: "BT-0302",
    photo: "💄",
    quota: { utilise: 38, max: 50 },
  },
  {
    id: "PRD-006",
    nom: "Sérum Éclat Cellulaire",
    boutique: "By Terry",
    categorie: "Beauté",
    prix: 98,
    stock: 6,
    statut: "actif",
    validation: "validé",
    signalements: 0,
    dateAjout: "02/02/2026",
    ref: "BT-0303",
    photo: "✨",
    quota: { utilise: 38, max: 50 },
  },
  {
    id: "PRD-007",
    nom: "Sac Cabas Cuir — Camel",
    boutique: "Sandro Paris",
    categorie: "Accessoires",
    prix: 198,
    stock: 1,
    statut: "actif",
    validation: "validé",
    signalements: 1,
    dateAjout: "15/01/2026",
    ref: "SP-0881",
    photo: "👜",
    quota: { utilise: 184, max: null },
  },
  {
    id: "PRD-008",
    nom: "Blazer Structuré Noir",
    boutique: "AMI Paris",
    categorie: "Mode",
    prix: 420,
    stock: 5,
    statut: "suspendu",
    validation: "refusé",
    signalements: 2,
    dateAjout: "20/01/2026",
    ref: "AMI-0195",
    photo: "🧳",
    quota: { utilise: 112, max: 200 },
  },
  {
    id: "PRD-009",
    nom: "Veste Tailleur Tweed",
    boutique: "Sandro Paris",
    categorie: "Mode",
    prix: 320,
    stock: 0,
    statut: "inactif",
    validation: "validé",
    signalements: 0,
    dateAjout: "12/01/2026",
    ref: "SP-1142",
    photo: "🧥",
    quota: { utilise: 184, max: null },
  },
  {
    id: "PRD-010",
    nom: "Crème Hydra-Lux 50ml",
    boutique: "By Terry",
    categorie: "Beauté",
    prix: 78,
    stock: 15,
    statut: "actif",
    validation: "en_attente",
    signalements: 0,
    dateAjout: "10/04/2026",
    ref: "BT-0401",
    photo: "🧴",
    quota: { utilise: 38, max: 50 },
  },
];

const STATUT_CFG = {
  actif: { label: "Actif", color: "#2e8b57", bg: "#e8f5ee", dot: "#10B981" },
  inactif: {
    label: "Inactif",
    color: "#6B7280",
    bg: "#f3f4f6",
    dot: "#9CA3AF",
  },
  suspendu: {
    label: "Suspendu",
    color: "#c0392b",
    bg: "#fef2f2",
    dot: "#EF4444",
  },
};

const VALID_CFG = {
  validé: { label: "Validé", color: "#2e8b57", bg: "#e8f5ee" },
  en_attente: { label: "En attente", color: "#b7770d", bg: "#faeeda" },
  refusé: { label: "Refusé", color: "#c0392b", bg: "#fef2f2" },
};

const CATEGORIES = [
  "Mode",
  "Beauté",
  "Accessoires",
  "Lifestyle",
  "Épicerie fine",
];
const BOUTIQUES = [
  "Sandro Paris",
  "AMI Paris",
  "Isabel Marant",
  "By Terry",
  "Rouje",
];

const MOTIFS_REFUS = [
  "Photos non conformes aux standards LIVRR",
  "Description trompeuse ou incorrecte",
  "Prix incohérent avec le marché",
  "Produit non autorisé sur la plateforme",
  "Quota de produits atteint pour ce plan",
];

export default function Produits() {
  const [produits, setProduits] = useState(PRODUITS_DATA);
  const [selected, setSelected] = useState(null);
  const [filterStatut, setFilterStatut] = useState("all");
  const [filterValidation, setFilterValidation] = useState("all");
  const [filterCategorie, setFilterCategorie] = useState("all");
  const [filterBoutique, setFilterBoutique] = useState("all");
  const [search, setSearch] = useState("");
  const [showRefusModal, setShowRefusModal] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [refusMotif, setRefusMotif] = useState("");
  const [noteText, setNoteText] = useState("");
  const [onglet, setOnglet] = useState("detail");

  const produit = selected ? produits.find((p) => p.id === selected) : null;

  const filtres = produits.filter((p) => {
    return (
      (filterStatut === "all" || p.statut === filterStatut) &&
      (filterValidation === "all" || p.validation === filterValidation) &&
      (filterCategorie === "all" || p.categorie === filterCategorie) &&
      (filterBoutique === "all" || p.boutique === filterBoutique) &&
      (p.nom.toLowerCase().includes(search.toLowerCase()) ||
        p.ref.toLowerCase().includes(search.toLowerCase()) ||
        p.boutique.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const stats = {
    total: produits.length,
    actifs: produits.filter((p) => p.statut === "actif").length,
    enAttente: produits.filter((p) => p.validation === "en_attente").length,
    signalés: produits.filter((p) => p.signalements > 0).length,
    suspendus: produits.filter((p) => p.statut === "suspendu").length,
  };

  const validerProduit = () => {
    setProduits((prev) =>
      prev.map((p) =>
        p.id === selected ? { ...p, validation: "validé", statut: "actif" } : p
      )
    );
    toast.success("Produit validé — visible sur la plateforme");
  };

  const refuserProduit = () => {
    if (!refusMotif.trim()) {
      toast.error("Motif obligatoire");
      return;
    }
    setProduits((prev) =>
      prev.map((p) =>
        p.id === selected
          ? { ...p, validation: "refusé", statut: "suspendu" }
          : p
      )
    );
    setShowRefusModal(false);
    setRefusMotif("");
    toast.success("Produit refusé");
  };

  const toggleSuspension = () => {
    setProduits((prev) =>
      prev.map((p) =>
        p.id === selected
          ? { ...p, statut: p.statut === "suspendu" ? "actif" : "suspendu" }
          : p
      )
    );
    toast.success(
      produit?.statut === "suspendu" ? "Produit réactivé" : "Produit suspendu"
    );
  };

  const ajouterNote = () => {
    if (!noteText.trim()) return;
    toast.success("Note ajoutée");
    setNoteText("");
    setShowNoteInput(false);
  };

  return (
    <div className="page" style={{ padding: "44px 52px" }}>
      {/* Header */}
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
          Produits
        </h1>
        <p style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}>
          Catalogue cross-boutiques, validation des fiches et modération
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
          { label: "Total produits", val: stats.total, color: "var(--noir)" },
          { label: "Actifs", val: stats.actifs, color: "#2e8b57" },
          {
            label: "En attente validation",
            val: stats.enAttente,
            color: "#b7770d",
          },
          { label: "Signalés", val: stats.signalés, color: "#c0392b" },
          { label: "Suspendus", val: stats.suspendus, color: "#6B7280" },
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
                lineHeight: 1,
                color: k.color,
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
          gridTemplateColumns: "1fr 380px",
          gap: "20px",
        }}
      >
        {/* Tableau produits */}
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
              padding: "14px 18px",
              borderBottom: "1px solid var(--white-3)",
            }}
          >
            <input
              type="text"
              placeholder="Nom, réf, boutique…"
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
                onClick={() => setFilterValidation("all")}
                style={fBtn(filterValidation === "all")}
              >
                Toutes validations
              </button>
              {Object.entries(VALID_CFG).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setFilterValidation(k)}
                  style={fBtn(filterValidation === k, v.color, v.bg)}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              <button
                onClick={() => setFilterStatut("all")}
                style={fBtn(filterStatut === "all")}
              >
                Tous statuts
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
              <div
                style={{
                  width: 1,
                  height: 20,
                  background: "var(--white-3)",
                  margin: "0 2px",
                }}
              />
              <select
                value={filterCategorie}
                onChange={(e) => setFilterCategorie(e.target.value)}
                style={{
                  padding: "4px 8px",
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
                <option value="all">Toutes catégories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={filterBoutique}
                onChange={(e) => setFilterBoutique(e.target.value)}
                style={{
                  padding: "4px 8px",
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
                <option value="all">Toutes boutiques</option>
                {BOUTIQUES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "13px",
              }}
            >
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  background: "var(--gray-bg)",
                  zIndex: 1,
                }}
              >
                <tr>
                  {[
                    "Produit",
                    "Boutique",
                    "Catégorie",
                    "Prix",
                    "Stock",
                    "Validation",
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
                {filtres.map((p) => {
                  const sc = STATUT_CFG[p.statut];
                  const vc = VALID_CFG[p.validation];
                  const isActive = selected === p.id;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => {
                        setSelected(isActive ? null : p.id);
                        setOnglet("detail");
                        setShowNoteInput(false);
                      }}
                      style={{
                        borderBottom: "1px solid var(--white-3)",
                        cursor: "pointer",
                        background: isActive
                          ? "rgba(201,169,110,0.05)"
                          : p.signalements > 0
                          ? "rgba(192,57,43,0.01)"
                          : "transparent",
                        transition: "background 0.15s",
                      }}
                    >
                      <td style={{ padding: "12px 14px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span style={{ fontSize: "20px" }}>{p.photo}</span>
                          <div>
                            <div
                              style={{ fontWeight: "500", marginBottom: "1px" }}
                            >
                              {p.nom}
                            </div>
                            <div
                              style={{
                                fontSize: "11px",
                                color: "var(--gray)",
                                fontFamily: "monospace",
                              }}
                            >
                              {p.ref}
                            </div>
                          </div>
                        </div>
                        {p.signalements > 0 && (
                          <div
                            style={{
                              fontSize: "10px",
                              color: "#c0392b",
                              fontWeight: "700",
                              marginTop: "3px",
                            }}
                          >
                            ⚠ {p.signalements} signalement
                            {p.signalements > 1 ? "s" : ""}
                          </div>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontSize: "12px",
                          color: "var(--gray)",
                        }}
                      >
                        {p.boutique}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            background: "var(--gray-bg)",
                            color: "var(--gray)",
                            fontWeight: "500",
                          }}
                        >
                          {p.categorie}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px", fontWeight: "600" }}>
                        {p.prix}€
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span
                          style={{
                            fontWeight: "600",
                            color:
                              p.stock === 0
                                ? "#c0392b"
                                : p.stock <= 3
                                ? "#b7770d"
                                : "#2e8b57",
                          }}
                        >
                          {p.stock}
                        </span>
                        {p.stock === 0 && (
                          <div style={{ fontSize: "10px", color: "#c0392b" }}>
                            Rupture
                          </div>
                        )}
                        {p.stock > 0 && p.stock <= 3 && (
                          <div style={{ fontSize: "10px", color: "#b7770d" }}>
                            Stock bas
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "600",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            background: vc.bg,
                            color: vc.color,
                          }}
                        >
                          {vc.label}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "600",
                            padding: "2px 8px",
                            borderRadius: "10px",
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
                        {p.validation === "en_attente" && (
                          <div style={{ display: "flex", gap: "4px" }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelected(p.id);
                                validerProduit();
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
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelected(p.id);
                                setShowRefusModal(true);
                              }}
                              style={{
                                padding: "4px 10px",
                                borderRadius: "var(--radius-sm)",
                                fontSize: "11px",
                                fontWeight: "600",
                                background: "#fef2f2",
                                color: "#c0392b",
                                border: "1px solid #fecaca",
                                cursor: "pointer",
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtres.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px",
                  color: "var(--gray)",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔍</div>
                <div style={{ fontSize: "13px" }}>Aucun produit trouvé</div>
              </div>
            )}
          </div>
        </div>

        {/* Fiche produit */}
        {!produit ? (
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
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛍️</div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "22px",
                fontWeight: "300",
                marginBottom: "8px",
              }}
            >
              Sélectionnez un produit
            </div>
            <div style={{ fontSize: "13px" }}>
              Cliquez pour voir la fiche et agir
            </div>
          </div>
        ) : (
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-sm)",
              border: `1px solid ${
                produit.signalements > 0 ? "#fecaca" : "var(--white-3)"
              }`,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header fiche */}
            <div
              style={{
                padding: "18px 22px 0",
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
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span style={{ fontSize: "32px" }}>{produit.photo}</span>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "18px",
                        fontWeight: "300",
                        lineHeight: 1.2,
                      }}
                    >
                      {produit.nom}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--gray)",
                        marginTop: "3px",
                      }}
                    >
                      {produit.boutique} ·{" "}
                      <span style={{ fontFamily: "monospace" }}>
                        {produit.ref}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Badges */}
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  flexWrap: "wrap",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    background: VALID_CFG[produit.validation].bg,
                    color: VALID_CFG[produit.validation].color,
                  }}
                >
                  {VALID_CFG[produit.validation].label}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    background: STATUT_CFG[produit.statut].bg,
                    color: STATUT_CFG[produit.statut].color,
                  }}
                >
                  {STATUT_CFG[produit.statut].label}
                </span>
                {produit.signalements > 0 && (
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#c0392b",
                      background: "#fef2f2",
                      padding: "3px 10px",
                      borderRadius: "20px",
                    }}
                  >
                    ⚠ {produit.signalements} signalement
                    {produit.signalements > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              {/* Actions */}
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  flexWrap: "wrap",
                  marginBottom: "12px",
                }}
              >
                {produit.validation === "en_attente" && (
                  <>
                    <button onClick={validerProduit} style={bStyle("success")}>
                      ✓ Valider
                    </button>
                    <button
                      onClick={() => setShowRefusModal(true)}
                      style={bStyle("error")}
                    >
                      ✕ Refuser
                    </button>
                  </>
                )}
                <button
                  onClick={toggleSuspension}
                  style={bStyle(
                    produit.statut === "suspendu" ? "success" : "ghost"
                  )}
                >
                  {produit.statut === "suspendu" ? "Réactiver" : "Suspendre"}
                </button>
              </div>
              {/* Onglets */}
              <div style={{ display: "flex" }}>
                {[
                  { id: "detail", label: "Fiche" },
                  { id: "notes", label: "Notes" },
                ].map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setOnglet(o.id)}
                    style={{
                      padding: "7px 16px",
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
            <div style={{ flex: 1, overflowY: "auto", padding: "18px 22px" }}>
              {onglet === "detail" && (
                <div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                      marginBottom: "16px",
                    }}
                  >
                    {[
                      { label: "Prix", val: `${produit.prix}€` },
                      {
                        label: "Stock",
                        val:
                          produit.stock === 0
                            ? "Rupture"
                            : `${produit.stock} unités`,
                      },
                      { label: "Catégorie", val: produit.categorie },
                      { label: "Date ajout", val: produit.dateAjout },
                      { label: "Boutique", val: produit.boutique },
                      { label: "Référence", val: produit.ref },
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

                  {/* Quota boutique */}
                  {produit.quota.max && (
                    <div style={{ marginBottom: "16px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "5px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: "var(--gray)",
                          }}
                        >
                          Quota boutique
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            color:
                              produit.quota.utilise / produit.quota.max > 0.85
                                ? "#c0392b"
                                : "var(--noir)",
                          }}
                        >
                          {produit.quota.utilise}/{produit.quota.max}
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
                            width: `${Math.min(
                              (produit.quota.utilise / produit.quota.max) * 100,
                              100
                            )}%`,
                            background:
                              produit.quota.utilise / produit.quota.max > 0.85
                                ? "#c0392b"
                                : "var(--gold)",
                            borderRadius: "6px",
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {!produit.quota.max && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--gray)",
                        marginBottom: "16px",
                      }}
                    >
                      Quota : <strong>Illimité</strong> (plan Prestige)
                    </div>
                  )}

                  {/* Signalements */}
                  {produit.signalements > 0 && (
                    <div
                      style={{
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: "var(--radius-md)",
                        padding: "12px 14px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "#c0392b",
                          marginBottom: "4px",
                        }}
                      >
                        ⚠ Signalements actifs
                      </div>
                      <div style={{ fontSize: "12px", color: "#c0392b" }}>
                        Ce produit a été signalé {produit.signalements} fois.
                        Voir la section Modération pour le détail.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {onglet === "notes" && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
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
                      padding: "12px 14px",
                      fontSize: "13px",
                      color: "var(--gray-light)",
                      fontStyle: "italic",
                      marginBottom: showNoteInput ? "10px" : 0,
                    }}
                  >
                    Aucune note pour ce produit.
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
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal refus */}
      {showRefusModal && (
        <div style={OVL} onClick={() => setShowRefusModal(false)}>
          <div
            style={{ ...MDL, width: "460px" }}
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
              Refuser le produit
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "20px",
              }}
            >
              {produit?.nom} · {produit?.boutique}
            </p>
            <label style={LBL}>Motif de refus *</label>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                marginBottom: "12px",
              }}
            >
              {MOTIFS_REFUS.map((m) => (
                <button
                  key={m}
                  onClick={() => setRefusMotif(m)}
                  style={{
                    textAlign: "left",
                    padding: "9px 12px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "13px",
                    border: `1.5px solid ${
                      refusMotif === m ? "#c0392b" : "var(--white-3)"
                    }`,
                    background: refusMotif === m ? "#fef2f2" : "transparent",
                    color: refusMotif === m ? "#c0392b" : "var(--noir)",
                    cursor: "pointer",
                    fontWeight: refusMotif === m ? "600" : "400",
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
            <textarea
              value={refusMotif}
              onChange={(e) => setRefusMotif(e.target.value)}
              placeholder="Ou motif personnalisé…"
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
                style={bStyle("ghost")}
              >
                Annuler
              </button>
              <button onClick={refuserProduit} style={bStyle("error")}>
                Confirmer le refus
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
    padding: "8px 14px",
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
