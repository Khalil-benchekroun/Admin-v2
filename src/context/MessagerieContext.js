import React, { createContext, useContext, useState } from "react";

const CONVERSATIONS_INIT = [
  {
    id: "MSG-B-001",
    boutiqueId: 1,
    boutique: { nom: "Sandro Paris", avatar: "S", plan: "prestige" },
    statut: "non_lu",
    sujet: "Demande de modification zone de livraison",
    messages: [
      {
        id: 1,
        auteur: "Sandro Paris",
        role: "boutique",
        texte: "Bonjour, nous souhaiterions élargir notre zone de livraison aux arrondissements 17e et 18e. Est-ce possible pour la semaine prochaine ?",
        heure: "10:30",
        date: "18/04/2026",
      },
    ],
    dernier: "10:30 · 18/04/2026",
  },
  {
    id: "MSG-B-002",
    boutiqueId: 5,
    boutique: { nom: "Rouje", avatar: "R", plan: "classic" },
    statut: "non_lu",
    sujet: "Question sur le quota produits",
    messages: [
      {
        id: 1,
        auteur: "Rouje",
        role: "boutique",
        texte: "Bonjour, notre catalogue dépasse 50 produits. Comment procéder pour upgrader notre plan et ne pas perdre les fiches déjà créées ?",
        heure: "09:15",
        date: "18/04/2026",
      },
    ],
    dernier: "09:15 · 18/04/2026",
  },
  {
    id: "MSG-B-003",
    boutiqueId: 2,
    boutique: { nom: "AMI Paris", avatar: "A", plan: "signature" },
    statut: "lu",
    sujet: "Problème paiement abonnement",
    messages: [
      {
        id: 1,
        auteur: "AMI Paris",
        role: "boutique",
        texte: "Le prélèvement de ce mois a échoué. Pouvez-vous nous indiquer la procédure pour régulariser ?",
        heure: "15:00",
        date: "16/04/2026",
      },
      {
        id: 2,
        auteur: "Khalil B.",
        role: "admin",
        texte: "Bonjour, je transmets votre demande à notre équipe comptable. Vous recevrez un lien de paiement par email d'ici 24h. Avez-vous pu vérifier que votre RIB est bien à jour dans les paramètres ?",
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
    boutiqueId: 4,
    boutique: { nom: "By Terry", avatar: "B", plan: "classic" },
    statut: "lu",
    sujet: "Compensation litige — notification reçue",
    messages: [
      {
        id: 1,
        auteur: "Khalil B.",
        role: "admin",
        texte: "Bonjour, suite au litige de la commande LV-00385, une compensation de 15€ a été appliquée sur votre prochaine facture. Nous nous excusons pour le manque de communication lors de l'annulation.",
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

const MessagerieContext = createContext(null);

export function MessagerieProvider({ children }) {
  const [conversations, setConversations] = useState(CONVERSATIONS_INIT);
  // ID de la conversation à ouvrir automatiquement quand on arrive sur Messagerie
  const [convCible, setConvCible] = useState(null);

  // Ouvrir ou créer une conversation depuis Boutiques.js
  // Retourne l'id de la conversation créée ou existante
  const ouvrirOuCreerConversation = (boutique) => {
    const existing = conversations.find((c) => c.boutiqueId === boutique.id);
    if (existing) {
      setConvCible(existing.id);
      return existing.id;
    }
    // Créer une nouvelle conversation
    const now = new Date();
    const heure = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    const date = now.toLocaleDateString("fr-FR");
    const newConv = {
      id: `MSG-B-${String(conversations.length + 1).padStart(3, "0")}`,
      boutiqueId: boutique.id,
      boutique: {
        nom: boutique.name,
        avatar: boutique.name.charAt(0),
        plan: boutique.abonnement,
      },
      statut: "lu",
      sujet: "Nouvelle conversation",
      messages: [],
      dernier: `${heure} · ${date}`,
    };
    setConversations((prev) => [newConv, ...prev]);
    setConvCible(newConv.id);
    return newConv.id;
  };

  const marquerLu = (convId) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, statut: "lu" } : c))
    );
  };

  const envoyerMessage = (convId, texte, auteur = "Khalil B.") => {
    const now = new Date();
    const msg = {
      id: Date.now(),
      auteur,
      role: "admin",
      texte: texte.trim(),
      heure: now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      date: now.toLocaleDateString("fr-FR"),
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              messages: [...c.messages, msg],
              statut: "lu",
              dernier: `${msg.heure} · ${msg.date}`,
            }
          : c
      )
    );
    return msg;
  };

  const effacerCible = () => setConvCible(null);

  const nonLus = conversations.filter((c) => c.statut === "non_lu").length;

  return (
    <MessagerieContext.Provider
      value={{
        conversations,
        convCible,
        nonLus,
        ouvrirOuCreerConversation,
        marquerLu,
        envoyerMessage,
        effacerCible,
      }}
    >
      {children}
    </MessagerieContext.Provider>
  );
}

export function useMessagerie() {
  const ctx = useContext(MessagerieContext);
  if (!ctx) throw new Error("useMessagerie must be used within MessagerieProvider");
  return ctx;
}
