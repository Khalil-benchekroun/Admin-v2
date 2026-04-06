import React from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const CA_DATA = [
  { mois: "Oct", ca: 48000 }, { mois: "Nov", ca: 62000 }, { mois: "Déc", ca: 89000 },
  { mois: "Jan", ca: 54000 }, { mois: "Fév", ca: 71000 }, { mois: "Mar", ca: 95000 },
];

const ORDERS_DATA = [
  { jour: "Lun", commandes: 45 }, { jour: "Mar", commandes: 62 }, { jour: "Mer", commandes: 38 },
  { jour: "Jeu", commandes: 74 }, { jour: "Ven", commandes: 91 }, { jour: "Sam", commandes: 110 }, { jour: "Dim", commandes: 83 },
];

const TOP_BOUTIQUES = [
  { name: "Sandro Paris", ca: "28 400 €", orders: 142, status: "active" },
  { name: "AMI Paris", ca: "19 800 €", orders: 98, status: "active" },
  { name: "Isabel Marant", ca: "15 200 €", orders: 76, status: "active" },
  { name: "By Terry", ca: "9 600 €", orders: 54, status: "active" },
];

const RECENT_ORDERS = [
  { ref: "#LV-00312", client: "Sophie M.", boutique: "Sandro Paris", total: 490, status: "livré" },
  { ref: "#LV-00311", client: "Karim T.", boutique: "AMI Paris", total: 1079, status: "en cours" },
  { ref: "#LV-00310", client: "Yasmine B.", boutique: "Isabel Marant", total: 450, status: "livré" },
  { ref: "#LV-00309", client: "Lucas D.", boutique: "By Terry", total: 280, status: "retour" },
];

const STATUS_BADGE = {
  "livré": "badge-success", "en cours": "badge-info", "retour": "badge-warning", "annulé": "badge-error"
};

export default function Dashboard() {
  return (
    <div className="page">
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "13px", color: "var(--gray)", marginBottom: "4px" }}>Tableau de bord</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "36px", fontWeight: "400" }}>Vue d'ensemble</h1>
        <p style={{ color: "var(--gray)", fontSize: "14px", marginTop: "4px" }}>
          {new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* STATS GLOBALES */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {[
          { label: "Boutiques actives", value: "12", sub: "+2 ce mois", color: "var(--gold)", icon: "🏪" },
          { label: "Clients inscrits", value: "2 847", sub: "+143 cette semaine", color: "var(--info)", icon: "👥" },
          { label: "Commandes aujourd'hui", value: "83", sub: "+12% vs hier", color: "var(--success)", icon: "📦" },
          { label: "CA total (mois)", value: "95 400 €", sub: "+34% vs mois dernier", color: "var(--success)", icon: "💰" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "11px", color: "var(--gray)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</span>
              <span style={{ fontSize: "20px" }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: "28px", fontFamily: "var(--font-display)", color: "var(--noir)", marginBottom: "6px" }}>{s.value}</div>
            <div style={{ fontSize: "12px", color: "var(--success)" }}>↑ {s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "20px", marginBottom: "20px" }}>
        {/* GRAPHIQUE CA */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px" }}>Chiffre d'affaires</h3>
            <span className="badge badge-success">6 derniers mois</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={CA_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="mois" tick={{ fontSize: 12, fill: "#6B6878" }} />
              <YAxis tick={{ fontSize: 12, fill: "#6B6878" }} />
              <Tooltip formatter={(v) => `${v.toLocaleString("fr-FR")} €`} />
              <Line type="monotone" dataKey="ca" stroke="var(--gold)" strokeWidth={2.5} dot={{ fill: "var(--gold)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* GRAPHIQUE COMMANDES */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px" }}>Commandes / jour</h3>
            <span className="badge badge-info">Cette semaine</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ORDERS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="jour" tick={{ fontSize: 12, fill: "#6B6878" }} />
              <YAxis tick={{ fontSize: 12, fill: "#6B6878" }} />
              <Tooltip />
              <Bar dataKey="commandes" fill="var(--noir)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* TOP BOUTIQUES */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px" }}>Top boutiques</h3>
            <Link to="/boutiques" style={{ fontSize: "13px", color: "var(--gold)", fontWeight: "500" }}>Voir tout →</Link>
          </div>
          <table className="table">
            <thead><tr><th>Boutique</th><th>CA</th><th>Commandes</th></tr></thead>
            <tbody>
              {TOP_BOUTIQUES.map((b) => (
                <tr key={b.name}>
                  <td><div style={{ fontWeight: "600", fontSize: "14px" }}>{b.name}</div></td>
                  <td style={{ fontWeight: "700", color: "var(--success)" }}>{b.ca}</td>
                  <td>{b.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DERNIÈRES COMMANDES */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px" }}>Dernières commandes</h3>
            <Link to="/commandes" style={{ fontSize: "13px", color: "var(--gold)", fontWeight: "500" }}>Voir tout →</Link>
          </div>
          <table className="table">
            <thead><tr><th>Réf.</th><th>Client</th><th>Total</th><th>Statut</th></tr></thead>
            <tbody>
              {RECENT_ORDERS.map((o) => (
                <tr key={o.ref}>
                  <td style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: "600" }}>{o.ref}</td>
                  <td style={{ fontSize: "13px" }}>{o.client}</td>
                  <td style={{ fontWeight: "600" }}>{o.total} €</td>
                  <td><span className={`badge ${STATUS_BADGE[o.status]}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
