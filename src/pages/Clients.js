import React, { useState } from "react";

const CLIENTS = [
  { id: 1, name: "Sophie Martin", email: "s.martin@gmail.com", phone: "06 12 34 56 78", city: "Paris", orders: 8, totalSpent: 3240, lastOrder: "2026-04-01", premium: true },
  { id: 2, name: "Karim Tazi", email: "k.tazi@outlook.fr", phone: "06 98 76 54 32", city: "Casablanca", orders: 5, totalSpent: 2180, lastOrder: "2026-03-28", premium: false },
  { id: 3, name: "Yasmine Benali", email: "y.benali@gmail.com", phone: "06 55 44 33 22", city: "Paris", orders: 12, totalSpent: 5890, lastOrder: "2026-04-05", premium: true },
  { id: 4, name: "Lucas Dupont", email: "l.dupont@yahoo.fr", phone: "06 11 22 33 44", city: "Lyon", orders: 3, totalSpent: 890, lastOrder: "2026-02-14", premium: false },
  { id: 5, name: "Nadia Haddad", email: "n.haddad@gmail.com", phone: "06 77 88 99 00", city: "Marseille", orders: 7, totalSpent: 2670, lastOrder: "2026-03-15", premium: true },
  { id: 6, name: "Thomas Bernard", email: "t.bernard@free.fr", phone: "06 33 44 55 66", city: "Paris", orders: 2, totalSpent: 590, lastOrder: "2026-01-20", premium: false },
];

const CLIENT_ORDERS = {
  1: [{ ref: "#LV-00290", boutique: "Sandro Paris", total: 490, date: "2026-04-01", status: "livré" }, { ref: "#LV-00250", boutique: "AMI Paris", total: 890, date: "2026-03-10", status: "livré" }],
  3: [{ ref: "#LV-00312", boutique: "Isabel Marant", total: 450, date: "2026-04-05", status: "en cours" }, { ref: "#LV-00280", boutique: "By Terry", total: 280, date: "2026-03-20", status: "livré" }],
};

export default function Clients() {
  const [search, setSearch] = useState("");
  const [filterPremium, setFilterPremium] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = CLIENTS
    .filter((c) => filterPremium === "all" || (filterPremium === "premium" ? c.premium : !c.premium))
    .filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "36px" }}>Gestion des Clients</h1>
          <p style={{ color: "var(--gray)", fontSize: "14px" }}>{CLIENTS.length} clients inscrits · {CLIENTS.filter(c => c.premium).length} premium</p>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Total clients", value: CLIENTS.length, color: "var(--info)", bg: "var(--info-bg)" },
          { label: "Clients premium", value: CLIENTS.filter(c => c.premium).length, color: "var(--gold-dark)", bg: "var(--gold-light)" },
          { label: "Commandes totales", value: CLIENTS.reduce((a, c) => a + c.orders, 0), color: "var(--success)", bg: "var(--success-bg)" },
          { label: "CA clients", value: `${CLIENTS.reduce((a, c) => a + c.totalSpent, 0).toLocaleString("fr-FR")} €`, color: "var(--success)", bg: "var(--success-bg)" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: "11px", color: "var(--gray)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>{s.label}</div>
            <div style={{ fontSize: "28px", fontFamily: "var(--font-display)", color: "var(--noir)" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* FILTRES */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input className="input-field" placeholder="Rechercher par nom ou email..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: "300px", marginBottom: 0 }} />
        {[{ k: "all", l: "Tous" }, { k: "premium", l: "Premium" }, { k: "standard", l: "Standard" }].map((f) => (
          <button key={f.k} onClick={() => setFilterPremium(f.k)}
            style={{ padding: "8px 16px", borderRadius: "20px", border: "none", background: filterPremium === f.k ? "var(--noir)" : "#fff", color: filterPremium === f.k ? "#fff" : "var(--gray)", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}>
            {f.l}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table">
          <thead>
            <tr><th>CLIENT</th><th>VILLE</th><th>COMMANDES</th><th>TOTAL DÉPENSÉ</th><th>DERNIÈRE COMMANDE</th><th>TYPE</th><th style={{ textAlign: "right" }}>ACTIONS</th></tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>
                  <div style={{ fontWeight: "700", fontSize: "14px" }}>{c.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--gray)" }}>{c.email}</div>
                </td>
                <td style={{ fontSize: "13px" }}>{c.city}</td>
                <td style={{ fontWeight: "600" }}>{c.orders}</td>
                <td style={{ fontWeight: "700", color: "var(--success)" }}>{c.totalSpent.toLocaleString("fr-FR")} €</td>
                <td style={{ fontSize: "12px", color: "var(--gray)" }}>{new Date(c.lastOrder).toLocaleDateString("fr-FR")}</td>
                <td>
                  {c.premium
                    ? <span className="badge badge-gold">⭐ Premium</span>
                    : <span className="badge badge-gray">Standard</span>}
                </td>
                <td style={{ textAlign: "right" }}>
                  <button className="btn-outline" style={{ fontSize: "12px", padding: "6px 12px" }} onClick={() => setSelected(c)}>
                    Historique
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL HISTORIQUE */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setSelected(null)}>
          <div className="card" style={{ background: "#fff", borderRadius: "20px", padding: "30px", width: "100%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
              <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: selected.premium ? "var(--gold)" : "var(--gray-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "18px", fontWeight: "700" }}>
                {selected.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px" }}>{selected.name}</h3>
                <div style={{ fontSize: "12px", color: "var(--gray)" }}>{selected.email} · {selected.phone}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
              {[
                { label: "Commandes", value: selected.orders },
                { label: "Total dépensé", value: `${selected.totalSpent.toLocaleString("fr-FR")} €` },
                { label: "Ville", value: selected.city },
                { label: "Abonnement", value: selected.premium ? "Premium ⭐" : "Standard" },
              ].map((i) => (
                <div key={i.label} style={{ background: "#F8F7F4", borderRadius: "10px", padding: "12px" }}>
                  <div style={{ fontSize: "10px", color: "var(--gray)", textTransform: "uppercase", fontWeight: "700", marginBottom: "4px" }}>{i.label}</div>
                  <div style={{ fontWeight: "700", fontSize: "15px" }}>{i.value}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: "12px", fontWeight: "800", color: "var(--gray)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>Dernières commandes</div>
            {(CLIENT_ORDERS[selected.id] || []).length > 0 ? (
              CLIENT_ORDERS[selected.id].map((o) => (
                <div key={o.ref} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#F8F7F4", borderRadius: "8px", marginBottom: "8px" }}>
                  <div>
                    <div style={{ fontFamily: "monospace", fontWeight: "700", fontSize: "13px" }}>{o.ref}</div>
                    <div style={{ fontSize: "11px", color: "var(--gray)" }}>{o.boutique} · {new Date(o.date).toLocaleDateString("fr-FR")}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: "700" }}>{o.total} €</div>
                    <span className={`badge ${o.status === "livré" ? "badge-success" : "badge-info"}`}>{o.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "20px", color: "var(--gray)", fontSize: "13px" }}>Aucune commande récente disponible</div>
            )}
            <button className="btn-outline" style={{ width: "100%", marginTop: "16px" }} onClick={() => setSelected(null)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}
