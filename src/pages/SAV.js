import React, { useState } from "react";
import toast from "react-hot-toast";

const RECLAMATIONS = [
  { id: 1, client: "Sophie M.", email: "s.martin@gmail.com", subject: "Commande non reçue", order: "#LV-00290", date: "2026-04-03", status: "ouvert", priority: "haute", messages: [{ from: "client", text: "Ma commande n'est pas arrivée après 3h d'attente.", time: "14:32" }] },
  { id: 2, client: "Lucas D.", email: "l.dupont@yahoo.fr", subject: "Produit endommagé", order: "#LV-00309", date: "2026-04-04", status: "en cours", priority: "moyenne", messages: [{ from: "client", text: "Le sac reçu est rayé.", time: "09:15" }, { from: "admin", text: "Nous allons traiter votre réclamation sous 24h.", time: "10:00" }] },
  { id: 3, client: "Nadia H.", email: "n.haddad@gmail.com", subject: "Mauvaise taille livrée", order: "#LV-00305", date: "2026-04-02", status: "résolu", priority: "basse", messages: [{ from: "client", text: "J'ai reçu du M au lieu du S.", time: "16:45" }, { from: "admin", text: "Retour accepté, échange en cours.", time: "17:00" }] },
];

export default function SAV() {
  const [reclamations, setReclamations] = useState(RECLAMATIONS);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = reclamations.filter((r) => filterStatus === "all" || r.status === filterStatus);

  const sendReply = () => {
    if (!reply.trim()) return;
    setReclamations((prev) => prev.map((r) =>
      r.id === selected.id
        ? { ...r, status: "en cours", messages: [...r.messages, { from: "admin", text: reply, time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }] }
        : r
    ));
    setSelected((prev) => ({ ...prev, status: "en cours", messages: [...prev.messages, { from: "admin", text: reply, time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }] }));
    setReply("");
    toast.success("Réponse envoyée");
  };

  const resolveCase = (id) => {
    setReclamations((prev) => prev.map((r) => r.id === id ? { ...r, status: "résolu" } : r));
    if (selected?.id === id) setSelected((prev) => ({ ...prev, status: "résolu" }));
    toast.success("Réclamation marquée comme résolue");
  };

  const STATUS_BADGE = { "ouvert": "badge-error", "en cours": "badge-warning", "résolu": "badge-success" };
  const PRIORITY_BADGE = { "haute": "badge-error", "moyenne": "badge-warning", "basse": "badge-gray" };

  return (
    <div className="page">
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "36px" }}>Service Après-Vente</h1>
        <p style={{ color: "var(--gray)", fontSize: "14px" }}>Gestion des réclamations et support client</p>
      </div>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Réclamations ouvertes", value: reclamations.filter(r => r.status === "ouvert").length, bg: "var(--error-bg)", color: "var(--error)" },
          { label: "En cours de traitement", value: reclamations.filter(r => r.status === "en cours").length, bg: "var(--warning-bg)", color: "var(--warning)" },
          { label: "Résolues", value: reclamations.filter(r => r.status === "résolu").length, bg: "var(--success-bg)", color: "var(--success)" },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ background: s.bg, border: "none" }}>
            <div style={{ fontSize: "11px", color: s.color, fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>{s.label}</div>
            <div style={{ fontSize: "32px", fontFamily: "var(--font-display)", color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "20px", alignItems: "start" }}>
        {/* LISTE RÉCLAMATIONS */}
        <div>
          <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
            {["all", "ouvert", "en cours", "résolu"].map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)}
                style={{ padding: "6px 12px", borderRadius: "20px", border: "none", background: filterStatus === s ? "var(--noir)" : "#fff", color: filterStatus === s ? "#fff" : "var(--gray)", fontWeight: "600", cursor: "pointer", fontSize: "12px" }}>
                {s === "all" ? "Toutes" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filtered.map((r) => (
              <div key={r.id} onClick={() => setSelected(r)}
                style={{ padding: "16px", borderRadius: "12px", background: selected?.id === r.id ? "rgba(201,169,110,0.08)" : "var(--white)", border: `1.5px solid ${selected?.id === r.id ? "var(--gold)" : "rgba(0,0,0,0.06)"}`, cursor: "pointer", transition: "var(--transition)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                  <div style={{ fontWeight: "700", fontSize: "14px" }}>{r.client}</div>
                  <span className={`badge ${STATUS_BADGE[r.status]}`}>{r.status}</span>
                </div>
                <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>{r.subject}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "var(--gray)" }}>{r.order} · {new Date(r.date).toLocaleDateString("fr-FR")}</span>
                  <span className={`badge ${PRIORITY_BADGE[r.priority]}`}>{r.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHAT */}
        {selected ? (
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px" }}>{selected.subject}</h3>
                <div style={{ fontSize: "12px", color: "var(--gray)" }}>{selected.client} · {selected.order}</div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {selected.status !== "résolu" && (
                  <button className="btn-outline" style={{ fontSize: "12px", padding: "6px 12px" }} onClick={() => resolveCase(selected.id)}>
                    ✓ Résoudre
                  </button>
                )}
              </div>
            </div>

            <div style={{ background: "#F8F7F4", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px", minHeight: "200px", maxHeight: "300px", overflowY: "auto" }}>
              {selected.messages.map((msg, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: msg.from === "admin" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "75%", padding: "10px 14px", borderRadius: "12px", background: msg.from === "admin" ? "var(--noir)" : "#fff", color: msg.from === "admin" ? "#fff" : "var(--noir)", fontSize: "13px", border: msg.from === "client" ? "1px solid rgba(0,0,0,0.08)" : "none" }}>
                    <div style={{ marginBottom: "4px" }}>{msg.text}</div>
                    <div style={{ fontSize: "10px", opacity: 0.6, textAlign: "right" }}>{msg.from === "admin" ? "Admin LIVRR" : selected.client} · {msg.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {selected.status !== "résolu" && (
              <div style={{ display: "flex", gap: "10px" }}>
                <input className="input-field" placeholder="Votre réponse..." value={reply} onChange={(e) => setReply(e.target.value)} style={{ flex: 1, marginBottom: 0 }}
                  onKeyDown={(e) => { if (e.key === "Enter") sendReply(); }} />
                <button className="btn-gold" style={{ padding: "10px 20px" }} onClick={sendReply}>Envoyer</button>
              </div>
            )}
            {selected.status === "résolu" && (
              <div style={{ textAlign: "center", padding: "12px", background: "var(--success-bg)", borderRadius: "10px", color: "var(--success)", fontWeight: "600", fontSize: "13px" }}>
                ✓ Cette réclamation a été résolue
              </div>
            )}
          </div>
        ) : (
          <div className="card" style={{ textAlign: "center", padding: "60px", color: "var(--gray)" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>💬</div>
            <div style={{ fontSize: "14px" }}>Sélectionnez une réclamation pour voir la conversation</div>
          </div>
        )}
      </div>
    </div>
  );
}
