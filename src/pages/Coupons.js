import React, { useState } from "react";
import toast from "react-hot-toast";

const COUPONS_DATA = [
  { id: "CPN-001", code: "LIVRR20", type: "pourcentage", valeur: 20, portée: "plateforme", description: "20% sur toute commande — campagne lancement", minCommande: 100, maxUtilisations: 500, utilisations: 142, parClient: 1, dateDebut: "01/04/2026", dateFin: "30/04/2026", actif: true, creéPar: "Khalil B." },
  { id: "CPN-002", code: "BIENVENUE", type: "fixe", valeur: 15, portée: "plateforme", description: "15€ offerts — premier achat client", minCommande: 50, maxUtilisations: 1000, utilisations: 387, parClient: 1, dateDebut: "01/01/2026", dateFin: "31/12/2026", actif: true, creéPar: "Khalil B." },
  { id: "CPN-003", code: "FASHION10", type: "pourcentage", valeur: 10, portée: "categorie", categoriesCibles: ["Mode", "Accessoires"], description: "10% Mode & Accessoires — été 2026", minCommande: 80, maxUtilisations: 300, utilisations: 89, parClient: 2, dateDebut: "15/03/2026", dateFin: "15/06/2026", actif: true, creéPar: "Khalil B." },
  { id: "CPN-004", code: "LIVRAISON0", type: "livraison_offerte", valeur: 0, portée: "plateforme", description: "Livraison offerte — weekend promotionnel", minCommande: 0, maxUtilisations: 200, utilisations: 200, parClient: 1, dateDebut: "12/04/2026", dateFin: "14/04/2026", actif: false, creéPar: "Khalil B." },
  { id: "CPN-005", code: "PRESTIGE25", type: "pourcentage", valeur: 25, portée: "abonnement", abonnementsCibles: ["prestige"], description: "25% exclusif boutiques Prestige", minCommande: 150, maxUtilisations: 100, utilisations: 23, parClient: 1, dateDebut: "20/04/2026", dateFin: "31/05/2026", actif: true, creéPar: "Khalil B." },
];

const TYPE_CFG = {
  pourcentage:      { label: "% Remise",         color: "#185fa5", bg: "#eff6ff",          icon: "%" },
  fixe:             { label: "Montant fixe",      color: "#2e8b57", bg: "#e8f5ee",          icon: "€" },
  livraison_offerte:{ label: "Livraison offerte", color: "#6d28d9", bg: "#f5f3ff",          icon: "🛵" },
};

const PORTEE_CFG = {
  plateforme: { label: "Toute la plateforme", color: "#C9A96E", bg: "rgba(201,169,110,0.1)" },
  categorie:  { label: "Par catégorie",       color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
  abonnement: { label: "Par abonnement",      color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
};

const FORM_INIT = { code: "", type: "pourcentage", valeur: "", portée: "plateforme", description: "", minCommande: "", maxUtilisations: "", parClient: "1", dateDebut: "", dateFin: "" };

export default function Coupons() {
  const [coupons, setCoupons] = useState(COUPONS_DATA);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(FORM_INIT);
  const [filterActif, setFilterActif] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");

  const coupon = coupons.find((c) => c.id === selected);

  const filtres = coupons.filter((c) => {
    const matchActif = filterActif === "all" || (filterActif === "actif" ? c.actif : !c.actif);
    const matchType = filterType === "all" || c.type === filterType;
    const matchSearch = !search || c.code.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    return matchActif && matchType && matchSearch;
  });

  const stats = {
    total: coupons.length,
    actifs: coupons.filter((c) => c.actif).length,
    utilisations: coupons.reduce((s, c) => s + c.utilisations, 0),
    tauxMoyen: Math.round(coupons.filter((c) => c.maxUtilisations > 0).reduce((s, c) => s + (c.utilisations / c.maxUtilisations) * 100, 0) / coupons.filter((c) => c.maxUtilisations > 0).length),
  };

  const genCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({length: 8}, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  const creerCoupon = () => {
    if (!form.code.trim()) { toast.error("Code obligatoire"); return; }
    if (!form.valeur && form.type !== "livraison_offerte") { toast.error("Valeur obligatoire"); return; }
    if (!form.dateFin) { toast.error("Date de fin obligatoire"); return; }
    const newC = {
      id: `CPN-${String(coupons.length + 1).padStart(3, "0")}`,
      code: form.code.toUpperCase(), type: form.type, valeur: parseFloat(form.valeur) || 0,
      portée: form.portée, description: form.description,
      minCommande: parseFloat(form.minCommande) || 0,
      maxUtilisations: parseInt(form.maxUtilisations) || 0,
      utilisations: 0, parClient: parseInt(form.parClient) || 1,
      dateDebut: form.dateDebut || new Date().toLocaleDateString("fr-FR"),
      dateFin: form.dateFin, actif: true, creéPar: "Khalil B.",
    };
    setCoupons((prev) => [newC, ...prev]);
    setForm(FORM_INIT); setShowModal(false);
    toast.success(`Coupon ${newC.code} créé`);
  };

  const toggleActif = (id) => {
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, actif: !c.actif } : c));
    const c = coupons.find((x) => x.id === id);
    toast.success(c?.actif ? "Coupon désactivé" : "Coupon activé");
  };

  const copierCode = (code) => {
    navigator.clipboard.writeText(code).then(() => toast.success(`Code ${code} copié`));
  };

  return (
    <div className="page" style={{ padding: "32px 36px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
        <div>
          <div style={SUPRA}>Administration</div>
          <h1 style={H1}>Coupons plateforme</h1>
          <p style={SUB}>Codes promo globaux LIVRR — indépendants des boutiques</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ padding: "11px 22px", borderRadius: "var(--radius-sm)", fontSize: "13px", fontWeight: "600", background: "var(--noir)", color: "var(--gold)", border: "none", cursor: "pointer" }}>
          + Créer un coupon
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
        {[
          { label: "Total coupons", val: stats.total, color: "var(--noir)" },
          { label: "Actifs", val: stats.actifs, color: "#2e8b57" },
          { label: "Utilisations totales", val: stats.utilisations, color: "#185fa5" },
          { label: "Taux moyen utilisation", val: `${stats.tauxMoyen}%`, color: "var(--gold-dark)" },
        ].map((k) => (
          <div key={k.label} style={{ background: "#fff", borderRadius: "var(--radius-md)", padding: "16px 18px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--white-3)" }}>
            <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gray)", marginBottom: "6px" }}>{k.label}</div>
            <div style={{ fontSize: "26px", fontFamily: "var(--font-display)", fontWeight: "300", color: k.color }}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", padding: "12px 18px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--white-3)", marginBottom: "16px", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
        <input type="text" placeholder="Code, description…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: "7px 12px", border: "1px solid var(--white-3)", borderRadius: "var(--radius-sm)", fontSize: "12px", background: "var(--gray-bg)", outline: "none", minWidth: "160px" }} />
        <div style={{ width: 1, height: 20, background: "var(--white-3)" }} />
        {[{ v: "all", l: "Tous" }, { v: "actif", l: "Actifs" }, { v: "inactif", l: "Inactifs" }].map((f) => (
          <button key={f.v} onClick={() => setFilterActif(f.v)} style={fBtn(filterActif === f.v)}>{f.l}</button>
        ))}
        <div style={{ width: 1, height: 20, background: "var(--white-3)" }} />
        <button onClick={() => setFilterType("all")} style={fBtn(filterType === "all")}>Tous types</button>
        {Object.entries(TYPE_CFG).map(([k, v]) => (
          <button key={k} onClick={() => setFilterType(k)} style={fBtn(filterType === k, v.color, v.bg)}>{v.icon} {v.label}</button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: "12px", color: "var(--gray)" }}>{filtres.length} coupon{filtres.length > 1 ? "s" : ""}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 340px" : "1fr", gap: "20px" }}>

        {/* Tableau */}
        <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--white-3)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "var(--gray-bg)" }}>
                {["Code", "Type", "Valeur", "Portée", "Utilisation", "Validité", "Statut", ""].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gray)", borderBottom: "1px solid var(--white-3)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtres.map((c) => {
                const tc = TYPE_CFG[c.type];
                const pc = PORTEE_CFG[c.portée];
                const isActive = selected === c.id;
                const tauxUtil = c.maxUtilisations > 0 ? Math.round((c.utilisations / c.maxUtilisations) * 100) : null;
                const isExpired = (() => { const [d, m, y] = c.dateFin.split("/"); return new Date(`${y}-${m}-${d}`) < new Date(); })();
                return (
                  <tr key={c.id} onClick={() => setSelected(isActive ? null : c.id)} style={{ borderBottom: "1px solid var(--white-3)", cursor: "pointer", background: isActive ? "rgba(201,169,110,0.04)" : "transparent", transition: "background 0.15s", opacity: !c.actif ? 0.6 : 1 }}>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: "800", color: c.actif ? "var(--noir)" : "var(--gray)", letterSpacing: "0.05em" }}>{c.code}</span>
                        <button onClick={(e) => { e.stopPropagation(); copierCode(c.code); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", opacity: 0.5, padding: "2px" }}>📋</button>
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--gray)", marginTop: "2px" }}>{c.description}</div>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "10px", background: tc.bg, color: tc.color }}>{tc.icon} {tc.label}</span>
                    </td>
                    <td style={{ padding: "12px 14px", fontWeight: "700", fontSize: "15px", color: "var(--gold-dark)" }}>
                      {c.type === "pourcentage" ? `${c.valeur}%` : c.type === "fixe" ? `${c.valeur}€` : "Gratuite"}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "10px", background: pc.bg, color: pc.color }}>{pc.label}</span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "3px" }}>
                        {c.utilisations} {c.maxUtilisations > 0 ? `/ ${c.maxUtilisations}` : "/ ∞"}
                      </div>
                      {tauxUtil !== null && (
                        <div style={{ height: 4, background: "var(--white-3)", borderRadius: "4px", overflow: "hidden", width: "80px" }}>
                          <div style={{ height: "100%", width: `${Math.min(tauxUtil, 100)}%`, background: tauxUtil >= 90 ? "#c0392b" : tauxUtil >= 70 ? "#F59E0B" : "#10B981", borderRadius: "4px" }} />
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: "12px" }}>
                      <div style={{ color: "var(--gray)" }}>{c.dateDebut}</div>
                      <div style={{ color: isExpired ? "#c0392b" : "var(--gray)", fontWeight: isExpired ? "600" : "400" }}>→ {c.dateFin}{isExpired ? " ⚠" : ""}</div>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "12px", background: c.actif && !isExpired ? "#e8f5ee" : "#f3f4f6", color: c.actif && !isExpired ? "#2e8b57" : "#6B7280", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.actif && !isExpired ? "#10B981" : "#9CA3AF" }} />
                        {c.actif && !isExpired ? "Actif" : isExpired ? "Expiré" : "Inactif"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <button onClick={(e) => { e.stopPropagation(); toggleActif(c.id); }} style={{ padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: "11px", fontWeight: "600", cursor: "pointer", background: c.actif ? "#fef2f2" : "#e8f5ee", color: c.actif ? "#c0392b" : "#2e8b57", border: `1px solid ${c.actif ? "#fecaca" : "#bbf7d0"}` }}>
                        {c.actif ? "Désactiver" : "Activer"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtres.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--gray)" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🎟️</div>
              <div>Aucun coupon trouvé</div>
            </div>
          )}
        </div>

        {/* Détail */}
        {coupon && (
          <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--white-3)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--white-3)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <span style={{ fontFamily: "monospace", fontSize: "22px", fontWeight: "800", letterSpacing: "0.06em", color: "var(--noir)" }}>{coupon.code}</span>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "var(--gray)" }}>✕</button>
              </div>
              <div style={{ fontSize: "12px", color: "var(--gray)", lineHeight: 1.5 }}>{coupon.description}</div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
              {[
                { label: "Type", val: `${TYPE_CFG[coupon.type].icon} ${TYPE_CFG[coupon.type].label}` },
                { label: "Valeur", val: coupon.type === "pourcentage" ? `${coupon.valeur}%` : coupon.type === "fixe" ? `${coupon.valeur}€` : "Livraison gratuite" },
                { label: "Portée", val: PORTEE_CFG[coupon.portée].label },
                { label: "Commande minimum", val: coupon.minCommande > 0 ? `${coupon.minCommande}€` : "Aucun minimum" },
                { label: "Max. utilisations", val: coupon.maxUtilisations > 0 ? coupon.maxUtilisations : "Illimité" },
                { label: "Par client", val: `${coupon.parClient} fois max` },
                { label: "Utilisations actuelles", val: `${coupon.utilisations}${coupon.maxUtilisations > 0 ? ` / ${coupon.maxUtilisations}` : ""}`, bold: true },
                { label: "Date début", val: coupon.dateDebut },
                { label: "Date fin", val: coupon.dateFin },
                { label: "Créé par", val: coupon.creéPar },
              ].map((r) => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--white-3)" }}>
                  <span style={{ fontSize: "12px", color: "var(--gray)" }}>{r.label}</span>
                  <span style={{ fontSize: "12px", fontWeight: r.bold ? "700" : "500", color: r.bold ? "var(--gold-dark)" : "var(--noir)" }}>{r.val}</span>
                </div>
              ))}
              {/* Barre progression */}
              {coupon.maxUtilisations > 0 && (
                <div style={{ marginTop: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--gray)", marginBottom: "6px" }}>
                    <span>Taux d'utilisation</span>
                    <span style={{ fontWeight: "700" }}>{Math.round((coupon.utilisations / coupon.maxUtilisations) * 100)}%</span>
                  </div>
                  <div style={{ height: 8, background: "var(--white-3)", borderRadius: "8px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min((coupon.utilisations / coupon.maxUtilisations) * 100, 100)}%`, background: (coupon.utilisations / coupon.maxUtilisations) >= 0.9 ? "#c0392b" : "#10B981", borderRadius: "8px", transition: "width 0.4s" }} />
                  </div>
                </div>
              )}
              <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                <button onClick={() => copierCode(coupon.code)} style={{ flex: 1, padding: "9px", borderRadius: "var(--radius-sm)", fontSize: "12px", fontWeight: "600", background: "var(--gray-bg)", color: "var(--noir)", border: "1px solid var(--white-3)", cursor: "pointer" }}>
                  📋 Copier le code
                </button>
                <button onClick={() => toggleActif(coupon.id)} style={{ flex: 1, padding: "9px", borderRadius: "var(--radius-sm)", fontSize: "12px", fontWeight: "600", background: coupon.actif ? "#fef2f2" : "#e8f5ee", color: coupon.actif ? "#c0392b" : "#2e8b57", border: `1px solid ${coupon.actif ? "#fecaca" : "#bbf7d0"}`, cursor: "pointer" }}>
                  {coupon.actif ? "Désactiver" : "Activer"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal créer */}
      {showModal && (
        <div style={OVL} onClick={() => setShowModal(false)}>
          <div style={MDL} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: "300", marginBottom: "6px" }}>Nouveau coupon plateforme</h2>
            <p style={{ fontSize: "13px", color: "var(--gray)", marginBottom: "20px" }}>Le coupon sera applicable par tous les clients sur toute la plateforme LIVRR.</p>

            <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
              <div style={{ flex: 1 }}>
                <label style={LBL}>Code *</label>
                <div style={{ display: "flex", gap: "6px" }}>
                  <input type="text" value={form.code} onChange={(e) => setForm((p) => ({...p, code: e.target.value.toUpperCase()}))} placeholder="Ex. : SUMMER25" style={{ ...INPUT, flex: 1, fontFamily: "monospace", fontWeight: "700", letterSpacing: "0.05em" }} />
                  <button onClick={() => setForm((p) => ({...p, code: genCode()}))} style={{ padding: "10px 12px", borderRadius: "var(--radius-sm)", fontSize: "11px", background: "var(--gray-bg)", border: "1px solid var(--white-3)", cursor: "pointer", whiteSpace: "nowrap", color: "var(--gray)" }}>🎲 Auto</button>
                </div>
              </div>
            </div>

            <label style={LBL}>Type de remise *</label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
              {Object.entries(TYPE_CFG).map(([k, v]) => (
                <button key={k} onClick={() => setForm((p) => ({...p, type: k}))} style={{ flex: 1, padding: "10px 8px", borderRadius: "var(--radius-sm)", fontSize: "12px", fontWeight: "600", cursor: "pointer", border: `2px solid ${form.type === k ? v.color : "var(--white-3)"}`, background: form.type === k ? v.bg : "transparent", color: form.type === k ? v.color : "var(--gray)" }}>
                  {v.icon} {v.label}
                </button>
              ))}
            </div>

            {form.type !== "livraison_offerte" && (
              <div style={{ marginBottom: "14px" }}>
                <label style={LBL}>Valeur * {form.type === "pourcentage" ? "(%)" : "(€)"}</label>
                <input type="number" value={form.valeur} onChange={(e) => setForm((p) => ({...p, valeur: e.target.value}))} placeholder={form.type === "pourcentage" ? "Ex. : 20" : "Ex. : 15"} style={INPUT} />
              </div>
            )}

            <label style={LBL}>Description</label>
            <input type="text" value={form.description} onChange={(e) => setForm((p) => ({...p, description: e.target.value}))} placeholder="Ex. : 20% sur toute commande — campagne lancement" style={INPUT} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
              <div>
                <label style={LBL}>Commande minimum (€)</label>
                <input type="number" value={form.minCommande} onChange={(e) => setForm((p) => ({...p, minCommande: e.target.value}))} placeholder="0 = aucun minimum" style={INPUT} />
              </div>
              <div>
                <label style={LBL}>Max. utilisations total</label>
                <input type="number" value={form.maxUtilisations} onChange={(e) => setForm((p) => ({...p, maxUtilisations: e.target.value}))} placeholder="0 = illimité" style={INPUT} />
              </div>
              <div>
                <label style={LBL}>Utilisations par client</label>
                <input type="number" value={form.parClient} onChange={(e) => setForm((p) => ({...p, parClient: e.target.value}))} placeholder="1" style={INPUT} />
              </div>
              <div>
                <label style={LBL}>Date de fin *</label>
                <input type="date" value={form.dateFin} onChange={(e) => setForm((p) => ({...p, dateFin: e.target.value}))} style={INPUT} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
              <button onClick={() => setShowModal(false)} style={bStyle("ghost")}>Annuler</button>
              <button onClick={creerCoupon} style={bStyle("gold")}>Créer le coupon</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function fBtn(active, color, bg) { return { padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", cursor: "pointer", border: `1.5px solid ${active ? (color || "var(--gold)") : "var(--white-3)"}`, background: active ? (bg || "rgba(201,169,110,0.08)") : "transparent", color: active ? (color || "var(--gold-dark)") : "var(--gray)" }; }
function bStyle(t) { const s = { gold: { background: "var(--noir)", color: "var(--gold)", border: "none" }, ghost: { background: "transparent", color: "var(--gray)", border: "1.5px solid var(--white-3)" } }; return { padding: "9px 16px", borderRadius: "var(--radius-sm)", fontSize: "12px", fontWeight: "600", cursor: "pointer", ...s[t] }; }
const SUPRA = { fontSize: "11px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gray)", marginBottom: "8px" };
const H1 = { fontFamily: "var(--font-display)", fontSize: "44px", fontWeight: "300", lineHeight: 1.1 };
const SUB = { color: "var(--gray)", fontSize: "14px", marginTop: "6px" };
const OVL = { position: "fixed", inset: 0, background: "rgba(10,10,15,0.55)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" };
const MDL = { background: "#fff", borderRadius: "var(--radius-lg)", padding: "32px", width: "560px", boxShadow: "var(--shadow-lg)", maxHeight: "90vh", overflowY: "auto" };
const LBL = { display: "block", fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gray)", marginBottom: "8px" };
const INPUT = { width: "100%", padding: "10px 12px", border: "1.5px solid var(--white-3)", borderRadius: "var(--radius-sm)", fontSize: "13px", outline: "none", marginBottom: "0", display: "block" };