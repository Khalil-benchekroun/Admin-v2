import React, { useState } from "react";
import toast from "react-hot-toast";

const SIGNALEMENTS_DATA = [
  {
    id: "SIG-031",
    type: "produit",
    statut: "en_attente",
    priorite: "haute",
    sujet: "Photo de produit non conforme",
    detail:
      "La photo montre un article différent de la description (coloris incorrect). Signalé par 2 clients cette semaine.",
    cible: { nom: "Robe Milena — Noir", ref: "IM-0891" },
    boutique: "Isabel Marant",
    signalePar: "Yasmine B.",
    date: "17/04/2026",
    heure: "10:22",
    notes: "",
  },
  {
    id: "SIG-030",
    type: "message",
    statut: "en_attente",
    priorite: "haute",
    sujet: "Message hors-plateforme d'une boutique",
    detail:
      "Le message contient des coordonnées directes (numéro WhatsApp) pour contourner la plateforme.",
    cible: { nom: "Message #MSG-4421", ref: "MSG-4421" },
    boutique: "Rouje",
    signalePar: "Emma B.",
    date: "16/04/2026",
    heure: "18:05",
    notes: "",
  },
  {
    id: "SIG-029",
    type: "boutique",
    statut: "en_cours",
    priorite: "normale",
    sujet: "Boutique inactive depuis 5 jours",
    detail:
      "La boutique n'a pas accepté de commande depuis le 12/04. 3 commandes ont été automatiquement annulées.",
    cible: { nom: "Isabel Marant", ref: "BTQ-003" },
    boutique: "Isabel Marant",
    signalePar: "Système automatique",
    date: "17/04/2026",
    heure: "08:00",
    notes: "Contactée par email le 16/04 — pas de réponse.",
  },
  {
    id: "SIG-028",
    type: "produit",
    statut: "en_cours",
    priorite: "normale",
    sujet: "Description produit trompeuse",
    detail:
      "Le prix affiché ne correspond pas au prix final. Des frais de conditionnement non mentionnés sont ajoutés au checkout.",
    cible: { nom: "Sac Cabas Cuir — Camel", ref: "SP-0881" },
    boutique: "Sandro Paris",
    signalePar: "Lucas D.",
    date: "15/04/2026",
    heure: "14:30",
    notes: "Boutique contactée — en attente de correction.",
  },
  {
    id: "SIG-027",
    type: "client",
    statut: "résolu",
    priorite: "normale",
    sujet: "Comportement abusif client",
    detail:
      "Le client a initié 3 chargebacks en moins d'un mois sans motif valide, causant des pertes aux boutiques.",
    cible: { nom: "Nadia S.", ref: "CLT-006" },
    boutique: "—",
    signalePar: "Marie (SAV)",
    date: "14/04/2026",
    heure: "11:00",
    notes: "Compte bloqué le 14/04 — décision admin validée.",
  },
  {
    id: "SIG-026",
    type: "produit",
    statut: "rejeté",
    priorite: "normale",
    sujet: "Photo produit signalée à tort",
    detail:
      "Après vérification manuelle, la photo est conforme aux CGU. Signalement non fondé.",
    cible: { nom: "Pull Alexandre — Marine", ref: "AMI-0221" },
    boutique: "AMI Paris",
    signalePar: "Inconnu",
    date: "12/04/2026",
    heure: "09:15",
    notes: "Rejeté après vérification — photo conforme.",
  },
];

const TYPE_CFG = {
  produit: { label: "Produit", color: "#185fa5", bg: "#eff6ff", icon: "🏷️" },
  message: { label: "Message", color: "#6d28d9", bg: "#f5f3ff", icon: "💬" },
  boutique: { label: "Boutique", color: "#b7770d", bg: "#faeeda", icon: "🏪" },
  client: { label: "Client", color: "#c0392b", bg: "#fef2f2", icon: "👤" },
};

const STATUT_CFG = {
  en_attente: {
    label: "En attente",
    color: "#b7770d",
    bg: "#faeeda",
    dot: "#F59E0B",
  },
  en_cours: {
    label: "En cours",
    color: "#185fa5",
    bg: "#eff6ff",
    dot: "#3B82F6",
  },
  résolu: { label: "Résolu", color: "#2e8b57", bg: "#e8f5ee", dot: "#10B981" },
  rejeté: { label: "Rejeté", color: "#6B7280", bg: "#f3f4f6", dot: "#9CA3AF" },
};

const ACTIONS = [
  "Contacter la boutique",
  "Suspendre temporairement le contenu",
  "Supprimer le contenu",
  "Bloquer le compte concerné",
  "Escalader à l'admin plateforme",
  "Aucune action requise",
];

export default function Moderation() {
  const [items, setItems] = useState(SIGNALEMENTS_DATA);
  const [selected, setSelected] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [filterStatut, setFilterStatut] = useState("all");
  const [search, setSearch] = useState("");
  const [noteText, setNoteText] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionChoisie, setActionChoisie] = useState("");
  const [actionMotif, setActionMotif] = useState("");

  const item = selected ? items.find((i) => i.id === selected) : null;

  const filtres = items.filter(
    (i) =>
      (filterType === "all" || i.type === filterType) &&
      (filterStatut === "all" || i.statut === filterStatut) &&
      (i.id.toLowerCase().includes(search.toLowerCase()) ||
        i.sujet.toLowerCase().includes(search.toLowerCase()) ||
        i.boutique.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    total: items.length,
    enAttente: items.filter((i) => i.statut === "en_attente").length,
    hautes: items.filter(
      (i) => i.priorite === "haute" && !["résolu", "rejeté"].includes(i.statut)
    ).length,
    resolus: items.filter((i) => ["résolu", "rejeté"].includes(i.statut))
      .length,
  };

  const changerStatut = (s) => {
    setItems((prev) =>
      prev.map((i) => (i.id === selected ? { ...i, statut: s } : i))
    );
    toast.success(STATUT_CFG[s].label);
  };

  const appliquerAction = () => {
    if (!actionChoisie) {
      toast.error("Sélectionnez une action");
      return;
    }
    if (!actionMotif.trim()) {
      toast.error("Motif obligatoire");
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === selected
          ? {
              ...i,
              statut: "résolu",
              notes: i.notes
                ? i.notes + "\nAction : " + actionChoisie + " — " + actionMotif
                : "Action : " + actionChoisie + " — " + actionMotif,
            }
          : i
      )
    );
    setShowActionModal(false);
    setActionChoisie("");
    setActionMotif("");
    toast.success("Action appliquée — signalement résolu");
  };

  const ajouterNote = () => {
    if (!noteText.trim()) return;
    setItems((prev) =>
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
    <div className="page" style={{ padding: "32px 36px" }}>
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
          Modération
        </h1>
        <p style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}>
          Signalements, contenus à valider et actions correctives
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          marginBottom: "18px",
        }}
      >
        {[
          {
            label: "Total signalements",
            val: stats.total,
            color: "var(--noir)",
          },
          { label: "En attente", val: stats.enAttente, color: "#b7770d" },
          { label: "Haute priorité", val: stats.hautes, color: "#c0392b" },
          { label: "Résolus / Rejetés", val: stats.resolus, color: "#2e8b57" },
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--white-3)",
            display: "flex",
            flexDirection: "column",
            maxHeight: "calc(100vh - 260px)",
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
              placeholder="ID, sujet, boutique…"
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
                onClick={() => setFilterType("all")}
                style={fBtn(filterType === "all")}
              >
                Tous
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
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtres.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px 24px",
                  color: "var(--gray)",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔍</div>
                <div style={{ fontSize: "13px" }}>Aucun signalement trouvé</div>
              </div>
            )}
            {filtres.map((sig) => {
              const tc = TYPE_CFG[sig.type];
              const sc = STATUT_CFG[sig.statut];
              const isActive = selected === sig.id;
              return (
                <div
                  key={sig.id}
                  onClick={() => {
                    setSelected(sig.id);
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
                        {sig.id}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "600",
                          padding: "1px 7px",
                          borderRadius: "10px",
                          background: tc.bg,
                          color: tc.color,
                        }}
                      >
                        {tc.icon} {tc.label}
                      </span>
                      {sig.priorite === "haute" && (
                        <span
                          style={{
                            fontSize: "9px",
                            fontWeight: "800",
                            color: "#c0392b",
                            background: "#fef2f2",
                            padding: "1px 6px",
                            borderRadius: "10px",
                          }}
                        >
                          URGENT
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
                    {sig.sujet}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                    {sig.boutique} · {sig.heure} {sig.date}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {!item ? (
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
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "22px",
                fontWeight: "300",
                marginBottom: "8px",
              }}
            >
              Sélectionnez un signalement
            </div>
            <div style={{ fontSize: "13px" }}>
              Cliquez pour voir le détail et agir
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
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "22px",
                      fontWeight: "300",
                      marginBottom: "8px",
                    }}
                  >
                    {item.sujet}
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
                        background: TYPE_CFG[item.type].bg,
                        color: TYPE_CFG[item.type].color,
                      }}
                    >
                      {TYPE_CFG[item.type].icon} {TYPE_CFG[item.type].label}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        background: STATUT_CFG[item.statut].bg,
                        color: STATUT_CFG[item.statut].color,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: STATUT_CFG[item.statut].dot,
                          display: "inline-block",
                          marginRight: "5px",
                        }}
                      />
                      {STATUT_CFG[item.statut].label}
                    </span>
                    {item.priorite === "haute" && (
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
                        ⚠ Haute priorité
                      </span>
                    )}
                  </div>
                </div>
                {!["résolu", "rejeté"].includes(item.statut) && (
                  <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    {item.statut !== "en_cours" && (
                      <button
                        onClick={() => changerStatut("en_cours")}
                        style={bStyle("ghost")}
                      >
                        Passer en cours
                      </button>
                    )}
                    <button
                      onClick={() => changerStatut("rejeté")}
                      style={bStyle("ghost")}
                    >
                      Rejeter
                    </button>
                    <button
                      onClick={() => setShowActionModal(true)}
                      style={bStyle("gold")}
                    >
                      Appliquer une action
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <STitle>Élément signalé</STitle>
                  <IBox>
                    <IRow label="Type" val={TYPE_CFG[item.type].label} />
                    <IRow label="Nom" val={item.cible.nom} />
                    <IRow label="Référence" val={item.cible.ref} mono />
                    <IRow label="Boutique" val={item.boutique} />
                  </IBox>
                </div>
                <div>
                  <STitle>Source du signalement</STitle>
                  <IBox>
                    <IRow label="Signalé par" val={item.signalePar} />
                    <IRow label="Date" val={item.date} />
                    <IRow label="Heure" val={item.heure} />
                    <IRow label="ID" val={item.id} mono />
                  </IBox>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <STitle>Détail du signalement</STitle>
                <div
                  style={{
                    background: "#fffbeb",
                    border: "1px solid #fde68a",
                    borderRadius: "var(--radius-md)",
                    padding: "14px 18px",
                    fontSize: "13px",
                    lineHeight: 1.7,
                    color: "var(--noir)",
                  }}
                >
                  {item.detail}
                </div>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <STitle style={{ margin: 0 }}>Notes internes</STitle>
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
                    background: "var(--gray-bg)",
                    border: "1px solid var(--white-3)",
                    borderRadius: "var(--radius-md)",
                    padding: "14px 18px",
                    fontSize: "13px",
                    color: item.notes ? "var(--noir)" : "var(--gray-light)",
                    fontStyle: item.notes ? "normal" : "italic",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                    marginBottom: showNoteInput ? "10px" : 0,
                  }}
                >
                  {item.notes || "Aucune note pour ce signalement."}
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

      {showActionModal && item && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10,10,15,0.55)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowActionModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--radius-lg)",
              padding: "32px",
              width: "500px",
              boxShadow: "var(--shadow-lg)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
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
              Appliquer une action
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "20px",
              }}
            >
              {item.id} · {item.sujet}
            </p>
            <label style={LBL}>Action corrective *</label>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                marginBottom: "16px",
              }}
            >
              {ACTIONS.map((a) => (
                <button
                  key={a}
                  onClick={() => setActionChoisie(a)}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "13px",
                    border:
                      "1.5px solid " +
                      (actionChoisie === a ? "var(--gold)" : "var(--white-3)"),
                    background:
                      actionChoisie === a
                        ? "rgba(201,169,110,0.08)"
                        : "transparent",
                    color:
                      actionChoisie === a ? "var(--gold-dark)" : "var(--noir)",
                    cursor: "pointer",
                    fontWeight: actionChoisie === a ? "600" : "400",
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
            <label style={LBL}>Motif obligatoire *</label>
            <textarea
              value={actionMotif}
              onChange={(e) => setActionMotif(e.target.value)}
              placeholder="Justifiez l'action choisie…"
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
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowActionModal(false)}
                style={bStyle("ghost")}
              >
                Annuler
              </button>
              <button onClick={appliquerAction} style={bStyle("gold")}>
                Confirmer l'action
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
function IRow({ label, val, mono }) {
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
          fontWeight: "500",
          textAlign: "right",
          fontFamily: mono ? "monospace" : "inherit",
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
    border:
      "1.5px solid " + (active ? color || "var(--gold)" : "var(--white-3)"),
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
    padding: "8px 16px",
    borderRadius: "var(--radius-sm)",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    ...s[t],
  };
}
const LBL = {
  display: "block",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--gray)",
  marginBottom: "8px",
};
