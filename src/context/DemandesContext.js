import React, { createContext, useContext, useState } from "react";

const DemandesContext = createContext();

export function DemandesProvider({ children }) {
  const [demandes, setDemandes] = useState([
    // Example pre-seeded demande
    {
      id: "DEM-001",
      type: "suspension_boutique",
      cible: "Isabel Marant",
      cibleId: 3,
      motif: "Boutique inactive depuis 5 jours — 3 commandes annulées automatiquement",
      demandePar: "Paul (Ops)",
      role: "ops",
      date: new Date().toLocaleDateString("fr-FR"),
      heure: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      statut: "en_attente", // en_attente | validé | refusé
    },
    {
      id: "DEM-002",
      type: "blocage_client",
      cible: "Nadia S.",
      cibleId: 6,
      motif: "3ème chargeback abusif en moins d'un mois — fraude suspectée",
      demandePar: "Marie (SAV)",
      role: "sav",
      date: new Date().toLocaleDateString("fr-FR"),
      heure: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      statut: "en_attente",
    },
  ]);

  const ajouterDemande = (demande) => {
    const newDemande = {
      id: `DEM-${String(demandes.length + 1).padStart(3, "0")}`,
      date: new Date().toLocaleDateString("fr-FR"),
      heure: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      statut: "en_attente",
      ...demande,
    };
    setDemandes((prev) => [newDemande, ...prev]);
    return newDemande;
  };

  const validerDemande = (id) => {
    setDemandes((prev) => prev.map((d) => d.id === id ? { ...d, statut: "validé" } : d));
  };

  const refuserDemande = (id) => {
    setDemandes((prev) => prev.map((d) => d.id === id ? { ...d, statut: "refusé" } : d));
  };

  const demandesEnAttente = demandes.filter((d) => d.statut === "en_attente");

  return (
    <DemandesContext.Provider value={{ demandes, demandesEnAttente, ajouterDemande, validerDemande, refuserDemande }}>
      {children}
    </DemandesContext.Provider>
  );
}

export const useDemandes = () => {
  const context = useContext(DemandesContext);
  if (!context) {
    // Fallback si le contexte n'est pas disponible
    return {
      demandes: [],
      demandesEnAttente: [],
      ajouterDemande: () => {},
      validerDemande: () => {},
      refuserDemande: () => {},
    };
  }
  return context;
};