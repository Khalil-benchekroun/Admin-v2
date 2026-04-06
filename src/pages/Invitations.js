import React, { useState } from "react";
import toast from "react-hot-toast";

const INITIAL_LINKS = [
  { id: 1, code: "LIVRR-SANDRO-2026", boutique: "Sandro Paris", created: "2025-10-10", expires: "2025-11-10", used: true, usedBy: "Sandro Paris" },
  { id: 2, code: "LIVRR-JACQ-2026", boutique: "Jacquemus", created: "2026-03-01", expires: "2026-04-01", used: false, usedBy: null },
  { id: 3, code: "LIVRR-VIP-8821", boutique: "Nouveau partenaire", created: "2026-03-20", expires: "2026-04-20", used: false, usedBy: null },
];

export default function Invitations() {
  const [links, setLinks] = useState(INITIAL_LINKS);
  const [boutiqueName, setBoutiqueName] = useState("");

  const generateLink = () => {
    if (!boutiqueName.trim()) return toast.error("Nom de boutique requis");
    const code = `LIVRR-${boutiqueName.toUpperCase().replace(/\s/g, "").slice(0, 6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    setLinks((prev) => [{
      id: Date.now(), code, boutique: boutiqueName,
      created: new Date().toISOString().split("T")[0],
      expires: expiry.toISOString().split("T")[0],
      used: false, usedBy: null,
    }, ...prev]);
    setBoutiqueName("");
    toast.success(`Lien généré pour ${boutiqueName} !`);
  };

  const copyLink = (code) => {
    navigator.clipboard.writeText(`https://livrr.app/inscription?code=${code}`);
    toast.success("Lien copié !");
  };

  return (
    <div className="page">
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "36px" }}>Liens d'invitation</h1>
        <p style={{ color: "var(--gray)", fontSize: "14px" }}>Générez et gérez les liens d'accès pour les boutiques partenaires</p>
      </div>

      {/* GÉNÉRER UN LIEN */}
      <div className="card" style={{ marginBottom: "24px", background: "var(--noir)", border: "none" }}>
        <h3 style={{ fontFamily: "var(--font-display)", color: "var(--gold)", fontSize: "20px", marginBottom: "16px" }}>
          Générer un nouveau lien
        </h3>
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>
              Nom de la boutique partenaire
            </label>
            <input style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none", fontFamily: "var(--font-body)" }}
              placeholder="Ex: Maison Kitsuné" value={boutiqueName} onChange={(e) => setBoutiqueName(e.target.value)} />
          </div>
          <button className="btn-gold" style={{ padding: "12px 24px", whiteSpace: "nowrap" }} onClick={generateLink}>
            🔗 Générer le lien
          </button>
        </div>
      </div>

      {/* TABLE LIENS */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table">
          <thead>
            <tr><th>CODE</th><th>BOUTIQUE</th><th>CRÉÉ LE</th><th>EXPIRE LE</th><th>STATUT</th><th style={{ textAlign: "right" }}>ACTIONS</th></tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id}>
                <td><span style={{ fontFamily: "monospace", fontWeight: "700", fontSize: "13px", color: "var(--noir)" }}>{link.code}</span></td>
                <td style={{ fontWeight: "600" }}>{link.boutique}</td>
                <td style={{ fontSize: "13px", color: "var(--gray)" }}>{new Date(link.created).toLocaleDateString("fr-FR")}</td>
                <td style={{ fontSize: "13px", color: new Date(link.expires) < new Date() ? "var(--error)" : "var(--gray)" }}>
                  {new Date(link.expires).toLocaleDateString("fr-FR")}
                </td>
                <td>
                  {link.used
                    ? <span className="badge badge-success">✓ Utilisé par {link.usedBy}</span>
                    : new Date(link.expires) < new Date()
                    ? <span className="badge badge-error">Expiré</span>
                    : <span className="badge badge-warning">En attente</span>}
                </td>
                <td style={{ textAlign: "right" }}>
                  {!link.used && (
                    <button className="btn-outline" style={{ fontSize: "12px", padding: "6px 12px" }} onClick={() => copyLink(link.code)}>
                      📋 Copier
                    </button>
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
