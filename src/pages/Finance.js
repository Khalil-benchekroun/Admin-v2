import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ── Mock Data ──────────────────────────────────────────────
const CA_MENSUEL = [
  { mois: "Nov", ca: 41200, commissions: 6800, remboursements: 1200 },
  { mois: "Déc", ca: 68400, commissions: 11200, remboursements: 2100 },
  { mois: "Jan", ca: 84600, commissions: 13900, remboursements: 1800 },
  { mois: "Fév", ca: 91200, commissions: 14800, remboursements: 2400 },
  { mois: "Mar", ca: 103400, commissions: 16900, remboursements: 3100 },
  { mois: "Avr", ca: 119800, commissions: 19600, remboursements: 2800 },
];

const CA_SEMAINE = [
  { j: "Lun 11", ca: 14200, commissions: 2300 },
  { j: "Mar 12", ca: 18600, commissions: 3100 },
  { j: "Mer 13", ca: 12400, commissions: 2000 },
  { j: "Jeu 14", ca: 22800, commissions: 3700 },
  { j: "Ven 15", ca: 28400, commissions: 4600 },
  { j: "Sam 16", ca: 34200, commissions: 5600 },
  { j: "Dim 17", ca: 26100, commissions: 4300 },
];

const VERSEMENTS_BOUTIQUES = [
  {
    id: "VRS-041",
    boutique: "Sandro Paris",
    avatar: "S",
    plan: "prestige",
    commission: "12%",
    caBrut: 28400,
    commissionMontant: 3408,
    montantDu: 24992,
    statut: "en_attente",
    dateEcheance: "30/04/2026",
    commandes: 142,
    periode: "Avril 2026",
  },
  {
    id: "VRS-040",
    boutique: "AMI Paris",
    avatar: "A",
    plan: "signature",
    commission: "15%",
    caBrut: 19800,
    commissionMontant: 2970,
    montantDu: 16830,
    statut: "en_attente",
    dateEcheance: "30/04/2026",
    commandes: 98,
    periode: "Avril 2026",
  },
  {
    id: "VRS-039",
    boutique: "By Terry",
    avatar: "B",
    plan: "classic",
    commission: "18%",
    caBrut: 9600,
    commissionMontant: 1728,
    montantDu: 7872,
    statut: "en_attente",
    dateEcheance: "30/04/2026",
    commandes: 54,
    periode: "Avril 2026",
  },
  {
    id: "VRS-038",
    boutique: "Sandro Paris",
    avatar: "S",
    plan: "prestige",
    commission: "12%",
    caBrut: 26100,
    commissionMontant: 3132,
    montantDu: 22968,
    statut: "versé",
    dateEcheance: "31/03/2026",
    commandes: 130,
    periode: "Mars 2026",
  },
  {
    id: "VRS-037",
    boutique: "AMI Paris",
    avatar: "A",
    plan: "signature",
    commission: "15%",
    caBrut: 17400,
    commissionMontant: 2610,
    montantDu: 14790,
    statut: "versé",
    dateEcheance: "31/03/2026",
    commandes: 87,
    periode: "Mars 2026",
  },
  {
    id: "VRS-036",
    boutique: "Isabel Marant",
    avatar: "I",
    plan: "signature",
    commission: "15%",
    caBrut: 15200,
    commissionMontant: 2280,
    montantDu: 12920,
    statut: "versé",
    dateEcheance: "31/03/2026",
    commandes: 76,
    periode: "Mars 2026",
  },
  {
    id: "VRS-035",
    boutique: "By Terry",
    avatar: "B",
    plan: "classic",
    commission: "18%",
    caBrut: 8800,
    commissionMontant: 1584,
    montantDu: 7216,
    statut: "versé",
    dateEcheance: "31/03/2026",
    commandes: 48,
    periode: "Mars 2026",
  },
];

const REMBOURSEMENTS = [
  {
    id: "REMB-042",
    client: "Sophie M.",
    boutique: "Sandro Paris",
    montant: 198,
    motif: "Retour validé",
    date: "15/04/2026",
    statut: "effectué",
  },
  {
    id: "REMB-041",
    client: "Nadia S.",
    boutique: "AMI Paris",
    montant: 290,
    motif: "Retour validé",
    date: "10/04/2026",
    statut: "effectué",
  },
  {
    id: "REMB-040",
    client: "Karim T.",
    boutique: "AMI Paris",
    montant: 89,
    motif: "Erreur de livraison",
    date: "15/04/2026",
    statut: "effectué",
  },
  {
    id: "REMB-039",
    client: "Yasmine B.",
    boutique: "Isabel Marant",
    montant: 450,
    motif: "Produit endommagé",
    date: "16/04/2026",
    statut: "en_cours",
  },
];

const PLAN_CFG = {
  classic: { label: "Classic", color: "#6B7280" },
  signature: { label: "Signature", color: "#3B82F6" },
  prestige: { label: "Prestige", color: "#C9A96E" },
};

const STATUT_VERSEMENT = {
  en_attente: {
    label: "En attente",
    color: "#b7770d",
    bg: "#faeeda",
    dot: "#F59E0B",
  },
  versé: { label: "Versé", color: "#2e8b57", bg: "#e8f5ee", dot: "#10B981" },
  litige: { label: "Litige", color: "#c0392b", bg: "#fef2f2", dot: "#EF4444" },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--white-3)",
        borderRadius: "10px",
        padding: "12px 16px",
        boxShadow: "var(--shadow-md)",
        fontSize: "12px",
      }}
    >
      <div
        style={{ fontWeight: "700", marginBottom: "6px", color: "var(--noir)" }}
      >
        {label}
      </div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color, marginBottom: "2px" }}>
          {p.name} : <strong>{p.value.toLocaleString("fr-FR")}€</strong>
        </div>
      ))}
    </div>
  );
};

export default function Finance() {
  const [versements, setVersements] = useState(VERSEMENTS_BOUTIQUES);
  const [periode, setPeriode] = useState("semaine");
  const [filterStatut, setFilterStatut] = useState("all");
  const [filterPeriodeVers, setFilterPeriodeVers] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showExport, setShowExport] = useState(false);
  const [showVersModal, setShowVersModal] = useState(false);
  const [versRef, setVersRef] = useState("");

  const vers = selected ? versements.find((v) => v.id === selected) : null;

  const chartData = periode === "semaine" ? CA_SEMAINE : CA_MENSUEL;
  const xKey = periode === "semaine" ? "j" : "mois";

  const totaux = {
    caBrut: versements.reduce((s, v) => s + v.caBrut, 0),
    commissions: versements.reduce((s, v) => s + v.commissionMontant, 0),
    duBoutiques: versements
      .filter((v) => v.statut === "en_attente")
      .reduce((s, v) => s + v.montantDu, 0),
    remboursements: REMBOURSEMENTS.reduce((s, r) => s + r.montant, 0),
  };

  const filtres = versements.filter((v) => {
    const matchStatut = filterStatut === "all" || v.statut === filterStatut;
    const matchPeriode =
      filterPeriodeVers === "all" || v.periode === filterPeriodeVers;
    return matchStatut && matchPeriode;
  });

  const periodes = [...new Set(versements.map((v) => v.periode))];

  const marquerVersé = () => {
    if (!versRef.trim()) {
      toast.error("Référence de virement obligatoire");
      return;
    }
    setVersements((prev) =>
      prev.map((v) => (v.id === selected ? { ...v, statut: "versé" } : v))
    );
    setShowVersModal(false);
    setVersRef("");
    toast.success(`Versement ${selected} marqué comme effectué`);
  };

  const exportCSV = () => {
    const rows = [
      [
        "ID",
        "Boutique",
        "Plan",
        "Commission",
        "CA Brut",
        "Commission (€)",
        "Montant dû",
        "Statut",
        "Période",
        "Échéance",
      ],
      ...filtres.map((v) => [
        v.id,
        v.boutique,
        v.plan,
        v.commission,
        v.caBrut,
        v.commissionMontant,
        v.montantDu,
        v.statut,
        v.periode,
        v.dateEcheance,
      ]),
    ];
    const csv = rows.map((r) => r.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `livrr-finance-export-${new Date()
      .toLocaleDateString("fr-FR")
      .replace(/\//g, "-")}.csv`;
    a.click();
    toast.success("Export CSV téléchargé");
  };

  return (
    <div className="page" style={{ padding: "44px 52px" }}>
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "36px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--gray)",
              marginBottom: "8px",
            }}
          >
            Administration
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "44px",
              fontWeight: "300",
              lineHeight: 1.1,
            }}
          >
            Finance
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}
          >
            Commissions, versements boutiques et exports comptables
          </p>
        </div>
        <button
          onClick={exportCSV}
          style={{
            padding: "10px 20px",
            borderRadius: "var(--radius-sm)",
            fontSize: "12px",
            fontWeight: "600",
            background: "var(--noir)",
            color: "var(--gold)",
            cursor: "pointer",
            border: "none",
            letterSpacing: "0.05em",
          }}
        >
          ↓ Exporter CSV
        </button>
      </div>

      {/* ── KPIs ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        {[
          {
            label: "CA brut plateforme",
            val: totaux.caBrut.toLocaleString("fr-FR") + "€",
            sub: "Tous versements confondus",
            color: "var(--noir)",
          },
          {
            label: "Commissions LIVRR",
            val: totaux.commissions.toLocaleString("fr-FR") + "€",
            sub: "Revenus nets plateforme",
            color: "var(--gold-dark)",
          },
          {
            label: "À verser boutiques",
            val: totaux.duBoutiques.toLocaleString("fr-FR") + "€",
            sub: "Versements en attente",
            color: "#185fa5",
          },
          {
            label: "Remboursements",
            val: totaux.remboursements.toLocaleString("fr-FR") + "€",
            sub: "Mois en cours",
            color: "#c0392b",
          },
        ].map((k) => (
          <div
            key={k.label}
            style={{
              background: "#fff",
              borderRadius: "var(--radius-md)",
              padding: "20px 24px",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--white-3)",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: "700",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--gray)",
                marginBottom: "8px",
              }}
            >
              {k.label}
            </div>
            <div
              style={{
                fontSize: "28px",
                fontFamily: "var(--font-display)",
                fontWeight: "300",
                color: k.color,
                lineHeight: 1,
                marginBottom: "4px",
              }}
            >
              {k.val}
            </div>
            <div style={{ fontSize: "11px", color: "var(--gray-light)" }}>
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── Graphiques ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "28px",
        }}
      >
        {/* CA & Commissions */}
        <div
          style={{
            background: "#fff",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--white-3)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--gray)",
                  marginBottom: "4px",
                }}
              >
                CA & Commissions
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "18px",
                  fontWeight: "300",
                }}
              >
                {periode === "semaine" ? "7 derniers jours" : "6 derniers mois"}
              </div>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              {["semaine", "mois"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriode(p)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "600",
                    border: `1.5px solid ${
                      periode === p ? "var(--gold)" : "var(--white-3)"
                    }`,
                    background:
                      periode === p ? "rgba(201,169,110,0.08)" : "transparent",
                    color: periode === p ? "var(--gold-dark)" : "var(--gray)",
                    cursor: "pointer",
                  }}
                >
                  {p === "semaine" ? "7 jours" : "6 mois"}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradCA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#C9A96E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradComm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Area
                type="monotone"
                dataKey="ca"
                name="CA brut"
                stroke="#C9A96E"
                strokeWidth={2}
                fill="url(#gradCA)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="commissions"
                name="Commissions"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#gradComm)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Remboursements */}
        <div
          style={{
            background: "#fff",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--white-3)",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--gray)",
                marginBottom: "4px",
              }}
            >
              Remboursements récents
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "18px",
                fontWeight: "300",
              }}
            >
              Mois en cours
            </div>
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "12px",
            }}
          >
            <thead>
              <tr>
                {["Réf.", "Client", "Boutique", "Montant", "Statut"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "6px 8px",
                        textAlign: "left",
                        fontSize: "10px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--gray)",
                        borderBottom: "2px solid var(--white-3)",
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {REMBOURSEMENTS.map((r) => (
                <tr
                  key={r.id}
                  style={{ borderBottom: "1px solid var(--white-3)" }}
                >
                  <td
                    style={{
                      padding: "10px 8px",
                      fontWeight: "600",
                      color: "var(--gold-dark)",
                      fontSize: "11px",
                    }}
                  >
                    {r.id}
                  </td>
                  <td style={{ padding: "10px 8px" }}>{r.client}</td>
                  <td style={{ padding: "10px 8px", color: "var(--gray)" }}>
                    {r.boutique}
                  </td>
                  <td style={{ padding: "10px 8px", fontWeight: "600" }}>
                    {r.montant}€
                  </td>
                  <td style={{ padding: "10px 8px" }}>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        background:
                          r.statut === "effectué" ? "#e8f5ee" : "#faeeda",
                        color: r.statut === "effectué" ? "#2e8b57" : "#b7770d",
                      }}
                    >
                      {r.statut === "effectué" ? "Effectué" : "En cours"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              marginTop: "16px",
              paddingTop: "12px",
              borderTop: "1px solid var(--white-3)",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                color: "var(--gray)",
                fontWeight: "600",
              }}
            >
              Total remboursé
            </span>
            <span
              style={{ fontSize: "14px", fontWeight: "600", color: "#c0392b" }}
            >
              {totaux.remboursements}€
            </span>
          </div>
        </div>
      </div>

      {/* ── Versements boutiques ── */}
      <div
        style={{
          background: "#fff",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-sm)",
          border: "1px solid var(--white-3)",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--white-3)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--gray)",
                marginBottom: "4px",
              }}
            >
              Versements boutiques
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                fontWeight: "300",
              }}
            >
              Commissions & montants dus
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <select
              value={filterPeriodeVers}
              onChange={(e) => setFilterPeriodeVers(e.target.value)}
              style={{
                padding: "7px 12px",
                border: "1.5px solid var(--white-3)",
                borderRadius: "var(--radius-sm)",
                fontSize: "12px",
                outline: "none",
                background: "var(--gray-bg)",
                color: "var(--noir)",
                cursor: "pointer",
              }}
            >
              <option value="all">Toutes les périodes</option>
              {periodes.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {["all", "en_attente", "versé"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatut(s)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: "600",
                  border: `1.5px solid ${
                    filterStatut === s
                      ? s === "en_attente"
                        ? "#b7770d"
                        : s === "versé"
                        ? "#2e8b57"
                        : "var(--gold)"
                      : "var(--white-3)"
                  }`,
                  background:
                    filterStatut === s
                      ? s === "en_attente"
                        ? "#faeeda"
                        : s === "versé"
                        ? "#e8f5ee"
                        : "rgba(201,169,110,0.08)"
                      : "transparent",
                  color:
                    filterStatut === s
                      ? s === "en_attente"
                        ? "#b7770d"
                        : s === "versé"
                        ? "#2e8b57"
                        : "var(--gold-dark)"
                      : "var(--gray)",
                  cursor: "pointer",
                }}
              >
                {s === "all" ? "Tous" : STATUT_VERSEMENT[s].label}
              </button>
            ))}
          </div>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
          }}
        >
          <thead>
            <tr style={{ background: "var(--gray-bg)" }}>
              {[
                "Référence",
                "Boutique",
                "Période",
                "CA brut",
                "Commission",
                "Montant dû",
                "Échéance",
                "Statut",
                "",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: "10px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--gray)",
                    borderBottom: "1px solid var(--white-3)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtres.map((v) => {
              const statut = STATUT_VERSEMENT[v.statut];
              const plan = PLAN_CFG[v.plan];
              const isSelected = selected === v.id;
              return (
                <tr
                  key={v.id}
                  onClick={() => setSelected(isSelected ? null : v.id)}
                  style={{
                    borderBottom: "1px solid var(--white-3)",
                    cursor: "pointer",
                    background: isSelected
                      ? "rgba(201,169,110,0.04)"
                      : "transparent",
                    transition: "background 0.15s",
                  }}
                >
                  <td
                    style={{
                      padding: "14px 16px",
                      fontWeight: "600",
                      color: "var(--gold-dark)",
                      fontSize: "12px",
                    }}
                  >
                    {v.id}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: `rgba(${
                            plan.color === "#6B7280"
                              ? "107,114,128"
                              : plan.color === "#3B82F6"
                              ? "59,130,246"
                              : "201,169,110"
                          },0.1)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: "700",
                          color: plan.color,
                          flexShrink: 0,
                        }}
                      >
                        {v.avatar}
                      </div>
                      <div>
                        <div style={{ fontWeight: "500" }}>{v.boutique}</div>
                        <span
                          style={{
                            fontSize: "10px",
                            color: plan.color,
                            fontWeight: "600",
                          }}
                        >
                          {plan.label}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "var(--gray)",
                      fontSize: "12px",
                    }}
                  >
                    {v.periode}
                  </td>
                  <td style={{ padding: "14px 16px", fontWeight: "500" }}>
                    {v.caBrut.toLocaleString("fr-FR")}€
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ color: "#c0392b", fontWeight: "600" }}>
                      −{v.commissionMontant.toLocaleString("fr-FR")}€
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        color: "var(--gray)",
                        marginLeft: "4px",
                      }}
                    >
                      ({v.commission})
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontWeight: "700",
                      fontSize: "14px",
                    }}
                  >
                    {v.montantDu.toLocaleString("fr-FR")}€
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontSize: "12px",
                      color: "var(--gray)",
                    }}
                  >
                    {v.dateEcheance}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        background: statut.bg,
                        color: statut.color,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: statut.dot,
                        }}
                      />
                      {statut.label}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {v.statut === "en_attente" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(v.id);
                          setShowVersModal(true);
                        }}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "11px",
                          fontWeight: "600",
                          background: "#e8f5ee",
                          color: "#2e8b57",
                          border: "1px solid #bbf7d0",
                          cursor: "pointer",
                        }}
                      >
                        Marquer versé
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totaux */}
        {filtres.length > 0 && (
          <div
            style={{
              padding: "16px 24px",
              borderTop: "2px solid var(--white-3)",
              background: "var(--gray-bg)",
              display: "flex",
              justifyContent: "flex-end",
              gap: "32px",
            }}
          >
            {[
              {
                label: "CA brut total",
                val:
                  filtres
                    .reduce((s, v) => s + v.caBrut, 0)
                    .toLocaleString("fr-FR") + "€",
              },
              {
                label: "Commissions totales",
                val:
                  filtres
                    .reduce((s, v) => s + v.commissionMontant, 0)
                    .toLocaleString("fr-FR") + "€",
                color: "#c0392b",
              },
              {
                label: "À verser (en attente)",
                val:
                  filtres
                    .filter((v) => v.statut === "en_attente")
                    .reduce((s, v) => s + v.montantDu, 0)
                    .toLocaleString("fr-FR") + "€",
                color: "#185fa5",
              },
            ].map((t) => (
              <div key={t.label} style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--gray)",
                    marginBottom: "3px",
                  }}
                >
                  {t.label}
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: t.color || "var(--noir)",
                  }}
                >
                  {t.val}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal : Marquer versé ── */}
      {showVersModal && vers && (
        <div style={overlayStyle} onClick={() => setShowVersModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: "300",
                marginBottom: "6px",
              }}
            >
              Confirmer le versement
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "24px",
              }}
            >
              {vers.boutique} · {vers.periode} ·{" "}
              <strong>{vers.montantDu.toLocaleString("fr-FR")}€</strong>
            </p>

            <div
              style={{
                background: "var(--gray-bg)",
                borderRadius: "var(--radius-md)",
                padding: "16px 18px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  fontSize: "13px",
                }}
              >
                <div>
                  <span style={{ color: "var(--gray)" }}>CA brut : </span>
                  <strong>{vers.caBrut.toLocaleString("fr-FR")}€</strong>
                </div>
                <div>
                  <span style={{ color: "var(--gray)" }}>Commission : </span>
                  <strong style={{ color: "#c0392b" }}>
                    −{vers.commissionMontant.toLocaleString("fr-FR")}€ (
                    {vers.commission})
                  </strong>
                </div>
                <div>
                  <span style={{ color: "var(--gray)" }}>Plan : </span>
                  <strong>{PLAN_CFG[vers.plan].label}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--gray)" }}>Commandes : </span>
                  <strong>{vers.commandes}</strong>
                </div>
              </div>
              <div
                style={{
                  borderTop: "1px solid var(--white-3)",
                  marginTop: "12px",
                  paddingTop: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "13px", fontWeight: "700" }}>
                  Montant à verser
                </span>
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#2e8b57",
                  }}
                >
                  {vers.montantDu.toLocaleString("fr-FR")}€
                </span>
              </div>
            </div>

            <label style={labelStyle}>Référence de virement *</label>
            <input
              type="text"
              value={versRef}
              onChange={(e) => setVersRef(e.target.value)}
              placeholder="Ex. : VIR-2026-04-SANDRO-001"
              autoFocus
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1.5px solid var(--white-3)",
                borderRadius: "var(--radius-sm)",
                fontSize: "13px",
                outline: "none",
                marginBottom: "20px",
              }}
            />

            <div
              style={{
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: "var(--radius-sm)",
                padding: "10px 14px",
                fontSize: "12px",
                color: "#b7770d",
                marginBottom: "20px",
              }}
            >
              ⚠ Cette action est irréversible. Assurez-vous que le virement a
              bien été émis avant de confirmer.
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowVersModal(false)}
                style={btnStyle("ghost")}
              >
                Annuler
              </button>
              <button onClick={marquerVersé} style={btnStyle("success")}>
                Confirmer le versement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────
function btnStyle(type) {
  const styles = {
    gold: { background: "var(--noir)", color: "var(--gold)", border: "none" },
    ghost: {
      background: "transparent",
      color: "var(--gray)",
      border: "1.5px solid var(--white-3)",
    },
    success: {
      background: "#e8f5ee",
      color: "#2e8b57",
      border: "1.5px solid #bbf7d0",
    },
    error: {
      background: "#fef2f2",
      color: "var(--error)",
      border: "1.5px solid #fecaca",
    },
  };
  return {
    padding: "10px 18px",
    borderRadius: "var(--radius-sm)",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    ...styles[type],
  };
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(10,10,15,0.55)",
  zIndex: 200,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const modalStyle = {
  background: "#fff",
  borderRadius: "var(--radius-lg)",
  padding: "32px",
  width: "500px",
  boxShadow: "var(--shadow-lg)",
  maxHeight: "90vh",
  overflowY: "auto",
};
const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--gray)",
  marginBottom: "8px",
};
