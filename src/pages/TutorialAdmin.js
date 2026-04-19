import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const STEPS = [
  {
    id: 1,
    icon: "✦",
    title: "Bienvenue sur LIVRR Admin",
    subtitle: "Espace Administration",
    description:
      "Votre centre de contrôle de la plateforme LIVRR. Boutiques, commandes, clients, finance, SAV — tout est centralisé ici. Ce guide vous prendra environ 7 minutes.",
    highlight: null,
    tip: null,
  },
  {
    id: 2,
    icon: "🎭",
    title: "Rôles et accès",
    subtitle: "Admin · SAV · Ops",
    description:
      "L'Espace Admin distingue 3 rôles : Admin Plateforme (accès total), SAV/Support (tickets, clients, modération, retours), et Ops/Modération (lecture commandes et clients). Votre rôle est détecté automatiquement selon votre email de connexion.",
    highlight: "parametres",
    tip: "💡 Les rôles SAV et Ops ne voient pas les sections Finance et Paramètres. Si vous avez besoin d'accès supplémentaires, contactez l'Admin Plateforme.",
  },
  {
    id: 3,
    icon: "📊",
    title: "Tableau de bord live",
    subtitle: "Alertes & temps réel",
    description:
      "Le Dashboard est votre vue d'ensemble en temps réel. Un bandeau rouge clignotant apparaît si une commande est bloquée depuis plus de 30 minutes ou si une boutique est inactive. Le compteur de commandes se met à jour toutes les 30 secondes.",
    highlight: "dashboard",
    tip: "💡 Les alertes critiques ne peuvent pas être ignorées — elles restent visibles jusqu'à résolution du problème. Les alertes warning peuvent être dismissées avec le bouton ✕.",
  },
  {
    id: 4,
    icon: "🏪",
    title: "Gestion des boutiques",
    subtitle: "Cycle de vie complet",
    description:
      "Chaque boutique passe par 3 phases : invitation (lien unique généré), onboarding (validation du dossier avec checklist), puis activation sur la plateforme. Vous pouvez suspendre ou réactiver une boutique à tout moment depuis la fiche boutique.",
    highlight: "boutiques",
    tip: "💡 La checklist d'onboarding contient 6 éléments obligatoires : infos légales, RIB, contrat signé, catalogue (min 5 produits), horaires. Le bouton Activer est verrouillé tant que tous les éléments ne sont pas cochés.",
  },
  {
    id: 5,
    icon: "🔗",
    title: "Liens d'invitation",
    subtitle: "Prospection partenaires",
    description:
      "Générez des liens d'invitation uniques pour chaque boutique prospectée. Chaque lien est horodaté, tracé et associé à un plan (Classic / Signature / Prestige). Durée de validité configurable (3, 7, 14 ou 30 jours). Un lien utilisé génère automatiquement un dossier d'onboarding.",
    highlight: "boutiques",
    tip: "💡 Les liens sur le point d'expirer (≤ 2 jours) sont surlignés en rouge. Utilisez le bouton Renouveler pour étendre la validité sans recréer un nouveau lien.",
  },
  {
    id: 6,
    icon: "📋",
    title: "Abonnements boutiques",
    subtitle: "Plans & quotas",
    description:
      "Trois plans disponibles : Classic (149€/mois, 30 produits), Signature (299€/mois, 100 produits), Prestige (599€/mois, 300 produits). Vous pouvez changer le plan d'une boutique à tout moment. Un changement downgrade nécessite un motif obligatoire.",
    highlight: "boutiques",
    tip: "💡 Quand une boutique atteint 90% de son quota produits, elle reçoit une notification automatique. Vous le voyez également dans la page Abonnements.",
  },
  {
    id: 7,
    icon: "📦",
    title: "Catalogue & Catégories",
    subtitle: "Produits plateforme",
    description:
      "La page Produits vous donne une vue cross-boutiques de tous les produits actifs. Vous pouvez suspendre une fiche produit non conforme directement depuis l'admin. Les catégories (Mode, Beauté, Accessoires, Lifestyle, Épicerie fine) sont gérées depuis la page Catégories.",
    highlight: "produits",
    tip: "💡 Les sous-catégories sont cliquables pour être ajoutées ou supprimées. L'ordre des catégories impacte l'affichage dans l'app client — réorganisez-les avec les flèches ▲▼.",
  },
  {
    id: 8,
    icon: "🛍️",
    title: "Suivi des commandes",
    subtitle: "Vue globale plateforme",
    description:
      "La page Commandes affiche toutes les commandes de toutes les boutiques en temps réel. Filtrez par statut, boutique, date ou montant. Les commandes bloquées sont surlignées en rouge. Vous pouvez forcer un changement de statut depuis la fiche commande.",
    highlight: "commandes",
    tip: "💡 Une commande est 'bloquée' quand une boutique ne l'a pas acceptée dans le délai imparti (3-5 minutes), ou quand un coursier est introuvable. Ces cas remontent automatiquement dans les alertes du Dashboard.",
  },
  {
    id: 9,
    icon: "🛵",
    title: "Livraisons & Coursiers",
    subtitle: "Dispatch temps réel",
    description:
      "Supervisez toutes les livraisons actives en cours. Deux partenaires logistiques : Coursier.fr et Top Chrono. Vous pouvez assigner manuellement un coursier à une commande prête. Les incidents (coursier bloqué, hors zone) génèrent une alerte immédiate.",
    highlight: "livraisons",
    tip: "💡 La page Intégrations vous montre la latence et l'uptime de chaque partenaire en temps réel. En cas d'erreur 500 sur un webhook, un email d'alerte est envoyé au contact technique du partenaire.",
  },
  {
    id: 10,
    icon: "↩️",
    title: "Retours & Remboursements",
    subtitle: "Deux pages distinctes",
    description:
      "Les Retours gèrent le cycle physique (demande → retour en cours → reçu → validé → remboursé). Les Remboursements listent tous les virements déclenchés, classés par type : Automatique (plateforme), Manuel SAV, ou Manuel Admin. Confirmez chaque virement avec sa référence bancaire.",
    highlight: "commandes",
    tip: "💡 Un remboursement automatique est déclenché quand : la boutique ne répond pas dans le délai, la boutique refuse une commande déjà payée, ou un incident de livraison est avéré. Vous n'avez pas besoin d'intervenir sauf si le virement échoue.",
  },
  {
    id: 11,
    icon: "👥",
    title: "Gestion des clients",
    subtitle: "Base clients & parrainage",
    description:
      "La page Clients donne accès à toutes les fiches clients : historique commandes, statut fidélité (Bronze/Silver/Gold), informations personnelles et actions (blocage, export RGPD). La page Parrainage suit les parrainages actifs et permet de verser manuellement les récompenses.",
    highlight: "clients",
    tip: "💡 Pour bloquer un client abusif (chargebacks répétés, fraude), rendez-vous dans la fiche client et cliquez sur 'Bloquer le compte'. Cette action est tracée dans le Journal d'audit.",
  },
  {
    id: 12,
    icon: "💰",
    title: "Finance",
    subtitle: "Commissions, versements & facturation",
    description:
      "Suivez les commissions dues par boutique, confirmez les virements mensuel par boutique avec référence bancaire. La page Facturation gère les abonnements impayés avec relance automatique et lien de paiement. La page Reporting génère et envoie des rapports de performance aux boutiques.",
    highlight: "finance",
    tip: "💡 Export CSV Finance : disponible depuis le bouton en haut à droite — il inclut les versements, les remboursements et les totaux avec horodatage. Format UTF-8 avec BOM, compatible Excel directement.",
  },
  {
    id: 13,
    icon: "📈",
    title: "Statistiques",
    subtitle: "Data visualisation & classements",
    description:
      "Analysez le CA brut, les commissions, les clients actifs et la répartition des commandes sur 7 jours, 30 jours ou 6 mois. Le classement boutiques est interactif — triez par CA, commandes ou note. Un score global (CA 50% + commandes 30% + note 20%) est calculé automatiquement.",
    highlight: "dashboard",
    tip: "💡 Export CSV Stats : exporte le classement boutiques, le CA par période, les clients actifs et la répartition commandes en une seule fois. Encodage UTF-8 compatible Excel.",
  },
  {
    id: 14,
    icon: "🎫",
    title: "Support & SAV",
    subtitle: "Tickets & escalades",
    description:
      "Les tickets SAV arrivent dans la page Tickets avec priorité (normale / haute / critique). Le SAV peut escalader un ticket vers la page Litiges & Arbitrage quand le dossier dépasse ses droits. L'admin dispose de 7 décisions prédéfinies (remboursement forcé, blocage client, avertissement boutique…).",
    highlight: "sav",
    tip: "💡 Une décision d'arbitrage est irréversible et horodatée. Elle est automatiquement enregistrée dans le Journal d'audit. Motif obligatoire avant validation.",
  },
  {
    id: 15,
    icon: "🔍",
    title: "Modération",
    subtitle: "Signalements & actions",
    description:
      "La page Modération centralise tous les signalements : photos produit non conformes, messages hors-plateforme, boutiques inactives, comportements abusifs. Chaque signalement peut être résolu avec une action corrective documentée (suspension, suppression, blocage, escalade).",
    highlight: "moderation",
    tip: "💡 Les signalements avec priorité 'haute' sont marqués en rouge. Le filtre 'En attente' vous montre uniquement les cas qui nécessitent votre intervention immédiate.",
  },
  {
    id: 16,
    icon: "⭐",
    title: "Avis clients",
    subtitle: "Modération & réponses",
    description:
      "Modérez les avis laissés par les clients sur les boutiques. Vous pouvez publier, masquer ou signaler un avis. Vous pouvez également rédiger une réponse au nom de la boutique concernée. Les avis signalés nécessitent une décision : valider (publier) ou masquer définitivement.",
    highlight: "avis",
    tip: "💡 Les avis avec note ≤ 2 sont automatiquement placés en file 'signalé' pour modération. Un avis masqué reste visible dans votre interface admin mais disparaît côté client.",
  },
  {
    id: 17,
    icon: "📍",
    title: "Zones de service",
    subtitle: "Géographie & expansion",
    description:
      "Paris est la zone active au lancement. Nice, Cannes et Monaco sont préconfigurées en statut 'planifié' pour l'expansion au mois 18. Pour Paris, vous pouvez activer ou désactiver chaque arrondissement individuellement en cliquant sur la grille interactive.",
    highlight: "parametres",
    tip: "💡 La roadmap d'expansion est visible sur la frise chronologique en haut de la page Zones. L'activation d'une nouvelle ville déclenche une entrée dans le Journal d'audit.",
  },
  {
    id: 18,
    icon: "🔔",
    title: "Notifications",
    subtitle: "Templates & déclencheurs",
    description:
      "Gérez les 10 templates de notifications (commandes, retours, alertes système, avis). Activez ou désactivez chaque canal (Push / Email / SMS) par template. Modifiez le contenu avec les variables dynamiques disponibles : {client}, {boutique}, {montant}, {eta}…",
    highlight: "parametres",
    tip: "💡 L'aperçu push notification en bas de chaque fiche montre exactement ce que le client verra sur son téléphone avant envoi.",
  },
  {
    id: 19,
    icon: "🔌",
    title: "Intégrations logistiques",
    subtitle: "Coursier.fr & Top Chrono",
    description:
      "Supervisez les connexions API en temps réel (latence, uptime, logs). Activez ou désactivez les webhooks par événement (prise en charge, en route, livraison, incident). En cas de compromission, renouvelez la clé API depuis la page Intégrations.",
    highlight: "parametres",
    tip: "💡 Les erreurs HTTP 500 dans les logs de webhook signalent un problème de communication avec le partenaire. Consultez le contact technique du partenaire et vérifiez votre URL webhook.",
  },
  {
    id: 20,
    icon: "📜",
    title: "Journal d'audit",
    subtitle: "Traçabilité immuable",
    description:
      "Toutes les actions effectuées sur la plateforme sont enregistrées : remboursements, blocages, suspensions, décisions d'arbitrage, activations de zone. Le journal est immuable — aucune entrée ne peut être modifiée ou supprimée. Exportable en CSV pour audit externe.",
    highlight: "parametres",
    tip: "💡 Filtrez par rôle (Admin / SAV / Ops) pour voir qui a fait quoi. Filtrez par module (finance, commandes, boutiques…) pour retracer l'historique d'une décision spécifique.",
  },
  {
    id: 21,
    icon: "💬",
    title: "Messagerie boutiques",
    subtitle: "Communication directe",
    description:
      "Canal de communication directe entre l'Admin et les boutiques partenaires — distinct du SAV client. Les messages non lus sont indiqués par un badge rouge. Des réponses rapides prédéfinies accélèrent les échanges opérationnels courants.",
    highlight: "boutiques",
    tip: "💡 La messagerie boutiques est réservée aux communications opérationnelles (onboarding, abonnement, technique). Les litiges clients doivent passer par les tickets SAV.",
  },
  {
    id: 22,
    icon: "👤",
    title: "Comptes admin",
    subtitle: "Gestion des accès",
    description:
      "Créez des comptes pour vos équipes SAV et Ops. Chaque compte est associé à un rôle qui détermine les pages et actions accessibles. Désactivez un compte sans le supprimer pour garder l'historique des actions dans le Journal d'audit.",
    highlight: "parametres",
    tip: "💡 Les emails SAV doivent contenir 'sav' et les emails Ops doivent contenir 'ops' pour que le rôle soit détecté automatiquement à la connexion (ex: marie.sav@livrr.fr).",
  },
  {
    id: 23,
    icon: "🚀",
    title: "Vous êtes prêt !",
    subtitle: "C'est parti",
    description:
      "Vous maîtrisez maintenant l'ensemble de l'Espace Admin LIVRR. Notre équipe technique est disponible pour tout incident critique. Bonne gestion de la plateforme.",
    highlight: null,
    tip: null,
  },
];

const SECTION_ICONS = {
  dashboard: { icon: "📊", label: "Tableau de bord", color: "#6366F1" },
  boutiques: { icon: "🏪", label: "Boutiques", color: "#C9A96E" },
  produits: { icon: "📦", label: "Produits", color: "#EC4899" },
  commandes: { icon: "🛍️", label: "Commandes", color: "#F59E0B" },
  livraisons: { icon: "🛵", label: "Livraisons", color: "#3B82F6" },
  clients: { icon: "👥", label: "Clients", color: "#8B5CF6" },
  finance: { icon: "💰", label: "Finance", color: "#10B981" },
  sav: { icon: "🎫", label: "Support & SAV", color: "#EF4444" },
  moderation: { icon: "🔍", label: "Modération", color: "#F59E0B" },
  avis: { icon: "⭐", label: "Avis clients", color: "#F59E0B" },
  parametres: { icon: "⚙️", label: "Paramètres", color: "#6B7280" },
};

export default function TutorialAdmin() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [completed, setCompleted] = useState(false);

  const step = STEPS[currentStep];
  const progress = (currentStep / (STEPS.length - 1)) * 100;

  const goTo = (index) => {
    if (animating || index === currentStep) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep(index);
      setAnimating(false);
    }, 180);
  };

  const next = () => {
    if (currentStep < STEPS.length - 1) goTo(currentStep + 1);
    else finish();
  };

  const prev = () => {
    if (currentStep > 0) goTo(currentStep - 1);
  };

  const finish = () => {
    localStorage.setItem("livrr_admin_tutorial_done", "true");
    setCompleted(true);
  };

  const skip = () => {
    if (
      window.confirm(
        "Passer le tutoriel ? Vous pourrez le retrouver dans le menu."
      )
    ) {
      localStorage.setItem("livrr_admin_tutorial_done", "true");
      navigate("/");
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentStep]);

  if (completed) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0A0A0F",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-body)",
          padding: "20px",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "520px" }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "80px",
              color: "var(--gold)",
              marginBottom: "24px",
              lineHeight: 1,
            }}
          >
            ✦
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "48px",
              fontWeight: "300",
              color: "#fff",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            Tutoriel terminé !
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.8,
              marginBottom: "40px",
            }}
          >
            Vous maîtrisez maintenant l'Espace Admin LIVRR.
            <br />
            La plateforme n'attend que vous.
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "14px 36px",
              borderRadius: "10px",
              background: "var(--gold)",
              color: "var(--noir)",
              border: "none",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              letterSpacing: "0.05em",
            }}
          >
            Accéder au dashboard →
          </button>
          <p
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.2)",
              marginTop: "24px",
            }}
          >
            Retrouvez ce tutoriel à tout moment dans le menu
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0F",
        display: "flex",
        fontFamily: "var(--font-body)",
        overflow: "hidden",
      }}
    >
      {/* ── SIDEBAR PROGRESSION ── */}
      <div
        style={{
          width: "272px",
          flexShrink: 0,
          borderRight: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "32px 24px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            className="livrr-logo"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "20px",
              letterSpacing: "6px",
              fontWeight: "400",
              marginBottom: "4px",
            }}
          >
            LIVRR
          </div>
          <div
            style={{
              fontSize: "9px",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            Guide Admin
          </div>
        </div>

        {/* Progression */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
              color: "rgba(255,255,255,0.3)",
              marginBottom: "8px",
            }}
          >
            <span>Progression</span>
            <span>
              {currentStep + 1} / {STEPS.length}
            </span>
          </div>
          <div
            style={{
              height: "2px",
              background: "rgba(255,255,255,0.07)",
              borderRadius: "1px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, var(--gold-dark), var(--gold))",
                borderRadius: "1px",
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.2)",
              marginTop: "6px",
            }}
          >
            {Math.round(progress)}% complété
          </div>
        </div>

        {/* Liste étapes */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {STEPS.map((s, i) => {
            const isDone = i < currentStep;
            const isCurrent = i === currentStep;
            return (
              <div
                key={s.id}
                onClick={() => goTo(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 24px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  background: isCurrent
                    ? "rgba(201,169,110,0.08)"
                    : "transparent",
                  borderLeft: isCurrent
                    ? "2px solid var(--gold)"
                    : "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isCurrent)
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                }}
                onMouseLeave={(e) => {
                  if (!isCurrent)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isDone
                      ? "var(--gold)"
                      : isCurrent
                      ? "rgba(201,169,110,0.2)"
                      : "rgba(255,255,255,0.05)",
                    border: isCurrent ? "1.5px solid var(--gold)" : "none",
                    fontSize: "9px",
                    fontWeight: "800",
                    color: isDone
                      ? "var(--noir)"
                      : isCurrent
                      ? "var(--gold)"
                      : "rgba(255,255,255,0.2)",
                  }}
                >
                  {isDone ? "✓" : i + 1}
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: isCurrent ? "600" : "400",
                    color: isCurrent
                      ? "rgba(255,255,255,0.9)"
                      : isDone
                      ? "rgba(255,255,255,0.35)"
                      : "rgba(255,255,255,0.22)",
                    lineHeight: 1.3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Passer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <button
            onClick={skip}
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.2)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            Passer le tutoriel →
          </button>
        </div>
      </div>

      {/* ── CONTENU ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div
          style={{
            padding: "22px 52px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Étape {currentStep + 1} sur {STEPS.length}
          </div>
          <div
            style={{
              display: "flex",
              gap: "5px",
              flexWrap: "wrap",
              maxWidth: "400px",
            }}
          >
            {STEPS.map((_, i) => (
              <div
                key={i}
                onClick={() => goTo(i)}
                style={{
                  height: "4px",
                  borderRadius: "2px",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  width: i === currentStep ? "20px" : "4px",
                  background:
                    i < currentStep
                      ? "var(--gold)"
                      : i === currentStep
                      ? "var(--gold)"
                      : "rgba(255,255,255,0.1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Zone principale */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 80px",
          }}
        >
          <div
            style={{
              maxWidth: "620px",
              width: "100%",
              textAlign: "center",
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(8px)" : "translateY(0)",
              transition: "opacity 0.2s ease, transform 0.2s ease",
            }}
          >
            {/* Icône */}
            <div
              style={{ fontSize: "64px", marginBottom: "20px", lineHeight: 1 }}
            >
              {step.icon}
            </div>

            {/* Subtitle */}
            {step.subtitle && (
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(201,169,110,0.7)",
                  marginBottom: "10px",
                }}
              >
                {step.subtitle}
              </div>
            )}

            {/* Titre */}
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "44px",
                fontWeight: "300",
                color: "#fff",
                lineHeight: 1.1,
                marginBottom: "20px",
                letterSpacing: "-0.01em",
              }}
            >
              {step.title}
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: "15px",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.85,
                marginBottom: step.tip || step.highlight ? "24px" : "48px",
              }}
            >
              {step.description}
            </p>

            {/* Section badge */}
            {step.highlight && SECTION_ICONS[step.highlight] && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 20px",
                  background: `${SECTION_ICONS[step.highlight].color}14`,
                  border: `1px solid ${SECTION_ICONS[step.highlight].color}33`,
                  borderRadius: "30px",
                  marginBottom: "20px",
                }}
              >
                <span style={{ fontSize: "16px" }}>
                  {SECTION_ICONS[step.highlight].icon}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: SECTION_ICONS[step.highlight].color,
                  }}
                >
                  Section : {SECTION_ICONS[step.highlight].label}
                </span>
              </div>
            )}

            {/* Tip */}
            {step.tip && (
              <div
                style={{
                  padding: "14px 18px",
                  background: "rgba(201,169,110,0.07)",
                  border: "1px solid rgba(201,169,110,0.18)",
                  borderRadius: "10px",
                  marginBottom: "40px",
                  textAlign: "left",
                }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {step.tip}
                </p>
              </div>
            )}

            {!step.tip && !step.highlight && <div style={{ height: "8px" }} />}
            {(step.tip || step.highlight) && <div style={{ height: "8px" }} />}

            {/* Navigation */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {currentStep > 0 && (
                <button
                  onClick={prev}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "transparent",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.25)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                  }}
                >
                  ← Précédent
                </button>
              )}
              <button
                onClick={next}
                style={{
                  padding: "14px 36px",
                  borderRadius: "10px",
                  background: "var(--gold)",
                  color: "var(--noir)",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  letterSpacing: "0.04em",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 20px rgba(201,169,110,0.25)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-1px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                {currentStep === STEPS.length - 1
                  ? "Terminer le tutoriel ✓"
                  : "Suivant →"}
              </button>
            </div>

            {/* Raccourcis */}
            <div
              style={{
                marginTop: "24px",
                fontSize: "11px",
                color: "rgba(255,255,255,0.15)",
                display: "flex",
                gap: "20px",
                justifyContent: "center",
              }}
            >
              <span>← → Naviguer</span>
              <span>Esc Passer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
