import React, { useState } from "react";
import toast from "react-hot-toast";

const INITIAL_BOUTIQUES = [
  { id: 1, name: "Sandro Paris", city: "Paris 8e", email: "contact@sandro.fr", status: "active", products: 45, orders: 142, ca: 28400, joined: "2025-10-15" },
  { id: 2, name: "AMI Paris", city: "Paris 6e", email: "hello@amiparis.fr", status: "active", products: 32, orders: 98, ca: 19800, joined: "2025-11-02" },
  { id: 3, name: "Isabel Marant", city: "Paris 11e", email: "paris@isabelmarant.com", status: "active", products: 28, orders: 76, ca: 15200, joined: "2025-11-20" },
  { id: 4, name: "By Terry", city: "Paris 1er", email: "shop@byterry.com", status: "active", products: 18, orders: 54, ca: 9600, joined: "2026-01-08" },
  { id: 5, name: "Jacquemus", city: "Paris 2e", email: "boutique@jacquemus.com", status: "pending", products: 0, orders: 0, ca: 0, joined: "2026-03-01" },
  { id: 6, name: "Rouje", city: "Paris 9e", email: "contact@rouje.com", status: "inactive", products: 12, orders: 8, ca: 2100, joined: "2025-12-10" },
];

export default function Boutiques() {
  const [boutiques, setBoutiques] = useState(INITIAL_BOUTIQUES);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);

  const toggleStatus = (id) => {
    setBoutiques((prev) => prev.map((b) => b.id === id ? { ...b, status: b.status === "active" ? "inactive" : "active" } : b));
    toast.success("Statut mis à jour");
  };

  const filtered = boutiques
    .filter((b) => filterStatus === "all" || b.status === filterStatus)
    .filter((b) => !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.city.toLowerCase().includes(search.toLowerCase()));

  const STATUS_STYLE = {
    active: "badge-success", pending: "badge-warning", inactive: "badge-gray"
  };

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "36px" }}>Gestion des Boutiques</h1>
          <p style={{ color: "var(--gray)", fontSize: "14px" }}>{boutiques.filter(b => b.status === "active").length} boutiques actives sur {boutiques.length} partenaires</p>
        </div>
        <button className="btn-gold" onClick={() => toast.success("Lien d'invitation copié dans le presse-papier !")}>
          🔗 Générer un lien d'invitation
        </button>
      </div>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Boutiques actives", value: boutiques.filter(b => b.status === "active").length, bg: "var(--success-bg)", color: "var(--success)" },
          { label: "En attente", value: boutiques.filter(b => b.status === "pending").length, bg: "var(--warning-bg)", color: "var(--warning)" },
          { label: "CA total généré", value: `${boutiques.reduce((a, b) => a + b.ca, 0).toLocaleString("fr-FR")} €`, bg: "var(--gold-light)", color: "var(--gold-dark)" },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ background: s.bg, border: "none" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: s.color, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>{s.label}</div>
            <div style={{ fontSize: "28px", fontFamily: "var(--font-display)", color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* FILTRES */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input className="input-field" placeholder="Rechercher une boutique..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: "260px", marginBottom: 0 }} />
        {["all", "active", "pending", "inactive"].map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)}
            style={{ padding: "8px 16px", borderRadius: "20px", border: "none", background: filterStatus === s ? "var(--noir)" : "#fff", color: filterStatus === s ? "#fff" : "var(--gray)", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}>
            {s === "all" ? "Toutes" : s === "active" ? "Actives" : s === "pending" ? "En attente" : "Inactives"}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table">
          <thead>
            <tr><th>BOUTIQUE</th><th>VILLE</th><th>PRODUITS</th><th>COMMANDES</th><th>CA TOTAL</th><th>STATUT</th><th style={{ textAlign: "right" }}>ACTIONS</th></tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id}>
                <td>
                  <div style={{ fontWeight: "700", fontSize: "14px" }}>{b.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--gray)" }}>{b.email}</div>
                </td>
                <td style={{ fontSize: "13px" }}>{b.city}</td>
                <td style={{ fontWeight: "600" }}>{b.products}</td>
                <td style={{ fontWeight: "600" }}>{b.orders}</td>
                <td style={{ fontWeight: "700", color: b.ca > 0 ? "var(--success)" : "var(--gray)" }}>
                  {b.ca > 0 ? `${b.ca.toLocaleString("fr-FR")} €` : "—"}
                </td>
                <td><span className={`badge ${STATUS_STYLE[b.status]}`}>{b.status === "active" ? "Active" : b.status === "pending" ? "En attente" : "Inactive"}</span></td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                    <button className="btn-outline" style={{ fontSize: "12px", padding: "6px 12px" }} onClick={() => setSelected(b)}>Détails</button>
                    <button className={b.status === "active" ? "btn-danger" : "btn-outline"} style={{ fontSize: "12px", padding: "6px 12px" }} onClick={() => toggleStatus(b.id)}>
                      {b.status === "active" ? "Désactiver" : "Activer"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DÉTAIL BOUTIQUE */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setSelected(null)}>
          <div className="card" style={{ background: "#fff", borderRadius: "20px", padding: "30px", width: "100%", maxWidth: "500px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "12px", background: "var(--gold-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "700", color: "var(--gold-dark)" }}>
                {selected.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px" }}>{selected.name}</h3>
                <div style={{ fontSize: "13px", color: "var(--gray)" }}>{selected.city} · Depuis {new Date(selected.joined).toLocaleDateString("fr-FR")}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
              {[
                { label: "Produits", value: selected.products },
                { label: "Commandes", value: selected.orders },
                { label: "Chiffre d'affaires", value: `${selected.ca.toLocaleString("fr-FR")} €` },
                { label: "Statut", value: selected.status === "active" ? "Active" : "Inactive" },
              ].map((info) => (
                <div key={info.label} style={{ background: "#F8F7F4", borderRadius: "10px", padding: "12px 14px" }}>
                  <div style={{ fontSize: "10px", color: "var(--gray)", textTransform: "uppercase", fontWeight: "700", marginBottom: "4px" }}>{info.label}</div>
                  <div style={{ fontWeight: "700", fontSize: "16px" }}>{info.value}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: "13px", color: "var(--gray)", marginBottom: "20px" }}>
              <strong>Email :</strong> {selected.email}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn-gold" style={{ flex: 1 }} onClick={() => toast.success("Email envoyé à la boutique")}>Contacter</button>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => setSelected(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
