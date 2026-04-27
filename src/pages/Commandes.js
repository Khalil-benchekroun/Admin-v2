import React, { useState } from "react";
import toast from "react-hot-toast";

const COMMANDES = [
  {
    id: "LV-00412",
    client: "Sophie M.",
    boutique: "Sandro Paris",
    total: 490,
    status: "bloquée",
    date: "09/04/2026",
    heure: "14:12",
    motifBlocage: "Coursier non trouvé depuis 45 min",
  },
  {
    id: "LV-00411",
    client: "Karim T.",
    boutique: "AMI Paris",
    total: 1079,
    status: "livrée",
    date: "09/04/2026",
    heure: "13:45",
    motifBlocage: null,
  },
  {
    id: "LV-00410",
    client: "Yasmine B.",
    boutique: "Isabel Marant",
    total: 450,
    status: "livrée",
    date: "09/04/2026",
    heure: "13:22",
    motifBlocage: null,
  },
  {
    id: "LV-00409",
    client: "Lucas D.",
    boutique: "By Terry",
    total: 280,
    status: "retour",
    date: "08/04/2026",
    heure: "18:10",
    motifBlocage: null,
  },
  {
    id: "LV-00408",
    client: "Nadia S.",
    boutique: "Sandro Paris",
    total: 890,
    status: "annulée",
    date: "08/04/2026",
    heure: "17:30",
    motifBlocage: null,
  },
  {
    id: "LV-00407",
    client: "Emma B.",
    boutique: "AMI Paris",
    total: 320,
    status: "en cours",
    date: "08/04/2026",
    heure: "16:55",
    motifBlocage: null,
  },
];

const STATUS_CFG = {
  "en cours": { label: "En cours", cls: "badge-info", dot: "#3B82F6" },
  livrée: { label: "Livrée", cls: "badge-success", dot: "#10B981" },
  bloquée: { label: "Bloquée", cls: "badge-error", dot: "#EF4444" },
  retour: { label: "Retour", cls: "badge-warning", dot: "#F59E0B" },
  annulée: { label: "Annulée", cls: "badge-gray", dot: "#9CA3AF" },
};

const MOTIFS_ANNULATION = [
  "Incident de livraison avéré",
  "Erreur de commande confirmée",
  "Boutique fermée / indisponible",
  "Demande exceptionnelle client validée",
  "Erreur technique plateforme",
];

export default function Commandes() {
  const [commandes, setCommandes] = useState(COMMANDES);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showCancel, setShowCancel] = useState(false);
  const [showRemb, setShowRemb] = useState(false);
  const [pendingId, setPendingId] = useState(null);
  const [motif, setMotif] = useState("");
  const [rembType, setRembType] = useState("total");
  const [rembMontant, setRembMontant] = useState("");

  const filtered = commandes.filter(
    (c) =>
      (filter === "all" || c.status === filter) &&
      (c.id.includes(search) ||
        c.client.toLowerCase().includes(search.toLowerCase()) ||
        c.boutique.toLowerCase().includes(search.toLowerCase()))
  );

  const annuler = () => {
    if (!motif.trim()) return toast.error("Motif obligatoire");
    setCommandes((prev) =>
      prev.map((c) => (c.id === pendingId ? { ...c, status: "annulée" } : c))
    );
    toast.success("Commande annulée — Remboursement déclenché", { icon: "ℹ️" });
    setShowCancel(false);
    setMotif("");
    if (selected?.id === pendingId) setSelected(null);
  };

  const rembourser = () => {
    if (!motif.trim()) return toast.error("Motif obligatoire");
    if (rembType === "partiel" && !rembMontant)
      return toast.error("Montant requis");
    toast.success(`Remboursement ${rembType} déclenché`, {
      icon: "💳",
      duration: 4000,
    });
    setShowRemb(false);
    setMotif("");
    setRembMontant("");
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
            Supervision
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "44px",
              fontWeight: "300",
              lineHeight: 1.1,
            }}
          >
            Commandes
          </h1>
          <p style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}>
            {commandes.filter((c) => c.status === "bloquée").length > 0
              ? `🔴 ${commandes.filter((c) => c.status === "bloquée").length} commande(s) bloquée(s) — intervention requise`
              : "Aucune commande bloquée"}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          className="input-field"
          placeholder="Rechercher par ref, client, boutique…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 0, maxWidth: "280px" }}
        />
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {[
            { k: "all", l: "Toutes" },
            { k: "bloquée", l: "Bloquées" },
            { k: "en cours", l: "En cours" },
            { k: "livrée", l: "Livrées" },
            { k: "annulée", l: "Annulées" },
          ].map((f) => (
            <button
              key={f.k}
              onClick={() => setFilter(f.k)}
              style={{
                padding: "8px 14px",
                borderRadius: "30px",
                border: `1.5px solid ${filter === f.k ? "var(--gold)" : "rgba(0,0,0,0.1)"}`,
                background: filter === f.k ? "rgba(201,169,110,0.08)" : "transparent",
                color: filter === f.k ? "var(--gold-dark)" : "var(--gray)",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                transition: "all 0.2s",
              }}
            >
              {f.l}{" "}
              <span style={{ opacity: 0.6 }}>
                ({f.k === "all" ? commandes.length : commandes.filter((c) => c.status === f.k).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: selected ? "1fr 380px" : "1fr",
          gap: "20px",
          // ✅ POINT 2 — alignItems stretch pour que les deux colonnes soient à la même hauteur
          alignItems: "start",
        }}
      >
        {/* ✅ POINT 2 — Wrapper avec overflowX: "auto" pour le scroll horizontal du tableau */}
        <div
          className="card"
          style={{
            padding: 0,
            // ✅ scroll horizontal quand le panneau détail rétrécit le tableau
            overflowX: "auto",
            // ✅ scroll vertical limité à ~6 lignes (~420px) quand beaucoup de commandes
            maxHeight: "520px",
            overflowY: "auto",
          }}
        >
          <table className="table" style={{ minWidth: "680px" }}>
            <thead>
              <tr>
                <th>Référence</th>
                <th>Client</th>
                <th>Boutique</th>
                <th>Total</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const sc = STATUS_CFG[c.status] || STATUS_CFG["en cours"];
                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(selected?.id === c.id ? null : c)}
                    style={{
                      cursor: "pointer",
                      background:
                        selected?.id === c.id
                          ? "rgba(201,169,110,0.06)"
                          : c.status === "bloquée"
                          ? "rgba(239,68,68,0.02)"
                          : "transparent",
                    }}
                  >
                    <td>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "15px",
                          fontWeight: "600",
                        }}
                      >
                        {c.id}
                      </div>
                      {c.motifBlocage && (
                        <div style={{ fontSize: "10px", color: "var(--error)", marginTop: "2px" }}>
                          ⚠ {c.motifBlocage}
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: "500" }}>{c.client}</td>
                    <td style={{ fontSize: "13px", color: "var(--gray)" }}>{c.boutique}</td>
                    <td style={{ fontFamily: "var(--font-display)", fontSize: "15px" }}>
                      {c.total} €
                    </td>
                    <td style={{ fontSize: "12px", color: "var(--gray)", whiteSpace: "nowrap" }}>
                      {c.date} · {c.heure}
                    </td>
                    <td>
                      <span className={`badge ${sc.cls}`}>{sc.label}</span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {c.status !== "annulée" && c.status !== "livrée" && (
                          <button
                            className="btn-danger"
                            style={{ fontSize: "11px", padding: "5px 10px" }}
                            onClick={() => {
                              setPendingId(c.id);
                              setMotif("");
                              setShowCancel(true);
                            }}
                          >
                            Annuler
                          </button>
                        )}
                        {c.status !== "annulée" && (
                          <button
                            className="btn-outline"
                            style={{ fontSize: "11px", padding: "5px 10px" }}
                            onClick={() => {
                              setPendingId(c.id);
                              setMotif("");
                              setRembType("total");
                              setShowRemb(true);
                            }}
                          >
                            Rembourser
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "var(--gray)", fontSize: "13px" }}>
                    Aucune commande trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Panneau détail — sticky, scroll indépendant */}
        {selected && (
          <div
            className="card"
            style={{
              position: "sticky",
              top: "20px",
              height: "fit-content",
              // ✅ Le panneau détail a son propre scroll si contenu long
              maxHeight: "520px",
              overflowY: "auto",
            }}
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
                  Détail commande
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "22px",
                    fontWeight: "400",
                  }}
                >
                  {selected.id}
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
              { l: "Client", v: selected.client },
              { l: "Boutique", v: selected.boutique },
              { l: "Total", v: `${selected.total} €` },
              { l: "Date", v: `${selected.date} à ${selected.heure}` },
              {
                l: "Statut",
                v: (
                  <span className={`badge ${STATUS_CFG[selected.status]?.cls}`}>
                    {STATUS_CFG[selected.status]?.label}
                  </span>
                ),
              },
            ].map((info) => (
              <div
                key={info.l}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
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
                <span style={{ fontSize: "13px", fontWeight: "500" }}>{info.v}</span>
              </div>
            ))}

            {selected.motifBlocage && (
              <div
                style={{
                  padding: "12px 14px",
                  background: "var(--error-bg)",
                  borderRadius: "8px",
                  marginTop: "12px",
                  fontSize: "12px",
                  color: "var(--error)",
                }}
              >
                ⚠ {selected.motifBlocage}
              </div>
            )}

            <div style={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap" }}>
              {selected.status !== "annulée" && selected.status !== "livrée" && (
                <button
                  className="btn-danger"
                  style={{ flex: 1, fontSize: "12px" }}
                  onClick={() => {
                    setPendingId(selected.id);
                    setMotif("");
                    setShowCancel(true);
                  }}
                >
                  Annuler la commande
                </button>
              )}
              {selected.status !== "annulée" && (
                <button
                  className="btn-outline"
                  style={{ flex: 1, fontSize: "12px" }}
                  onClick={() => {
                    setPendingId(selected.id);
                    setMotif("");
                    setRembType("total");
                    setShowRemb(true);
                  }}
                >
                  Rembourser
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL ANNULATION */}
      {showCancel && (
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
          onClick={() => setShowCancel(false)}
        >
          <div
            className="card"
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "32px",
              width: "100%",
              maxWidth: "440px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                fontSize: "11px",
                color: "var(--error)",
                fontWeight: "700",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Annulation — Admin
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "24px",
                fontWeight: "400",
                marginBottom: "6px",
              }}
            >
              {pendingId}
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "20px",
                lineHeight: 1.6,
              }}
            >
              Motif <strong>obligatoire</strong> — tracé et horodaté.
            </p>
            <label className="label">Motif *</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
              {MOTIFS_ANNULATION.map((m) => (
                <div
                  key={m}
                  onClick={() => setMotif(m)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "13px",
                    transition: "all 0.15s",
                    border: `1.5px solid ${motif === m ? "var(--error)" : "rgba(0,0,0,0.08)"}`,
                    background: motif === m ? "rgba(192,57,43,0.05)" : "#FAFAF8",
                    color: motif === m ? "var(--error)" : "var(--noir)",
                    fontWeight: motif === m ? "600" : "400",
                  }}
                >
                  {m}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn-danger" style={{ flex: 2 }} onClick={annuler}>
                Confirmer l'annulation
              </button>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => setShowCancel(false)}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REMBOURSEMENT */}
      {showRemb && (
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
          onClick={() => setShowRemb(false)}
        >
          <div
            className="card"
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "32px",
              width: "100%",
              maxWidth: "420px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                fontSize: "11px",
                color: "var(--gold)",
                fontWeight: "700",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Remboursement — Admin
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "24px",
                fontWeight: "400",
                marginBottom: "20px",
              }}
            >
              {pendingId}
            </h3>
            <label className="label">Type de remboursement *</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                marginBottom: "14px",
              }}
            >
              {["total", "partiel"].map((t) => (
                <div
                  key={t}
                  onClick={() => setRembType(t)}
                  style={{
                    padding: "12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    textAlign: "center",
                    border: `1.5px solid ${rembType === t ? "var(--gold)" : "rgba(0,0,0,0.08)"}`,
                    background: rembType === t ? "rgba(201,169,110,0.06)" : "#FAFAF8",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "14px",
                      color: rembType === t ? "var(--gold-dark)" : "var(--noir)",
                    }}
                  >
                    {t === "total" ? "Total" : "Partiel"}
                  </div>
                </div>
              ))}
            </div>
            {rembType === "partiel" && (
              <div style={{ marginBottom: "14px" }}>
                <label className="label">Montant à rembourser *</label>
                <input
                  className="input-field"
                  type="number"
                  placeholder="Ex: 150"
                  value={rembMontant}
                  onChange={(e) => setRembMontant(e.target.value)}
                  style={{ marginBottom: 0 }}
                />
              </div>
            )}
            <label className="label">Motif *</label>
            <textarea
              className="input-field"
              placeholder="Motif du remboursement…"
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              rows={3}
              style={{ resize: "none" }}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn-gold" style={{ flex: 2 }} onClick={rembourser}>
                Déclencher le remboursement
              </button>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => setShowRemb(false)}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
