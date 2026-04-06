import React, { useState } from "react";
import toast from "react-hot-toast";

const COMMANDES = [
  { id: "LV-00312", client: "Sophie M.", boutique: "Sandro Paris", items: "Robe Midi Fleurie × 1", total: 490, status: "livré", date: "2026-04-05", city: "Paris" },
  { id: "LV-00311", client: "Karim T.", boutique: "AMI Paris", items: "Trench Camel × 1", total: 890, status: "en cours", date: "2026-04-05", city: "Casablanca" },
  { id: "LV-00310", client: "Yasmine B.", boutique: "Isabel Marant", items: "Sneakers Cuir × 1", total: 450, status: "livré", date: "2026-04-04", city: "Paris" },
  { id: "LV-00309", client: "Lucas D.", boutique: "By Terry", items: "Parfum Oud 50ml × 1", total: 280, status: "retour", date: "2026-04-03", city: "Lyon" },
  { id: "LV-00308", client: "Nadia H.", boutique: "Sandro Paris", items: "Blazer Structuré × 1", total: 295, status: "livré", date: "2026-04-03", city: "Marseille" },
  { id: "LV-00307", client: "Thomas B.", boutique: "AMI Paris", items: "Sac Cuir × 1", total: 890, status: "annulé", date: "2026-04-02", city: "Paris" },
  { id: "LV-00306", client: "Isabelle M.", boutique: "Isabel Marant", items: "Mules Dorées × 1", total: 380, status: "livré", date: "2026-04-01", city: "Paris" },
];

const STATUS_BADGE = { "livré": "badge-success", "en cours": "badge-info", "retour": "badge-warning", "annulé": "badge-error", "en attente": "badge-gray" };

export default function Commandes() {
  const [commandes] = useState(COMMANDES);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBoutique, setFilterBoutique] = useState("all");

  const boutiques = [...new Set(commandes.map(c => c.boutique))];

  const filtered = commandes
    .filter((c) => filterStatus === "all" || c.status === filterStatus)
    .filter((c) => filterBoutique === "all" || c.boutique === filterBoutique)
    .filter((c) => !search || c.client.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()));

  const totalCA = commandes.filter(c => c.status === "livré").reduce((a, c) => a + c.total, 0);

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "36px" }}>Gestion des Commandes</h1>
          <p style={{ color: "var(--gray)", fontSize: "14px" }}>Toutes les commandes de la plateforme</p>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Total commandes", value: commandes.length, bg: "var(--info-bg)", color: "var(--info)" },
          { label: "Livrées", value: commandes.filter(c => c.status === "livré").length, bg: "var(--success-bg)", color: "var(--success)" },
          { label: "En cours", value: commandes.filter(c => c.status === "en cours").length, bg: "var(--warning-bg)", color: "var(--warning)" },
          { label: "CA livraisons", value: `${totalCA.toLocaleString("fr-FR")} €`, bg: "var(--gold-light)", color: "var(--gold-dark)" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: "11px", color: "var(--gray)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>{s.label}</div>
            <div style={{ fontSize: "28px", fontFamily: "var(--font-display)", color: "var(--noir)" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* FILTRES */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input className="input-field" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: "220px", marginBottom: 0 }} />
        <select className="input-field" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ maxWidth: "160px", marginBottom: 0 }}>
          <option value="all">Tous les statuts</option>
          <option value="livré">Livré</option>
          <option value="en cours">En cours</option>
          <option value="retour">Retour</option>
          <option value="annulé">Annulé</option>
        </select>
        <select className="input-field" value={filterBoutique} onChange={(e) => setFilterBoutique(e.target.value)} style={{ maxWidth: "180px", marginBottom: 0 }}>
          <option value="all">Toutes les boutiques</option>
          {boutiques.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table">
          <thead>
            <tr><th>RÉFÉRENCE</th><th>CLIENT</th><th>BOUTIQUE</th><th>ARTICLES</th><th>TOTAL</th><th>DATE</th><th>STATUT</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "var(--gray)" }}>Aucune commande trouvée</td></tr>}
            {filtered.map((c) => (
              <tr key={c.id}>
                <td style={{ fontFamily: "monospace", fontWeight: "700", fontSize: "13px" }}>#{c.id}</td>
                <td>
                  <div style={{ fontWeight: "600" }}>{c.client}</div>
                  <div style={{ fontSize: "11px", color: "var(--gray)" }}>{c.city}</div>
                </td>
                <td style={{ fontSize: "13px" }}>{c.boutique}</td>
                <td style={{ fontSize: "12px", color: "var(--gray)" }}>{c.items}</td>
                <td style={{ fontWeight: "700" }}>{c.total} €</td>
                <td style={{ fontSize: "12px", color: "var(--gray)" }}>{new Date(c.date).toLocaleDateString("fr-FR")}</td>
                <td><span className={`badge ${STATUS_BADGE[c.status]}`}>{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
