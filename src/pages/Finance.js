import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

// ── Mock Data ──────────────────────────────────────────────

// Abonnements boutiques (mensualités fixes)
const ABONNEMENTS_BOUTIQUES = [
  { id: "AB-001", boutique: "Sandro Paris",  plan: "prestige",  montant: 599, statut: "payé",     periode: "Avril 2026",  date: "01/04/2026" },
  { id: "AB-002", boutique: "AMI Paris",     plan: "signature", montant: 299, statut: "payé",     periode: "Avril 2026",  date: "01/04/2026" },
  { id: "AB-003", boutique: "Isabel Marant", plan: "signature", montant: 299, statut: "impayé",   periode: "Avril 2026",  date: "01/04/2026" },
  { id: "AB-004", boutique: "By Terry",      plan: "classic",   montant: 149, statut: "payé",     periode: "Avril 2026",  date: "01/04/2026" },
  { id: "AB-005", boutique: "Rouje",         plan: "classic",   montant: 149, statut: "en_attente", periode: "Avril 2026", date: "08/04/2026" },
  { id: "AB-006", boutique: "Sandro Paris",  plan: "prestige",  montant: 599, statut: "payé",     periode: "Mars 2026",   date: "01/03/2026" },
  { id: "AB-007", boutique: "AMI Paris",     plan: "signature", montant: 299, statut: "payé",     periode: "Mars 2026",   date: "01/03/2026" },
  { id: "AB-008", boutique: "Isabel Marant", plan: "signature", montant: 299, statut: "payé",     periode: "Mars 2026",   date: "01/03/2026" },
  { id: "AB-009", boutique: "By Terry",      plan: "classic",   montant: 149, statut: "payé",     periode: "Mars 2026",   date: "01/03/2026" },
];

// Abonnements clients Premium
const ABONNEMENTS_CLIENTS = [
  { id: "CAB-001", client: "Sophie M.",  plan: "premium_mensuel", montant: 14.99, statut: "actif",   dateDebut: "01/02/2026", prochainPrelevement: "01/05/2026" },
  { id: "CAB-002", client: "Karim T.",   plan: "premium_annuel",  montant: 9.99,  statut: "actif",   dateDebut: "15/01/2026", prochainPrelevement: "15/01/2027" },
  { id: "CAB-003", client: "Emma B.",    plan: "premium_mensuel", montant: 14.99, statut: "actif",   dateDebut: "10/03/2026", prochainPrelevement: "10/05/2026" },
  { id: "CAB-004", client: "Yasmine B.", plan: "premium_mensuel", montant: 14.99, statut: "résilié", dateDebut: "01/01/2026", prochainPrelevement: "—" },
  { id: "CAB-005", client: "Lucas D.",   plan: "premium_annuel",  montant: 9.99,  statut: "actif",   dateDebut: "20/02/2026", prochainPrelevement: "20/02/2027" },
  { id: "CAB-006", client: "Nadia S.",   plan: "premium_mensuel", montant: 14.99, statut: "suspendu",dateDebut: "05/03/2026", prochainPrelevement: "—" },
];

const CA_MENSUEL = [
  { mois: "Nov", ca: 41200, commissions: 6800, abonnementsBoutiques: 1196, abonnementsClients: 45, remboursements: 1200 },
  { mois: "Déc", ca: 68400, commissions: 11200, abonnementsBoutiques: 1346, abonnementsClients: 75, remboursements: 2100 },
  { mois: "Jan", ca: 84600, commissions: 13900, abonnementsBoutiques: 1346, abonnementsClients: 105, remboursements: 1800 },
  { mois: "Fév", ca: 91200, commissions: 14800, abonnementsBoutiques: 1346, abonnementsClients: 135, remboursements: 2400 },
  { mois: "Mar", ca: 103400, commissions: 16900, abonnementsBoutiques: 1346, abonnementsClients: 165, remboursements: 3100 },
  { mois: "Avr", ca: 119800, commissions: 19600, abonnementsBoutiques: 1346, abonnementsClients: 195, remboursements: 2800 },
];

const CA_SEMAINE = [
  { j: "Lun 11", ca: 14200, commissions: 2300, abonnementsBoutiques: 0, abonnementsClients: 0 },
  { j: "Mar 12", ca: 18600, commissions: 3100, abonnementsBoutiques: 0, abonnementsClients: 15 },
  { j: "Mer 13", ca: 12400, commissions: 2000, abonnementsBoutiques: 0, abonnementsClients: 0 },
  { j: "Jeu 14", ca: 22800, commissions: 3700, abonnementsBoutiques: 0, abonnementsClients: 30 },
  { j: "Ven 15", ca: 28400, commissions: 4600, abonnementsBoutiques: 1346, abonnementsClients: 15 },
  { j: "Sam 16", ca: 34200, commissions: 5600, abonnementsBoutiques: 0, abonnementsClients: 0 },
  { j: "Dim 17", ca: 26100, commissions: 4300, abonnementsBoutiques: 0, abonnementsClients: 15 },
];

const VERSEMENTS_BOUTIQUES = [
  { id: "VRS-041", boutique: "Sandro Paris",  avatar: "S", plan: "prestige",  commission: "12%", caBrut: 28400, commissionMontant: 3408, montantDu: 24992, statut: "en_attente", dateEcheance: "30/04/2026", commandes: 142, periode: "Avril 2026" },
  { id: "VRS-040", boutique: "AMI Paris",     avatar: "A", plan: "signature", commission: "15%", caBrut: 19800, commissionMontant: 2970, montantDu: 16830, statut: "en_attente", dateEcheance: "30/04/2026", commandes: 98,  periode: "Avril 2026" },
  { id: "VRS-039", boutique: "By Terry",      avatar: "B", plan: "classic",   commission: "18%", caBrut: 9600,  commissionMontant: 1728, montantDu: 7872,  statut: "en_attente", dateEcheance: "30/04/2026", commandes: 54,  periode: "Avril 2026" },
  { id: "VRS-038", boutique: "Sandro Paris",  avatar: "S", plan: "prestige",  commission: "12%", caBrut: 26100, commissionMontant: 3132, montantDu: 22968, statut: "versé",     dateEcheance: "31/03/2026", commandes: 130, periode: "Mars 2026" },
  { id: "VRS-037", boutique: "AMI Paris",     avatar: "A", plan: "signature", commission: "15%", caBrut: 17400, commissionMontant: 2610, montantDu: 14790, statut: "versé",     dateEcheance: "31/03/2026", commandes: 87,  periode: "Mars 2026" },
  { id: "VRS-036", boutique: "Isabel Marant", avatar: "I", plan: "signature", commission: "15%", caBrut: 15200, commissionMontant: 2280, montantDu: 12920, statut: "versé",     dateEcheance: "31/03/2026", commandes: 76,  periode: "Mars 2026" },
  { id: "VRS-035", boutique: "By Terry",      avatar: "B", plan: "classic",   commission: "18%", caBrut: 8800,  commissionMontant: 1584, montantDu: 7216,  statut: "versé",     dateEcheance: "31/03/2026", commandes: 48,  periode: "Mars 2026" },
];

const REMBOURSEMENTS = [
  { id: "REMB-042", client: "Sophie M.", boutique: "Sandro Paris",  montant: 198, motif: "Retour validé",      date: "15/04/2026", statut: "effectué" },
  { id: "REMB-041", client: "Nadia S.",  boutique: "AMI Paris",     montant: 290, motif: "Retour validé",      date: "10/04/2026", statut: "effectué" },
  { id: "REMB-040", client: "Karim T.", boutique: "AMI Paris",      montant: 89,  motif: "Erreur de livraison",date: "15/04/2026", statut: "effectué" },
  { id: "REMB-039", client: "Yasmine B.",boutique: "Isabel Marant", montant: 450, motif: "Produit endommagé",  date: "16/04/2026", statut: "en_cours" },
];

const PLAN_CFG = {
  classic:   { label: "Classic",   color: "#6B7280" },
  signature: { label: "Signature", color: "#3B82F6" },
  prestige:  { label: "Prestige",  color: "#C9A96E" },
};

const PLAN_CLIENT_CFG = {
  premium_mensuel: { label: "Premium Mensuel", color: "#8B5CF6", bg: "rgba(139,92,246,0.1)", prix: "14.99€/mois" },
  premium_annuel:  { label: "Premium Annuel",  color: "#C9A96E", bg: "rgba(201,169,110,0.1)", prix: "9.99€/mois" },
};

const STATUT_VERSEMENT = {
  en_attente: { label: "En attente", color: "#b7770d", bg: "#faeeda", dot: "#F59E0B" },
  versé:      { label: "Versé",      color: "#2e8b57", bg: "#e8f5ee", dot: "#10B981" },
  litige:     { label: "Litige",     color: "#c0392b", bg: "#fef2f2", dot: "#EF4444" },
};

const STATUT_AB = {
  payé:       { label: "Payé",       color: "#2e8b57", bg: "#e8f5ee" },
  impayé:     { label: "Impayé",     color: "#c0392b", bg: "#fef2f2" },
  en_attente: { label: "En attente", color: "#b7770d", bg: "#faeeda" },
  actif:      { label: "Actif",      color: "#2e8b57", bg: "#e8f5ee" },
  résilié:    { label: "Résilié",    color: "#6B7280", bg: "#f3f4f6" },
  suspendu:   { label: "Suspendu",   color: "#c0392b", bg: "#fef2f2" },
};

const TABS = [
  { id: "commissions",   label: "💰 Commissions",             sub: "CA & versements boutiques" },
  { id: "ab_boutiques",  label: "🏪 Abonnements boutiques",   sub: "Mensualités Classic/Signature/Prestige" },
  { id: "ab_clients",    label: "👤 Abonnements clients",     sub: "Premium mensuel & annuel" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid var(--white-3)", borderRadius: "10px", padding: "12px 16px", boxShadow: "var(--shadow-md)", fontSize: "12px" }}>
      <div style={{ fontWeight: "700", marginBottom: "6px", color: "var(--noir)" }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color, marginBottom: "2px" }}>
          {p.name} : <strong>{typeof p.value === "number" ? p.value.toLocaleString("fr-FR") + "€" : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

export default function Finance() {
  const [versements, setVersements] = useState(VERSEMENTS_BOUTIQUES);
  const [activeTab, setActiveTab] = useState("commissions");
  const [periode, setPeriode] = useState("semaine");
  const [filterStatut, setFilterStatut] = useState("all");
  const [filterPeriodeVers, setFilterPeriodeVers] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showVersModal, setShowVersModal] = useState(false);
  const [versRef, setVersRef] = useState("");

  const vers = selected ? versements.find((v) => v.id === selected) : null;
  const chartData = periode === "semaine" ? CA_SEMAINE : CA_MENSUEL;
  const xKey = periode === "semaine" ? "j" : "mois";

  // ── Totaux globaux (3 sources) ──
  const caCommissions = versements.reduce((s, v) => s + v.commissionMontant, 0);
  const caAbBoutiques = ABONNEMENTS_BOUTIQUES.filter((a) => a.statut === "payé").reduce((s, a) => s + a.montant, 0);
  const caAbClients = ABONNEMENTS_CLIENTS.filter((a) => a.statut === "actif").reduce((s, a) => s + a.montant, 0);
  const caTotal = caCommissions + caAbBoutiques + caAbClients;

  const totaux = {
    caTotal,
    caCommissions,
    caAbBoutiques,
    caAbClients,
    duBoutiques: versements.filter((v) => v.statut === "en_attente").reduce((s, v) => s + v.montantDu, 0),
    remboursements: REMBOURSEMENTS.reduce((s, r) => s + r.montant, 0),
  };

  const filtresVers = versements.filter((v) => {
    const matchStatut = filterStatut === "all" || v.statut === filterStatut;
    const matchPeriode = filterPeriodeVers === "all" || v.periode === filterPeriodeVers;
    return matchStatut && matchPeriode;
  });

  const periodes = [...new Set(versements.map((v) => v.periode))];

  const marquerVersé = () => {
    if (!versRef.trim()) { toast.error("Référence de virement obligatoire"); return; }
    setVersements((prev) => prev.map((v) => v.id === selected ? { ...v, statut: "versé" } : v));
    setShowVersModal(false); setVersRef("");
    toast.success(`Versement ${selected} marqué comme effectué`);
  };

  const exportCSV = () => {
    const rows = [
      ["=== LIVRR — EXPORT FINANCE ==="],
      ["Généré le", new Date().toLocaleDateString("fr-FR")],
      [],
      ["=== RÉSUMÉ CA ==="],
      ["CA Commissions (20%)", caCommissions + "€"],
      ["CA Abonnements boutiques", caAbBoutiques + "€"],
      ["CA Abonnements clients",   caAbClients + "€"],
      ["CA Total plateforme",      caTotal + "€"],
      [],
      ["=== VERSEMENTS BOUTIQUES ==="],
      ["ID", "Boutique", "Plan", "Taux", "CA Brut", "Commission", "Montant dû", "Statut", "Période", "Échéance"],
      ...filtresVers.map((v) => [v.id, v.boutique, v.plan, v.commission, v.caBrut, v.commissionMontant, v.montantDu, v.statut, v.periode, v.dateEcheance]),
      [],
      ["=== ABONNEMENTS BOUTIQUES ==="],
      ["ID", "Boutique", "Plan", "Montant", "Statut", "Période"],
      ...ABONNEMENTS_BOUTIQUES.map((a) => [a.id, a.boutique, a.plan, a.montant + "€", a.statut, a.periode]),
      [],
      ["=== ABONNEMENTS CLIENTS ==="],
      ["ID", "Client", "Plan", "Montant/mois", "Statut"],
      ...ABONNEMENTS_CLIENTS.map((a) => [a.id, a.client, a.plan, a.montant + "€", a.statut]),
    ];
    const csv = rows.map((r) => r.join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "livrr-finance-" + new Date().toLocaleDateString("fr-FR").replace(/\//g, "-") + ".csv";
    a.click(); toast.success("Export finance complet téléchargé");
  };

  return (
    <div className="page" style={{ padding: "32px 36px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
        <div>
          <div style={SUPRA}>Administration</div>
          <h1 style={H1}>Finance</h1>
          <p style={SUB}>Commissions · Abonnements boutiques · Abonnements clients</p>
        </div>
        <button onClick={exportCSV} style={{ padding: "10px 20px", borderRadius: "var(--radius-sm)", fontSize: "12px", fontWeight: "600", background: "var(--noir)", color: "var(--gold)", cursor: "pointer", border: "none" }}>
          ↓ Exporter CSV complet
        </button>
      </div>

      {/* ── KPIs 3 sources de revenus ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0", background: "rgba(0,0,0,0.06)", marginBottom: "24px", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        {[
          { label: "CA Commissions",           val: caCommissions.toLocaleString("fr-FR") + "€", sub: "20% sur chaque commande",         color: "#C9A96E", pct: Math.round((caCommissions / caTotal) * 100) },
          { label: "CA Abonnements boutiques", val: caAbBoutiques.toLocaleString("fr-FR") + "€", sub: "Classic · Signature · Prestige",   color: "#3B82F6", pct: Math.round((caAbBoutiques / caTotal) * 100) },
          { label: "CA Abonnements clients",   val: caAbClients.toFixed(2) + "€",                sub: "Premium mensuel & annuel",         color: "#8B5CF6", pct: Math.round((caAbClients / caTotal) * 100) },
        ].map((k, i) => (
          <div key={k.label} style={{ background: "#fff", padding: "22px 24px", borderRight: i < 2 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
            <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gray)", marginBottom: "8px" }}>{k.label}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: "300", color: k.color, lineHeight: 1, marginBottom: "6px" }}>{k.val}</div>
            <div style={{ fontSize: "11px", color: "var(--gray-light)", marginBottom: "10px" }}>{k.sub}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ flex: 1, height: 4, background: "var(--white-3)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${k.pct}%`, background: k.color, borderRadius: "4px" }} />
              </div>
              <span style={{ fontSize: "11px", fontWeight: "600", color: k.color }}>{k.pct}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* CA Total */}
      <div style={{ background: "var(--noir)", borderRadius: "var(--radius-lg)", padding: "18px 24px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>CA Total plateforme (toutes sources)</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "36px", fontWeight: "300", color: "var(--gold)" }}>
            {caTotal.toLocaleString("fr-FR")}€
          </div>
        </div>
        <div style={{ display: "flex", gap: "24px", textAlign: "right" }}>
          <div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", marginBottom: "3px" }}>À verser boutiques</div>
            <div style={{ fontSize: "18px", fontWeight: "600", color: "#60a5fa" }}>{totaux.duBoutiques.toLocaleString("fr-FR")}€</div>
          </div>
          <div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", marginBottom: "3px" }}>Remboursements</div>
            <div style={{ fontSize: "18px", fontWeight: "600", color: "#f87171" }}>{totaux.remboursements}€</div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: "0", borderBottom: "2px solid var(--white-3)", marginBottom: "24px" }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "12px 24px", fontSize: "13px", fontWeight: "600", background: "none", border: "none", cursor: "pointer", color: activeTab === t.id ? "var(--gold-dark)" : "var(--gray)", borderBottom: activeTab === t.id ? "2px solid var(--gold)" : "2px solid transparent", marginBottom: "-2px", transition: "all 0.15s", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
            {t.label}
            <span style={{ fontSize: "10px", fontWeight: "400", color: activeTab === t.id ? "var(--gold-dark)" : "var(--gray-light)" }}>{t.sub}</span>
          </button>
        ))}
      </div>

      {/* ── TAB 1 : Commissions ── */}
      {activeTab === "commissions" && (
        <div>
          {/* Graphique */}
          <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--white-3)", marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gray)", marginBottom: "4px" }}>CA Global & Revenus LIVRR</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: "300" }}>
                  {periode === "semaine" ? "7 derniers jours" : "6 derniers mois"}
                </div>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                {["semaine", "mois"].map((p) => (
                  <button key={p} onClick={() => setPeriode(p)} style={{ padding: "5px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", border: `1.5px solid ${periode === p ? "var(--gold)" : "var(--white-3)"}`, background: periode === p ? "rgba(201,169,110,0.08)" : "transparent", color: periode === p ? "var(--gold-dark)" : "var(--gray)", cursor: "pointer" }}>
                    {p === "semaine" ? "7 jours" : "6 mois"}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradCA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.15} /><stop offset="95%" stopColor="#C9A96E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradComm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} /><stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradAbB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradAbC" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.15} /><stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Area type="monotone" dataKey="ca" name="CA brut" stroke="#C9A96E" strokeWidth={2} fill="url(#gradCA)" dot={false} />
                <Area type="monotone" dataKey="commissions" name="Commissions" stroke="#3B82F6" strokeWidth={2} fill="url(#gradComm)" dot={false} />
                <Area type="monotone" dataKey="abonnementsBoutiques" name="Ab. boutiques" stroke="#10B981" strokeWidth={1.5} fill="url(#gradAbB)" dot={false} />
                <Area type="monotone" dataKey="abonnementsClients" name="Ab. clients" stroke="#8B5CF6" strokeWidth={1.5} fill="url(#gradAbC)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Versements */}
          <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--white-3)" }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--white-3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gray)", marginBottom: "4px" }}>Versements boutiques</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: "300" }}>Commissions & montants dus</div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <select value={filterPeriodeVers} onChange={(e) => setFilterPeriodeVers(e.target.value)} style={{ padding: "6px 10px", border: "1.5px solid var(--white-3)", borderRadius: "var(--radius-sm)", fontSize: "12px", outline: "none", background: "var(--gray-bg)", cursor: "pointer" }}>
                  <option value="all">Toutes périodes</option>
                  {periodes.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                {["all", "en_attente", "versé"].map((s) => (
                  <button key={s} onClick={() => setFilterStatut(s)} style={{ padding: "5px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", border: `1.5px solid ${filterStatut === s ? (s === "en_attente" ? "#b7770d" : s === "versé" ? "#2e8b57" : "var(--gold)") : "var(--white-3)"}`, background: filterStatut === s ? (s === "en_attente" ? "#faeeda" : s === "versé" ? "#e8f5ee" : "rgba(201,169,110,0.08)") : "transparent", color: filterStatut === s ? (s === "en_attente" ? "#b7770d" : s === "versé" ? "#2e8b57" : "var(--gold-dark)") : "var(--gray)", cursor: "pointer" }}>
                    {s === "all" ? "Tous" : STATUT_VERSEMENT[s].label}
                  </button>
                ))}
              </div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "var(--gray-bg)" }}>
                  {["Référence", "Boutique", "Période", "CA brut", "Commission", "Montant dû", "Échéance", "Statut", ""].map((h) => (
                    <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gray)", borderBottom: "1px solid var(--white-3)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtresVers.map((v) => {
                  const statut = STATUT_VERSEMENT[v.statut];
                  const plan = PLAN_CFG[v.plan];
                  const isSelected = selected === v.id;
                  return (
                    <tr key={v.id} onClick={() => setSelected(isSelected ? null : v.id)} style={{ borderBottom: "1px solid var(--white-3)", cursor: "pointer", background: isSelected ? "rgba(201,169,110,0.04)" : "transparent", transition: "background 0.15s" }}>
                      <td style={{ padding: "13px 14px", fontWeight: "600", color: "var(--gold-dark)", fontSize: "12px" }}>{v.id}</td>
                      <td style={{ padding: "13px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: `rgba(${plan.color === "#6B7280" ? "107,114,128" : plan.color === "#3B82F6" ? "59,130,246" : "201,169,110"},0.1)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", color: plan.color }}>
                            {v.avatar}
                          </div>
                          <div>
                            <div style={{ fontWeight: "500" }}>{v.boutique}</div>
                            <span style={{ fontSize: "10px", color: plan.color, fontWeight: "600" }}>{plan.label}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "13px 14px", color: "var(--gray)", fontSize: "12px" }}>{v.periode}</td>
                      <td style={{ padding: "13px 14px", fontWeight: "500" }}>{v.caBrut.toLocaleString("fr-FR")}€</td>
                      <td style={{ padding: "13px 14px" }}>
                        <span style={{ color: "#c0392b", fontWeight: "600" }}>−{v.commissionMontant.toLocaleString("fr-FR")}€</span>
                        <span style={{ fontSize: "10px", color: "var(--gray)", marginLeft: "4px" }}>({v.commission})</span>
                      </td>
                      <td style={{ padding: "13px 14px", fontWeight: "700", fontSize: "14px" }}>{v.montantDu.toLocaleString("fr-FR")}€</td>
                      <td style={{ padding: "13px 14px", fontSize: "12px", color: "var(--gray)" }}>{v.dateEcheance}</td>
                      <td style={{ padding: "13px 14px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "12px", background: statut.bg, color: statut.color, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: statut.dot }} />{statut.label}
                        </span>
                      </td>
                      <td style={{ padding: "13px 14px" }}>
                        {v.statut === "en_attente" && (
                          <button onClick={(e) => { e.stopPropagation(); setSelected(v.id); setShowVersModal(true); }} style={{ padding: "5px 12px", borderRadius: "var(--radius-sm)", fontSize: "11px", fontWeight: "600", background: "#e8f5ee", color: "#2e8b57", border: "1px solid #bbf7d0", cursor: "pointer" }}>
                            Marquer versé
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtresVers.length > 0 && (
              <div style={{ padding: "14px 24px", borderTop: "2px solid var(--white-3)", background: "var(--gray-bg)", display: "flex", justifyContent: "flex-end", gap: "28px" }}>
                {[
                  { label: "CA brut",       val: filtresVers.reduce((s, v) => s + v.caBrut, 0).toLocaleString("fr-FR") + "€" },
                  { label: "Commissions",   val: filtresVers.reduce((s, v) => s + v.commissionMontant, 0).toLocaleString("fr-FR") + "€", color: "#c0392b" },
                  { label: "À verser",      val: filtresVers.filter((v) => v.statut === "en_attente").reduce((s, v) => s + v.montantDu, 0).toLocaleString("fr-FR") + "€", color: "#185fa5" },
                ].map((t) => (
                  <div key={t.label} style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gray)", marginBottom: "2px" }}>{t.label}</div>
                    <div style={{ fontSize: "15px", fontWeight: "600", color: t.color || "var(--noir)" }}>{t.val}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2 : Abonnements boutiques ── */}
      {activeTab === "ab_boutiques" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
            {[
              { label: "Encaissé ce mois", val: ABONNEMENTS_BOUTIQUES.filter((a) => a.statut === "payé" && a.periode === "Avril 2026").reduce((s, a) => s + a.montant, 0) + "€", color: "#2e8b57" },
              { label: "Impayés", val: ABONNEMENTS_BOUTIQUES.filter((a) => a.statut === "impayé").length, color: "#c0392b" },
              { label: "Boutiques Classic", val: ABONNEMENTS_BOUTIQUES.filter((a) => a.plan === "classic" && a.periode === "Avril 2026").length, color: "#6B7280" },
              { label: "Boutiques Prestige", val: ABONNEMENTS_BOUTIQUES.filter((a) => a.plan === "prestige" && a.periode === "Avril 2026").length, color: "#C9A96E" },
            ].map((k) => (
              <div key={k.label} style={{ background: "#fff", borderRadius: "var(--radius-md)", padding: "16px 18px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--white-3)" }}>
                <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gray)", marginBottom: "6px" }}>{k.label}</div>
                <div style={{ fontSize: "26px", fontFamily: "var(--font-display)", fontWeight: "300", color: k.color }}>{k.val}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--white-3)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "var(--gray-bg)" }}>
                  {["Réf.", "Boutique", "Plan", "Mensualité", "Période", "Date", "Statut"].map((h) => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gray)", borderBottom: "1px solid var(--white-3)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ABONNEMENTS_BOUTIQUES.map((a) => {
                  const pc = PLAN_CFG[a.plan];
                  const sc = STATUT_AB[a.statut];
                  return (
                    <tr key={a.id} style={{ borderBottom: "1px solid var(--white-3)" }}>
                      <td style={{ padding: "12px 14px", fontFamily: "monospace", fontSize: "11px", fontWeight: "700", color: "var(--gold-dark)" }}>{a.id}</td>
                      <td style={{ padding: "12px 14px", fontWeight: "500" }}>{a.boutique}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "10px", background: `rgba(${pc.color === "#6B7280" ? "107,114,128" : pc.color === "#3B82F6" ? "59,130,246" : "201,169,110"},0.1)`, color: pc.color }}>{pc.label}</span>
                      </td>
                      <td style={{ padding: "12px 14px", fontWeight: "700", fontSize: "14px", color: "var(--gold-dark)" }}>{a.montant}€</td>
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: "var(--gray)" }}>{a.periode}</td>
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: "var(--gray)" }}>{a.date}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "12px", background: sc.bg, color: sc.color }}>{sc.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ padding: "12px 24px", borderTop: "2px solid var(--white-3)", background: "var(--gray-bg)", display: "flex", justifyContent: "flex-end", gap: "24px" }}>
              {[
                { label: "Total encaissé", val: ABONNEMENTS_BOUTIQUES.filter((a) => a.statut === "payé").reduce((s, a) => s + a.montant, 0) + "€", color: "#2e8b57" },
                { label: "Total impayé", val: ABONNEMENTS_BOUTIQUES.filter((a) => a.statut === "impayé").reduce((s, a) => s + a.montant, 0) + "€", color: "#c0392b" },
              ].map((t) => (
                <div key={t.label} style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gray)", marginBottom: "2px" }}>{t.label}</div>
                  <div style={{ fontSize: "15px", fontWeight: "600", color: t.color }}>{t.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3 : Abonnements clients ── */}
      {activeTab === "ab_clients" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
            {[
              { label: "Abonnés actifs", val: ABONNEMENTS_CLIENTS.filter((a) => a.statut === "actif").length, color: "#2e8b57" },
              { label: "MRR (mensuel)", val: ABONNEMENTS_CLIENTS.filter((a) => a.statut === "actif").reduce((s, a) => s + a.montant, 0).toFixed(2) + "€", color: "#8B5CF6" },
              { label: "Résiliés", val: ABONNEMENTS_CLIENTS.filter((a) => a.statut === "résilié").length, color: "#6B7280" },
              { label: "Suspendus", val: ABONNEMENTS_CLIENTS.filter((a) => a.statut === "suspendu").length, color: "#c0392b" },
            ].map((k) => (
              <div key={k.label} style={{ background: "#fff", borderRadius: "var(--radius-md)", padding: "16px 18px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--white-3)" }}>
                <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gray)", marginBottom: "6px" }}>{k.label}</div>
                <div style={{ fontSize: "26px", fontFamily: "var(--font-display)", fontWeight: "300", color: k.color }}>{k.val}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--white-3)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "var(--gray-bg)" }}>
                  {["Réf.", "Client", "Plan", "Montant/mois", "Début", "Prochain prélèvement", "Statut"].map((h) => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gray)", borderBottom: "1px solid var(--white-3)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ABONNEMENTS_CLIENTS.map((a) => {
                  const pc = PLAN_CLIENT_CFG[a.plan];
                  const sc = STATUT_AB[a.statut];
                  return (
                    <tr key={a.id} style={{ borderBottom: "1px solid var(--white-3)" }}>
                      <td style={{ padding: "12px 14px", fontFamily: "monospace", fontSize: "11px", fontWeight: "700", color: "var(--gold-dark)" }}>{a.id}</td>
                      <td style={{ padding: "12px 14px", fontWeight: "500" }}>{a.client}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "10px", background: pc.bg, color: pc.color }}>{pc.label}</span>
                      </td>
                      <td style={{ padding: "12px 14px", fontWeight: "700", fontSize: "14px", color: "#8B5CF6" }}>{a.montant}€</td>
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: "var(--gray)" }}>{a.dateDebut}</td>
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: a.prochainPrelevement === "—" ? "var(--gray-light)" : "var(--noir)", fontWeight: a.prochainPrelevement !== "—" ? "500" : "400" }}>{a.prochainPrelevement}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "12px", background: sc.bg, color: sc.color }}>{sc.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ padding: "12px 24px", borderTop: "2px solid var(--white-3)", background: "var(--gray-bg)", display: "flex", justifyContent: "flex-end", gap: "24px" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gray)", marginBottom: "2px" }}>MRR actif</div>
                <div style={{ fontSize: "15px", fontWeight: "600", color: "#8B5CF6" }}>{ABONNEMENTS_CLIENTS.filter((a) => a.statut === "actif").reduce((s, a) => s + a.montant, 0).toFixed(2)}€/mois</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal versement ── */}
      {showVersModal && vers && (
        <div style={OVL} onClick={() => setShowVersModal(false)}>
          <div style={MDL} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: "300", marginBottom: "6px" }}>Confirmer le versement</h2>
            <p style={{ fontSize: "13px", color: "var(--gray)", marginBottom: "20px" }}>
              {vers.boutique} · {vers.periode} · <strong>{vers.montantDu.toLocaleString("fr-FR")}€</strong>
            </p>
            <div style={{ background: "var(--gray-bg)", borderRadius: "var(--radius-md)", padding: "16px 18px", marginBottom: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "13px" }}>
                <div><span style={{ color: "var(--gray)" }}>CA brut : </span><strong>{vers.caBrut.toLocaleString("fr-FR")}€</strong></div>
                <div><span style={{ color: "var(--gray)" }}>Commission : </span><strong style={{ color: "#c0392b" }}>−{vers.commissionMontant.toLocaleString("fr-FR")}€ ({vers.commission})</strong></div>
                <div><span style={{ color: "var(--gray)" }}>Plan : </span><strong>{PLAN_CFG[vers.plan].label}</strong></div>
                <div><span style={{ color: "var(--gray)" }}>Commandes : </span><strong>{vers.commandes}</strong></div>
              </div>
              <div style={{ borderTop: "1px solid var(--white-3)", marginTop: "12px", paddingTop: "10px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", fontWeight: "700" }}>Montant à verser</span>
                <span style={{ fontSize: "18px", fontWeight: "700", color: "#2e8b57" }}>{vers.montantDu.toLocaleString("fr-FR")}€</span>
              </div>
            </div>
            <label style={LBL}>Référence de virement *</label>
            <input type="text" value={versRef} onChange={(e) => setVersRef(e.target.value)} placeholder="Ex. : VIR-2026-04-SANDRO-001" autoFocus style={{ width: "100%", padding: "10px 12px", border: "1.5px solid var(--white-3)", borderRadius: "var(--radius-sm)", fontSize: "13px", outline: "none", marginBottom: "16px" }} />
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "var(--radius-sm)", padding: "10px 14px", fontSize: "12px", color: "#b7770d", marginBottom: "20px" }}>
              ⚠ Cette action est irréversible. Assurez-vous que le virement a bien été émis.
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowVersModal(false)} style={bStyle("ghost")}>Annuler</button>
              <button onClick={marquerVersé} style={bStyle("success")}>Confirmer le versement</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function bStyle(t) { const s = { gold: { background: "var(--noir)", color: "var(--gold)", border: "none" }, ghost: { background: "transparent", color: "var(--gray)", border: "1.5px solid var(--white-3)" }, success: { background: "#e8f5ee", color: "#2e8b57", border: "1.5px solid #bbf7d0" } }; return { padding: "10px 18px", borderRadius: "var(--radius-sm)", fontSize: "12px", fontWeight: "600", cursor: "pointer", ...s[t] }; }
const SUPRA = { fontSize: "11px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gray)", marginBottom: "8px" };
const H1 = { fontFamily: "var(--font-display)", fontSize: "44px", fontWeight: "300", lineHeight: 1.1 };
const SUB = { color: "var(--gray)", fontSize: "14px", marginTop: "6px" };
const OVL = { position: "fixed", inset: 0, background: "rgba(10,10,15,0.55)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" };
const MDL = { background: "#fff", borderRadius: "var(--radius-lg)", padding: "32px", width: "500px", boxShadow: "var(--shadow-lg)", maxHeight: "90vh", overflowY: "auto" };
const LBL = { display: "block", fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gray)", marginBottom: "8px" };
