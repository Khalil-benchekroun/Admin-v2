import React, { useState } from "react";
import toast from "react-hot-toast";

const RETOURS = [
  { id: 1, ref: "#LV-00309", client: "Lucas D.", boutique: "By Terry", item: "Parfum Oud 50ml", reason: "Produit non conforme", total: 280, status: "en attente", date: "2026-04-04" },
  { id: 2, ref: "#LV-00280", client: "Thomas B.", boutique: "AMI Paris", item: "Sac Cuir Noir", reason: "Article endommagé", total: 890, status: "approuvé", date: "2026-03-28" },
  { id: 3, ref: "#LV-00245", client: "Julie P.", boutique: "Sandro Paris", item: "Robe Fleurie", reason: "Mauvaise taille", total: 490, status: "remboursé", date: "2026-03-15" },
];

export default function Retours() {
  const [retours, setRetours] = useState(RETOURS);

  const updateStatus = (id, status) => {
    setRetours((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    toast.success("Statut du retour mis à jour");
  };

  const STATUS_BADGE = { "en attente": "badge-warning", "approuvé": "badge-info", "remboursé": "badge-success", "refusé": "badge-error" };

  return (
    <div className="page">
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "36px" }}>Gestion des Retours</h1>
        <p style={{ color: "var(--gray)", fontSize: "14px" }}>{retours.filter(r => r.status === "en attente").length} retours en attente de traitement</p>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table">
          <thead>
            <tr><th>COMMANDE</th><th>CLIENT</th><th>ARTICLE</th><th>MOTIF</th><th>MONTANT</th><th>STATUT</th><th style={{ textAlign: "right" }}>ACTIONS</th></tr>
          </thead>
          <tbody>
            {retours.map((r) => (
              <tr key={r.id}>
                <td style={{ fontFamily: "monospace", fontWeight: "700", fontSize: "13px" }}>{r.ref}</td>
                <td>
                  <div style={{ fontWeight: "600" }}>{r.client}</div>
                  <div style={{ fontSize: "11px", color: "var(--gray)" }}>{r.boutique}</div>
                </td>
                <td style={{ fontSize: "13px" }}>{r.item}</td>
                <td style={{ fontSize: "12px", color: "var(--gray)" }}>{r.reason}</td>
                <td style={{ fontWeight: "700" }}>{r.total} €</td>
                <td><span className={`badge ${STATUS_BADGE[r.status]}`}>{r.status}</span></td>
                <td style={{ textAlign: "right" }}>
                  {r.status === "en attente" && (
                    <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                      <button className="btn-outline" style={{ fontSize: "12px", padding: "6px 12px", color: "var(--success)", borderColor: "var(--success)" }} onClick={() => updateStatus(r.id, "approuvé")}>Approuver</button>
                      <button className="btn-danger" style={{ fontSize: "12px", padding: "6px 12px" }} onClick={() => updateStatus(r.id, "refusé")}>Refuser</button>
                    </div>
                  )}
                  {r.status === "approuvé" && (
                    <button className="btn-outline" style={{ fontSize: "12px", padding: "6px 12px" }} onClick={() => updateStatus(r.id, "remboursé")}>Marquer remboursé</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
