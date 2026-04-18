import { useAuth } from "./context/AuthContext";

// ── Matrice des droits par rôle ────────────────────────────
//
// admin : accès total à tout
// sav   : support opérationnel — pas de finance, paramètres, abonnements, comptes
// ops   : modération/contrôle — lecture seule sur commandes/clients, pas de finance/paramètres/abonnements/comptes
//
const DROITS = {
  // Pages accessibles
  pages: {
    admin: ["*"],
    sav: [
      "dashboard",
      "statistiques",
      "boutiques",
      "commandes",
      "retours",
      "clients",
      "sav",
      "moderation",
    ],
    ops: [
      "dashboard",
      "statistiques",
      "boutiques",
      "commandes",
      "retours",
      "clients",
      "sav",
      "moderation",
    ],
  },

  // Actions autorisées par page
  actions: {
    // Commandes
    commandes_annuler: { admin: true, sav: true, ops: false },
    commandes_rembourser: { admin: true, sav: true, ops: false },
    commandes_modifier: { admin: true, sav: true, ops: true },
    commandes_bloquer: { admin: true, sav: false, ops: true },

    // Retours
    retours_rembourser: { admin: true, sav: true, ops: false },
    retours_refuser: { admin: true, sav: true, ops: false },
    retours_avancer: { admin: true, sav: true, ops: true },
    retours_note: { admin: true, sav: true, ops: true },

    // Clients
    clients_bloquer: { admin: true, sav: true, ops: true },
    clients_signaler: { admin: true, sav: true, ops: true },
    clients_note: { admin: true, sav: true, ops: true },
    clients_rgpd: { admin: true, sav: true, ops: false },

    // Boutiques
    boutiques_activer: { admin: true, sav: false, ops: true },
    boutiques_suspendre: { admin: true, sav: false, ops: true },
    boutiques_message: { admin: true, sav: true, ops: true },
    boutiques_invitation: { admin: true, sav: false, ops: false },

    // Abonnements
    abonnements_changer: { admin: true, sav: false, ops: false },
    abonnements_suspendre: { admin: true, sav: false, ops: false },
    abonnements_note: { admin: true, sav: false, ops: false },

    // Finance
    finance_verser: { admin: true, sav: false, ops: false },
    finance_export: { admin: true, sav: false, ops: false },

    // SAV
    sav_repondre: { admin: true, sav: true, ops: false },
    sav_assigner: { admin: true, sav: true, ops: true },
    sav_statut: { admin: true, sav: true, ops: true },
    sav_note: { admin: true, sav: true, ops: true },

    // Modération
    moderation_action: { admin: true, sav: false, ops: true },
    moderation_note: { admin: true, sav: true, ops: true },

    // Paramètres
    parametres_modifier: { admin: true, sav: false, ops: false },

    // Comptes
    comptes_creer: { admin: true, sav: false, ops: false },
    comptes_modifier: { admin: true, sav: false, ops: false },
    comptes_desactiver: { admin: true, sav: false, ops: false },
  },
};

// ── Hook principal ─────────────────────────────────────────
export function useRole() {
  const { admin } = useAuth();
  const role = admin?.role || "admin";

  // Vérifie si une action est autorisée pour le rôle courant
  const peut = (action) => {
    const droitAction = DROITS.actions[action];
    if (!droitAction) return true; // action inconnue = permissive par défaut
    return droitAction[role] === true;
  };

  // Vérifie si une page est accessible
  const peutVoirPage = (page) => {
    const pages = DROITS.pages[role];
    if (!pages) return false;
    return pages.includes("*") || pages.includes(page);
  };

  // Retourne les pages accessibles pour filtrer le menu
  const pagesAccessibles = DROITS.pages[role] || [];

  return {
    role,
    peut,
    peutVoirPage,
    pagesAccessibles,
    isAdmin: role === "admin",
    isSav: role === "sav",
    isOps: role === "ops",
  };
}

// ── Composant guard visuel ─────────────────────────────────
// Masque son enfant si l'action n'est pas autorisée
// Usage : <RoleGuard action="finance_verser"><button>Verser</button></RoleGuard>
export function RoleGuard({ action, children, fallback = null }) {
  const { peut } = useRole();
  if (!peut(action)) return fallback;
  return children;
}

// ── Bannière "lecture seule" ───────────────────────────────
export function LectureSeulee({ show }) {
  if (!show) return null;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "11px",
        fontWeight: "600",
        color: "#6B7280",
        background: "#f3f4f6",
        border: "1px solid #e5e7eb",
        padding: "4px 12px",
        borderRadius: "20px",
      }}
    >
      <span style={{ fontSize: "10px" }}>🔒</span> Lecture seule
    </div>
  );
}
