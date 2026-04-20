import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useDemandes } from "../context/DemandesContext";

const BOUTIQUES = [
  {
    id: 1,
    name: "Sandro Paris",
    email: "contact@sandro.fr",
    abonnement: "prestige",
    statut: "active",
    ca: "28 400 €",
    orders: 142,
    note: 4.9,
    ville: "Paris 8e",
    dateInscription: "12/01/2026",
    responsable: "Marie Leclerc",
  },
  {
    id: 2,
    name: "AMI Paris",
    email: "ami@amiparis.fr",
    abonnement: "signature",
    statut: "active",
    ca: "19 800 €",
    orders: 98,
    note: 4.7,
    ville: "Paris 3e",
    dateInscription: "18/01/2026",
    responsable: "Alexandre M.",
  },
  {
    id: 3,
    name: "Isabel Marant",
    email: "contact@isabel.fr",
    abonnement: "signature",
    statut: "inactive",
    ca: "15 200 €",
    orders: 76,
    note: 4.8,
    ville: "Paris 11e",
    dateInscription: "25/01/2026",
    responsable: "Julie D.",
  },
  {
    id: 4,
    name: "By Terry",
    email: "hello@byterry.fr",
    abonnement: "classic",
    statut: "active",
    ca: "9 600 €",
    orders: 54,
    note: 4.6,
    ville: "Paris 1er",
    dateInscription: "02/02/2026",
    responsable: "Terry B.",
  },
  {
    id: 5,
    name: "Rouje",
    email: "bonjour@rouje.com",
    abonnement: "classic",
    statut: "pending",
    ca: "—",
    orders: 0,
    note: 0,
    ville: "Paris 6e",
    dateInscription: "08/04/2026",
    responsable: "Jeanne D.",
  },
];

const ABONNEMENT_CFG = {
  classic: { label: "Classic", color: "#6B7280", bg: "rgba(107,114,128,0.1)" },
  signature: {
    label: "Signature",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.1)",
  },
  prestige: {
    label: "Prestige",
    color: "#C9A96E",
    bg: "rgba(201,169,110,0.1)",
  },
};

const STATUT_CFG = {
  active: { label: "Active", cls: "badge-success" },
  inactive: { label: "Inactive", cls: "badge-error" },
  pending: { label: "En attente", cls: "badge-warning" },
  suspended: { label: "Suspendue", cls: "badge-gray" },
};

export default function Boutiques() {
  const { admin } = useAuth();
  const { ajouterDemande } = useDemandes();
  const role = admin?.role || "admin";
  const isAdmin = role === "admin";

  const [boutiques, setBoutiques] = useState(BOUTIQUES);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState("all");
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [msgTarget, setMsgTarget] = useState(null);
  const [showDemandeModal, setShowDemandeModal] = useState(false);
  const [demandeMotif, setDemandeMotif] = useState("");
  const [demandeCible, setDemandeCible] = useState(null);

  const filtered = boutiques.filter(
    (b) =>
      (filterStatut === "all" || b.statut === filterStatut) &&
      (b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.ville.toLowerCase().includes(search.toLowerCase()))
  );

  const changeStatut = (id, newStatut) => {
    setBoutiques((prev) =>
      prev.map((b) => (b.id === id ? { ...b, statut: newStatut } : b))
    );
    const b = boutiques.find((b) => b.id === id);
    const msgs = {
      active: "Boutique réactivée ✓",
      inactive: "Boutique désactivée",
      suspended: "Boutique suspendue",
    };
    toast(msgs[newStatut] || "Statut mis à jour", {
      icon: newStatut === "active" ? "✅" : "⚠️",
    });
    if (selected?.id === id)
      setSelected((prev) => ({ ...prev, statut: newStatut }));
  };

  const demanderSuspension = () => {
    if (!demandeMotif.trim()) {
      toast.error("Motif obligatoire");
      return;
    }
    const b = boutiques.find((x) => x.id === demandeCible);
    ajouterDemande({
      type: "suspension_boutique",
      cible: b?.name,
      cibleId: demandeCible,
      motif: demandeMotif,
      demandePar: admin?.name || role,
      role,
    });
    setShowDemandeModal(false);
    setDemandeMotif("");
    setDemandeCible(null);
    toast.success("Demande de suspension envoyée à l'admin pour validation");
  };

  const ouvrirDemandeSuspension = (id) => {
    setDemandeCible(id);
    setShowDemandeModal(true);
  };

  const envoyerMessage = () => {
    if (!msgText.trim()) return toast.error("Message vide");
    toast.success(`Message envoyé à ${msgTarget?.name}`, { icon: "📧" });
    setShowMsgModal(false);
    setMsgText("");
  };

  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "40px",
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
            Plateforme
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "44px",
              fontWeight: "300",
              lineHeight: 1.1,
            }}
          >
            Boutiques
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}
          >
            {boutiques.filter((b) => b.statut === "active").length} actives ·{" "}
            {boutiques.filter((b) => b.statut === "pending").length} en attente
            de validation
          </p>
        </div>
        <a
          href="/invitations"
          className="btn-gold"
          style={{ fontSize: "12px", textDecoration: "none" }}
        >
          + Inviter une boutique
        </a>
      </div>

      {/* FILTRES */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <input
          className="input-field"
          placeholder="Rechercher une boutique…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 0, maxWidth: "300px" }}
        />
        <div style={{ display: "flex", gap: "6px" }}>
          {[
            { k: "all", l: "Toutes" },
            { k: "active", l: "Actives" },
            { k: "inactive", l: "Inactives" },
            { k: "pending", l: "En attente" },
            { k: "suspended", l: "Suspendues" },
          ].map((f) => (
            <button
              key={f.k}
              onClick={() => setFilterStatut(f.k)}
              style={{
                padding: "8px 14px",
                borderRadius: "30px",
                border: `1.5px solid ${
                  filterStatut === f.k ? "var(--gold)" : "rgba(0,0,0,0.1)"
                }`,
                background:
                  filterStatut === f.k
                    ? "rgba(201,169,110,0.08)"
                    : "transparent",
                color:
                  filterStatut === f.k ? "var(--gold-dark)" : "var(--gray)",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                transition: "all 0.2s",
              }}
            >
              {f.l}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: selected ? "1fr 380px" : "1fr",
          gap: "20px",
        }}
      >
        {/* TABLE */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Boutique</th>
                <th>Ville</th>
                <th>Abonnement</th>
                <th>CA</th>
                <th>Note</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const ab = ABONNEMENT_CFG[b.abonnement];
                const st = STATUT_CFG[b.statut];
                return (
                  <tr
                    key={b.id}
                    onClick={() =>
                      setSelected(selected?.id === b.id ? null : b)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <div style={{ fontWeight: "700", fontSize: "14px" }}>
                        {b.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                        {b.email}
                      </div>
                    </td>
                    <td style={{ fontSize: "13px", color: "var(--gray)" }}>
                      {b.ville}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "10px",
                          fontWeight: "700",
                          background: ab.bg,
                          color: ab.color,
                        }}
                      >
                        {ab.label}
                      </span>
                    </td>
                    <td
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "15px",
                      }}
                    >
                      {b.ca}
                    </td>
                    <td style={{ fontSize: "13px" }}>
                      {b.note > 0 ? `⭐ ${b.note}` : "—"}
                    </td>
                    <td>
                      <span className={`badge ${st.cls}`}>{st.label}</span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {b.statut === "pending" && (
                          <>
                            <button
                              className="btn-success"
                              style={{ fontSize: "11px", padding: "5px 10px" }}
                              onClick={() => changeStatut(b.id, "active")}
                            >
                              ✓ Valider
                            </button>
                            <button
                              className="btn-danger"
                              style={{ fontSize: "11px", padding: "5px 10px" }}
                              onClick={() => changeStatut(b.id, "suspended")}
                            >
                              Refuser
                            </button>
                          </>
                        )}
                        {b.statut === "active" &&
                          (isAdmin ? (
                            <button
                              className="btn-outline"
                              style={{
                                fontSize: "11px",
                                padding: "5px 10px",
                                color: "var(--warning)",
                                borderColor: "var(--warning)",
                              }}
                              onClick={() => changeStatut(b.id, "suspended")}
                            >
                              Suspendre
                            </button>
                          ) : (
                            <button
                              className="btn-outline"
                              style={{
                                fontSize: "11px",
                                padding: "5px 10px",
                                color: "#b7770d",
                                borderColor: "#b7770d",
                              }}
                              onClick={() => ouvrirDemandeSuspension(b.id)}
                            >
                              ⚑ Demander suspension
                            </button>
                          ))}
                        {(b.statut === "inactive" ||
                          b.statut === "suspended") && (
                          <button
                            className="btn-success"
                            style={{ fontSize: "11px", padding: "5px 10px" }}
                            onClick={() => changeStatut(b.id, "active")}
                          >
                            Réactiver
                          </button>
                        )}
                        <button
                          className="btn-outline"
                          style={{ fontSize: "11px", padding: "5px 10px" }}
                          onClick={() => {
                            setMsgTarget(b);
                            setMsgText("");
                            setShowMsgModal(true);
                          }}
                        >
                          ✉
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* DÉTAIL */}
        {selected && (
          <div
            className="card"
            style={{ position: "sticky", top: "20px", height: "fit-content" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "20px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "var(--gold)",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "4px",
                  }}
                >
                  Fiche boutique
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "24px",
                    fontWeight: "400",
                  }}
                >
                  {selected.name}
                </h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "var(--gray)",
                }}
              >
                ✕
              </button>
            </div>
            {[
              { l: "Email", v: selected.email },
              { l: "Responsable", v: selected.responsable },
              { l: "Ville", v: selected.ville },
              { l: "Date inscription", v: selected.dateInscription },
              { l: "Abonnement", v: ABONNEMENT_CFG[selected.abonnement].label },
              { l: "CA généré", v: selected.ca },
              { l: "Commandes", v: `${selected.orders} commandes` },
              {
                l: "Note moyenne",
                v: selected.note > 0 ? `⭐ ${selected.note}/5` : "Aucun avis",
              },
            ].map((info) => (
              <div
                key={info.l}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--gray)",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {info.l}
                </span>
                <span style={{ fontSize: "13px", fontWeight: "500" }}>
                  {info.v}
                </span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop: "16px",
                flexWrap: "wrap",
              }}
            >
              <button
                className="btn-gold"
                style={{ flex: 1, fontSize: "12px" }}
                onClick={() => {
                  setMsgTarget(selected);
                  setShowMsgModal(true);
                }}
              >
                Envoyer un message
              </button>
              {selected.statut === "active" &&
                (isAdmin ? (
                  <button
                    className="btn-danger"
                    style={{ flex: 1, fontSize: "12px" }}
                    onClick={() => changeStatut(selected.id, "suspended")}
                  >
                    Suspendre
                  </button>
                ) : (
                  <button
                    style={{
                      flex: 1,
                      fontSize: "12px",
                      padding: "9px",
                      borderRadius: "var(--radius-sm)",
                      fontWeight: "600",
                      background: "#faeeda",
                      color: "#b7770d",
                      border: "1.5px solid #fde68a",
                      cursor: "pointer",
                    }}
                    onClick={() => ouvrirDemandeSuspension(selected.id)}
                  >
                    ⚑ Demander suspension
                  </button>
                ))}
              {selected.statut !== "active" && (
                <button
                  className="btn-success"
                  style={{ flex: 1, fontSize: "12px" }}
                  onClick={() => changeStatut(selected.id, "active")}
                >
                  Réactiver
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL MESSAGE */}
      {/* ── Modal demande suspension (SAV/Ops) ── */}
      {showDemandeModal && (
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
          onClick={() => setShowDemandeModal(false)}
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
              Demande de suspension
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "16px",
              }}
            >
              {boutiques.find((b) => b.id === demandeCible)?.name} — La
              suspension sera appliquée uniquement après validation par l'Admin
              Plateforme.
            </p>
            <div
              style={{
                background: "#faeeda",
                border: "1px solid #fde68a",
                borderRadius: "var(--radius-sm)",
                padding: "10px 14px",
                fontSize: "12px",
                color: "#b7770d",
                marginBottom: "16px",
              }}
            >
              ⚑ Votre rôle <strong>{role.toUpperCase()}</strong> ne permet pas
              de suspendre directement une boutique. Cette demande sera soumise
              à l'Admin Plateforme.
            </div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--gray)",
                marginBottom: "8px",
              }}
            >
              Motif de la demande *
            </label>
            <textarea
              value={demandeMotif}
              onChange={(e) => setDemandeMotif(e.target.value)}
              placeholder="Expliquez pourquoi cette boutique doit être suspendue…"
              rows={4}
              autoFocus
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
                onClick={() => {
                  setShowDemandeModal(false);
                  setDemandeMotif("");
                }}
                style={{
                  padding: "9px 16px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  background: "transparent",
                  color: "var(--gray)",
                  border: "1.5px solid var(--white-3)",
                }}
              >
                Annuler
              </button>
              <button
                onClick={demanderSuspension}
                style={{
                  padding: "9px 16px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  background: "#b7770d",
                  color: "#fff",
                  border: "none",
                }}
              >
                Envoyer la demande à l'admin
              </button>
            </div>
          </div>
        </div>
      )}

      {showMsgModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowMsgModal(false)}
        >
          <div
            className="card"
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "32px",
              width: "100%",
              maxWidth: "460px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                fontSize: "11px",
                color: "var(--gold)",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "6px",
              }}
            >
              Message admin
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "24px",
                fontWeight: "400",
                marginBottom: "20px",
              }}
            >
              → {msgTarget?.name}
            </h3>
            <textarea
              className="input-field"
              placeholder="Rédigez votre message à la boutique…"
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              rows={5}
              style={{ resize: "none" }}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="btn-gold"
                style={{ flex: 2 }}
                onClick={envoyerMessage}
              >
                Envoyer
              </button>
              <button
                className="btn-outline"
                style={{ flex: 1 }}
                onClick={() => setShowMsgModal(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
