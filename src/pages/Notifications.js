import React, { useState } from "react";
import toast from "react-hot-toast";

// ── Templates de notifications ─────────────────────────────
const TEMPLATES_DATA = [
  {
    id: "cmd_nouvelle",
    categorie: "commandes",
    evenement: "Nouvelle commande",
    description: "Envoyée à la boutique dès qu'un client passe une commande",
    destinataires: ["boutique"],
    canaux: { push: true, email: true, sms: false },
    actif: true,
    sujet: "Nouvelle commande #{id} — {boutique}",
    corps:
      "Vous avez reçu une nouvelle commande de {client} pour un montant de {montant}€. Vous avez {delai} minutes pour l'accepter.",
    delaiEnvoi: "immédiat",
  },
  {
    id: "cmd_acceptee",
    categorie: "commandes",
    evenement: "Commande acceptée",
    description: "Envoyée au client quand la boutique accepte",
    destinataires: ["client"],
    canaux: { push: true, email: true, sms: false },
    actif: true,
    sujet: "Votre commande est en préparation",
    corps:
      "Bonne nouvelle ! {boutique} prépare votre commande. Livraison estimée : {eta}.",
    delaiEnvoi: "immédiat",
  },
  {
    id: "cmd_refusee",
    categorie: "commandes",
    evenement: "Commande refusée",
    description: "Envoyée au client quand la boutique refuse",
    destinataires: ["client"],
    canaux: { push: true, email: true, sms: false },
    actif: true,
    sujet: "Votre commande n'a pas pu être honorée",
    corps:
      "La commande #{id} a été refusée par {boutique}. Motif : {motif}. Vous serez remboursé sous 3-5 jours ouvrés.",
    delaiEnvoi: "immédiat",
  },
  {
    id: "cmd_prete",
    categorie: "commandes",
    evenement: "Commande prête",
    description:
      "Envoyée au client quand la commande est prête à être récupérée par le coursier",
    destinataires: ["client"],
    canaux: { push: true, email: false, sms: false },
    actif: true,
    sujet: "Votre commande est prête !",
    corps:
      "Votre commande chez {boutique} est prête. Le coursier est en route.",
    delaiEnvoi: "immédiat",
  },
  {
    id: "cmd_livree",
    categorie: "commandes",
    evenement: "Commande livrée",
    description:
      "Envoyée au client à la livraison + à la boutique pour confirmation",
    destinataires: ["client", "boutique"],
    canaux: { push: true, email: true, sms: false },
    actif: true,
    sujet: "Commande livrée — merci pour votre confiance",
    corps:
      "Votre commande #{id} a bien été livrée. Bonne dégustation / utilisation ! Laissez un avis pour {boutique}.",
    delaiEnvoi: "immédiat",
  },
  {
    id: "cmd_annulee",
    categorie: "commandes",
    evenement: "Commande annulée (SAV)",
    description:
      "Envoyée au client et à la boutique en cas d'annulation par le SAV",
    destinataires: ["client", "boutique"],
    canaux: { push: true, email: true, sms: false },
    actif: true,
    sujet: "Commande #{id} annulée",
    corps:
      "La commande #{id} a été annulée. Motif : {motif}. Remboursement déclenché sous 3-5 jours.",
    delaiEnvoi: "immédiat",
  },
  {
    id: "retour_recu",
    categorie: "retours",
    evenement: "Retour reçu",
    description:
      "Envoyée au client quand la boutique confirme réception du retour",
    destinataires: ["client"],
    canaux: { push: true, email: true, sms: false },
    actif: true,
    sujet: "Retour reçu par {boutique}",
    corps:
      "Votre retour a bien été reçu. Le remboursement de {montant}€ sera déclenché sous 3-5 jours ouvrés.",
    delaiEnvoi: "immédiat",
  },
  {
    id: "boutique_inactive",
    categorie: "alertes_systeme",
    evenement: "Boutique inactive",
    description:
      "Alerte admin si une boutique n'accepte aucune commande depuis X heures",
    destinataires: ["admin"],
    canaux: { push: false, email: true, sms: false },
    actif: true,
    sujet: "⚠ Boutique inactive — {boutique}",
    corps:
      "La boutique {boutique} n'a pas accepté de commande depuis {duree}h. Intervention recommandée.",
    delaiEnvoi: "après 4h d'inactivité",
  },
  {
    id: "quota_atteint",
    categorie: "alertes_systeme",
    evenement: "Quota produits atteint",
    description: "Alerte boutique si elle dépasse 90% de son quota produits",
    destinataires: ["boutique"],
    canaux: { push: false, email: true, sms: false },
    actif: true,
    sujet: "Votre quota produits est presque atteint",
    corps:
      "Vous utilisez {pct}% de votre quota ({utilise}/{max} produits). Envisagez un upgrade de votre plan.",
    delaiEnvoi: "à 90% du quota",
  },
  {
    id: "avis_client",
    categorie: "avis",
    evenement: "Demande d'avis post-livraison",
    description: "Demande d'avis envoyée au client 2h après la livraison",
    destinataires: ["client"],
    canaux: { push: true, email: false, sms: false },
    actif: false,
    sujet: "Comment s'est passée votre livraison ?",
    corps:
      "Vous avez commandé chez {boutique}. Donnez votre avis en 30 secondes — cela aide toute la communauté.",
    delaiEnvoi: "2h après livraison",
  },
];

const CATEGORIES = {
  commandes: { label: "Commandes", color: "#185fa5", bg: "#eff6ff" },
  retours: { label: "Retours", color: "#b7770d", bg: "#faeeda" },
  alertes_systeme: {
    label: "Alertes système",
    color: "#c0392b",
    bg: "#fef2f2",
  },
  avis: { label: "Avis", color: "#6d28d9", bg: "#f5f3ff" },
};

const DEST_CFG = {
  client: { label: "Client", color: "#2e8b57" },
  boutique: { label: "Boutique", color: "#185fa5" },
  admin: { label: "Admin", color: "#C9A96E" },
};

const VARIABLES = [
  "{id}",
  "{client}",
  "{boutique}",
  "{montant}",
  "{eta}",
  "{motif}",
  "{duree}",
  "{pct}",
  "{utilise}",
  "{max}",
  "{delai}",
];

export default function Notifications() {
  const [templates, setTemplates] = useState(TEMPLATES_DATA);
  const [selected, setSelected] = useState("cmd_nouvelle");
  const [filterCat, setFilterCat] = useState("all");
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});

  const tpl = templates.find((t) => t.id === selected);
  const filtres = templates.filter(
    (t) => filterCat === "all" || t.categorie === filterCat
  );

  const stats = {
    total: templates.length,
    actifs: templates.filter((t) => t.actif).length,
    inactifs: templates.filter((t) => !t.actif).length,
    push: templates.filter((t) => t.actif && t.canaux.push).length,
    email: templates.filter((t) => t.actif && t.canaux.email).length,
  };

  const toggleActif = (id) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, actif: !t.actif } : t))
    );
    const t = templates.find((t) => t.id === id);
    toast.success(t.actif ? "Notification désactivée" : "Notification activée");
  };

  const toggleCanal = (id, canal) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, canaux: { ...t.canaux, [canal]: !t.canaux[canal] } }
          : t
      )
    );
  };

  const sauvegarderEdit = () => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === selected ? { ...t, ...editForm } : t))
    );
    setEditMode(false);
    toast.success("Template mis à jour");
  };

  const startEdit = () => {
    setEditForm({
      sujet: tpl.sujet,
      corps: tpl.corps,
      delaiEnvoi: tpl.delaiEnvoi,
    });
    setEditMode(true);
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
          Notifications
        </h1>
        <p style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}>
          Templates, canaux et déclencheurs des notifications plateforme
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
          { label: "Templates totaux", val: stats.total, color: "var(--noir)" },
          { label: "Actifs", val: stats.actifs, color: "#2e8b57" },
          { label: "Inactifs", val: stats.inactifs, color: "#6B7280" },
          { label: "Push activés", val: stats.push, color: "#185fa5" },
          { label: "Email activés", val: stats.email, color: "#b7770d" },
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

      {/* Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: "20px",
        }}
      >
        {/* Liste templates */}
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
          <div
            style={{
              padding: "12px 14px",
              borderBottom: "1px solid var(--white-3)",
            }}
          >
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              <button
                onClick={() => setFilterCat("all")}
                style={fBtn(filterCat === "all")}
              >
                Tous
              </button>
              {Object.entries(CATEGORIES).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setFilterCat(k)}
                  style={fBtn(filterCat === k, v.color, v.bg)}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtres.map((t) => {
              const cat = CATEGORIES[t.categorie];
              const isActive = selected === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    setSelected(t.id);
                    setEditMode(false);
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
                      marginBottom: "4px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        flex: 1,
                        marginRight: "8px",
                      }}
                    >
                      {t.evenement}
                    </div>
                    {/* Toggle on/off */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleActif(t.id);
                      }}
                      style={{
                        width: 32,
                        height: 18,
                        borderRadius: "9px",
                        background: t.actif ? "var(--gold)" : "#D1D5DB",
                        cursor: "pointer",
                        position: "relative",
                        flexShrink: 0,
                        transition: "background 0.2s",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 2,
                          left: t.actif ? 16 : 2,
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          background: "#fff",
                          transition: "left 0.2s",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        padding: "1px 7px",
                        borderRadius: "10px",
                        background: cat.bg,
                        color: cat.color,
                      }}
                    >
                      {cat.label}
                    </span>
                    {t.canaux.push && (
                      <span style={{ fontSize: "10px", color: "var(--gray)" }}>
                        📲
                      </span>
                    )}
                    {t.canaux.email && (
                      <span style={{ fontSize: "10px", color: "var(--gray)" }}>
                        📧
                      </span>
                    )}
                    {t.canaux.sms && (
                      <span style={{ fontSize: "10px", color: "var(--gray)" }}>
                        💬
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: "10px",
                        color: "var(--gray-light)",
                        marginLeft: "auto",
                      }}
                    >
                      {t.destinataires
                        .map((d) => DEST_CFG[d]?.label)
                        .join(", ")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Détail template */}
        {tpl && (
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
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "22px",
                    fontWeight: "300",
                    marginBottom: "6px",
                  }}
                >
                  {tpl.evenement}
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
                      background: CATEGORIES[tpl.categorie].bg,
                      color: CATEGORIES[tpl.categorie].color,
                    }}
                  >
                    {CATEGORIES[tpl.categorie].label}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      padding: "3px 10px",
                      borderRadius: "20px",
                      background: tpl.actif ? "#e8f5ee" : "#f3f4f6",
                      color: tpl.actif ? "#2e8b57" : "#6B7280",
                    }}
                  >
                    {tpl.actif ? "✓ Actif" : "Inactif"}
                  </span>
                  {tpl.destinataires.map((d) => (
                    <span
                      key={d}
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        background: "var(--gray-bg)",
                        color: DEST_CFG[d]?.color,
                      }}
                    >
                      {DEST_CFG[d]?.label}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {!editMode && (
                  <button onClick={startEdit} style={bStyle("ghost")}>
                    Modifier le template
                  </button>
                )}
                {editMode && (
                  <>
                    <button
                      onClick={() => setEditMode(false)}
                      style={bStyle("ghost")}
                    >
                      Annuler
                    </button>
                    <button onClick={sauvegarderEdit} style={bStyle("gold")}>
                      Sauvegarder
                    </button>
                  </>
                )}
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
              {/* Canaux */}
              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--gray)",
                    marginBottom: "12px",
                  }}
                >
                  Canaux d'envoi
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  {[
                    { key: "push", label: "Push notification", icon: "📲" },
                    { key: "email", label: "Email", icon: "📧" },
                    { key: "sms", label: "SMS", icon: "💬" },
                  ].map((c) => (
                    <div
                      key={c.key}
                      onClick={() => toggleCanal(tpl.id, c.key)}
                      style={{
                        flex: 1,
                        padding: "14px 16px",
                        borderRadius: "var(--radius-md)",
                        border: `2px solid ${
                          tpl.canaux[c.key] ? "var(--gold)" : "var(--white-3)"
                        }`,
                        background: tpl.canaux[c.key]
                          ? "rgba(201,169,110,0.06)"
                          : "transparent",
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{ fontSize: "24px", marginBottom: "6px" }}>
                        {c.icon}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: tpl.canaux[c.key]
                            ? "var(--gold-dark)"
                            : "var(--gray)",
                        }}
                      >
                        {c.label}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: tpl.canaux[c.key] ? "#2e8b57" : "#c0392b",
                          fontWeight: "600",
                          marginTop: "4px",
                        }}
                      >
                        {tpl.canaux[c.key] ? "Activé" : "Désactivé"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Déclencheur */}
              <div style={{ marginBottom: "20px" }}>
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
                  Déclencheur
                </div>
                <div
                  style={{
                    background: "var(--gray-bg)",
                    border: "1px solid var(--white-3)",
                    borderRadius: "var(--radius-sm)",
                    padding: "10px 14px",
                    fontSize: "13px",
                  }}
                >
                  {tpl.description} · <strong>{tpl.delaiEnvoi}</strong>
                </div>
              </div>

              {/* Contenu */}
              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--gray)",
                    marginBottom: "12px",
                  }}
                >
                  Contenu du message
                </div>
                {!editMode ? (
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
                        fontSize: "10px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--gray)",
                        marginBottom: "6px",
                      }}
                    >
                      Sujet
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        marginBottom: "14px",
                        color: "var(--noir)",
                      }}
                    >
                      {tpl.sujet}
                    </div>
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
                      Corps
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        lineHeight: 1.6,
                        color: "var(--noir)",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {tpl.corps}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label style={LBL}>Sujet</label>
                    <input
                      value={editForm.sujet || ""}
                      onChange={(e) =>
                        setEditForm((p) => ({ ...p, sujet: e.target.value }))
                      }
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1.5px solid var(--gold)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "13px",
                        outline: "none",
                        marginBottom: "12px",
                      }}
                    />
                    <label style={LBL}>Corps du message</label>
                    <textarea
                      value={editForm.corps || ""}
                      onChange={(e) =>
                        setEditForm((p) => ({ ...p, corps: e.target.value }))
                      }
                      rows={4}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1.5px solid var(--gold)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "13px",
                        resize: "vertical",
                        outline: "none",
                        marginBottom: "8px",
                      }}
                    />
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--gray)",
                        background: "var(--gray-bg)",
                        padding: "8px 12px",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      Variables disponibles :{" "}
                      {VARIABLES.map((v) => (
                        <code
                          key={v}
                          style={{
                            marginRight: "6px",
                            fontSize: "11px",
                            color: "var(--gold-dark)",
                          }}
                        >
                          {v}
                        </code>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Aperçu push */}
              {tpl.canaux.push && !editMode && (
                <div>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--gray)",
                      marginBottom: "12px",
                    }}
                  >
                    Aperçu push notification
                  </div>
                  <div
                    style={{
                      background: "#1C1C1E",
                      borderRadius: "16px",
                      padding: "14px 16px",
                      maxWidth: "320px",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "6px",
                          background: "var(--gold)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: "700",
                          color: "#000",
                        }}
                      >
                        L
                      </div>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "rgba(255,255,255,0.6)",
                          fontWeight: "500",
                        }}
                      >
                        LIVRR
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "rgba(255,255,255,0.3)",
                          marginLeft: "auto",
                        }}
                      >
                        Maintenant
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#fff",
                        marginBottom: "3px",
                      }}
                    >
                      {tpl.sujet.replace(/{[^}]+}/g, "...")}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.55)",
                        lineHeight: 1.4,
                      }}
                    >
                      {tpl.corps.replace(/{[^}]+}/g, "...").slice(0, 80)}…
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
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
const LBL = {
  display: "block",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--gray)",
  marginBottom: "8px",
};
