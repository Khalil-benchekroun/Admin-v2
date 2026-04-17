import React, { useState } from "react";
import toast from "react-hot-toast";

// ── Mock Data ──────────────────────────────────────────────
const TICKETS = [
  {
    id: "TK-0041",
    type: "client",
    sujet: "Commande non reçue après 2h",
    commande: "LV-00412",
    contact: { nom: "Sophie M.", email: "sophie.m@email.fr", avatar: "S" },
    boutique: "Sandro Paris",
    statut: "ouvert",
    priorite: "haute",
    assigné: "Marie (SAV)",
    date: "17/04/2026",
    heure: "14:22",
    messages: [
      {
        id: 1,
        auteur: "Sophie M.",
        role: "client",
        texte:
          "Bonjour, ma commande LV-00412 a été passée il y a plus de 2h et je n'ai toujours rien reçu. Pouvez-vous m'aider ?",
        heure: "14:22",
        date: "17/04/2026",
      },
      {
        id: 2,
        auteur: "Marie (SAV)",
        role: "sav",
        texte:
          "Bonjour Sophie, je regarde votre commande immédiatement. Il semble y avoir un incident avec le coursier. Je reviens vers vous dans quelques minutes.",
        heure: "14:35",
        date: "17/04/2026",
      },
    ],
    notes: "Coursier bloqué en zone piétonne. Escalade Ops.",
    historique: [
      {
        action: "Ticket créé",
        par: "Sophie M.",
        heure: "14:22",
        date: "17/04/2026",
      },
      {
        action: "Assigné à Marie (SAV)",
        par: "Système",
        heure: "14:23",
        date: "17/04/2026",
      },
      {
        action: "Note interne ajoutée",
        par: "Marie (SAV)",
        heure: "14:40",
        date: "17/04/2026",
      },
    ],
  },
  {
    id: "TK-0040",
    type: "boutique",
    sujet: "Problème accès application boutique",
    commande: null,
    contact: { nom: "Sandro Paris", email: "ops@sandro.fr", avatar: "S" },
    boutique: "Sandro Paris",
    statut: "en cours",
    priorite: "normale",
    assigné: "Lucas (SAV)",
    date: "17/04/2026",
    heure: "11:05",
    messages: [
      {
        id: 1,
        auteur: "Sandro Paris",
        role: "boutique",
        texte:
          "Depuis ce matin nous n'arrivons plus à valider les commandes depuis l'appli boutique. L'écran reste figé sur 'Chargement'.",
        heure: "11:05",
        date: "17/04/2026",
      },
      {
        id: 2,
        auteur: "Lucas (SAV)",
        role: "sav",
        texte:
          "Bonjour, nous avons identifié un problème de connexion websocket sur votre compte. Notre équipe technique travaille sur un correctif. Délai estimé : 1h.",
        heure: "11:20",
        date: "17/04/2026",
      },
    ],
    notes: "Bug lié au déploiement de ce matin. Ticket dev ouvert.",
    historique: [
      {
        action: "Ticket créé",
        par: "Sandro Paris",
        heure: "11:05",
        date: "17/04/2026",
      },
      {
        action: "Assigné à Lucas (SAV)",
        par: "Système",
        heure: "11:06",
        date: "17/04/2026",
      },
      {
        action: "Escalade équipe tech",
        par: "Lucas (SAV)",
        heure: "11:25",
        date: "17/04/2026",
      },
    ],
  },
  {
    id: "TK-0039",
    type: "client",
    sujet: "Remboursement non reçu après retour",
    commande: "LV-00398",
    contact: { nom: "Karim T.", email: "karim.t@email.fr", avatar: "K" },
    boutique: "AMI Paris",
    statut: "résolu",
    priorite: "normale",
    assigné: "Marie (SAV)",
    date: "15/04/2026",
    heure: "09:45",
    messages: [
      {
        id: 1,
        auteur: "Karim T.",
        role: "client",
        texte:
          "J'ai renvoyé mon article le 12 avril et je n'ai pas encore été remboursé.",
        heure: "09:45",
        date: "15/04/2026",
      },
      {
        id: 2,
        auteur: "Marie (SAV)",
        role: "sav",
        texte:
          "Bonjour Karim, j'ai déclenché le remboursement manuellement. Vous devriez le recevoir sous 3-5 jours ouvrés. Désolé pour le délai.",
        heure: "10:10",
        date: "15/04/2026",
      },
    ],
    notes:
      "Remboursement déclenché manuellement — 89€. Référence virement : REMB-20260415-039.",
    historique: [
      {
        action: "Ticket créé",
        par: "Karim T.",
        heure: "09:45",
        date: "15/04/2026",
      },
      {
        action: "Assigné à Marie (SAV)",
        par: "Système",
        heure: "09:46",
        date: "15/04/2026",
      },
      {
        action: "Remboursement déclenché (89€)",
        par: "Marie (SAV)",
        heure: "10:12",
        date: "15/04/2026",
      },
      {
        action: "Ticket résolu",
        par: "Marie (SAV)",
        heure: "10:15",
        date: "15/04/2026",
      },
    ],
  },
  {
    id: "TK-0038",
    type: "client",
    sujet: "Produit reçu endommagé",
    commande: "LV-00390",
    contact: { nom: "Yasmine B.", email: "yasmine.b@email.fr", avatar: "Y" },
    boutique: "Isabel Marant",
    statut: "en cours",
    priorite: "haute",
    assigné: null,
    date: "14/04/2026",
    heure: "16:30",
    messages: [
      {
        id: 1,
        auteur: "Yasmine B.",
        role: "client",
        texte:
          "La robe Isabel Marant que j'ai reçue a une déchirure sur la couture gauche. C'est inacceptable pour 450€. Je veux un remboursement complet.",
        heure: "16:30",
        date: "14/04/2026",
      },
    ],
    notes: "",
    historique: [
      {
        action: "Ticket créé",
        par: "Yasmine B.",
        heure: "16:30",
        date: "14/04/2026",
      },
    ],
  },
  {
    id: "TK-0037",
    type: "boutique",
    sujet: "Litige — commande annulée sans notification",
    commande: "LV-00385",
    contact: { nom: "By Terry", email: "contact@byterry.fr", avatar: "B" },
    boutique: "By Terry",
    statut: "fermé",
    priorite: "normale",
    assigné: "Lucas (SAV)",
    date: "12/04/2026",
    heure: "10:00",
    messages: [
      {
        id: 1,
        auteur: "By Terry",
        role: "boutique",
        texte:
          "La commande LV-00385 a été annulée par votre SAV sans que nous en soyons informés. Nous avions déjà préparé la commande.",
        heure: "10:00",
        date: "12/04/2026",
      },
      {
        id: 2,
        auteur: "Lucas (SAV)",
        role: "sav",
        texte:
          "Nous vous présentons nos excuses pour ce manque de communication. L'annulation était justifiée mais la notification n'a pas été envoyée suite à une erreur système. Nous avons identifié et corrigé le bug. Une compensation sera appliquée sur votre prochaine facture.",
        heure: "14:20",
        date: "12/04/2026",
      },
    ],
    notes:
      "Bug notification confirmé. Compensation de 15€ appliquée sur facture du 30/04.",
    historique: [
      {
        action: "Ticket créé",
        par: "By Terry",
        heure: "10:00",
        date: "12/04/2026",
      },
      {
        action: "Assigné à Lucas (SAV)",
        par: "Système",
        heure: "10:01",
        date: "12/04/2026",
      },
      {
        action: "Ticket fermé — compensation appliquée",
        par: "Lucas (SAV)",
        heure: "14:25",
        date: "12/04/2026",
      },
    ],
  },
];

const AGENTS_SAV = ["Marie (SAV)", "Lucas (SAV)", "Amina (SAV)", "Paul (Ops)"];

const STATUT_CFG = {
  ouvert: { label: "Ouvert", bg: "#fef2f2", color: "#c0392b", dot: "#EF4444" },
  "en cours": {
    label: "En cours",
    bg: "#eff6ff",
    color: "#185fa5",
    dot: "#3B82F6",
  },
  résolu: { label: "Résolu", bg: "#f0fdf4", color: "#2e8b57", dot: "#10B981" },
  fermé: { label: "Fermé", bg: "#f9fafb", color: "#6B7280", dot: "#9CA3AF" },
};

const PRIORITE_CFG = {
  haute: { label: "Haute", color: "#c0392b", bg: "#fef2f2" },
  normale: { label: "Normale", color: "#185fa5", bg: "#eff6ff" },
};

const TYPE_CFG = {
  client: { label: "Client", icon: "👤" },
  boutique: { label: "Boutique", icon: "🏪" },
};

// ── Sous-composant : Badge ─────────────────────────────────
function Badge({ cfg, style }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "600",
        background: cfg.bg,
        color: cfg.color,
        ...style,
      }}
    >
      {cfg.dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: cfg.dot,
            display: "inline-block",
          }}
        />
      )}
      {cfg.label}
    </span>
  );
}

// ── Sous-composant : Bulle de chat ─────────────────────────
function Bulle({ msg }) {
  const isSav = msg.role === "sav";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isSav ? "row-reverse" : "row",
        gap: "10px",
        marginBottom: "16px",
        alignItems: "flex-end",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          flexShrink: 0,
          background: isSav
            ? "rgba(201,169,110,0.15)"
            : msg.role === "boutique"
            ? "rgba(59,130,246,0.12)"
            : "rgba(16,185,129,0.12)",
          border: `1px solid ${
            isSav
              ? "rgba(201,169,110,0.35)"
              : msg.role === "boutique"
              ? "rgba(59,130,246,0.3)"
              : "rgba(16,185,129,0.3)"
          }`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          fontWeight: "600",
          color: isSav
            ? "var(--gold)"
            : msg.role === "boutique"
            ? "#3B82F6"
            : "#10B981",
        }}
      >
        {msg.auteur.charAt(0)}
      </div>
      <div
        style={{
          maxWidth: "68%",
          display: "flex",
          flexDirection: "column",
          alignItems: isSav ? "flex-end" : "flex-start",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            color: "var(--gray)",
            marginBottom: "4px",
            fontWeight: "500",
          }}
        >
          {msg.auteur} · {msg.heure}
        </span>
        <div
          style={{
            background: isSav ? "var(--noir)" : "#fff",
            color: isSav ? "#fff" : "var(--noir)",
            padding: "10px 14px",
            borderRadius: isSav ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
            fontSize: "13px",
            lineHeight: 1.55,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            border: isSav ? "none" : "1px solid var(--white-3)",
          }}
        >
          {msg.texte}
        </div>
      </div>
    </div>
  );
}

// ── Composant principal ────────────────────────────────────
export default function SAV() {
  const [tickets, setTickets] = useState(TICKETS);
  const [selected, setSelected] = useState(null);
  const [filterStatut, setFilterStatut] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");
  const [onglet, setOnglet] = useState("chat"); // chat | notes | historique
  const [reponse, setReponse] = useState("");
  const [note, setNote] = useState("");
  const [showAssign, setShowAssign] = useState(false);
  const [showStatut, setShowStatut] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  const filtres = tickets.filter((t) => {
    const matchStatut = filterStatut === "all" || t.statut === filterStatut;
    const matchType = filterType === "all" || t.type === filterType;
    const matchSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.contact.nom.toLowerCase().includes(search.toLowerCase()) ||
      t.sujet.toLowerCase().includes(search.toLowerCase());
    return matchStatut && matchType && matchSearch;
  });

  const ticket = selected ? tickets.find((t) => t.id === selected) : null;

  const envoyerReponse = () => {
    if (!reponse.trim()) return;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selected
          ? {
              ...t,
              messages: [
                ...t.messages,
                {
                  id: Date.now(),
                  auteur: "Vous (SAV)",
                  role: "sav",
                  texte: reponse.trim(),
                  heure: new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  date: new Date().toLocaleDateString("fr-FR"),
                },
              ],
              historique: [
                ...t.historique,
                {
                  action: "Message envoyé",
                  par: "Vous (SAV)",
                  heure: new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  date: new Date().toLocaleDateString("fr-FR"),
                },
              ],
            }
          : t
      )
    );
    setReponse("");
    toast.success("Message envoyé");
  };

  const ajouterNote = () => {
    if (!note.trim()) return;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selected
          ? {
              ...t,
              notes: t.notes ? t.notes + "\n\n" + note.trim() : note.trim(),
              historique: [
                ...t.historique,
                {
                  action: "Note interne ajoutée",
                  par: "Vous (SAV)",
                  heure: new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  date: new Date().toLocaleDateString("fr-FR"),
                },
              ],
            }
          : t
      )
    );
    setNote("");
    setShowNoteModal(false);
    toast.success("Note interne ajoutée");
  };

  const changerStatut = (newStatut) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selected
          ? {
              ...t,
              statut: newStatut,
              historique: [
                ...t.historique,
                {
                  action: `Statut changé → ${STATUT_CFG[newStatut].label}`,
                  par: "Vous (SAV)",
                  heure: new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  date: new Date().toLocaleDateString("fr-FR"),
                },
              ],
            }
          : t
      )
    );
    setShowStatut(false);
    toast.success(`Ticket marqué : ${STATUT_CFG[newStatut].label}`);
  };

  const assignerAgent = (agent) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selected
          ? {
              ...t,
              assigné: agent,
              historique: [
                ...t.historique,
                {
                  action: `Assigné à ${agent}`,
                  par: "Vous (SAV)",
                  heure: new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  date: new Date().toLocaleDateString("fr-FR"),
                },
              ],
            }
          : t
      )
    );
    setShowAssign(false);
    toast.success(`Ticket assigné à ${agent}`);
  };

  const stats = {
    ouverts: tickets.filter((t) => t.statut === "ouvert").length,
    enCours: tickets.filter((t) => t.statut === "en cours").length,
    hautesPriorites: tickets.filter((t) => t.priorite === "haute").length,
    nonAssignes: tickets.filter((t) => !t.assigné).length,
  };

  return (
    <div className="page" style={{ padding: "44px 52px" }}>
      {/* ── Header ── */}
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
            Support & SAV
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}
          >
            Tickets clients, litiges boutiques et chats SAV
          </p>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {[
          {
            label: "Tickets ouverts",
            val: stats.ouverts,
            color: "#c0392b",
            bg: "#fef2f2",
          },
          {
            label: "En cours",
            val: stats.enCours,
            color: "#185fa5",
            bg: "#eff6ff",
          },
          {
            label: "Haute priorité",
            val: stats.hautesPriorites,
            color: "#b7770d",
            bg: "#faeeda",
          },
          {
            label: "Non assignés",
            val: stats.nonAssignes,
            color: "#6B7280",
            bg: "#f9fafb",
          },
        ].map((k) => (
          <div
            key={k.label}
            style={{
              background: "#fff",
              borderRadius: "var(--radius-md)",
              padding: "20px 24px",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--white-3)",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--gray)",
                marginBottom: "10px",
              }}
            >
              {k.label}
            </div>
            <div
              style={{
                fontSize: "36px",
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

      {/* ── Layout principal : liste + détail ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "380px 1fr",
          gap: "20px",
          height: "calc(100vh - 340px)",
          minHeight: "500px",
        }}
      >
        {/* ── Colonne gauche : liste des tickets ── */}
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
          {/* Filtres */}
          <div
            style={{
              padding: "16px",
              borderBottom: "1px solid var(--white-3)",
            }}
          >
            <input
              type="text"
              placeholder="Rechercher un ticket…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                border: "1px solid var(--white-3)",
                borderRadius: "var(--radius-sm)",
                fontSize: "13px",
                background: "var(--gray-bg)",
                outline: "none",
                marginBottom: "10px",
              }}
            />
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {["all", "ouvert", "en cours", "résolu", "fermé"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatut(s)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "600",
                    border:
                      filterStatut === s
                        ? "1.5px solid var(--gold)"
                        : "1.5px solid var(--white-3)",
                    background:
                      filterStatut === s
                        ? "rgba(201,169,110,0.08)"
                        : "transparent",
                    color:
                      filterStatut === s ? "var(--gold-dark)" : "var(--gray)",
                    cursor: "pointer",
                  }}
                >
                  {s === "all" ? "Tous" : STATUT_CFG[s]?.label || s}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
              {["all", "client", "boutique"].map((tp) => (
                <button
                  key={tp}
                  onClick={() => setFilterType(tp)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "600",
                    border:
                      filterType === tp
                        ? "1.5px solid #185fa5"
                        : "1.5px solid var(--white-3)",
                    background: filterType === tp ? "#eff6ff" : "transparent",
                    color: filterType === tp ? "#185fa5" : "var(--gray)",
                    cursor: "pointer",
                  }}
                >
                  {tp === "all" ? "Tous types" : TYPE_CFG[tp].label}
                </button>
              ))}
            </div>
          </div>

          {/* Liste */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtres.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px 24px",
                  color: "var(--gray)",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔍</div>
                <div style={{ fontSize: "13px" }}>Aucun ticket trouvé</div>
              </div>
            ) : (
              filtres.map((t) => {
                const scfg = STATUT_CFG[t.statut];
                const isActive = selected === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelected(t.id);
                      setOnglet("chat");
                    }}
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
                        alignItems: "flex-start",
                        marginBottom: "6px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            color: "var(--gold-dark)",
                            letterSpacing: "0.06em",
                          }}
                        >
                          {t.id}
                        </span>
                        <span style={{ fontSize: "11px" }}>
                          {TYPE_CFG[t.type].icon}
                        </span>
                        {t.priorite === "haute" && (
                          <span
                            style={{
                              fontSize: "9px",
                              background: "#fef2f2",
                              color: "#c0392b",
                              padding: "2px 6px",
                              borderRadius: "10px",
                              fontWeight: "700",
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
                          background: scfg.bg,
                          color: scfg.color,
                        }}
                      >
                        {scfg.label}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "var(--noir)",
                        marginBottom: "4px",
                        lineHeight: 1.3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t.sujet}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "12px", color: "var(--gray)" }}>
                        {t.contact.nom}
                      </span>
                      <span
                        style={{ fontSize: "11px", color: "var(--gray-light)" }}
                      >
                        {t.heure} · {t.date}
                      </span>
                    </div>
                    {!t.assigné && (
                      <div
                        style={{
                          marginTop: "6px",
                          fontSize: "10px",
                          color: "#b7770d",
                          fontWeight: "600",
                        }}
                      >
                        ⚠ Non assigné
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Colonne droite : détail ticket ── */}
        {!ticket ? (
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
              color: "var(--gray)",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>💬</div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "22px",
                fontWeight: "300",
                marginBottom: "8px",
              }}
            >
              Sélectionnez un ticket
            </div>
            <div style={{ fontSize: "13px" }}>
              Cliquez sur un ticket pour voir les détails et le chat
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
            {/* Header ticket */}
            <div
              style={{
                padding: "20px 24px",
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
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "20px",
                        fontWeight: "400",
                      }}
                    >
                      {ticket.sujet}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <Badge cfg={STATUT_CFG[ticket.statut]} />
                    <Badge cfg={PRIORITE_CFG[ticket.priorite]} />
                    <span style={{ fontSize: "12px", color: "var(--gray)" }}>
                      {TYPE_CFG[ticket.type].icon} {ticket.contact.nom}
                    </span>
                    {ticket.commande && (
                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--gold-dark)",
                          fontWeight: "600",
                        }}
                      >
                        {ticket.commande}
                      </span>
                    )}
                  </div>
                </div>
                {/* Actions rapides */}
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <div style={{ position: "relative" }}>
                    <button
                      onClick={() => {
                        setShowStatut(!showStatut);
                        setShowAssign(false);
                      }}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "12px",
                        fontWeight: "600",
                        border: "1.5px solid var(--white-3)",
                        background: "var(--gray-bg)",
                        color: "var(--noir)",
                        cursor: "pointer",
                      }}
                    >
                      Statut ▾
                    </button>
                    {showStatut && (
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: "calc(100% + 6px)",
                          background: "#fff",
                          border: "1px solid var(--white-3)",
                          borderRadius: "var(--radius-md)",
                          boxShadow: "var(--shadow-md)",
                          zIndex: 50,
                          minWidth: "160px",
                          overflow: "hidden",
                        }}
                      >
                        {Object.entries(STATUT_CFG).map(([k, v]) => (
                          <button
                            key={k}
                            onClick={() => changerStatut(k)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              width: "100%",
                              padding: "10px 14px",
                              fontSize: "13px",
                              background:
                                ticket.statut === k
                                  ? "var(--gray-bg)"
                                  : "transparent",
                              color: "var(--noir)",
                              fontWeight: ticket.statut === k ? "600" : "400",
                              cursor: "pointer",
                              borderBottom: "1px solid var(--white-3)",
                            }}
                          >
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: v.dot,
                                display: "inline-block",
                              }}
                            />
                            {v.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ position: "relative" }}>
                    <button
                      onClick={() => {
                        setShowAssign(!showAssign);
                        setShowStatut(false);
                      }}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "12px",
                        fontWeight: "600",
                        border: "1.5px solid var(--white-3)",
                        background: "var(--gray-bg)",
                        color: "var(--noir)",
                        cursor: "pointer",
                      }}
                    >
                      {ticket.assigné || "Assigner"} ▾
                    </button>
                    {showAssign && (
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: "calc(100% + 6px)",
                          background: "#fff",
                          border: "1px solid var(--white-3)",
                          borderRadius: "var(--radius-md)",
                          boxShadow: "var(--shadow-md)",
                          zIndex: 50,
                          minWidth: "180px",
                          overflow: "hidden",
                        }}
                      >
                        {AGENTS_SAV.map((a) => (
                          <button
                            key={a}
                            onClick={() => assignerAgent(a)}
                            style={{
                              display: "block",
                              width: "100%",
                              padding: "10px 14px",
                              fontSize: "13px",
                              textAlign: "left",
                              background:
                                ticket.assigné === a
                                  ? "var(--gray-bg)"
                                  : "transparent",
                              color: "var(--noir)",
                              fontWeight: ticket.assigné === a ? "600" : "400",
                              cursor: "pointer",
                              borderBottom: "1px solid var(--white-3)",
                            }}
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowNoteModal(true)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "12px",
                      fontWeight: "600",
                      border: "1.5px solid var(--white-3)",
                      background: "rgba(201,169,110,0.08)",
                      color: "var(--gold-dark)",
                      cursor: "pointer",
                    }}
                  >
                    + Note
                  </button>
                </div>
              </div>

              {/* Onglets */}
              <div
                style={{
                  display: "flex",
                  gap: "0",
                  borderBottom: "2px solid var(--white-3)",
                  marginTop: "8px",
                }}
              >
                {[
                  { id: "chat", label: `Chat (${ticket.messages.length})` },
                  { id: "notes", label: "Notes internes" },
                  {
                    id: "historique",
                    label: `Historique (${ticket.historique.length})`,
                  },
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
                      marginBottom: "-2px",
                      transition: "all 0.15s",
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Corps : Chat */}
            {onglet === "chat" && (
              <>
                <div
                  style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}
                >
                  {ticket.messages.map((msg) => (
                    <Bulle key={msg.id} msg={msg} />
                  ))}
                </div>
                {/* Zone de réponse */}
                <div
                  style={{
                    padding: "16px 24px",
                    borderTop: "1px solid var(--white-3)",
                    background: "var(--gray-bg)",
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
                    Répondre à {ticket.contact.nom}
                  </div>
                  <textarea
                    value={reponse}
                    onChange={(e) => setReponse(e.target.value)}
                    placeholder="Votre réponse…"
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.ctrlKey) envoyerReponse();
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
                      onClick={envoyerReponse}
                      style={{
                        padding: "9px 20px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "12px",
                        fontWeight: "600",
                        background: "var(--noir)",
                        color: "var(--gold)",
                        cursor: "pointer",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Envoyer →
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Corps : Notes internes */}
            {onglet === "notes" && (
              <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
                <div
                  style={{
                    background: "#fffbeb",
                    border: "1px solid #fde68a",
                    borderRadius: "var(--radius-md)",
                    padding: "16px 20px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "#b7770d",
                      marginBottom: "8px",
                    }}
                  >
                    📋 Notes internes — non visibles par le client/boutique
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--noir)",
                      lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {ticket.notes || (
                      <span
                        style={{
                          color: "var(--gray-light)",
                          fontStyle: "italic",
                        }}
                      >
                        Aucune note pour ce ticket.
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowNoteModal(true)}
                  style={{
                    padding: "9px 18px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "12px",
                    fontWeight: "600",
                    border: "1.5px dashed var(--gold)",
                    background: "rgba(201,169,110,0.05)",
                    color: "var(--gold-dark)",
                    cursor: "pointer",
                  }}
                >
                  + Ajouter une note interne
                </button>
              </div>
            )}

            {/* Corps : Historique */}
            {onglet === "historique" && (
              <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
                <div style={{ position: "relative" }}>
                  {ticket.historique.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: "14px",
                        marginBottom: "20px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: "var(--gold)",
                            border: "2px solid var(--gold-lighter)",
                            flexShrink: 0,
                            marginTop: 2,
                          }}
                        />
                        {i < ticket.historique.length - 1 && (
                          <div
                            style={{
                              width: 1,
                              flex: 1,
                              background: "var(--white-3)",
                              marginTop: 4,
                            }}
                          />
                        )}
                      </div>
                      <div style={{ paddingBottom: "4px" }}>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: "500",
                            color: "var(--noir)",
                            marginBottom: "2px",
                          }}
                        >
                          {h.action}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                          par {h.par} · {h.heure} · {h.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Modal : Note interne ── */}
      {showNoteModal && (
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
          onClick={() => setShowNoteModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--radius-lg)",
              padding: "32px",
              width: "480px",
              boxShadow: "var(--shadow-lg)",
            }}
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
              Note interne
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "20px",
              }}
            >
              Visible uniquement par l'équipe LIVRR. Non transmise au client ou
              à la boutique.
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Saisissez votre note interne…"
              rows={4}
              autoFocus
              style={{
                width: "100%",
                padding: "12px",
                border: "1.5px solid var(--white-3)",
                borderRadius: "var(--radius-sm)",
                fontSize: "13px",
                resize: "none",
                outline: "none",
                background: "#fffbeb",
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
                onClick={() => setShowNoteModal(false)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "13px",
                  fontWeight: "500",
                  border: "1.5px solid var(--white-3)",
                  background: "transparent",
                  color: "var(--gray)",
                  cursor: "pointer",
                }}
              >
                Annuler
              </button>
              <button
                onClick={ajouterNote}
                style={{
                  padding: "10px 24px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "13px",
                  fontWeight: "600",
                  background: "var(--noir)",
                  color: "var(--gold)",
                  cursor: "pointer",
                }}
              >
                Ajouter la note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fermer dropdowns au click extérieur */}
      {(showStatut || showAssign) && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 40 }}
          onClick={() => {
            setShowStatut(false);
            setShowAssign(false);
          }}
        />
      )}
    </div>
  );
}
