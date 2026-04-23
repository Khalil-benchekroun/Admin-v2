import { useAuth } from "../context/AuthContext";

// Pages accessibles par rôle
const ACCES = {
  // superadmin = tout sans exception
  superadmin: "*",

  // admin = tout sauf pages superadmin-only
  admin: [
    "dashboard", "statistiques",
    "boutiques", "messagerie", "invitations", "onboarding", "abonnements",
    "produits", "categories",
    "commandes", "livraisons", "retours",
    "clients", "parrainage",
    "finance", "remboursements", "facturation", "reporting",
    "sav", "litiges", "historique-reclamations", "moderation", "avis",
    "parametres", "zones", "notifications", "integrations",
    "audit", "comptes", "activite", "coupons",
  ],

  // sav = opérations client + support
  sav: [
    "dashboard", "statistiques",
    "boutiques", "messagerie",
    "produits", "categories",
    "commandes", "livraisons", "retours",
    "clients", "parrainage",
    "sav", "historique-reclamations", "moderation", "avis",
  ],

  // ops = surveillance + modération uniquement
  ops: [
    "dashboard", "statistiques",
    "boutiques",
    "produits", "categories",
    "commandes", "livraisons", "retours",
    "sav", "historique-reclamations", "moderation", "avis",
  ],
};

export function useRole() {
  const { admin } = useAuth();
  const role = admin?.role || "admin";

  const peutAcceder = (page) => {
    // Superadmin = accès total absolu
    if (role === "superadmin") return true;
    // Vérif page superadmin-only
    if (page === "superadmin-only") return false;
    const acces = ACCES[role] || [];
    return acces === "*" || acces.includes(page);
  };

  // Pour la sidebar : superadmin se comporte comme admin (voit tous les menus)
  const roleForMenu = role === "superadmin" ? "admin" : role;

  const estSuperAdmin = role === "superadmin";
  const estAdmin      = role === "admin" || role === "superadmin";
  const estSAV        = role === "sav";
  const estOps        = role === "ops";

  return { role, roleForMenu, peutAcceder, estSuperAdmin, estAdmin, estSAV, estOps };
}