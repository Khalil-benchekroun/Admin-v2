import React, { useState } from "react";
import toast from "react-hot-toast";

const COMPTES_DATA = [
  {
    id: "ADM-001",
    nom: "Khalil B.",
    email: "khalil@livrr.fr",
    role: "admin",
    statut: "actif",
    dateCreation: "01/01/2026",
    derniereConnexion: "Aujourd'hui 14:32",
    avatar: "K",
    notes: "Fondateur — accès total.",
  },
  {
    id: "ADM-002",
    nom: "Marie L.",
    email: "marie@livrr.fr",
    role: "sav",
    statut: "actif",
    dateCreation: "12/01/2026",
    derniereConnexion: "Aujourd'hui 11:05",
    avatar: "M",
    notes: "SAV principal. Horaires 9h-18h.",
  },
  {
    id: "ADM-003",
    nom: "Lucas D.",
    email: "lucas@livrr.fr",
    role: "sav",
    statut: "actif",
    dateCreation: "15/01/2026",
    derniereConnexion: "Hier 17:44",
    avatar: "L",
    notes: "",
  },
  {
    id: "ADM-004",
    nom: "Paul R.",
    email: "paul@livrr.fr",
    role: "ops",
    statut: "actif",
    dateCreation: "20/01/2026",
    derniereConnexion: "17/04/2026 09:10",
    avatar: "P",
    notes: "Modération & opérations terrain.",
  },
  {
    id: "ADM-005",
    nom: "Amina S.",
    email: "amina@livrr.fr",
    role: "sav",
    statut: "inactif",
    dateCreation: "01/02/2026",
    derniereConnexion: "01/03/2026 16:00",
    avatar: "A",
    notes: "Compte désactivé — congé maternité.",
  },
];

const ROLE_CFG = {
  admin: {
    label: "Admin Plateforme",
    color: "#C9A96E",
    bg: "rgba(201,169,110,0.1)",
    droits: [
      "Accès total",
      "Paramètres globaux",
      "Finance & commissions",
      "Gestion des comptes",
      "Arbitrage tous statuts",
    ],
  },
  sav: {
    label: "SAV / Support",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.1)",
    droits: [
      "Commandes — lecture + annuler + rembourser",
      "Clients — lecture + signalement",
      "Tickets & litiges",
      "Retours — valider + rembourser",
      "Pas d'accès Finance ni Paramètres",
    ],
  },
  ops: {
    label: "Ops / Modération",
    color: "#10B981",
    bg: "rgba(16,185,129,0.1)",
    droits: [
      "Commandes — lecture + bloquer",
      "Boutiques — lecture + suspension",
      "Clients — lecture + blocage",
      "Modération des contenus",
      "Pas d'accès Finance ni Paramètres",
    ],
  },
};

const STATUT_CFG = {
  actif: { label: "Actif", color: "#2e8b57", bg: "#e8f5ee", dot: "#10B981" },
  inactif: {
    label: "Inactif",
    color: "#6B7280",
    bg: "#f3f4f6",
    dot: "#9CA3AF",
  },
};

export default function Comptes() {
  const [comptes, setComptes] = useState(COMPTES_DATA);
  const [selected, setSelected] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditRole, setShowEditRole] = useState(false);
  const [filterRole, setFilterRole] = useState("all");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ nom: "", email: "", role: "sav" });
  const [newRole, setNewRole] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  const compte = selected ? comptes.find((c) => c.id === selected) : null;

  const filtres = comptes.filter((c) => {
    const matchRole = filterRole === "all" || c.role === filterRole;
    const matchSearch =
      c.nom.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const stats = {
    total: comptes.length,
    actifs: comptes.filter((c) => c.statut === "actif").length,
    admins: comptes.filter((c) => c.role === "admin").length,
    sav: comptes.filter((c) => c.role === "sav").length,
    ops: comptes.filter((c) => c.role === "ops").length,
  };

  const creerCompte = () => {
    if (!form.nom.trim()) {
      toast.error("Nom requis");
      return;
    }
    if (!form.email.trim() || !form.email.includes("@")) {
      toast.error("Email invalide");
      return;
    }
    const newCompte = {
      id: `ADM-${String(comptes.length + 1).padStart(3, "0")}`,
      nom: form.nom,
      email: form.email,
      role: form.role,
      statut: "actif",
      dateCreation: new Date().toLocaleDateString("fr-FR"),
      derniereConnexion: "Jamais",
      avatar: form.nom.charAt(0).toUpperCase(),
      notes: "",
    };
    setComptes((prev) => [...prev, newCompte]);
    setForm({ nom: "", email: "", role: "sav" });
    setShowCreateModal(false);
    setSelected(newCompte.id);
    toast.success(`Compte créé pour ${newCompte.nom}`);
  };

  const changerRole = () => {
    if (!newRole) {
      toast.error("Choisissez un rôle");
      return;
    }
    setComptes((prev) =>
      prev.map((c) => (c.id === selected ? { ...c, role: newRole } : c))
    );
    setShowEditRole(false);
    setNewRole("");
    toast.success(`Rôle mis à jour → ${ROLE_CFG[newRole].label}`);
  };

  const toggleStatut = () => {
    const newStatut = compte.statut === "actif" ? "inactif" : "actif";
    setComptes((prev) =>
      prev.map((c) => (c.id === selected ? { ...c, statut: newStatut } : c))
    );
    toast.success(
      newStatut === "actif" ? "Compte réactivé" : "Compte désactivé"
    );
  };

  const ajouterNote = () => {
    if (!noteInput.trim()) return;
    setComptes((prev) =>
      prev.map((c) =>
        c.id === selected
          ? {
              ...c,
              notes: c.notes
                ? c.notes + "\n" + noteInput.trim()
                : noteInput.trim(),
            }
          : c
      )
    );
    setNoteInput("");
    setShowNoteInput(false);
    toast.success("Note ajoutée");
  };

  const reinitialiserMdp = () => {
    toast.success(`Email de réinitialisation envoyé à ${compte?.email}`);
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
            Comptes & accès
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}
          >
            Gestion des comptes internes Admin, SAV et Ops
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
          }}
        >
          + Créer un compte
        </button>
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
          { label: "Total comptes", val: stats.total, color: "var(--noir)" },
          { label: "Actifs", val: stats.actifs, color: "#2e8b57" },
          { label: "Admin", val: stats.admins, color: "#C9A96E" },
          { label: "SAV", val: stats.sav, color: "#3B82F6" },
          { label: "Ops", val: stats.ops, color: "#10B981" },
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
              placeholder="Nom, email…"
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
              <button
                onClick={() => setFilterRole("all")}
                style={fBtn(filterRole === "all")}
              >
                Tous
              </button>
              {Object.entries(ROLE_CFG).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setFilterRole(k)}
                  style={fBtn(filterRole === k, v.color, v.bg)}
                >
                  {v.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtres.map((c) => {
              const role = ROLE_CFG[c.role];
              const statut = STATUT_CFG[c.statut];
              const isActive = selected === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelected(c.id);
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
                      marginBottom: "4px",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "8px",
                        background: role.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        fontWeight: "700",
                        color: role.color,
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
                        }}
                      >
                        <span style={{ fontSize: "13px", fontWeight: "500" }}>
                          {c.nom}
                        </span>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: "600",
                            padding: "2px 7px",
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
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "600",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      background: role.bg,
                      color: role.color,
                    }}
                  >
                    {role.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Détail */}
        {!compte ? (
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
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>👥</div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "22px",
                fontWeight: "300",
                marginBottom: "8px",
              }}
            >
              Sélectionnez un compte
            </div>
            <div style={{ fontSize: "13px" }}>Gérez les rôles et accès</div>
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
                <div
                  style={{ display: "flex", alignItems: "center", gap: "14px" }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      background: ROLE_CFG[compte.role].bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      fontWeight: "700",
                      color: ROLE_CFG[compte.role].color,
                    }}
                  >
                    {compte.avatar}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "24px",
                        fontWeight: "300",
                        marginBottom: "6px",
                      }}
                    >
                      {compte.nom}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          padding: "3px 10px",
                          borderRadius: "12px",
                          background: ROLE_CFG[compte.role].bg,
                          color: ROLE_CFG[compte.role].color,
                        }}
                      >
                        {ROLE_CFG[compte.role].label}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          padding: "3px 10px",
                          borderRadius: "12px",
                          background: STATUT_CFG[compte.statut].bg,
                          color: STATUT_CFG[compte.statut].color,
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: STATUT_CFG[compte.statut].dot,
                            display: "inline-block",
                            marginRight: "5px",
                          }}
                        />
                        {STATUT_CFG[compte.statut].label}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <button onClick={reinitialiserMdp} style={btnStyle("ghost")}>
                    Réinitialiser MDP
                  </button>
                  <button
                    onClick={() => {
                      setNewRole(compte.role);
                      setShowEditRole(true);
                    }}
                    style={btnStyle("primary")}
                  >
                    Changer le rôle
                  </button>
                  <button
                    onClick={toggleStatut}
                    style={btnStyle(
                      compte.statut === "actif" ? "error" : "success"
                    )}
                  >
                    {compte.statut === "actif" ? "Désactiver" : "Réactiver"}
                  </button>
                </div>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
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
                  { label: "Email", val: compte.email },
                  { label: "ID", val: compte.id, mono: true },
                  { label: "Création", val: compte.dateCreation },
                  {
                    label: "Dernière connexion",
                    val: compte.derniereConnexion,
                  },
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
                      }}
                    >
                      {r.val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Droits du rôle */}
              <div style={{ marginBottom: "22px" }}>
                <Label>
                  Droits associés au rôle {ROLE_CFG[compte.role].label}
                </Label>
                <div
                  style={{
                    background: ROLE_CFG[compte.role].bg,
                    border: `1.5px solid ${ROLE_CFG[compte.role].color}30`,
                    borderRadius: "var(--radius-md)",
                    padding: "16px 18px",
                  }}
                >
                  {ROLE_CFG[compte.role].droits.map((d, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom:
                          i < ROLE_CFG[compte.role].droits.length - 1
                            ? "8px"
                            : 0,
                      }}
                    >
                      <span
                        style={{
                          color: ROLE_CFG[compte.role].color,
                          fontWeight: "700",
                          fontSize: "12px",
                        }}
                      >
                        ✓
                      </span>
                      <span style={{ fontSize: "13px", color: "var(--noir)" }}>
                        {d}
                      </span>
                    </div>
                  ))}
                </div>
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
                  <Label style={{ margin: 0 }}>Notes internes</Label>
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
                    color: compte.notes ? "var(--noir)" : "var(--gray-light)",
                    fontStyle: compte.notes ? "normal" : "italic",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                    marginBottom: showNoteInput ? "10px" : 0,
                  }}
                >
                  {compte.notes || "Aucune note."}
                </div>
                {showNoteInput && (
                  <div>
                    <textarea
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
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
                          setNoteInput("");
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

      {/* Modal créer */}
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
              Créer un compte
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "24px",
              }}
            >
              Un email d'invitation sera envoyé pour définir le mot de passe.
            </p>
            <Label>Nom complet *</Label>
            <input
              type="text"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              placeholder="Prénom Nom"
              style={inputStyle}
            />
            <Label>Email *</Label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="prenom@livrr.fr"
              style={inputStyle}
            />
            <Label>Rôle</Label>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginBottom: "24px",
              }}
            >
              {Object.entries(ROLE_CFG).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setForm({ ...form, role: k })}
                  style={{
                    textAlign: "left",
                    padding: "12px 16px",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    border: `2px solid ${
                      form.role === k ? v.color : "var(--white-3)"
                    }`,
                    background: form.role === k ? v.bg : "transparent",
                    transition: "all 0.15s",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: form.role === k ? v.color : "var(--noir)",
                      marginBottom: "3px",
                    }}
                  >
                    {v.label}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                    {v.droits[0]} · {v.droits[1]}
                  </div>
                </button>
              ))}
            </div>
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
              <button onClick={creerCompte} style={btnStyle("gold")}>
                Créer le compte
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal changer rôle */}
      {showEditRole && compte && (
        <div style={overlayStyle} onClick={() => setShowEditRole(false)}>
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
              Changer le rôle
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "24px",
              }}
            >
              {compte.nom} — actuellement {ROLE_CFG[compte.role].label}
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginBottom: "24px",
              }}
            >
              {Object.entries(ROLE_CFG).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setNewRole(k)}
                  style={{
                    textAlign: "left",
                    padding: "12px 16px",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    border: `2px solid ${
                      newRole === k ? v.color : "var(--white-3)"
                    }`,
                    background: newRole === k ? v.bg : "transparent",
                    transition: "all 0.15s",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: newRole === k ? v.color : "var(--noir)",
                    }}
                  >
                    {v.label}
                  </div>
                </button>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowEditRole(false)}
                style={btnStyle("ghost")}
              >
                Annuler
              </button>
              <button onClick={changerRole} style={btnStyle("gold")}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
    primary: {
      background: "var(--gray-bg)",
      color: "var(--noir)",
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
    padding: "9px 14px",
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
