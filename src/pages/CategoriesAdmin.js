import React, { useState } from "react";
import toast from "react-hot-toast";

const CATEGORIES_DATA = [
  {
    id: "CAT-001",
    nom: "Mode",
    slug: "mode",
    icon: "👗",
    color: "#C9A96E",
    description: "Vêtements, prêt-à-porter, robes, vestes, pantalons",
    sousCats: [
      "Vêtements femme",
      "Vêtements homme",
      "Robes",
      "Manteaux & vestes",
      "Pantalons & jupes",
    ],
    boutiques: 4,
    produits: 284,
    actif: true,
    ordre: 1,
  },
  {
    id: "CAT-002",
    nom: "Beauté",
    slug: "beaute",
    icon: "💄",
    color: "#E879A0",
    description: "Maquillage, soins visage et corps, parfums",
    sousCats: [
      "Maquillage",
      "Soins visage",
      "Soins corps",
      "Parfums",
      "Accessoires beauté",
    ],
    boutiques: 1,
    produits: 38,
    actif: true,
    ordre: 2,
  },
  {
    id: "CAT-003",
    nom: "Accessoires",
    slug: "accessoires",
    icon: "👜",
    color: "#8B5CF6",
    description: "Maroquinerie, chaussures, bijoux, lifestyle",
    sousCats: [
      "Sacs & maroquinerie",
      "Chaussures",
      "Bijoux",
      "Foulards & ceintures",
      "Lunettes",
    ],
    boutiques: 3,
    produits: 97,
    actif: true,
    ordre: 3,
  },
  {
    id: "CAT-004",
    nom: "Lifestyle",
    slug: "lifestyle",
    icon: "🕯️",
    color: "#10B981",
    description: "Décoration, art de vivre, papeterie, cadeaux",
    sousCats: ["Décoration", "Art de vivre", "Papeterie", "Cadeaux"],
    boutiques: 0,
    produits: 0,
    actif: false,
    ordre: 4,
  },
  {
    id: "CAT-005",
    nom: "Épicerie fine",
    slug: "epicerie-fine",
    icon: "🧴",
    color: "#F59E0B",
    description: "Produits gastronomiques, vins, champagnes, traiteurs",
    sousCats: ["Gastronomie", "Vins & champagnes", "Confiserie", "Traiteur"],
    boutiques: 0,
    produits: 0,
    actif: false,
    ordre: 5,
  },
];

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState(CATEGORIES_DATA);
  const [selected, setSelected] = useState("CAT-001");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddSousCat, setShowAddSousCat] = useState(false);
  const [newSousCat, setNewSousCat] = useState("");
  const [editNom, setEditNom] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [newCatForm, setNewCatForm] = useState({
    nom: "",
    icon: "📦",
    color: "#185fa5",
    description: "",
  });

  const cat = categories.find((c) => c.id === selected);

  const toggleActif = (id) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, actif: !c.actif } : c))
    );
    const c = categories.find((c) => c.id === id);
    toast.success(c.actif ? "Catégorie désactivée" : "Catégorie activée");
  };

  const ajouterSousCat = () => {
    if (!newSousCat.trim()) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === selected
          ? { ...c, sousCats: [...c.sousCats, newSousCat.trim()] }
          : c
      )
    );
    setNewSousCat("");
    setShowAddSousCat(false);
    toast.success("Sous-catégorie ajoutée");
  };

  const supprimerSousCat = (nom) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === selected
          ? { ...c, sousCats: c.sousCats.filter((s) => s !== nom) }
          : c
      )
    );
    toast.success("Sous-catégorie supprimée");
  };

  const sauvegarderEdit = () => {
    setCategories((prev) =>
      prev.map((c) => (c.id === selected ? { ...c, ...editForm } : c))
    );
    setEditNom(false);
    toast.success("Catégorie mise à jour");
  };

  const ajouterCategorie = () => {
    if (!newCatForm.nom.trim()) {
      toast.error("Nom obligatoire");
      return;
    }
    const newCat = {
      id: `CAT-00${categories.length + 1}`,
      slug: newCatForm.nom.toLowerCase().replace(/\s+/g, "-"),
      sousCats: [],
      boutiques: 0,
      produits: 0,
      actif: false,
      ordre: categories.length + 1,
      ...newCatForm,
    };
    setCategories((prev) => [...prev, newCat]);
    setSelected(newCat.id);
    setShowAddModal(false);
    setNewCatForm({ nom: "", icon: "📦", color: "#185fa5", description: "" });
    toast.success("Catégorie créée");
  };

  const deplacerOrdre = (id, dir) => {
    setCategories((prev) => {
      const arr = [...prev];
      const idx = arr.findIndex((c) => c.id === id);
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= arr.length) return arr;
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr.map((c, i) => ({ ...c, ordre: i + 1 }));
    });
  };

  return (
    <div className="page" style={{ padding: "44px 52px" }}>
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
            Catégories de produits
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}
          >
            Gestion des catégories et sous-catégories de la plateforme
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
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
          + Nouvelle catégorie
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
          {
            label: "Catégories totales",
            val: categories.length,
            color: "var(--noir)",
          },
          {
            label: "Actives",
            val: categories.filter((c) => c.actif).length,
            color: "#2e8b57",
          },
          {
            label: "Produits catalogués",
            val: categories.reduce((s, c) => s + c.produits, 0),
            color: "#185fa5",
          },
          {
            label: "Sous-catégories",
            val: categories.reduce((s, c) => s + c.sousCats.length, 0),
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: "20px",
        }}
      >
        {/* Liste catégories */}
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
              padding: "12px 14px",
              borderBottom: "1px solid var(--white-3)",
              fontSize: "10px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--gray)",
            }}
          >
            Catégories ({categories.length})
          </div>
          {categories.map((c, i) => {
            const isActive = selected === c.id;
            return (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0",
                  borderBottom: "1px solid var(--white-3)",
                }}
              >
                {/* Ordre arrows */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "0 6px",
                  }}
                >
                  <button
                    onClick={() => deplacerOrdre(c.id, -1)}
                    disabled={i === 0}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: i === 0 ? "default" : "pointer",
                      color: i === 0 ? "var(--white-3)" : "var(--gray)",
                      fontSize: "10px",
                      padding: "2px",
                    }}
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => deplacerOrdre(c.id, 1)}
                    disabled={i === categories.length - 1}
                    style={{
                      background: "none",
                      border: "none",
                      cursor:
                        i === categories.length - 1 ? "default" : "pointer",
                      color:
                        i === categories.length - 1
                          ? "var(--white-3)"
                          : "var(--gray)",
                      fontSize: "10px",
                      padding: "2px",
                    }}
                  >
                    ▼
                  </button>
                </div>
                <div
                  onClick={() => {
                    setSelected(c.id);
                    setEditNom(false);
                  }}
                  style={{
                    flex: 1,
                    padding: "12px 10px 12px 4px",
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
                      marginBottom: "4px",
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>{c.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: "500",
                          color: c.actif ? "var(--noir)" : "var(--gray-light)",
                        }}
                      >
                        {c.nom}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                        {c.produits} produits · {c.sousCats.length} sous-cats
                      </div>
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleActif(c.id);
                      }}
                      style={{
                        width: 28,
                        height: 16,
                        borderRadius: "8px",
                        background: c.actif ? c.color : "#D1D5DB",
                        cursor: "pointer",
                        position: "relative",
                        transition: "background 0.2s",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 2,
                          left: c.actif ? 14 : 2,
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background: "#fff",
                          transition: "left 0.2s",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ marginLeft: "30px" }}>
                    <div
                      style={{
                        height: 4,
                        background: "var(--white-3)",
                        borderRadius: "4px",
                        overflow: "hidden",
                        maxWidth: "160px",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.min((c.produits / 300) * 100, 100)}%`,
                          background: c.color,
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Détail catégorie */}
        {cat && (
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
                padding: "20px 28px",
                borderBottom: "1px solid var(--white-3)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "14px" }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "12px",
                    background: `${cat.color}18`,
                    border: `2px solid ${cat.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                  }}
                >
                  {cat.icon}
                </div>
                <div>
                  {!editNom ? (
                    <>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "26px",
                          fontWeight: "300",
                          marginBottom: "4px",
                        }}
                      >
                        {cat.nom}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--gray)",
                          fontFamily: "monospace",
                        }}
                      >
                        /{cat.slug}
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <input
                        value={editForm.nom || cat.nom}
                        onChange={(e) =>
                          setEditForm((p) => ({ ...p, nom: e.target.value }))
                        }
                        style={{
                          padding: "6px 10px",
                          border: "1.5px solid var(--gold)",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "16px",
                          outline: "none",
                        }}
                        autoFocus
                      />
                      <button onClick={sauvegarderEdit} style={bStyle("gold")}>
                        Sauvegarder
                      </button>
                      <button
                        onClick={() => setEditNom(false)}
                        style={bStyle("ghost")}
                      >
                        Annuler
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {!editNom && (
                <button
                  onClick={() => {
                    setEditForm({ nom: cat.nom, description: cat.description });
                    setEditNom(true);
                  }}
                  style={bStyle("ghost")}
                >
                  Modifier
                </button>
              )}
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
              {/* Stats rapides */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                {[
                  { label: "Produits", val: cat.produits, color: cat.color },
                  {
                    label: "Boutiques",
                    val: cat.boutiques,
                    color: "var(--noir)",
                  },
                  {
                    label: "Sous-catégories",
                    val: cat.sousCats.length,
                    color: "#185fa5",
                  },
                  {
                    label: "Statut",
                    val: cat.actif ? "Active" : "Inactive",
                    color: cat.actif ? "#2e8b57" : "#6B7280",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{
                      background: "var(--gray-bg)",
                      borderRadius: "var(--radius-sm)",
                      padding: "12px 14px",
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
                        marginBottom: "5px",
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
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

              {/* Description */}
              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--gray)",
                    marginBottom: "8px",
                  }}
                >
                  Description
                </div>
                {!editNom ? (
                  <div
                    style={{
                      background: "var(--gray-bg)",
                      borderRadius: "var(--radius-sm)",
                      padding: "12px 14px",
                      fontSize: "13px",
                      color: "var(--noir)",
                      border: "1px solid var(--white-3)",
                    }}
                  >
                    {cat.description}
                  </div>
                ) : (
                  <textarea
                    value={editForm.description || cat.description}
                    onChange={(e) =>
                      setEditForm((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1.5px solid var(--gold)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "13px",
                      resize: "none",
                      outline: "none",
                    }}
                  />
                )}
              </div>

              {/* Sous-catégories */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
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
                    Sous-catégories ({cat.sousCats.length})
                  </div>
                  {!showAddSousCat && (
                    <button
                      onClick={() => setShowAddSousCat(true)}
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        color: cat.color,
                        padding: "3px 10px",
                        border: `1px dashed ${cat.color}`,
                        borderRadius: "20px",
                        cursor: "pointer",
                        background: `${cat.color}08`,
                      }}
                    >
                      + Ajouter
                    </button>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: showAddSousCat ? "12px" : 0,
                  }}
                >
                  {cat.sousCats.map((s) => (
                    <div
                      key={s}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "5px 12px",
                        borderRadius: "20px",
                        background: `${cat.color}12`,
                        border: `1px solid ${cat.color}30`,
                        fontSize: "12px",
                        fontWeight: "500",
                        color: cat.color,
                      }}
                    >
                      {s}
                      <button
                        onClick={() => supprimerSousCat(s)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: cat.color,
                          fontSize: "12px",
                          padding: "0",
                          lineHeight: 1,
                          opacity: 0.6,
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {cat.sousCats.length === 0 && (
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--gray-light)",
                        fontStyle: "italic",
                      }}
                    >
                      Aucune sous-catégorie.
                    </div>
                  )}
                </div>
                {showAddSousCat && (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      value={newSousCat}
                      onChange={(e) => setNewSousCat(e.target.value)}
                      placeholder="Nom de la sous-catégorie…"
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && ajouterSousCat()}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        border: "1.5px solid var(--gold)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "13px",
                        outline: "none",
                      }}
                    />
                    <button onClick={ajouterSousCat} style={bStyle("gold")}>
                      Ajouter
                    </button>
                    <button
                      onClick={() => {
                        setShowAddSousCat(false);
                        setNewSousCat("");
                      }}
                      style={bStyle("ghost")}
                    >
                      Annuler
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal nouvelle catégorie */}
      {showAddModal && (
        <div style={OVL} onClick={() => setShowAddModal(false)}>
          <div
            style={{ ...MDL, width: "440px" }}
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
              Nouvelle catégorie
            </h2>
            {[
              {
                label: "Nom *",
                key: "nom",
                placeholder: "Ex. : Sport & Outdoor",
              },
              { label: "Icône (emoji)", key: "icon", placeholder: "Ex. : 🏃" },
              { label: "Couleur (hex)", key: "color", placeholder: "#185fa5" },
              {
                label: "Description",
                key: "description",
                placeholder: "Description courte de la catégorie…",
              },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: "14px" }}>
                <label style={LBL}>{f.label}</label>
                <input
                  value={newCatForm[f.key]}
                  onChange={(e) =>
                    setNewCatForm((p) => ({ ...p, [f.key]: e.target.value }))
                  }
                  placeholder={f.placeholder}
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
                marginBottom: "20px",
                background: "var(--gray-bg)",
                borderRadius: "var(--radius-sm)",
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  background: `${newCatForm.color}18`,
                  border: `2px solid ${newCatForm.color}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                }}
              >
                {newCatForm.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: newCatForm.color,
                  }}
                >
                  {newCatForm.nom || "Aperçu"}
                </div>
                <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                  {newCatForm.description || "Description…"}
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowAddModal(false)}
                style={bStyle("ghost")}
              >
                Annuler
              </button>
              <button onClick={ajouterCategorie} style={bStyle("gold")}>
                Créer la catégorie
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
