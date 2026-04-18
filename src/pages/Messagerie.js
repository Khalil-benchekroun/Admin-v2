import React, { useState } from "react";
import toast from "react-hot-toast";

const CONVERSATIONS_DATA = [
  {
    id: "MSG-B-001",
    boutique: { nom: "Sandro Paris", avatar: "S", plan: "prestige" },
    statut: "non_lu",
    sujet: "Demande de modification zone de livraison",
    messages: [
      {
        id: 1,
        auteur: "Sandro Paris",
        role: "boutique",
        texte:
          "Bonjour, nous souhaiterions élargir notre zone de livraison aux arrondissements 17e et 18e. Est-ce possible pour la semaine prochaine ?",
        heure: "10:30",
        date: "18/04/2026",
      },
    ],
    dernier: "10:30 · 18/04/2026",
  },
  {
    id: "MSG-B-002",
    boutique: { nom: "Rouje", avatar: "R", plan: "classic" },
    statut: "non_lu",
    sujet: "Question sur le quota produits",
    messages: [
      {
        id: 1,
        auteur: "Rouje",
        role: "boutique",
        texte:
          "Bonjour, notre catalogue dépasse 50 produits. Comment procéder pour upgrader notre plan et ne pas perdre les fiches déjà créées ?",
        heure: "09:15",
        date: "18/04/2026",
      },
    ],
    dernier: "09:15 · 18/04/2026",
  },
  {
    id: "MSG-B-003",
    boutique: { nom: "AMI Paris", avatar: "A", plan: "signature" },
    statut: "lu",
    sujet: "Problème paiement abonnement",
    messages: [
      {
        id: 1,
        auteur: "AMI Paris",
        role: "boutique",
        texte:
          "Le prélèvement de ce mois a échoué. Pouvez-vous nous indiquer la procédure pour régulariser ?",
        heure: "15:00",
        date: "16/04/2026",
      },
      {
        id: 2,
        auteur: "Khalil B.",
        role: "admin",
        texte:
          "Bonjour, je transmets votre demande à notre équipe comptable. Vous recevrez un lien de paiement par email d'ici 24h. Avez-vous pu vérifier que votre RIB est bien à jour dans les paramètres ?",
        heure: "16:20",
        date: "16/04/2026",
      },
      {
        id: 3,
        auteur: "AMI Paris",
        role: "boutique",
        texte: "Merci, le RIB est à jour. J'attends le lien.",
        heure: "16:45",
        date: "16/04/2026",
      },
    ],
    dernier: "16:45 · 16/04/2026",
  },
  {
    id: "MSG-B-004",
    boutique: { nom: "By Terry", avatar: "B", plan: "classic" },
    statut: "lu",
    sujet: "Compensation litige — notification reçue",
    messages: [
      {
        id: 1,
        auteur: "Khalil B.",
        role: "admin",
        texte:
          "Bonjour, suite au litige de la commande LV-00385, une compensation de 15€ a été appliquée sur votre prochaine facture. Nous nous excusons pour le manque de communication lors de l'annulation.",
        heure: "14:25",
        date: "12/04/2026",
      },
      {
        id: 2,
        auteur: "By Terry",
        role: "boutique",
        texte: "Merci pour le retour et la compensation. Cela nous convient.",
        heure: "15:00",
        date: "12/04/2026",
      },
    ],
    dernier: "15:00 · 12/04/2026",
  },
];

const PLAN_COLOR = {
  prestige: "#C9A96E",
  signature: "#3B82F6",
  classic: "#6B7280",
};
const STATUT_CFG = {
  non_lu: { label: "Non lu", color: "#c0392b", bg: "#fef2f2" },
  lu: { label: "Lu", color: "#6B7280", bg: "#f3f4f6" },
};

const REPONSES_RAPIDES = [
  "Merci pour votre message, je reviens vers vous rapidement.",
  "Votre demande a bien été prise en compte.",
  "Je transmets votre demande à l'équipe concernée.",
  "Nous allons procéder à la modification demandée.",
];

function Bulle({ msg }) {
  const isAdmin = msg.role === "admin";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isAdmin ? "row-reverse" : "row",
        gap: "8px",
        marginBottom: "14px",
        alignItems: "flex-end",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          flexShrink: 0,
          background: isAdmin
            ? "rgba(201,169,110,0.15)"
            : "rgba(59,130,246,0.1)",
          border: `1px solid ${
            isAdmin ? "rgba(201,169,110,0.3)" : "rgba(59,130,246,0.25)"
          }`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "11px",
          fontWeight: "700",
          color: isAdmin ? "var(--gold)" : "#3B82F6",
        }}
      >
        {msg.auteur.charAt(0)}
      </div>
      <div
        style={{
          maxWidth: "70%",
          display: "flex",
          flexDirection: "column",
          alignItems: isAdmin ? "flex-end" : "flex-start",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            color: "var(--gray)",
            marginBottom: "3px",
          }}
        >
          {msg.auteur} · {msg.heure}
        </span>
        <div
          style={{
            background: isAdmin ? "var(--noir)" : "#fff",
            color: isAdmin ? "#fff" : "var(--noir)",
            padding: "10px 14px",
            borderRadius: isAdmin ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
            fontSize: "13px",
            lineHeight: 1.55,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            border: isAdmin ? "none" : "1px solid var(--white-3)",
          }}
        >
          {msg.texte}
        </div>
      </div>
    </div>
  );
}

export default function Messagerie() {
  const [convs, setConvs] = useState(CONVERSATIONS_DATA);
  const [selected, setSelected] = useState("MSG-B-001");
  const [filterStatut, setFilterStatut] = useState("all");
  const [reponse, setReponse] = useState("");
  const [showRapides, setShowRapides] = useState(false);

  const conv = convs.find((c) => c.id === selected);
  const filtres = convs.filter(
    (c) => filterStatut === "all" || c.statut === filterStatut
  );

  const nonLus = convs.filter((c) => c.statut === "non_lu").length;

  const selectionner = (id) => {
    setSelected(id);
    setConvs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, statut: "lu" } : c))
    );
  };

  const envoyer = () => {
    if (!reponse.trim()) return;
    const msg = {
      id: Date.now(),
      auteur: "Khalil B.",
      role: "admin",
      texte: reponse.trim(),
      heure: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date().toLocaleDateString("fr-FR"),
    };
    setConvs((prev) =>
      prev.map((c) =>
        c.id === selected
          ? {
              ...c,
              messages: [...c.messages, msg],
              statut: "lu",
              dernier: `${msg.heure} · ${msg.date}`,
            }
          : c
      )
    );
    setReponse("");
    setShowRapides(false);
    toast.success("Message envoyé");
  };

  const nouvelleConv = () => {
    toast(
      "Ouvrir une conversation avec une boutique — sélectionnez depuis la page Boutiques",
      { icon: "💬" }
    );
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
            Messagerie boutiques
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}
          >
            Communication directe Admin ↔ Boutiques partenaires
          </p>
        </div>
        <button
          onClick={nouvelleConv}
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
          + Nouvelle conversation
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: "20px",
          height: "calc(100vh - 240px)",
          minHeight: "500px",
        }}
      >
        {/* Liste conversations */}
        <div
          style={{
            background: "#fff",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--white-3)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid var(--white-3)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={() => setFilterStatut("all")}
                style={fBtn(filterStatut === "all")}
              >
                Tous
              </button>
              <button
                onClick={() => setFilterStatut("non_lu")}
                style={fBtn(filterStatut === "non_lu", "#c0392b", "#fef2f2")}
              >
                Non lus{" "}
                {nonLus > 0 && (
                  <span
                    style={{
                      background: "#c0392b",
                      color: "#fff",
                      borderRadius: "10px",
                      padding: "0px 5px",
                      fontSize: "10px",
                      marginLeft: "4px",
                    }}
                  >
                    {nonLus}
                  </span>
                )}
              </button>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtres.map((c) => {
              const pc = PLAN_COLOR[c.boutique.plan];
              const isActive = selected === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => selectionner(c.id)}
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
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "5px",
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: `rgba(${
                          pc === "#C9A96E"
                            ? "201,169,110"
                            : pc === "#3B82F6"
                            ? "59,130,246"
                            : "107,114,128"
                        },0.1)`,
                        border: `1.5px solid ${pc}40`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: "700",
                        color: pc,
                        flexShrink: 0,
                      }}
                    >
                      {c.boutique.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: c.statut === "non_lu" ? "700" : "500",
                          }}
                        >
                          {c.boutique.nom}
                        </span>
                        {c.statut === "non_lu" && (
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: "#c0392b",
                              flexShrink: 0,
                            }}
                          />
                        )}
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
                        {c.sujet}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--gray-light)",
                      paddingLeft: "44px",
                    }}
                  >
                    {c.dernier}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conversation */}
        {!conv ? (
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--white-3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--gray)",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>💬</div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "22px",
                  fontWeight: "300",
                }}
              >
                Sélectionnez une conversation
              </div>
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
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 22px",
                borderBottom: "1px solid var(--white-3)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: `rgba(${
                    PLAN_COLOR[conv.boutique.plan] === "#C9A96E"
                      ? "201,169,110"
                      : PLAN_COLOR[conv.boutique.plan] === "#3B82F6"
                      ? "59,130,246"
                      : "107,114,128"
                  },0.1)`,
                  border: `2px solid ${PLAN_COLOR[conv.boutique.plan]}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: "700",
                  color: PLAN_COLOR[conv.boutique.plan],
                }}
              >
                {conv.boutique.avatar}
              </div>
              <div>
                <div style={{ fontSize: "15px", fontWeight: "600" }}>
                  {conv.boutique.nom}
                </div>
                <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                  {conv.sujet}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
              {conv.messages.map((msg) => (
                <Bulle key={msg.id} msg={msg} />
              ))}
            </div>

            {/* Réponses rapides + zone de saisie */}
            <div
              style={{
                borderTop: "1px solid var(--white-3)",
                background: "var(--gray-bg)",
              }}
            >
              {showRapides && (
                <div
                  style={{
                    padding: "10px 16px",
                    borderBottom: "1px solid var(--white-3)",
                    display: "flex",
                    gap: "6px",
                    flexWrap: "wrap",
                  }}
                >
                  {REPONSES_RAPIDES.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setReponse(r);
                        setShowRapides(false);
                      }}
                      style={{
                        padding: "5px 12px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: "500",
                        border: "1px solid var(--white-3)",
                        background: "#fff",
                        color: "var(--noir)",
                        cursor: "pointer",
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
              <div style={{ padding: "12px 16px" }}>
                <div
                  style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
                >
                  <button
                    onClick={() => setShowRapides(!showRapides)}
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "var(--gold-dark)",
                      padding: "4px 10px",
                      border: "1px solid rgba(201,169,110,0.3)",
                      borderRadius: "20px",
                      cursor: "pointer",
                      background: "rgba(201,169,110,0.06)",
                    }}
                  >
                    ⚡ Réponses rapides
                  </button>
                </div>
                <textarea
                  value={reponse}
                  onChange={(e) => setReponse(e.target.value)}
                  placeholder={`Répondre à ${conv.boutique.nom}…`}
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) envoyer();
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid var(--white-3)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "13px",
                    resize: "none",
                    outline: "none",
                    background: "#fff",
                    marginBottom: "8px",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ fontSize: "11px", color: "var(--gray-light)" }}
                  >
                    Ctrl + Entrée pour envoyer
                  </span>
                  <button
                    onClick={envoyer}
                    style={{
                      padding: "9px 20px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "12px",
                      fontWeight: "600",
                      background: "var(--noir)",
                      color: "var(--gold)",
                      cursor: "pointer",
                      border: "none",
                    }}
                  >
                    Envoyer →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function fBtn(active, color, bg) {
  return {
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
    border: `1.5px solid ${active ? color || "var(--gold)" : "var(--white-3)"}`,
    background: active ? bg || "rgba(201,169,110,0.08)" : "transparent",
    color: active ? color || "var(--gold-dark)" : "var(--gray)",
  };
}
