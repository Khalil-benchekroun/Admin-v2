import React, { useState } from "react";
import { useRole } from "../hooks/useRole";

// ── Données membres ────────────────────────────────────────
const MEMBRES = [
  {
    id: "ADM-001",
    nom: "Khalil B.",
    role: "superadmin",
    avatar: "K",
    email: "khalil.superadmin@livrr.fr",
  },
  {
    id: "ADM-002",
    nom: "Marie L.",
    role: "sav",
    avatar: "M",
    email: "marie.sav@livrr.fr",
  },
  {
    id: "ADM-003",
    nom: "Lucas D.",
    role: "sav",
    avatar: "L",
    email: "lucas.sav@livrr.fr",
  },
  {
    id: "ADM-004",
    nom: "Paul R.",
    role: "ops",
    avatar: "P",
    email: "paul.ops@livrr.fr",
  },
  {
    id: "ADM-005",
    nom: "Amina S.",
    role: "sav",
    avatar: "A",
    email: "amina.sav@livrr.fr",
    inactif: true,
  },
];

const ACTIVITES = [
  // Marie (SAV) - aujourd'hui
  {
    id: "ACT-088",
    membreId: "ADM-002",
    date: "20/04/2026",
    heure: "21:15",
    type: "ticket_résolu",
    action: "Ticket TK-0041 résolu",
    detail: "Action : Réassigner coursier — Commande LV-00412",
    cible: "TK-0041",
    module: "sav",
    statut: "success",
  },
  {
    id: "ACT-087",
    membreId: "ADM-002",
    date: "20/04/2026",
    heure: "20:45",
    type: "retour_validé",
    action: "Retour RET-0021 validé",
    detail: "Lucas D. — By Terry — Produit endommagé — 42€",
    cible: "RET-0021",
    module: "retours",
    statut: "success",
  },
  {
    id: "ACT-086",
    membreId: "ADM-002",
    date: "20/04/2026",
    heure: "18:30",
    type: "demande_suspension",
    action: "Demande suspension envoyée",
    detail: "Isabel Marant — inactive depuis 5 jours — en attente admin",
    cible: "BTQ-003",
    module: "boutiques",
    statut: "pending",
  },
  {
    id: "ACT-085",
    membreId: "ADM-002",
    date: "20/04/2026",
    heure: "16:22",
    type: "ticket_créé",
    action: "Ticket TK-0040 créé",
    detail: "By Terry — problème accès application boutique",
    cible: "TK-0040",
    module: "sav",
    statut: "success",
  },
  {
    id: "ACT-084",
    membreId: "ADM-002",
    date: "20/04/2026",
    heure: "14:35",
    type: "remboursement",
    action: "Remboursement déclenché",
    detail: "Sophie M. — 490€ — incident livraison avéré",
    cible: "REMB-052",
    module: "remboursements",
    statut: "success",
  },
  {
    id: "ACT-083",
    membreId: "ADM-002",
    date: "20/04/2026",
    heure: "11:20",
    type: "client_modifié",
    action: "Note client ajoutée",
    detail: "Nadia S. — historique chargebacks documenté",
    cible: "CLT-006",
    module: "clients",
    statut: "success",
  },
  {
    id: "ACT-082",
    membreId: "ADM-002",
    date: "20/04/2026",
    heure: "09:05",
    type: "connexion",
    action: "Connexion à l'espace admin",
    detail: "IP 92.12.x.x — navigateur Chrome",
    cible: null,
    module: "système",
    statut: "info",
  },
  // Marie (SAV) - hier
  {
    id: "ACT-081",
    membreId: "ADM-002",
    date: "19/04/2026",
    heure: "17:44",
    type: "ticket_résolu",
    action: "Ticket TK-0039 résolu",
    detail: "Action : Contacter boutique Isabel Marant",
    cible: "TK-0039",
    module: "sav",
    statut: "success",
  },
  {
    id: "ACT-080",
    membreId: "ADM-002",
    date: "19/04/2026",
    heure: "15:10",
    type: "avis_modéré",
    action: "Avis AV-036 signalé",
    detail: "Lucas D. — By Terry — produit endommagé — mis en modération",
    cible: "AV-036",
    module: "avis",
    statut: "warning",
  },
  {
    id: "ACT-079",
    membreId: "ADM-002",
    date: "19/04/2026",
    heure: "10:30",
    type: "connexion",
    action: "Connexion à l'espace admin",
    detail: "IP 92.12.x.x",
    cible: null,
    module: "système",
    statut: "info",
  },

  // Lucas (SAV) - aujourd'hui
  {
    id: "ACT-078",
    membreId: "ADM-003",
    date: "20/04/2026",
    heure: "20:00",
    type: "retour_validé",
    action: "Retour RET-0022 validé",
    detail: "Emma B. — Sandro Paris — 198€ — taille incorrecte",
    cible: "RET-0022",
    module: "retours",
    statut: "success",
  },
  {
    id: "ACT-077",
    membreId: "ADM-003",
    date: "20/04/2026",
    heure: "17:30",
    type: "ticket_créé",
    action: "Ticket TK-0042 créé",
    detail: "AMI Paris — demande upgrade abonnement",
    cible: "TK-0042",
    module: "sav",
    statut: "success",
  },
  {
    id: "ACT-076",
    membreId: "ADM-003",
    date: "20/04/2026",
    heure: "14:00",
    type: "demande_blocage",
    action: "Demande blocage client envoyée",
    detail: "Nadia S. — 3ème chargeback — en attente validation admin",
    cible: "CLT-006",
    module: "clients",
    statut: "pending",
  },
  {
    id: "ACT-075",
    membreId: "ADM-003",
    date: "20/04/2026",
    heure: "09:15",
    type: "connexion",
    action: "Connexion à l'espace admin",
    detail: "IP 78.45.x.x",
    cible: null,
    module: "système",
    statut: "info",
  },

  // Paul (Ops) - aujourd'hui
  {
    id: "ACT-074",
    membreId: "ADM-004",
    date: "20/04/2026",
    heure: "19:45",
    type: "signalement_résolu",
    action: "Signalement SIG-031 résolu",
    detail: "Isabel Marant — photo non conforme — produit suspendu",
    cible: "SIG-031",
    module: "moderation",
    statut: "success",
  },
  {
    id: "ACT-073",
    membreId: "ADM-004",
    date: "20/04/2026",
    heure: "16:00",
    type: "produit_suspendu",
    action: "Produit PRD-008 suspendu",
    detail: "Blazer Structuré Noir — photos non conformes CGU",
    cible: "PRD-008",
    module: "produits",
    statut: "warning",
  },
  {
    id: "ACT-072",
    membreId: "ADM-004",
    date: "20/04/2026",
    heure: "13:20",
    type: "signalement_créé",
    action: "Signalement SIG-032 créé",
    detail: "Sandro Paris — description produit trompeuse",
    cible: "SIG-032",
    module: "moderation",
    statut: "info",
  },
  {
    id: "ACT-071",
    membreId: "ADM-004",
    date: "20/04/2026",
    heure: "08:30",
    type: "connexion",
    action: "Connexion à l'espace admin",
    detail: "IP 78.45.x.x",
    cible: null,
    module: "système",
    statut: "info",
  },

  // Khalil (SuperAdmin) - aujourd'hui
  {
    id: "ACT-070",
    membreId: "ADM-001",
    date: "20/04/2026",
    heure: "21:00",
    type: "demande_validée",
    action: "Demande DEM-002 validée",
    detail: "Blocage client Nadia S. approuvé — fraude avérée",
    cible: "DEM-002",
    module: "dashboard",
    statut: "success",
  },
  {
    id: "ACT-069",
    membreId: "ADM-001",
    date: "20/04/2026",
    heure: "18:15",
    type: "versement_confirmé",
    action: "Versement VRS-038 confirmé",
    detail: "Sandro Paris — Mars 2026 — 22 968€",
    cible: "VRS-038",
    module: "finance",
    statut: "success",
  },
  {
    id: "ACT-068",
    membreId: "ADM-001",
    date: "20/04/2026",
    heure: "15:00",
    type: "compte_créé",
    action: "Compte ADM-006 créé",
    detail: "Thomas (SAV) — rôle SAV/Support — accès activé",
    cible: "ADM-006",
    module: "comptes",
    statut: "success",
  },
  {
    id: "ACT-067",
    membreId: "ADM-001",
    date: "20/04/2026",
    heure: "10:00",
    type: "connexion",
    action: "Connexion Super Admin",
    detail: "IP 185.24.x.x",
    cible: null,
    module: "système",
    statut: "info",
  },
];

const TYPE_CFG = {
  connexion: { icon: "🔐", color: "#6B7280", bg: "#f3f4f6" },
  ticket_résolu: { icon: "✅", color: "#2e8b57", bg: "#e8f5ee" },
  ticket_créé: { icon: "🎫", color: "#185fa5", bg: "#eff6ff" },
  retour_validé: { icon: "↩️", color: "#2e8b57", bg: "#e8f5ee" },
  remboursement: { icon: "💸", color: "#c0392b", bg: "#fef2f2" },
  demande_suspension: { icon: "⚑", color: "#b7770d", bg: "#faeeda" },
  demande_blocage: { icon: "🔒", color: "#b7770d", bg: "#faeeda" },
  demande_validée: { icon: "✓", color: "#2e8b57", bg: "#e8f5ee" },
  client_modifié: { icon: "👤", color: "#185fa5", bg: "#eff6ff" },
  avis_modéré: { icon: "⭐", color: "#b7770d", bg: "#faeeda" },
  signalement_résolu: { icon: "🔍", color: "#2e8b57", bg: "#e8f5ee" },
  signalement_créé: { icon: "🚩", color: "#185fa5", bg: "#eff6ff" },
  produit_suspendu: { icon: "🏷️", color: "#b7770d", bg: "#faeeda" },
  versement_confirmé: { icon: "💰", color: "#2e8b57", bg: "#e8f5ee" },
  compte_créé: { icon: "👤", color: "#185fa5", bg: "#eff6ff" },
};

const ROLE_CFG = {
  superadmin: {
    label: "Super Admin",
    color: "#C9A96E",
    bg: "rgba(201,169,110,0.12)",
  },
  admin: { label: "Admin", color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
  sav: { label: "SAV", color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
  ops: { label: "Ops", color: "#10B981", bg: "rgba(16,185,129,0.1)" },
};

const STATUT_DOT = {
  success: "#10B981",
  warning: "#F59E0B",
  pending: "#b7770d",
  info: "#6B7280",
};

const DATES = [...new Set(ACTIVITES.map((a) => a.date))];

export default function Activite() {
  const { estSuperAdmin, role } = useRole();

  // SuperAdmin voit tous les membres, Admin voit SAV/Ops uniquement
  const membresVisibles = MEMBRES.filter((m) => {
    if (estSuperAdmin) return true;
    return m.role === "sav" || m.role === "ops";
  });

  const [selectedMembre, setSelectedMembre] = useState(
    membresVisibles[0]?.id || null
  );
  const [filterDate, setFilterDate] = useState("all");
  const [filterModule, setFilterModule] = useState("all");
  const [search, setSearch] = useState("");

  const membre = membresVisibles.find((m) => m.id === selectedMembre);

  // Activités visibles selon rôle
  const activitesVisibles = ACTIVITES.filter((a) => {
    const m = MEMBRES.find((x) => x.id === a.membreId);
    if (!m) return false;
    if (estSuperAdmin) return true;
    return m.role === "sav" || m.role === "ops";
  });

  // Activités du membre sélectionné
  const activitesMembre = activitesVisibles.filter((a) => {
    const matchMembre = a.membreId === selectedMembre;
    const matchDate = filterDate === "all" || a.date === filterDate;
    const matchModule = filterModule === "all" || a.module === filterModule;
    const matchSearch =
      !search ||
      a.action.toLowerCase().includes(search.toLowerCase()) ||
      a.detail.toLowerCase().includes(search.toLowerCase());
    return matchMembre && matchDate && matchModule && matchSearch;
  });

  // Stats du membre
  const statsM = {
    total: activitesVisibles.filter((a) => a.membreId === selectedMembre)
      .length,
    aujourdhui: activitesVisibles.filter(
      (a) => a.membreId === selectedMembre && a.date === "20/04/2026"
    ).length,
    actionsPositives: activitesVisibles.filter(
      (a) => a.membreId === selectedMembre && a.statut === "success"
    ).length,
    enAttente: activitesVisibles.filter(
      (a) => a.membreId === selectedMembre && a.statut === "pending"
    ).length,
  };

  // Grouper par date
  const datesGroups = [...new Set(activitesMembre.map((a) => a.date))];
  const modules = [
    ...new Set(
      activitesVisibles
        .filter((a) => a.membreId === selectedMembre)
        .map((a) => a.module)
    ),
  ];

  const exportMembre = () => {
    if (!membre) return;
    const rows = [
      [`Activité de ${membre.nom} (${ROLE_CFG[membre.role]?.label})`],
      [`Email: ${membre.email}`],
      [],
      ["Date", "Heure", "Action", "Détail", "Module", "Statut"],
      ...activitesMembre.map((a) => [
        a.date,
        a.heure,
        a.action,
        a.detail,
        a.module,
        a.statut,
      ]),
    ];
    const csv = rows.map((r) => r.join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activite-${membre.nom.replace(" ", "-")}-${new Date()
      .toLocaleDateString("fr-FR")
      .replace(/\//g, "-")}.csv`;
    a.click();
  };

  return (
    <div className="page" style={{ padding: "32px 36px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "28px",
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
            {estSuperAdmin ? "Super Admin" : "Admin"}
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "44px",
              fontWeight: "300",
              lineHeight: 1.1,
            }}
          >
            Activité de l'équipe
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}
          >
            Suivi des actions par membre —{" "}
            {estSuperAdmin ? "tous les rôles" : "SAV & Ops uniquement"}
          </p>
        </div>
        {membre && (
          <button
            onClick={exportMembre}
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
            ↓ Exporter activité
          </button>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "20px",
        }}
      >
        {/* Liste membres */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Membres */}
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
                fontSize: "10px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--gray)",
              }}
            >
              Membres ({membresVisibles.filter((m) => !m.inactif).length}{" "}
              actifs)
            </div>
            {membresVisibles.map((m) => {
              const rc = ROLE_CFG[m.role];
              const isActive = selectedMembre === m.id;
              const actionsAuj = activitesVisibles.filter(
                (a) =>
                  a.membreId === m.id &&
                  a.date === "20/04/2026" &&
                  a.type !== "connexion"
              ).length;
              return (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedMembre(m.id);
                    setFilterDate("all");
                    setFilterModule("all");
                    setSearch("");
                  }}
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--white-3)",
                    cursor: "pointer",
                    background: isActive
                      ? "rgba(201,169,110,0.06)"
                      : "transparent",
                    borderLeft: isActive
                      ? "3px solid var(--gold)"
                      : "3px solid transparent",
                    transition: "all 0.15s",
                    opacity: m.inactif ? 0.5 : 1,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: rc.bg,
                        border: `1.5px solid ${rc.color}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        fontWeight: "700",
                        color: rc.color,
                        flexShrink: 0,
                      }}
                    >
                      {m.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: "13px", fontWeight: "600" }}>
                          {m.nom}
                        </span>
                        {actionsAuj > 0 && (
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: "700",
                              background: "#e8f5ee",
                              color: "#2e8b57",
                              padding: "2px 7px",
                              borderRadius: "10px",
                            }}
                          >
                            {actionsAuj} actions
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          marginTop: "2px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: "600",
                            color: rc.color,
                          }}
                        >
                          {rc.label}
                        </span>
                        {m.inactif && (
                          <span
                            style={{
                              fontSize: "10px",
                              color: "var(--gray-light)",
                            }}
                          >
                            · Inactif
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats membre sélectionné */}
          {membre && (
            <div
              style={{
                background: "#fff",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-sm)",
                border: "1px solid var(--white-3)",
                padding: "16px",
              }}
            >
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
                Stats — {membre.nom}
              </div>
              {[
                {
                  label: "Actions aujourd'hui",
                  val: statsM.aujourdhui,
                  color: "var(--noir)",
                },
                { label: "Total actions", val: statsM.total, color: "#185fa5" },
                {
                  label: "Actions réussies",
                  val: statsM.actionsPositives,
                  color: "#2e8b57",
                },
                {
                  label: "En attente validation",
                  val: statsM.enAttente,
                  color: "#b7770d",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "7px 0",
                    borderBottom: "1px solid var(--white-3)",
                  }}
                >
                  <span style={{ fontSize: "12px", color: "var(--gray)" }}>
                    {s.label}
                  </span>
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      color: s.color,
                    }}
                  >
                    {s.val}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Timeline activités */}
        {!membre ? (
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--white-3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "400px",
              color: "var(--gray)",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>👤</div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "22px",
                  fontWeight: "300",
                }}
              >
                Sélectionnez un membre
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
            }}
          >
            {/* Header membre */}
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid var(--white-3)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: ROLE_CFG[membre.role]?.bg,
                    border: `2px solid ${ROLE_CFG[membre.role]?.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    fontWeight: "700",
                    color: ROLE_CFG[membre.role]?.color,
                  }}
                >
                  {membre.avatar}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "22px",
                      fontWeight: "300",
                    }}
                  >
                    {membre.nom}
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
                        color: ROLE_CFG[membre.role]?.color,
                      }}
                    >
                      {ROLE_CFG[membre.role]?.label}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--gray)" }}>
                      {membre.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtres */}
            <div
              style={{
                padding: "12px 24px",
                borderBottom: "1px solid var(--white-3)",
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="Rechercher une action…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: "6px 12px",
                  border: "1px solid var(--white-3)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "12px",
                  background: "var(--gray-bg)",
                  outline: "none",
                  minWidth: "180px",
                }}
              />
              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                style={{
                  padding: "6px 10px",
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
                <option value="all">Toutes les dates</option>
                {DATES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <select
                value={filterModule}
                onChange={(e) => setFilterModule(e.target.value)}
                style={{
                  padding: "6px 10px",
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
                <option value="all">Tous modules</option>
                {modules.map((m) => (
                  <option key={m} value={m}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </option>
                ))}
              </select>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: "12px",
                  color: "var(--gray)",
                }}
              >
                {activitesMembre.length} action
                {activitesMembre.length > 1 ? "s" : ""}
              </span>
            </div>

            {/* Timeline par date */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
              {datesGroups.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "var(--gray)",
                  }}
                >
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                    🔍
                  </div>
                  <div>Aucune activité trouvée</div>
                </div>
              ) : (
                datesGroups.map((date) => {
                  const actionsDate = activitesMembre.filter(
                    (a) => a.date === date
                  );
                  const isToday = date === "20/04/2026";
                  return (
                    <div key={date} style={{ marginBottom: "28px" }}>
                      {/* Séparateur date */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          marginBottom: "16px",
                        }}
                      >
                        <div
                          style={{
                            height: 1,
                            flex: "0 0 16px",
                            background: "var(--white-3)",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: isToday ? "var(--gold-dark)" : "var(--gray)",
                            whiteSpace: "nowrap",
                            background: isToday
                              ? "rgba(201,169,110,0.08)"
                              : "var(--gray-bg)",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            border: isToday
                              ? "1px solid rgba(201,169,110,0.3)"
                              : "1px solid var(--white-3)",
                          }}
                        >
                          {isToday ? "Aujourd'hui · " : ""}
                          {date}
                          <span
                            style={{
                              marginLeft: "6px",
                              fontWeight: "400",
                              opacity: 0.7,
                            }}
                          >
                            ({actionsDate.length} actions)
                          </span>
                        </span>
                        <div
                          style={{
                            height: 1,
                            flex: 1,
                            background: "var(--white-3)",
                          }}
                        />
                      </div>

                      {/* Actions */}
                      {actionsDate.map((a, i) => {
                        const tc = TYPE_CFG[a.type] || {
                          icon: "•",
                          color: "#6B7280",
                          bg: "#f3f4f6",
                        };
                        return (
                          <div
                            key={a.id}
                            style={{
                              display: "flex",
                              gap: "14px",
                              marginBottom: "14px",
                            }}
                          >
                            {/* Timeline line */}
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                flexShrink: 0,
                              }}
                            >
                              <div
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: "50%",
                                  background: tc.bg,
                                  border: `1.5px solid ${tc.color}30`,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "14px",
                                  flexShrink: 0,
                                }}
                              >
                                {tc.icon}
                              </div>
                              {i < actionsDate.length - 1 && (
                                <div
                                  style={{
                                    width: 1,
                                    flex: 1,
                                    background: "var(--white-3)",
                                    margin: "3px 0",
                                  }}
                                />
                              )}
                            </div>

                            {/* Contenu */}
                            <div style={{ flex: 1, paddingBottom: "4px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                  marginBottom: "3px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "13px",
                                      fontWeight: "600",
                                      color: "var(--noir)",
                                    }}
                                  >
                                    {a.action}
                                  </span>
                                  <div
                                    style={{
                                      width: 6,
                                      height: 6,
                                      borderRadius: "50%",
                                      background: STATUT_DOT[a.statut],
                                      flexShrink: 0,
                                    }}
                                  />
                                </div>
                                <span
                                  style={{
                                    fontSize: "11px",
                                    fontWeight: "600",
                                    color: "var(--gray)",
                                    fontFamily: "monospace",
                                    whiteSpace: "nowrap",
                                    marginLeft: "12px",
                                  }}
                                >
                                  {a.heure}
                                </span>
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "var(--gray)",
                                  lineHeight: 1.5,
                                }}
                              >
                                {a.detail}
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "6px",
                                  marginTop: "5px",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "10px",
                                    fontWeight: "600",
                                    padding: "2px 8px",
                                    borderRadius: "10px",
                                    background: tc.bg,
                                    color: tc.color,
                                  }}
                                >
                                  {a.module}
                                </span>
                                {a.cible && (
                                  <span
                                    style={{
                                      fontSize: "10px",
                                      fontFamily: "monospace",
                                      color: "var(--gold-dark)",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {a.cible}
                                  </span>
                                )}
                                {a.statut === "pending" && (
                                  <span
                                    style={{
                                      fontSize: "10px",
                                      fontWeight: "600",
                                      color: "#b7770d",
                                      background: "#faeeda",
                                      padding: "2px 8px",
                                      borderRadius: "10px",
                                    }}
                                  >
                                    ⏳ En attente validation
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
