import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
} from "recharts";
import { useAuth } from "../context/AuthContext";

const CA_DATA = [
  { j: "Lun", ca: 48000, comm: 9600 },
  { j: "Mar", ca: 62000, comm: 12400 },
  { j: "Mer", ca: 38000, comm: 7600 },
  { j: "Jeu", ca: 74000, comm: 14800 },
  { j: "Ven", ca: 91000, comm: 18200 },
  { j: "Sam", ca: 110000, comm: 22000 },
  { j: "Dim", ca: 83000, comm: 16600 },
];

const ALERTES = [
  {
    type: "error",
    icon: "🔴",
    text: "Boutique Isabel Marant — inactive depuis 48h",
    link: "/boutiques",
  },
  {
    type: "warning",
    icon: "🟡",
    text: "Commande #LV-00412 bloquée depuis 2h — intervention requise",
    link: "/commandes",
  },
  {
    type: "warning",
    icon: "🟡",
    text: "3 demandes d'abonnement en attente de validation",
    link: "/abonnements",
  },
  {
    type: "info",
    icon: "🔵",
    text: "Nouveau ticket SAV priorité haute — By Terry vs client",
    link: "/sav",
  },
];

const TOP_BOUTIQUES = [
  {
    name: "Sandro Paris",
    ca: "28 400 €",
    orders: 142,
    note: 4.9,
    status: "active",
  },
  {
    name: "AMI Paris",
    ca: "19 800 €",
    orders: 98,
    note: 4.7,
    status: "active",
  },
  {
    name: "Isabel Marant",
    ca: "15 200 €",
    orders: 76,
    note: 4.8,
    status: "inactive",
  },
  { name: "By Terry", ca: "9 600 €", orders: 54, note: 4.6, status: "active" },
];

const RECENT_ORDERS = [
  {
    ref: "#LV-00412",
    client: "Sophie M.",
    boutique: "Sandro Paris",
    total: 490,
    status: "bloquée",
  },
  {
    ref: "#LV-00411",
    client: "Karim T.",
    boutique: "AMI Paris",
    total: 1079,
    status: "livrée",
  },
  {
    ref: "#LV-00410",
    client: "Yasmine B.",
    boutique: "Isabel Marant",
    total: 450,
    status: "livrée",
  },
  {
    ref: "#LV-00409",
    client: "Lucas D.",
    boutique: "By Terry",
    total: 280,
    status: "retour",
  },
];

const STATUS_CFG = {
  livrée: { cls: "badge-success", dot: "#10B981" },
  bloquée: { cls: "badge-error", dot: "#EF4444" },
  retour: { cls: "badge-warning", dot: "#F59E0B" },
  "en cours": { cls: "badge-info", dot: "#3B82F6" },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "10px",
        padding: "10px 14px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        fontFamily: "var(--font-body)",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          fontWeight: "700",
          color: "var(--gray)",
          marginBottom: "6px",
        }}
      >
        {label}
      </div>
      {payload.map((p, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: p.color,
            }}
          />
          <span>
            {p.name} : <strong>{p.value.toLocaleString("fr-FR")} €</strong>
          </span>
        </div>
      ))}
    </div>
  );
};

function AnimNum({ target, suffix = "", duration = 1000 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const steps = 40,
      interval = duration / steps;
    let step = 0;
    const t = setInterval(() => {
      step++;
      const eased = 1 - Math.pow(1 - step / steps, 3);
      setV(
        Number.isInteger(target)
          ? Math.floor(target * eased)
          : (target * eased).toFixed(1)
      );
      if (step >= steps) clearInterval(t);
    }, interval);
    return () => clearInterval(t);
  }, [target]);
  return (
    <span>
      {typeof v === "number" ? v.toLocaleString("fr-FR") : v}
      {suffix}
    </span>
  );
}

export default function Dashboard() {
  const { admin } = useAuth();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <div className="page">
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "40px",
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
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "44px",
              fontWeight: "300",
              lineHeight: 1.1,
            }}
          >
            {greeting}, {admin?.name?.split(" ")[0] || "Admin"}.
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}
          >
            Vue d'ensemble de la plateforme LIVRR
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            to="/invitations"
            className="btn-gold"
            style={{ fontSize: "12px" }}
          >
            + Inviter une boutique
          </Link>
        </div>
      </div>

      {/* KPI CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "1px",
          background: "rgba(0,0,0,0.07)",
          marginBottom: "32px",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        {[
          {
            label: "Boutiques actives",
            value: 12,
            suffix: "",
            sub: "+2 ce mois",
            color: "var(--gold)",
          },
          {
            label: "Clients inscrits",
            value: 2847,
            suffix: "",
            sub: "+143 cette semaine",
            color: "var(--info)",
          },
          {
            label: "Commandes aujourd'hui",
            value: 83,
            suffix: "",
            sub: "+12% vs hier",
            color: "var(--success)",
          },
          {
            label: "CA plateforme (mois)",
            value: 95400,
            suffix: " €",
            sub: "+34% vs mois préc.",
            color: "var(--success)",
          },
        ].map((s, i) => (
          <div
            key={s.label}
            style={{
              background: "#fff",
              padding: "28px 28px",
              animation: `fadeUp 0.5s ${i * 0.08}s ease both`,
              opacity: 0,
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#aaa",
                marginBottom: "14px",
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "40px",
                fontWeight: "300",
                color: s.color,
                lineHeight: 1,
                marginBottom: "8px",
              }}
            >
              {visible ? (
                <AnimNum target={s.value} suffix={s.suffix} />
              ) : (
                `0${s.suffix}`
              )}
            </div>
            <div
              style={{ fontSize: "12px", color: "#10B981", fontWeight: "600" }}
            >
              ↑ {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ALERTES SYSTÈME */}
      <div style={{ marginBottom: "28px" }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--gray)",
            marginBottom: "12px",
          }}
        >
          Alertes système
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {ALERTES.map((a, i) => (
            <Link
              key={i}
              to={a.link}
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                padding: "13px 18px",
                background: "#fff",
                borderRadius: "10px",
                border: `1px solid ${
                  a.type === "error"
                    ? "rgba(239,68,68,0.2)"
                    : a.type === "warning"
                    ? "rgba(245,158,11,0.2)"
                    : "rgba(59,130,246,0.15)"
                }`,
                borderLeft: `3px solid ${
                  a.type === "error"
                    ? "#EF4444"
                    : a.type === "warning"
                    ? "#F59E0B"
                    : "#3B82F6"
                }`,
                textDecoration: "none",
                color: "var(--noir)",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <span style={{ fontSize: "14px" }}>{a.icon}</span>
              <span style={{ fontSize: "13px", fontWeight: "500", flex: 1 }}>
                {a.text}
              </span>
              <span style={{ fontSize: "12px", color: "var(--gray)" }}>
                Traiter →
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* GRAPHIQUE CA */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "24px",
          marginBottom: "28px",
        }}
      >
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "22px",
                fontWeight: "400",
              }}
            >
              CA plateforme — 7 jours
            </h3>
            <div
              style={{
                display: "flex",
                gap: "14px",
                fontSize: "11px",
                fontWeight: "600",
              }}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "2px",
                    background: "#C9A96E",
                    display: "inline-block",
                  }}
                />
                CA brut
              </span>
              <span
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "2px",
                    background: "#0A0A0F",
                    display: "inline-block",
                  }}
                />
                Commission
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={CA_DATA}
              margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id="gradCA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#C9A96E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0,0,0,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="j"
                tick={{ fontSize: 11, fill: "#aaa" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#aaa" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k€`}
                width={45}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="ca"
                name="CA brut"
                stroke="#C9A96E"
                strokeWidth={2.5}
                fill="url(#gradCA)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="comm"
                name="Commission"
                stroke="#0A0A0F"
                strokeWidth={1.5}
                fill="none"
                dot={false}
                strokeDasharray="4 2"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* TOP BOUTIQUES */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              padding: "18px 20px",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                fontWeight: "400",
              }}
            >
              Top boutiques
            </h3>
          </div>
          {TOP_BOUTIQUES.map((b, i) => (
            <div
              key={b.name}
              style={{
                padding: "14px 20px",
                borderBottom:
                  i < TOP_BOUTIQUES.length - 1
                    ? "1px solid rgba(0,0,0,0.04)"
                    : "none",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "18px",
                  color: "#ddd",
                  width: "24px",
                  flexShrink: 0,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {b.name}
                </div>
                <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                  {b.orders} commandes · ⭐ {b.note}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "15px",
                  }}
                >
                  {b.ca}
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    padding: "2px 7px",
                    borderRadius: "20px",
                    background:
                      b.status === "active"
                        ? "var(--success-bg)"
                        : "var(--error-bg)",
                    color:
                      b.status === "active" ? "var(--success)" : "var(--error)",
                  }}
                >
                  {b.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COMMANDES RÉCENTES */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "20px",
              fontWeight: "400",
            }}
          >
            Commandes récentes
          </h3>
          <Link
            to="/commandes"
            style={{
              fontSize: "12px",
              color: "var(--gold)",
              fontWeight: "600",
            }}
          >
            Voir tout →
          </Link>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Client</th>
              <th>Boutique</th>
              <th>Total</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_ORDERS.map((o) => {
              const sc = STATUS_CFG[o.status] || STATUS_CFG["en cours"];
              return (
                <tr key={o.ref}>
                  <td
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "15px",
                      fontWeight: "600",
                    }}
                  >
                    {o.ref}
                  </td>
                  <td style={{ fontWeight: "500" }}>{o.client}</td>
                  <td style={{ color: "var(--gray)", fontSize: "13px" }}>
                    {o.boutique}
                  </td>
                  <td
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "15px",
                    }}
                  >
                    {o.total} €
                  </td>
                  <td>
                    <span className={`badge ${sc.cls}`}>{o.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
