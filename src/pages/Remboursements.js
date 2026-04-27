import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRole } from "../hooks/useRole";
import { useDemandes } from "../context/DemandesContext";
import { useAuth } from "../context/AuthContext";

const REMB_DATA = [
  { id: "REMB-052", commande: "LV-00412", client: "Sophie M.", boutique: "Sandro Paris", montant: 490, type: "automatique", declencheur: "Incident livraison — coursier introuvable", statut: "en_cours", dateCreation: "18/04/2026", heureCreation: "15:35", datePrevue: "23/04/2026", reference: null, methode: "Carte bancaire", motifSAV: null, demandePar: null },
  { id: "REMB-051", commande: "LV-00390", client: "Yasmine B.", boutique: "Isabel Marant", montant: 450, type: "demande_sav", declencheur: "Demande SAV en attente de validation admin", statut: "en_attente_admin", dateCreation: "16/04/2026", heureCreation: "09:05", datePrevue: null, reference: null, methode: "Carte bancaire", motifSAV: "Produit reçu endommagé — déchirure couture gauche visible. Photos transmises par le client. Remboursement total recommandé.", demandePar: "Marie (SAV)" },
  { id: "REMB-050", commande: "LV-00374", client: "Nadia S.", boutique: "AMI Paris", montant: 290, type: "manuel_admin", declencheur: "Arbitrage admin — boutique bloquait le remboursement", statut: "effectué", dateCreation: "10/04/2026", heureCreation: "10:05", datePrevue: "15/04/2026", reference: "VIR-REMB-2026-050", methode: "Carte bancaire", motifSAV: null, demandePar: null },
  { id: "REMB-049", commande: "LV-00360", client: "Sophie M.", boutique: "Sandro Paris", montant: 198, type: "automatique", declencheur: "Retour validé — changement d'avis", statut: "effectué", dateCreation: "02/04/2026", heureCreation: "10:20", datePrevue: "07/04/2026", reference: "VIR-REMB-2026-049", methode: "Carte bancaire", motifSAV: null, demandePar: null },
  { id: "REMB-048", commande: "LV-00350", client: "Karim T.", boutique: "AMI Paris", montant: 89, type: "automatique", declencheur: "Boutique refus — produit indisponible après acceptation", statut: "effectué", dateCreation: "29/03/2026", heureCreation: "14:30", datePrevue: "03/04/2026", reference: "VIR-REMB-2026-048", methode: "Carte bancaire", motifSAV: null, demandePar: null },
  { id: "REMB-047", commande: "LV-00340", client: "Emma B.", boutique: "Sandro Paris", montant: 320, type: "demande_sav", declencheur: "Demande SAV validée par admin — mauvais produit envoyé", statut: "en_cours", dateCreation: "25/03/2026", heureCreation: "16:00", datePrevue: "30/03/2026", reference: null, methode: "Carte bancaire", motifSAV: "Mauvais produit envoyé par la boutique. Client a reçu un article différent de sa commande. Remboursement total.", demandePar: "Lucas (SAV)" },
];

const TYPE_CFG = {
  automatique:  { label: "Automatique", color: "#185fa5", bg: "#eff6ff",              icon: "⚡", desc: "Déclenché par la plateforme" },
  demande_sav:  { label: "Demande SAV", color: "#6d28d9", bg: "#f5f3ff",              icon: "👤", desc: "Demande soumise par le SAV" },
  manuel_admin: { label: "Admin",        color: "#C9A96E", bg: "rgba(201,169,110,0.1)", icon: "⚖️", desc: "Décidé par l'admin" },
};

const STATUT_CFG = {
  en_attente_admin: { label: "⏳ Attente admin", color: "#b7770d", bg: "#faeeda", dot: "#F59E0B" },
  en_attente:       { label: "En attente",       color: "#b7770d", bg: "#faeeda", dot: "#F59E0B" },
  en_cours:         { label: "En cours",         color: "#185fa5", bg: "#eff6ff", dot: "#3B82F6" },
  effectué:         { label: "Effectué ✓",       color: "#2e8b57", bg: "#e8f5ee", dot: "#10B981" },
  refusé:           { label: "Refusé",           color: "#c0392b", bg: "#fef2f2", dot: "#EF4444" },
  échoué:           { label: "Échoué",           color: "#c0392b", bg: "#fef2f2", dot: "#EF4444" },
};

export default function Remboursements() {
  const { admin } = useAuth();
  const { estAdmin, estSAV, role } = useRole();
  const { ajouterDemande } = useDemandes();

  const [rembs, setRembs] = useState(REMB_DATA);
  const [selected, setSelected] = useState(null); // id du remb sélectionné
  const [filterType, setFilterType] = useState("all");
  const [filterStatut, setFilterStatut] = useState("all");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDemandeModal, setShowDemandeModal] = useState(false);
  const [showRefusModal, setShowRefusModal] = useState(false);
  const [refText, setRefText] = useState("");
  const [demandeForm, setDemandeForm] = useState({ commande: "", client: "", boutique: "", montant: "", motif: "" });
  const [refusMotif, setRefusMotif] = useState("");
  const [pendingAction, setPendingAction] = useState(null);

  // ✅ POINT 3 — remb est toujours le remboursement sélectionné, quel que soit son statut
  const remb = selected ? rembs.find((r) => r.id === selected) : null;

  const filtres = rembs.filter((r) =>
    (filterType === "all" || r.type === filterType) &&
    (filterStatut === "all" || r.statut === filterStatut)
  );

  const stats = {
    total: rembs.length,
    montantTotal: rembs.reduce((s, r) => s + r.montant, 0),
    enAttenteAdmin: rembs.filter((r) => r.statut === "en_attente_admin").length,
    enCours: rembs.filter((r) => r.statut === "en_cours").length,
    effectués: rembs.filter((r) => r.statut === "effectué").length,
  };

  const confirmerVirement = () => {
    if (!refText.trim()) { toast.error("Référence obligatoire"); return; }
    setRembs((prev) => prev.map((r) => r.id === selected ? { ...r, statut: "effectué", reference: refText.trim() } : r));
    setShowConfirmModal(false); setRefText("");
    toast.success("Remboursement marqué comme effectué");
  };

  const soumettreDemande = () => {
    if (!demandeForm.commande || !demandeForm.motif || !demandeForm.montant) { toast.error("Remplissez tous les champs obligatoires"); return; }
    const newRemb = {
      id: `REMB-${String(rembs.length + 53).padStart(3, "0")}`,
      commande: demandeForm.commande, client: demandeForm.client,
      boutique: demandeForm.boutique, montant: parseInt(demandeForm.montant),
      type: "demande_sav", declencheur: "Demande SAV en attente de validation admin",
      statut: "en_attente_admin", dateCreation: new Date().toLocaleDateString("fr-FR"),
      heureCreation: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      datePrevue: null, reference: null, methode: "Carte bancaire",
      motifSAV: demandeForm.motif, demandePar: admin?.name || "SAV",
    };
    setRembs((prev) => [newRemb, ...prev]);
    ajouterDemande({
      type: "remboursement_sav",
      cible: `${demandeForm.client} — ${demandeForm.commande}`,
      cibleId: newRemb.id,
      motif: demandeForm.motif,
      demandePar: admin?.name || "SAV",
      role,
      montant: parseInt(demandeForm.montant),
    });
    setShowDemandeModal(false);
    setDemandeForm({ commande: "", client: "", boutique: "", montant: "", motif: "" });
    toast.success("Demande de remboursement envoyée à l'admin pour validation");
  };

  const validerDemande = (id) => {
    setRembs((prev) => prev.map((r) => r.id === id ? { ...r, statut: "en_cours", type: "demande_sav", declencheur: `Demande SAV validée par admin — ${r.motifSAV?.slice(0, 50)}…` } : r));
    toast.success("Demande validée — remboursement déclenché");
  };

  const refuserDemande = () => {
    if (!refusMotif.trim()) { toast.error("Motif de refus obligatoire"); return; }
    setRembs((prev) => prev.map((r) => r.id === pendingAction ? { ...r, statut: "refusé", declencheur: `Refusé par admin — ${refusMotif}` } : r));
    setShowRefusModal(false); setRefusMotif(""); setPendingAction(null);
    toast.success("Demande refusée — SAV notifié");
  };

  const exportCSV = () => {
    const rows = [
      ["ID", "Commande", "Client", "Boutique", "Montant", "Type", "Statut", "Déclencheur", "Motif SAV", "Demandé par", "Date", "Référence"],
      ...filtres.map((r) => [r.id, r.commande, r.client, r.boutique, r.montant + "€", TYPE_CFG[r.type]?.label, STATUT_CFG[r.statut]?.label, `"${r.declencheur}"`, r.motifSAV ? `"${r.motifSAV}"` : "—", r.demandePar || "—", r.dateCreation, r.reference || "—"]),
    ];
    const csv = rows.map((r) => r.join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `livrr-remboursements-${new Date().toLocaleDateString("fr-FR").replace(/\//g, "-")}.csv`;
    a.click();
    toast.success("Export CSV téléchargé");
  };

  return (
    <div className="page" style={{ padding: "32px 36px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
        <div>
          <div style={SUPRA}>Administration</div>
          <h1 style={H1}>Remboursements</h1>
          <p style={SUB}>Automatiques · Demandes SAV · Admin — suivi des virements</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {(estSAV || role === "sav") && (
            <button onClick={() => setShowDemandeModal(true)} style={{ padding: "10px 18px", borderRadius: "var(--radius-sm)", fontSize: "12px", fontWeight: "600", background: "#6d28d9", color: "#fff", border: "none", cursor: "pointer" }}>
              + Demande de remboursement
            </button>
          )}
          <button onClick={exportCSV} style={{ padding: "10px 18px", borderRadius: "var(--radius-sm)", fontSize: "12px", fontWeight: "600", background: "var(--noir)", color: "var(--gold)", border: "none", cursor: "pointer" }}>
            ↓ Exporter CSV
          </button>
        </div>
      </div>

      {/* Alerte demandes en attente admin */}
      {estAdmin && stats.enAttenteAdmin > 0 && (
        <div style={{ background: "#faeeda", border: "2px solid #fde68a", borderRadius: "var(--radius-lg)", padding: "14px 20px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "18px" }}>⏳</span>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#b7770d" }}>{stats.enAttenteAdmin} demande{stats.enAttenteAdmin > 1 ? "s" : ""} SAV en attente de votre validation</span>
            <span style={{ fontSize: "12px", color: "#b7770d", opacity: 0.8, marginLeft: "10px" }}>Filtrez par "Attente admin" pour les voir</span>
          </div>
          <button onClick={() => setFilterStatut("en_attente_admin")} style={{ padding: "6px 14px", borderRadius: "var(--radius-sm)", fontSize: "12px", fontWeight: "600", background: "#b7770d", color: "#fff", border: "none", cursor: "pointer" }}>
            Voir les demandes
          </button>
        </div>
      )}

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", marginBottom: "20px" }}>
        {[
          { label: "Total", val: stats.total, color: "var(--noir)" },
          { label: "⏳ Attente admin", val: stats.enAttenteAdmin, color: "#b7770d" },
          { label: "En cours", val: stats.enCours, color: "#185fa5" },
          { label: "Effectués", val: stats.effectués, color: "#2e8b57" },
          { label: "Montant total", val: `${stats.montantTotal.toLocaleString("fr-FR")}€`, color: "var(--gold-dark)" },
        ].map((k) => (
          <div key={k.label} style={{ background: "#fff", borderRadius: "var(--radius-md)", padding: "16px 18px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--white-3)" }}>
            <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gray)", marginBottom: "6px" }}>{k.label}</div>
            <div style={{ fontSize: "22px", fontFamily: "var(--font-display)", fontWeight: "300", color: k.color }}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", padding: "12px 18px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--white-3)", marginBottom: "16px", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={() => setFilterType("all")} style={fBtn(filterType === "all")}>Tous types</button>
        {Object.entries(TYPE_CFG).map(([k, v]) => (
          <button key={k} onClick={() => setFilterType(k)} style={fBtn(filterType === k, v.color, v.bg)}>{v.icon} {v.label}</button>
        ))}
        <div style={{ width: 1, height: 20, background: "var(--white-3)" }} />
        <button onClick={() => setFilterStatut("all")} style={fBtn(filterStatut === "all")}>Tous statuts</button>
        {Object.entries(STATUT_CFG).map(([k, v]) => (
          <button key={k} onClick={() => setFilterStatut(k)} style={fBtn(filterStatut === k, v.color, v.bg)}>{v.label}</button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: "12px", color: "var(--gray)" }}>{filtres.length} entrée{filtres.length > 1 ? "s" : ""}</span>
      </div>

      {/* Layout : tableau + panneau détail côte à côte */}
      <div style={{ display: "grid", gridTemplateColumns: remb ? "1fr 380px" : "1fr", gap: "16px", alignItems: "start" }}>

        {/* Tableau */}
        <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--white-3)", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "700px" }}>
            <thead>
              <tr style={{ background: "var(--gray-bg)" }}>
                {["Réf.", "Client", "Boutique", "Montant", "Type", "Demandé par", "Déclencheur", "Date", "Statut", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gray)", borderBottom: "1px solid var(--white-3)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtres.map((r) => {
                const tc = TYPE_CFG[r.type] || TYPE_CFG.automatique;
                const sc = STATUT_CFG[r.statut] || STATUT_CFG.en_attente;
                const isSelected = selected === r.id;
                const isEnAttenteAdmin = r.statut === "en_attente_admin";
                return (
                  <tr
                    key={r.id}
                    // ✅ POINT 3 — clic sur n'importe quelle ligne ouvre le détail
                    onClick={() => setSelected(isSelected ? null : r.id)}
                    style={{ borderBottom: "1px solid var(--white-3)", cursor: "pointer", background: isSelected ? "rgba(201,169,110,0.06)" : isEnAttenteAdmin ? "rgba(245,158,11,0.03)" : "transparent", transition: "background 0.15s" }}
                  >
                    <td style={{ padding: "11px 12px", fontFamily: "monospace", fontSize: "11px", fontWeight: "700", color: "var(--gold-dark)" }}>{r.id}</td>
                    <td style={{ padding: "11px 12px", fontWeight: "500" }}>{r.client}</td>
                    <td style={{ padding: "11px 12px", fontSize: "12px", color: "var(--gray)" }}>{r.boutique}</td>
                    <td style={{ padding: "11px 12px", fontWeight: "700", fontSize: "14px" }}>{r.montant}€</td>
                    <td style={{ padding: "11px 12px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "10px", background: tc.bg, color: tc.color }}>{tc.icon} {tc.label}</span>
                    </td>
                    <td style={{ padding: "11px 12px", fontSize: "12px", color: "var(--gray)" }}>{r.demandePar || "Système"}</td>
                    <td style={{ padding: "11px 12px", fontSize: "12px", color: "var(--gray)", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.declencheur}</td>
                    <td style={{ padding: "11px 12px", fontSize: "12px", color: "var(--gray)", whiteSpace: "nowrap" }}>{r.dateCreation}</td>
                    <td style={{ padding: "11px 12px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "12px", background: sc.bg, color: sc.color, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: sc.dot }} />{sc.label}
                      </span>
                    </td>
                    <td style={{ padding: "11px 12px" }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: "flex", gap: "4px" }}>
                        {estAdmin && isEnAttenteAdmin && (
                          <>
                            <button onClick={() => validerDemande(r.id)} style={{ padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: "11px", fontWeight: "600", background: "#e8f5ee", color: "#2e8b57", border: "1px solid #bbf7d0", cursor: "pointer" }}>✓ Valider</button>
                            <button onClick={() => { setPendingAction(r.id); setShowRefusModal(true); }} style={{ padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: "11px", fontWeight: "600", background: "#fef2f2", color: "#c0392b", border: "1px solid #fecaca", cursor: "pointer" }}>Refuser</button>
                          </>
                        )}
                        {estAdmin && (r.statut === "en_cours" || r.statut === "en_attente") && (
                          <button onClick={() => { setSelected(r.id); setShowConfirmModal(true); }} style={{ padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: "11px", fontWeight: "600", background: "#eff6ff", color: "#185fa5", border: "1px solid #bfdbfe", cursor: "pointer" }}>Confirmer virement</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtres.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center", padding: "32px", color: "var(--gray)", fontSize: "13px" }}>Aucun remboursement trouvé</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Totaux */}
          <div style={{ padding: "14px 18px", borderTop: "2px solid var(--white-3)", background: "var(--gray-bg)", display: "flex", justifyContent: "flex-end", gap: "32px" }}>
            {[
              { label: "Montant filtré", val: filtres.reduce((s, r) => s + r.montant, 0).toLocaleString("fr-FR") + "€" },
              { label: "À valider (SAV)", val: filtres.filter((r) => r.statut === "en_attente_admin").reduce((s, r) => s + r.montant, 0).toLocaleString("fr-FR") + "€", color: "#b7770d" },
              { label: "À virer", val: filtres.filter((r) => r.statut === "en_cours").reduce((s, r) => s + r.montant, 0).toLocaleString("fr-FR") + "€", color: "#185fa5" },
            ].map((t) => (
              <div key={t.label} style={{ textAlign: "right" }}>
                <div style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gray)", marginBottom: "2px" }}>{t.label}</div>
                <div style={{ fontSize: "15px", fontWeight: "600", color: t.color || "var(--noir)" }}>{t.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ POINT 3 — Panneau détail : toutes les lignes, tous les statuts */}
        {remb && (
          <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--white-3)", position: "sticky", top: "20px", maxHeight: "80vh", overflowY: "auto" }}>
            {/* Header panneau */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--white-3)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold-dark)", marginBottom: "4px" }}>
                  {TYPE_CFG[remb.type]?.icon} {TYPE_CFG[remb.type]?.label} — {remb.id}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: "300" }}>{remb.client}</div>
                <div style={{ fontSize: "12px", color: "var(--gray)", marginTop: "2px" }}>{remb.boutique}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "var(--gray)", flexShrink: 0 }}>✕</button>
            </div>

            <div style={{ padding: "16px 20px" }}>
              {/* Statut */}
              {(() => {
                const sc = STATUT_CFG[remb.statut] || STATUT_CFG.en_attente;
                return (
                  <div style={{ marginBottom: "16px" }}>
                    <span style={{ fontSize: "12px", fontWeight: "600", padding: "5px 12px", borderRadius: "20px", background: sc.bg, color: sc.color, display: "inline-flex", alignItems: "center", gap: "5px" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot }} />{sc.label}
                    </span>
                  </div>
                );
              })()}

              {/* Infos principales */}
              <div style={{ background: "var(--gray-bg)", borderRadius: "var(--radius-md)", padding: "14px 16px", border: "1px solid var(--white-3)", marginBottom: "14px" }}>
                {[
                  { l: "Commande", v: remb.commande, mono: true },
                  { l: "Montant", v: `${remb.montant}€`, bold: true },
                  { l: "Méthode", v: remb.methode },
                  { l: "Créé le", v: `${remb.dateCreation} à ${remb.heureCreation}` },
                  { l: "Date prévue", v: remb.datePrevue || "—" },
                  { l: "Demandé par", v: remb.demandePar || "Système" },
                ].map((row) => (
                  <div key={row.l} style={{ display: "flex", justifyContent: "space-between", marginBottom: "7px", gap: "12px" }}>
                    <span style={{ fontSize: "12px", color: "var(--gray)", flexShrink: 0 }}>{row.l}</span>
                    <span style={{ fontSize: "12px", fontWeight: row.bold ? "700" : "500", textAlign: "right", fontFamily: row.mono ? "monospace" : "inherit", color: row.bold ? "var(--gold-dark)" : "var(--noir)" }}>{row.v}</span>
                  </div>
                ))}
                {remb.reference && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "7px", gap: "12px" }}>
                    <span style={{ fontSize: "12px", color: "var(--gray)", flexShrink: 0 }}>Référence virement</span>
                    <span style={{ fontSize: "11px", fontFamily: "monospace", fontWeight: "600", color: "#2e8b57", textAlign: "right" }}>{remb.reference}</span>
                  </div>
                )}
              </div>

              {/* Déclencheur */}
              <div style={{ marginBottom: "14px" }}>
                <div style={DETAIL_TITLE}>Déclencheur</div>
                <div style={{ background: "#f8f8f6", border: "1px solid var(--white-3)", borderRadius: "var(--radius-sm)", padding: "10px 14px", fontSize: "13px", color: "var(--noir)", lineHeight: 1.6 }}>
                  {remb.declencheur}
                </div>
              </div>

              {/* ✅ POINT 3 — Motif SAV affiché pour TOUS les statuts, y compris "effectué" et "automatique" */}
              {remb.motifSAV && (
                <div style={{ marginBottom: "14px" }}>
                  <div style={DETAIL_TITLE}>Motif SAV</div>
                  <div style={{ background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: "var(--radius-sm)", padding: "12px 14px", fontSize: "13px", color: "var(--noir)", lineHeight: 1.7, fontStyle: "italic" }}>
                    « {remb.motifSAV} »
                  </div>
                </div>
              )}

              {/* ✅ POINT 3 — Message "automatique" explicatif quand pas de motif SAV */}
              {!remb.motifSAV && remb.type === "automatique" && (
                <div style={{ marginBottom: "14px" }}>
                  <div style={DETAIL_TITLE}>Déclenchement</div>
                  <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "var(--radius-sm)", padding: "10px 14px", fontSize: "12px", color: "#185fa5" }}>
                    ⚡ Ce remboursement a été déclenché automatiquement par la plateforme. Aucun motif SAV associé.
                  </div>
                </div>
              )}

              {/* Référence virement si effectué */}
              {remb.statut === "effectué" && remb.reference && (
                <div style={{ marginBottom: "14px" }}>
                  <div style={DETAIL_TITLE}>Virement confirmé</div>
                  <div style={{ background: "#e8f5ee", border: "1px solid #bbf7d0", borderRadius: "var(--radius-sm)", padding: "10px 14px", fontSize: "13px", color: "#2e8b57", fontWeight: "600", fontFamily: "monospace" }}>
                    ✓ {remb.reference}
                  </div>
                </div>
              )}

              {/* Actions contextuelles dans le panneau */}
              {estAdmin && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                  {remb.statut === "en_attente_admin" && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => validerDemande(remb.id)} style={{ flex: 1, padding: "9px", borderRadius: "var(--radius-sm)", fontSize: "12px", fontWeight: "600", background: "#e8f5ee", color: "#2e8b57", border: "1px solid #bbf7d0", cursor: "pointer" }}>✓ Valider la demande</button>
                      <button onClick={() => { setPendingAction(remb.id); setShowRefusModal(true); }} style={{ flex: 1, padding: "9px", borderRadius: "var(--radius-sm)", fontSize: "12px", fontWeight: "600", background: "#fef2f2", color: "#c0392b", border: "1px solid #fecaca", cursor: "pointer" }}>Refuser</button>
                    </div>
                  )}
                  {(remb.statut === "en_cours" || remb.statut === "en_attente") && (
                    <button onClick={() => setShowConfirmModal(true)} style={{ width: "100%", padding: "9px", borderRadius: "var(--radius-sm)", fontSize: "12px", fontWeight: "600", background: "var(--noir)", color: "var(--gold)", border: "none", cursor: "pointer" }}>Confirmer le virement</button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Modal : SAV crée une demande ── */}
      {showDemandeModal && (
        <div style={OVL} onClick={() => setShowDemandeModal(false)}>
          <div style={MDL} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: "300", marginBottom: "6px" }}>Demande de remboursement</h2>
            <p style={{ fontSize: "13px", color: "var(--gray)", marginBottom: "16px" }}>La demande sera soumise à l'Admin Plateforme pour validation avant déclenchement.</p>
            <div style={{ background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: "var(--radius-sm)", padding: "10px 14px", fontSize: "12px", color: "#6d28d9", marginBottom: "16px" }}>
              👤 Votre rôle SAV ne peut pas déclencher directement un remboursement — cette demande sera examinée par l'admin.
            </div>
            {[
              { label: "Référence commande *", key: "commande", placeholder: "Ex. : LV-00412" },
              { label: "Nom du client *", key: "client", placeholder: "Ex. : Sophie M." },
              { label: "Boutique concernée", key: "boutique", placeholder: "Ex. : Sandro Paris" },
              { label: "Montant à rembourser (€) *", key: "montant", placeholder: "Ex. : 490", type: "number" },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: "14px" }}>
                <label style={LBL}>{f.label}</label>
                <input type={f.type || "text"} value={demandeForm[f.key]} onChange={(e) => setDemandeForm((p) => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={{ width: "100%", padding: "10px 12px", border: "1.5px solid var(--white-3)", borderRadius: "var(--radius-sm)", fontSize: "13px", outline: "none" }} />
              </div>
            ))}
            <label style={LBL}>Motif détaillé *</label>
            <textarea value={demandeForm.motif} onChange={(e) => setDemandeForm((p) => ({ ...p, motif: e.target.value }))} placeholder="Décrivez le problème avec précision — photos, preuves, historique client…" rows={4} style={{ width: "100%", padding: "10px 12px", border: "1.5px solid var(--white-3)", borderRadius: "var(--radius-sm)", fontSize: "13px", resize: "none", outline: "none", marginBottom: "20px" }} />
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowDemandeModal(false)} style={bStyle("ghost")}>Annuler</button>
              <button onClick={soumettreDemande} style={{ ...bStyle("gold"), background: "#6d28d9" }}>Envoyer à l'admin</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal : Admin confirme virement ── */}
      {showConfirmModal && remb && (
        <div style={OVL} onClick={() => setShowConfirmModal(false)}>
          <div style={{ ...MDL, width: "440px" }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: "300", marginBottom: "6px" }}>Confirmer le virement</h2>
            <p style={{ fontSize: "13px", color: "var(--gray)", marginBottom: "16px" }}>{remb.id} · {remb.client} · <strong>{remb.montant}€</strong></p>
            <label style={LBL}>Référence bancaire *</label>
            <input type="text" value={refText} onChange={(e) => setRefText(e.target.value)} placeholder="Ex. : VIR-REMB-2026-052" autoFocus style={{ width: "100%", padding: "10px 12px", border: "1.5px solid var(--white-3)", borderRadius: "var(--radius-sm)", fontSize: "13px", outline: "none", marginBottom: "20px" }} />
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowConfirmModal(false)} style={bStyle("ghost")}>Annuler</button>
              <button onClick={confirmerVirement} style={bStyle("success")}>Confirmer</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal : Admin refuse une demande SAV ── */}
      {showRefusModal && (
        <div style={OVL} onClick={() => setShowRefusModal(false)}>
          <div style={{ ...MDL, width: "440px" }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: "300", marginBottom: "6px" }}>Refuser la demande</h2>
            <p style={{ fontSize: "13px", color: "var(--gray)", marginBottom: "16px" }}>{rembs.find((r) => r.id === pendingAction)?.client} · {rembs.find((r) => r.id === pendingAction)?.montant}€</p>
            <label style={LBL}>Motif du refus *</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
              {["Informations insuffisantes — compléter le dossier", "Politique de remboursement non applicable", "Boutique non responsable — litige rejeté", "Délai de remboursement dépassé"].map((m) => (
                <button key={m} onClick={() => setRefusMotif(m)} style={{ textAlign: "left", padding: "9px 12px", borderRadius: "var(--radius-sm)", fontSize: "13px", border: `1.5px solid ${refusMotif === m ? "#c0392b" : "var(--white-3)"}`, background: refusMotif === m ? "#fef2f2" : "transparent", color: refusMotif === m ? "#c0392b" : "var(--noir)", cursor: "pointer" }}>{m}</button>
              ))}
            </div>
            <textarea value={refusMotif} onChange={(e) => setRefusMotif(e.target.value)} placeholder="Ou motif personnalisé…" rows={2} style={{ width: "100%", padding: "10px 12px", border: "1.5px solid var(--white-3)", borderRadius: "var(--radius-sm)", fontSize: "13px", resize: "none", outline: "none", marginBottom: "20px" }} />
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowRefusModal(false)} style={bStyle("ghost")}>Annuler</button>
              <button onClick={refuserDemande} style={bStyle("error")}>Confirmer le refus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function fBtn(active, color, bg) { return { padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", cursor: "pointer", border: `1.5px solid ${active ? (color || "var(--gold)") : "var(--white-3)"}`, background: active ? (bg || "rgba(201,169,110,0.08)") : "transparent", color: active ? (color || "var(--gold-dark)") : "var(--gray)" }; }
function bStyle(t) { const s = { gold: { background: "var(--noir)", color: "var(--gold)", border: "none" }, ghost: { background: "transparent", color: "var(--gray)", border: "1.5px solid var(--white-3)" }, error: { background: "#fef2f2", color: "var(--error)", border: "1.5px solid #fecaca" }, success: { background: "#e8f5ee", color: "#2e8b57", border: "1.5px solid #bbf7d0" } }; return { padding: "9px 16px", borderRadius: "var(--radius-sm)", fontSize: "12px", fontWeight: "600", cursor: "pointer", ...s[t] }; }
const SUPRA = { fontSize: "11px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gray)", marginBottom: "8px" };
const H1 = { fontFamily: "var(--font-display)", fontSize: "44px", fontWeight: "300", lineHeight: 1.1 };
const SUB = { color: "var(--gray)", fontSize: "14px", marginTop: "6px" };
const DETAIL_TITLE = { fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gray)", marginBottom: "8px" };
const OVL = { position: "fixed", inset: 0, background: "rgba(10,10,15,0.55)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" };
const MDL = { background: "#fff", borderRadius: "var(--radius-lg)", padding: "32px", width: "500px", boxShadow: "var(--shadow-lg)", maxHeight: "90vh", overflowY: "auto" };
const LBL = { display: "block", fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gray)", marginBottom: "8px" };
