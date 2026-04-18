import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAuth } from "../context/AuthContext";

// ── Données ────────────────────────────────────────────────
const CA_DATA = [
  { j: "Lun", ca: 48000, comm: 9600 },
  { j: "Mar", ca: 62000, comm: 12400 },
  { j: "Mer", ca: 38000, comm: 7600 },
  { j: "Jeu", ca: 74000, comm: 14800 },
  { j: "Ven", ca: 91000, comm: 18200 },
  { j: "Sam", ca: 110000, comm: 22000 },
  { j: "Dim", ca: 83000, comm: 16600 },
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

// Alertes avec criticité et durée de blocage
const ALERTES_INIT = [
  {
    id: 1,
    type: "critique",
    text: "Commande #LV-00412 bloquée",
    detail: "Coursier introuvable depuis 47 min",
    link: "/litiges",
    minutesBloquée: 47,
    since: Date.now() - 47 * 60000,
    dismissable: false,
  },
  {
    id: 2,
    type: "critique",
    text: "Boutique Isabel Marant inactive",
    detail: "Aucune acceptation depuis 48h — 3 commandes annulées",
    link: "/boutiques",
    minutesBloquée: 2880,
    since: Date.now() - 2880 * 60000,
    dismissable: false,
  },
  {
    id: 3,
    type: "warning",
    text: "Litige escaladé — arbitrage requis",
    detail: "LIT-012 · Sophie M. vs Sandro Paris · 490€",
    link: "/litiges",
    minutesBloquée: null,
    since: Date.now() - 35 * 60000,
    dismissable: true,
  },
  {
    id: 4,
    type: "warning",
    text: "3 remboursements en attente",
    detail: "Total : 831€ à confirmer",
    link: "/remboursements",
    minutesBloquée: null,
    since: Date.now() - 120 * 60000,
    dismissable: true,
  },
  {
    id: 5,
    type: "info",
    text: "Nouveau ticket SAV haute priorité",
    detail: "TK-0041 · By Terry vs client",
    link: "/sav",
    minutesBloquée: null,
    since: Date.now() - 22 * 60000,
    dismissable: true,
  },
];

// Commandes live temps réel
const COMMANDES_LIVE_INIT = [
  {
    id: "LV-00415",
    client: "Amélie R.",
    boutique: "Sandro Paris",
    statut: "en_preparation",
    montant: 380,
    since: 8,
  },
  {
    id: "LV-00414",
    client: "Marc D.",
    boutique: "AMI Paris",
    statut: "en_route",
    montant: 245,
    since: 22,
  },
  {
    id: "LV-00413",
    client: "Julia P.",
    boutique: "By Terry",
    statut: "prete",
    montant: 98,
    since: 5,
  },
  {
    id: "LV-00412",
    client: "Sophie M.",
    boutique: "Sandro Paris",
    statut: "bloquée",
    montant: 490,
    since: 47,
  },
  {
    id: "LV-00411",
    client: "Karim T.",
    boutique: "AMI Paris",
    statut: "en_route",
    montant: 1079,
    since: 31,
  },
];

const STATUT_CMD = {
  nouvelle: {
    label: "Nouvelle",
    color: "#185fa5",
    bg: "#eff6ff",
    dot: "#3B82F6",
  },
  acceptée: {
    label: "Acceptée",
    color: "#6d28d9",
    bg: "#f5f3ff",
    dot: "#8B5CF6",
  },
  en_preparation: {
    label: "En préparation",
    color: "#b7770d",
    bg: "#faeeda",
    dot: "#F59E0B",
  },
  prete: { label: "Prête", color: "#2e8b57", bg: "#e8f5ee", dot: "#10B981" },
  en_route: {
    label: "En route",
    color: "#185fa5",
    bg: "#eff6ff",
    dot: "#3B82F6",
  },
  livrée: { label: "Livrée", color: "#2e8b57", bg: "#e8f5ee", dot: "#10B981" },
  bloquée: {
    label: "Bloquée ⚠",
    color: "#c0392b",
    bg: "#fef2f2",
    dot: "#EF4444",
  },
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
              width: 6,
              height: 6,
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

export default function Dashboard() {
  const { admin } = useAuth();
  const [tick, setTick] = useState(0);
  const [alertes, setAlertes] = useState(ALERTES_INIT);
  const [commandesLive, setCommandesLive] = useState(COMMANDES_LIVE_INIT);
  const [commandesCount, setCommandesCount] = useState(83);
  const [blink, setBlink] = useState(true);
  const intervalRef = useRef(null);

  // ── Ticker live : toutes les 30s ──
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTick((t) => t + 1);
      // Incrémente légèrement les commandes pour simuler le live
      setCommandesCount((c) => c + Math.floor(Math.random() * 2));
      // Met à jour le "since" des commandes bloquées
      setCommandesLive((prev) =>
        prev.map((c) =>
          c.statut === "bloquée" ? { ...c, since: c.since + 0.5 } : c
        )
      );
    }, 30000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // ── Clignotement alertes critiques ──
  useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 1000);
    return () => clearInterval(t);
  }, []);

  const dismissAlerte = (id) => {
    setAlertes((prev) => prev.filter((a) => a.id !== id));
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";
  const alertesCritiques = alertes.filter((a) => a.type === "critique");
  const alertesWarning = alertes.filter((a) => a.type === "warning");

  return (
    <div className="page">
      {/* ── Bandeau alertes critiques clignotant ── */}
      {alertesCritiques.length > 0 && (
        <div
          style={{
            background: blink ? "#c0392b" : "#a93226",
            color: "#fff",
            padding: "10px 20px",
            marginBottom: "24px",
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            transition: "background 0.5s",
            boxShadow: blink ? "0 0 20px rgba(192,57,43,0.4)" : "none",
          }}
        >
          <span
            style={{ fontSize: "18px", animation: blink ? "none" : "none" }}
          >
            🚨
          </span>
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: "700", fontSize: "13px" }}>
              {alertesCritiques.length} alerte
              {alertesCritiques.length > 1 ? "s" : ""} critique
              {alertesCritiques.length > 1 ? "s" : ""} — intervention immédiate
              requise
            </span>
            <span
              style={{ fontSize: "12px", opacity: 0.8, marginLeft: "12px" }}
            >
              {alertesCritiques.map((a) => a.text).join(" · ")}
            </span>
          </div>
          <Link
            to="/litiges"
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "#fff",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "700",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Voir les litiges →
          </Link>
        </div>
      )}

      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "32px",
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
            style={{
              color: "var(--gray)",
              fontSize: "14px",
              marginTop: "6px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            Vue d'ensemble LIVRR
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "11px",
                color: "#2e8b57",
                background: "#e8f5ee",
                padding: "2px 8px",
                borderRadius: "10px",
                fontWeight: "600",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#10B981",
                  animation: "livePulse 2s infinite",
                }}
              />
              Live
            </span>
          </p>
        </div>
        <Link
          to="/invitations"
          style={{
            background: "var(--noir)",
            color: "var(--gold)",
            padding: "10px 20px",
            borderRadius: "var(--radius-sm)",
            fontSize: "12px",
            fontWeight: "600",
            textDecoration: "none",
            letterSpacing: "0.05em",
          }}
        >
          + Inviter une boutique
        </Link>
      </div>

      {/* ── KPIs ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1px",
          background: "rgba(0,0,0,0.07)",
          marginBottom: "28px",
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
            value: commandesCount,
            suffix: "",
            sub: "mis à jour en temps réel",
            color: "var(--success)",
          },
          {
            label: "CA plateforme (mois)",
            value: 95400,
            suffix: " €",
            sub: "+34% vs mois préc.",
            color: "var(--success)",
          },
        ].map((k) => (
          <div
            key={k.label}
            style={{ background: "#fff", padding: "28px 28px 24px" }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--gray)",
                marginBottom: "12px",
              }}
            >
              {k.label}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "42px",
                fontWeight: "300",
                color: k.color,
                lineHeight: 1,
                marginBottom: "8px",
              }}
            >
              <AnimNum target={k.value} suffix={k.suffix} />
            </div>
            <div style={{ fontSize: "12px", color: "var(--gray-light)" }}>
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── Alertes + Commandes live ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        {/* Alertes */}
        <div
          style={{
            background: "#fff",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--white-3)",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--white-3)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--gray)",
              }}
            >
              Alertes système
            </div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: alertesCritiques.length > 0 ? "#c0392b" : "var(--gray)",
              }}
            >
              {alertes.length} active{alertes.length > 1 ? "s" : ""}
            </span>
          </div>
          <div style={{ padding: "8px 0" }}>
            {alertes.map((a) => (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  padding: "12px 16px",
                  borderLeft: `3px solid ${
                    a.type === "critique"
                      ? "#EF4444"
                      : a.type === "warning"
                      ? "#F59E0B"
                      : "#3B82F6"
                  }`,
                  background:
                    a.type === "critique"
                      ? blink
                        ? "rgba(239,68,68,0.05)"
                        : "rgba(239,68,68,0.02)"
                      : "transparent",
                  marginBottom: "2px",
                  transition: "background 0.5s",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "2px",
                    }}
                  >
                    {a.text}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                    {a.detail}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--gray-light)",
                      marginTop: "2px",
                    }}
                  >
                    Il y a {Math.round((Date.now() - a.since) / 60000)} min
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                  <Link
                    to={a.link}
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: a.type === "critique" ? "#c0392b" : "#185fa5",
                      textDecoration: "none",
                      padding: "3px 8px",
                      borderRadius: "10px",
                      background: a.type === "critique" ? "#fef2f2" : "#eff6ff",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Voir →
                  </Link>
                  {a.dismissable && (
                    <button
                      onClick={() => dismissAlerte(a.id)}
                      style={{
                        fontSize: "11px",
                        color: "var(--gray-light)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "3px",
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
            {alertes.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "24px",
                  color: "#2e8b57",
                  fontSize: "13px",
                }}
              >
                ✓ Aucune alerte — tout fonctionne normalement
              </div>
            )}
          </div>
        </div>

        {/* Commandes live */}
        <div
          style={{
            background: "#fff",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--white-3)",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--white-3)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--gray)",
              }}
            >
              Commandes en cours
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "11px",
                color: "#2e8b57",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#10B981",
                  display: "inline-block",
                  animation: "livePulse 2s infinite",
                }}
              />
              Temps réel
            </div>
          </div>
          <div>
            {commandesLive.map((c) => {
              const sc = STATUT_CMD[c.statut];
              const isBloquée = c.statut === "bloquée";
              return (
                <div
                  key={c.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "11px 16px",
                    borderBottom: "1px solid var(--white-3)",
                    background: isBloquée
                      ? blink
                        ? "rgba(239,68,68,0.04)"
                        : "transparent"
                      : "transparent",
                    transition: "background 0.5s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: sc.dot,
                        boxShadow: isBloquée ? `0 0 8px ${sc.dot}` : "none",
                        flexShrink: 0,
                        animation: isBloquée && blink ? "none" : "none",
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: isBloquée ? "#c0392b" : "var(--noir)",
                        }}
                      >
                        {c.id}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                        {c.client} · {c.boutique}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div style={{ textAlign: "right" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          background: sc.bg,
                          color: sc.color,
                        }}
                      >
                        {sc.label}
                      </span>
                      <div
                        style={{
                          fontSize: "10px",
                          color: isBloquée ? "#c0392b" : "var(--gray-light)",
                          marginTop: "2px",
                          fontWeight: isBloquée ? "700" : "400",
                        }}
                      >
                        {isBloquée
                          ? `⚠ Bloquée ${c.since} min`
                          : `Depuis ${c.since} min`}
                      </div>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: "600" }}>
                      {c.montant}€
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div
            style={{
              padding: "10px 16px",
              borderTop: "1px solid var(--white-3)",
              textAlign: "center",
            }}
          >
            <Link
              to="/commandes"
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--gold-dark)",
                textDecoration: "none",
              }}
            >
              Voir toutes les commandes →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Graphique CA + Top boutiques ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        {/* Graphique */}
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
              fontSize: "11px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--gray)",
              marginBottom: "4px",
            }}
          >
            Chiffre d'affaires
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "20px",
              fontWeight: "300",
              marginBottom: "20px",
            }}
          >
            CA brut & commissions — 7 jours
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={CA_DATA}
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
                dataKey="j"
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
                fill="url(#gCA)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="comm"
                name="Commissions"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#gComm)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top boutiques */}
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
              fontSize: "11px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--gray)",
              marginBottom: "4px",
            }}
          >
            Performance
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "20px",
              fontWeight: "300",
              marginBottom: "20px",
            }}
          >
            Top boutiques du mois
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr>
                {["#", "Boutique", "CA", "Cmd.", "Note", "Statut"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 10px",
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
              {TOP_BOUTIQUES.map((b, i) => (
                <tr
                  key={b.name}
                  style={{ borderBottom: "1px solid var(--white-3)" }}
                >
                  <td
                    style={{
                      padding: "12px 10px",
                      fontFamily: "var(--font-display)",
                      fontSize: "18px",
                      fontWeight: "300",
                      color: i === 0 ? "var(--gold)" : "var(--gray-light)",
                    }}
                  >
                    {i + 1}
                  </td>
                  <td style={{ padding: "12px 10px", fontWeight: "500" }}>
                    {b.name}
                  </td>
                  <td style={{ padding: "12px 10px", fontWeight: "600" }}>
                    {b.ca}
                  </td>
                  <td style={{ padding: "12px 10px", color: "var(--gray)" }}>
                    {b.orders}
                  </td>
                  <td
                    style={{
                      padding: "12px 10px",
                      color: "#b7770d",
                      fontWeight: "600",
                    }}
                  >
                    ★ {b.note}
                  </td>
                  <td style={{ padding: "12px 10px" }}>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        background:
                          b.status === "active" ? "#e8f5ee" : "#fef2f2",
                        color: b.status === "active" ? "#2e8b57" : "#c0392b",
                      }}
                    >
                      {b.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Accès rapides ── */}
      <div
        style={{
          background: "#fff",
          borderRadius: "var(--radius-lg)",
          padding: "20px 24px",
          boxShadow: "var(--shadow-sm)",
          border: "1px solid var(--white-3)",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--gray)",
            marginBottom: "16px",
          }}
        >
          Accès rapides
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {[
            {
              label: "⚖️ Litiges",
              link: "/litiges",
              badge: 2,
              badgeColor: "#c0392b",
            },
            {
              label: "💸 Remboursements",
              link: "/remboursements",
              badge: 3,
              badgeColor: "#b7770d",
            },
            { label: "🎫 SAV", link: "/sav", badge: 3, badgeColor: "#c0392b" },
            { label: "🏪 Boutiques", link: "/boutiques", badge: null },
            { label: "📦 Retours", link: "/retours", badge: null },
            { label: "📊 Statistiques", link: "/statistiques", badge: null },
            { label: "🛵 Livraisons", link: "/livraisons", badge: null },
            { label: "📋 Abonnements", link: "/abonnements", badge: null },
          ].map((a) => (
            <Link
              key={a.link}
              to={a.link}
              style={{
                position: "relative",
                padding: "9px 16px",
                borderRadius: "var(--radius-sm)",
                fontSize: "12px",
                fontWeight: "600",
                background: "var(--gray-bg)",
                color: "var(--noir)",
                textDecoration: "none",
                border: "1px solid var(--white-3)",
                transition: "all 0.15s",
              }}
            >
              {a.label}
              {a.badge && (
                <span
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: a.badgeColor,
                    color: "#fff",
                    fontSize: "9px",
                    fontWeight: "800",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {a.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}
