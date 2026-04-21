import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ── Data ───────────────────────────────────────────────────
const DATA_CA_SEMAINE = [
  { j: "Lun 11", ca: 14200, commissions: 2300, commandes: 32 },
  { j: "Mar 12", ca: 18600, commissions: 3100, commandes: 44 },
  { j: "Mer 13", ca: 12400, commissions: 2000, commandes: 28 },
  { j: "Jeu 14", ca: 22800, commissions: 3700, commandes: 51 },
  { j: "Ven 15", ca: 28400, commissions: 4600, commandes: 63 },
  { j: "Sam 16", ca: 34200, commissions: 5600, commandes: 78 },
  { j: "Dim 17", ca: 26100, commissions: 4300, commandes: 59 },
];

const DATA_CA_MOIS = [
  { j: "Sem 1", ca: 84200, commissions: 13800, commandes: 198 },
  { j: "Sem 2", ca: 97400, commissions: 16000, commandes: 231 },
  { j: "Sem 3", ca: 91800, commissions: 15100, commandes: 217 },
  { j: "Sem 4", ca: 112000, commissions: 18400, commandes: 268 },
];

const DATA_CA_6MOIS = [
  { j: "Nov", ca: 41200, commissions: 6800, commandes: 412 },
  { j: "Déc", ca: 68400, commissions: 11200, commandes: 684 },
  { j: "Jan", ca: 84600, commissions: 13900, commandes: 820 },
  { j: "Fév", ca: 91200, commissions: 14800, commandes: 910 },
  { j: "Mar", ca: 103400, commissions: 16900, commandes: 1034 },
  { j: "Avr", ca: 119800, commissions: 19600, commandes: 1198 },
];

const DATA_COMMANDES_STATUTS = [
  { name: "Livrées", value: 847, color: "#10B981" },
  { name: "En cours", value: 124, color: "#3B82F6" },
  { name: "Retours", value: 89, color: "#F59E0B" },
  { name: "Annulées", value: 42, color: "#9CA3AF" },
  { name: "Bloquées", value: 18, color: "#EF4444" },
];

const DATA_TOP_BOUTIQUES = [
  {
    name: "Sandro Paris",
    ca: 28400,
    commandes: 142,
    note: 4.9,
    plan: "Prestige",
  },
  { name: "AMI Paris", ca: 19800, commandes: 98, note: 4.7, plan: "Signature" },
  {
    name: "Isabel Marant",
    ca: 15200,
    commandes: 76,
    note: 4.8,
    plan: "Signature",
  },
  { name: "By Terry", ca: 9600, commandes: 54, note: 4.6, plan: "Classic" },
  { name: "Rouje", ca: 0, commandes: 0, note: 0, plan: "Classic" },
];

const DATA_CLIENTS_ACTIFS = [
  { j: "Nov", clients: 48, nouveaux: 12 },
  { j: "Déc", clients: 74, nouveaux: 26 },
  { j: "Jan", clients: 112, nouveaux: 38 },
  { j: "Fév", clients: 148, nouveaux: 36 },
  { j: "Mar", clients: 189, nouveaux: 41 },
  { j: "Avr", clients: 234, nouveaux: 45 },
];

const DATA_FIDELITE = [
  { name: "Bronze", value: 142, color: "#92400e" },
  { name: "Silver", value: 67, color: "#6B7280" },
  { name: "Gold", value: 25, color: "#C9A96E" },
];

const DATA_PERF_LIVRAISON = [
  {
    coursier: "Karim M. (Coursier.fr)",
    livraisons: 89,
    tauxSucces: 97,
    delaiMoyen: "41 min",
    incidents: 2,
    note: 4.9,
  },
  {
    coursier: "Thomas R. (Top Chrono)",
    livraisons: 67,
    tauxSucces: 94,
    delaiMoyen: "48 min",
    incidents: 4,
    note: 4.7,
  },
  {
    coursier: "Yacine B. (Coursier.fr)",
    livraisons: 54,
    tauxSucces: 96,
    delaiMoyen: "44 min",
    incidents: 2,
    note: 4.8,
  },
  {
    coursier: "Mehdi S. (Top Chrono)",
    livraisons: 42,
    tauxSucces: 90,
    delaiMoyen: "52 min",
    incidents: 4,
    note: 4.5,
  },
  {
    coursier: "Lucas P. (Coursier.fr)",
    livraisons: 38,
    tauxSucces: 95,
    delaiMoyen: "43 min",
    incidents: 2,
    note: 4.7,
  },
];

const DATA_SECTEURS = [
  { name: "Mode", value: 52, color: "#C9A96E" },
  { name: "Beauté", value: 24, color: "#3B82F6" },
  { name: "Lifestyle", value: 14, color: "#10B981" },
  { name: "Épicerie fine", value: 10, color: "#8B5CF6" },
];

const DATA_DELAIS = [
  { tranche: "< 30 min", pct: 18 },
  { tranche: "30–45 min", pct: 34 },
  { tranche: "45–60 min", pct: 28 },
  { tranche: "1h–1h30", pct: 14 },
  { tranche: "> 1h30", pct: 6 },
];

// ── Tooltip custom ─────────────────────────────────────────
const Tip = ({ active, payload, label }) => {
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
        <div
          key={p.name}
          style={{ color: p.color || p.stroke, marginBottom: "2px" }}
        >
          {p.name} :{" "}
          <strong>
            {typeof p.value === "number" && p.value > 999
              ? p.value.toLocaleString("fr-FR") + "€"
              : p.value}
          </strong>
        </div>
      ))}
    </div>
  );
};

const TipPct = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--white-3)",
        borderRadius: "10px",
        padding: "10px 14px",
        boxShadow: "var(--shadow-md)",
        fontSize: "12px",
      }}
    >
      <div style={{ fontWeight: "700", color: "var(--noir)" }}>
        {payload[0]?.payload?.name}
      </div>
      <div style={{ color: payload[0]?.payload?.color }}>
        {payload[0]?.value}%
      </div>
    </div>
  );
};

// ── Composants utilitaires ─────────────────────────────────
function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          fontSize: "10px",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--gray)",
          marginBottom: "4px",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "18px",
          fontWeight: "300",
        }}
      >
        {sub}
      </div>
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "var(--radius-lg)",
        padding: "24px",
        boxShadow: "var(--shadow-sm)",
        border: "1px solid var(--white-3)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function KpiCard({ label, val, sub, color, delta }) {
  const isPos = delta > 0;
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "var(--radius-md)",
        padding: "20px 22px",
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
        {label}
      </div>
      <div
        style={{
          fontSize: "30px",
          fontFamily: "var(--font-display)",
          fontWeight: "300",
          color: color || "var(--noir)",
          lineHeight: 1,
          marginBottom: "6px",
        }}
      >
        {val}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {delta !== undefined && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: isPos ? "#2e8b57" : "#c0392b",
            }}
          >
            {isPos ? "▲" : "▼"} {Math.abs(delta)}%
          </span>
        )}
        {sub && (
          <span style={{ fontSize: "11px", color: "var(--gray-light)" }}>
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Composant principal ────────────────────────────────────
export default function Stats() {
  const [periode, setPeriode] = useState("semaine");
  const [sortBy, setSortBy] = useState("ca");
  const [sortDir, setSortDir] = useState("desc");

  const chartData =
    periode === "semaine"
      ? DATA_CA_SEMAINE
      : periode === "mois"
      ? DATA_CA_MOIS
      : DATA_CA_6MOIS;
  const xKey = "j";
  const totalCommandes = DATA_COMMANDES_STATUTS.reduce(
    (s, d) => s + d.value,
    0
  );

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  const boutiquesSorted = [...DATA_TOP_BOUTIQUES].sort((a, b) =>
    sortDir === "desc" ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy]
  );

  const exportStatsCSV = () => {
    const totalCA = DATA_TOP_BOUTIQUES.reduce((s, x) => s + x.ca, 0);
    const rows = [
      ["=== CLASSEMENT BOUTIQUES ==="],
      ["Rang", "Boutique", "Plan", "CA mois", "Commandes", "Note", "Part CA"],
      ...boutiquesSorted.map((b, i) => [
        i + 1,
        b.name,
        b.plan,
        b.ca + "€",
        b.commandes,
        b.note || "0",
        (totalCA > 0 ? Math.round((b.ca / totalCA) * 100) : 0) + "%",
      ]),
      [],
      ["=== CA & COMMISSIONS (6 mois) ==="],
      ["Mois", "CA brut", "Commissions", "Commandes"],
      ...DATA_CA_6MOIS.map((d) => [
        d.j,
        d.ca + "€",
        d.commissions + "€",
        d.commandes,
      ]),
      [],
      ["=== CLIENTS ACTIFS ==="],
      ["Mois", "Clients actifs", "Nouveaux"],
      ...DATA_CLIENTS_ACTIFS.map((d) => [d.j, d.clients, d.nouveaux]),
      [],
      ["=== REPARTITION COMMANDES ==="],
      ["Statut", "Nombre", "Pourcentage"],
      ...DATA_COMMANDES_STATUTS.map((d) => [
        d.name,
        d.value,
        Math.round((d.value / totalCommandes) * 100) + "%",
      ]),
    ];
    const csv = rows.map((r) => r.join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      "livrr-statistiques-" +
      new Date().toLocaleDateString("fr-FR").replace(/\//g, "-") +
      ".csv";
    a.click();
    toast.success("Export statistiques téléchargé");
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
            Statistiques
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}
          >
            Vue analytique de la plateforme LIVRR
          </p>
        </div>
        {/* Boutons header */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={exportStatsCSV}
            style={{
              padding: "10px 18px",
              borderRadius: "var(--radius-sm)",
              fontSize: "12px",
              fontWeight: "600",
              background: "var(--noir)",
              color: "var(--gold)",
              border: "none",
              cursor: "pointer",
            }}
          >
            ↓ Exporter CSV
          </button>
          {/* Toggle période global */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              background: "#fff",
              padding: "6px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--white-3)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {[
              { val: "semaine", label: "7 jours" },
              { val: "mois", label: "30 jours" },
              { val: "6mois", label: "6 mois" },
            ].map((p) => (
              <button
                key={p.val}
                onClick={() => setPeriode(p.val)}
                style={{
                  padding: "7px 16px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  background: periode === p.val ? "var(--noir)" : "transparent",
                  color: periode === p.val ? "var(--gold)" : "var(--gray)",
                  border: "none",
                  transition: "all 0.18s",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPIs principaux ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "14px",
          marginBottom: "24px",
        }}
      >
        <KpiCard
          label="CA brut"
          val="119 800€"
          sub="ce mois"
          color="var(--noir)"
          delta={16}
        />
        <KpiCard
          label="Commissions"
          val="19 600€"
          sub="ce mois"
          color="var(--gold-dark)"
          delta={16}
        />
        <KpiCard
          label="Commandes"
          val="1 198"
          sub="ce mois"
          color="#185fa5"
          delta={12}
        />
        <KpiCard
          label="Clients actifs"
          val="234"
          sub="ce mois"
          color="#2e8b57"
          delta={24}
        />
        <KpiCard
          label="Taux de livraison"
          val="76,2%"
          sub="livrées / total"
          color="#2e8b57"
          delta={3}
        />
      </div>

      {/* ── CA & Commandes ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* AreaChart CA */}
        <Card>
          <SectionHeader
            title="Chiffre d'affaires"
            sub="CA brut & commissions"
          />
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gCA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#C9A96E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gComm" x1="0" y1="0" x2="0" y2="1">
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
              <Tooltip content={<Tip />} />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Area
                type="monotone"
                dataKey="ca"
                name="CA brut"
                stroke="#C9A96E"
                strokeWidth={2}
                fill="url(#gCA)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="commissions"
                name="Commissions"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#gComm)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie commandes statuts */}
        <Card>
          <SectionHeader title="Commandes" sub="Répartition par statut" />
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={DATA_COMMANDES_STATUTS}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {DATA_COMMANDES_STATUTS.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val) => [
                  `${val} (${Math.round((val / totalCommandes) * 100)}%)`,
                  "",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              marginTop: "8px",
            }}
          >
            {DATA_COMMANDES_STATUTS.map((d) => (
              <div
                key={d.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "7px" }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: d.color,
                    }}
                  />
                  <span style={{ fontSize: "12px", color: "var(--gray)" }}>
                    {d.name}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600" }}>
                    {d.value}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--gray-light)",
                      width: "34px",
                      textAlign: "right",
                    }}
                  >
                    {Math.round((d.value / totalCommandes) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Volume commandes & Clients ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* BarChart volume commandes */}
        <Card>
          <SectionHeader title="Volume commandes" sub="Nombre de commandes" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
              barSize={16}
            >
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
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div
                      style={{
                        background: "#fff",
                        border: "1px solid var(--white-3)",
                        borderRadius: "10px",
                        padding: "10px 14px",
                        boxShadow: "var(--shadow-md)",
                        fontSize: "12px",
                      }}
                    >
                      <div style={{ fontWeight: "700", marginBottom: "4px" }}>
                        {label}
                      </div>
                      <div style={{ color: "#C9A96E" }}>
                        Commandes : <strong>{payload[0]?.value}</strong>
                      </div>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="commandes"
                name="Commandes"
                fill="#C9A96E"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* LineChart clients actifs */}
        <Card>
          <SectionHeader
            title="Clients"
            sub="Clients actifs & nouveaux inscrits"
          />
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={DATA_CLIENTS_ACTIFS}
              margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis
                dataKey="j"
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<Tip />} />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Line
                type="monotone"
                dataKey="clients"
                name="Clients actifs"
                stroke="#C9A96E"
                strokeWidth={2.5}
                dot={{ fill: "#C9A96E", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="nouveaux"
                name="Nouveaux inscrits"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── Secteurs, Fidélité, Délais ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* Secteurs */}
        <Card>
          <SectionHeader title="Répartition" sub="Par secteur d'activité" />
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={DATA_SECTEURS}
                cx="50%"
                cy="50%"
                outerRadius={60}
                paddingAngle={3}
                dataKey="value"
              >
                {DATA_SECTEURS.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              marginTop: "8px",
            }}
          >
            {DATA_SECTEURS.map((d) => (
              <div
                key={d.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "7px" }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "2px",
                      background: d.color,
                    }}
                  />
                  <span style={{ fontSize: "12px", color: "var(--gray)" }}>
                    {d.name}
                  </span>
                </div>
                <span style={{ fontSize: "12px", fontWeight: "600" }}>
                  {d.value}%
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Fidélité */}
        <Card>
          <SectionHeader
            title="Programme fidélité"
            sub="Répartition des niveaux"
          />
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={DATA_FIDELITE}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={4}
                dataKey="value"
              >
                {DATA_FIDELITE.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, n, { payload }) => [
                  `${v} clients`,
                  payload.name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "12px",
            }}
          >
            {DATA_FIDELITE.map((d) => (
              <div key={d.name} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "18px",
                    fontFamily: "var(--font-display)",
                    fontWeight: "300",
                    color: d.color,
                  }}
                >
                  {d.value}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "var(--gray)",
                    fontWeight: "600",
                  }}
                >
                  {d.name}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Délais livraison */}
        <Card>
          <SectionHeader
            title="Délais de livraison"
            sub="Distribution des créneaux"
          />
          <div style={{ marginTop: "8px" }}>
            {DATA_DELAIS.map((d) => (
              <div key={d.tranche} style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span style={{ fontSize: "12px", color: "var(--gray)" }}>
                    {d.tranche}
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: "600" }}>
                    {d.pct}%
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: "var(--white-3)",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${d.pct}%`,
                      background:
                        d.pct >= 30
                          ? "#C9A96E"
                          : d.pct >= 20
                          ? "#3B82F6"
                          : d.pct >= 10
                          ? "#10B981"
                          : "#9CA3AF",
                      borderRadius: "6px",
                      transition: "width 0.4s",
                    }}
                  />
                </div>
              </div>
            ))}
            <div
              style={{
                marginTop: "12px",
                paddingTop: "10px",
                borderTop: "1px solid var(--white-3)",
                fontSize: "12px",
                color: "var(--gray)",
              }}
            >
              Délai médian :{" "}
              <strong style={{ color: "var(--noir)" }}>44 min</strong>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Performance livraison ── */}
      <Card>
        <SectionHeader
          title="Livraison"
          sub="Performance coursiers — délais et taux de succès"
        />
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
                "Coursier",
                "Livraisons",
                "Taux succès",
                "Délai moyen",
                "Incidents",
                "Note",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "9px 14px",
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
            {DATA_PERF_LIVRAISON.map((c) => (
              <tr
                key={c.coursier}
                style={{ borderBottom: "1px solid var(--white-3)" }}
              >
                <td style={{ padding: "12px 14px", fontWeight: "500" }}>
                  {c.coursier}
                </td>
                <td style={{ padding: "12px 14px", color: "var(--gray)" }}>
                  {c.livraisons}
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: 6,
                        background: "var(--white-3)",
                        borderRadius: "6px",
                        overflow: "hidden",
                        minWidth: "60px",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${c.tauxSucces}%`,
                          background:
                            c.tauxSucces >= 95
                              ? "#10B981"
                              : c.tauxSucces >= 90
                              ? "#F59E0B"
                              : "#EF4444",
                          borderRadius: "6px",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        color:
                          c.tauxSucces >= 95
                            ? "#2e8b57"
                            : c.tauxSucces >= 90
                            ? "#b7770d"
                            : "#c0392b",
                      }}
                    >
                      {c.tauxSucces}%
                    </span>
                  </div>
                </td>
                <td style={{ padding: "12px 14px", fontWeight: "600" }}>
                  {c.delaiMoyen}
                </td>
                <td
                  style={{
                    padding: "12px 14px",
                    color: c.incidents > 3 ? "#c0392b" : "var(--gray)",
                    fontWeight: c.incidents > 3 ? "700" : "400",
                  }}
                >
                  {c.incidents}
                </td>
                <td
                  style={{
                    padding: "12px 14px",
                    color: "#b7770d",
                    fontWeight: "700",
                  }}
                >
                  ★ {c.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* ── Classement boutiques par performance ── */}
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "20px",
          }}
        >
          <SectionHeader
            title="Performance"
            sub="Classement boutiques — cliquez sur une colonne pour trier"
          />
          <div style={{ display: "flex", gap: "6px" }}>
            <span
              style={{
                fontSize: "11px",
                color: "var(--gray)",
                alignSelf: "center",
              }}
            >
              Trié par
            </span>
            {[
              { key: "ca", label: "CA" },
              { key: "commandes", label: "Commandes" },
              { key: "note", label: "Note" },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => toggleSort(s.key)}
                style={{
                  padding: "5px 12px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: "600",
                  cursor: "pointer",
                  border: `1.5px solid ${
                    sortBy === s.key ? "var(--gold)" : "var(--white-3)"
                  }`,
                  background:
                    sortBy === s.key ? "rgba(201,169,110,0.08)" : "transparent",
                  color: sortBy === s.key ? "var(--gold-dark)" : "var(--gray)",
                }}
              >
                {s.label}{" "}
                {sortBy === s.key ? (sortDir === "desc" ? "▼" : "▲") : ""}
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
                { label: "#", key: null },
                { label: "Boutique", key: null },
                { label: "Plan", key: null },
                { label: "CA mois", key: "ca" },
                { label: "Commandes", key: "commandes" },
                { label: "Note", key: "note" },
                { label: "Part du CA", key: "ca" },
                { label: "Score global", key: null },
              ].map((h) => (
                <th
                  key={h.label}
                  onClick={() => h.key && toggleSort(h.key)}
                  style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    fontSize: "10px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color:
                      h.key && sortBy === h.key
                        ? "var(--gold-dark)"
                        : "var(--gray)",
                    borderBottom: "1px solid var(--white-3)",
                    cursor: h.key ? "pointer" : "default",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h.label}{" "}
                  {h.key && sortBy === h.key
                    ? sortDir === "desc"
                      ? "▼"
                      : "▲"
                    : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {boutiquesSorted.map((b, i) => {
              const totalCA = DATA_TOP_BOUTIQUES.reduce((s, x) => s + x.ca, 0);
              const part = totalCA > 0 ? Math.round((b.ca / totalCA) * 100) : 0;
              const planColor = {
                Prestige: "#C9A96E",
                Signature: "#3B82F6",
                Classic: "#6B7280",
              }[b.plan];
              // Score global sur 100 : CA 50% + commandes 30% + note 20%
              const maxCA = Math.max(...DATA_TOP_BOUTIQUES.map((x) => x.ca));
              const maxCmd = Math.max(
                ...DATA_TOP_BOUTIQUES.map((x) => x.commandes)
              );
              const scoreCA = maxCA > 0 ? (b.ca / maxCA) * 50 : 0;
              const scoreCmd = maxCmd > 0 ? (b.commandes / maxCmd) * 30 : 0;
              const scoreNote = b.note > 0 ? ((b.note - 4) / 1) * 20 : 0;
              const score = Math.round(scoreCA + scoreCmd + scoreNote);
              const scoreColor =
                score >= 80 ? "#2e8b57" : score >= 50 ? "#b7770d" : "#c0392b";
              const rang =
                sortBy === "ca"
                  ? i + 1
                  : [...DATA_TOP_BOUTIQUES]
                      .sort((a, z) => z.ca - a.ca)
                      .findIndex((x) => x.name === b.name) + 1;
              return (
                <tr
                  key={b.name}
                  style={{
                    borderBottom: "1px solid var(--white-3)",
                    background:
                      i === 0 && sortDir === "desc"
                        ? "rgba(201,169,110,0.03)"
                        : "transparent",
                  }}
                >
                  <td
                    style={{
                      padding: "14px",
                      fontFamily: "var(--font-display)",
                      fontSize: "20px",
                      fontWeight: "300",
                      color: i === 0 ? "var(--gold)" : "var(--gray-light)",
                    }}
                  >
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                  </td>
                  <td style={{ padding: "14px", fontWeight: "500" }}>
                    {b.name}
                  </td>
                  <td style={{ padding: "14px" }}>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        background: `rgba(${
                          planColor === "#C9A96E"
                            ? "201,169,110"
                            : planColor === "#3B82F6"
                            ? "59,130,246"
                            : "107,114,128"
                        },0.1)`,
                        color: planColor,
                      }}
                    >
                      {b.plan}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "14px",
                      fontWeight: "700",
                      fontSize: "14px",
                    }}
                  >
                    {b.ca.toLocaleString("fr-FR")}€
                  </td>
                  <td
                    style={{
                      padding: "14px",
                      color: "var(--gray)",
                      fontWeight: "500",
                    }}
                  >
                    {b.commandes}
                  </td>
                  <td style={{ padding: "14px" }}>
                    {b.note > 0 ? (
                      <span style={{ color: "#b7770d", fontWeight: "700" }}>
                        ★ {b.note}
                      </span>
                    ) : (
                      <span style={{ color: "var(--gray-light)" }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: "14px" }}>
                    {b.ca > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            height: 6,
                            background: "var(--white-3)",
                            borderRadius: "6px",
                            overflow: "hidden",
                            minWidth: "60px",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${part}%`,
                              background: "var(--gold)",
                              borderRadius: "6px",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "600",
                            color: "var(--gray)",
                            minWidth: "28px",
                          }}
                        >
                          {part}%
                        </span>
                      </div>
                    ) : (
                      <span
                        style={{ color: "var(--gray-light)", fontSize: "12px" }}
                      >
                        —
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "14px" }}>
                    {b.ca > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: `${scoreColor}18`,
                            border: `2px solid ${scoreColor}40`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: "700",
                            color: scoreColor,
                          }}
                        >
                          {score}
                        </div>
                        <div
                          style={{
                            flex: 1,
                            height: 4,
                            background: "var(--white-3)",
                            borderRadius: "4px",
                            overflow: "hidden",
                            maxWidth: "60px",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${score}%`,
                              background: scoreColor,
                              borderRadius: "4px",
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span
                        style={{ color: "var(--gray-light)", fontSize: "12px" }}
                      >
                        N/A
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div
          style={{
            marginTop: "14px",
            paddingTop: "12px",
            borderTop: "1px solid var(--white-3)",
            fontSize: "11px",
            color: "var(--gray-light)",
          }}
        >
          Score global = CA (50%) + Volume commandes (30%) + Note clients (20%)
        </div>
      </Card>
    </div>
  );
}
