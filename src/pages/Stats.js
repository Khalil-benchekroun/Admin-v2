import React from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const CA_BY_BOUTIQUE = [
  { name: "Sandro", ca: 28400 }, { name: "AMI Paris", ca: 19800 },
  { name: "I. Marant", ca: 15200 }, { name: "By Terry", ca: 9600 }, { name: "Rouje", ca: 2100 },
];

const MONTHLY_CLIENTS = [
  { mois: "Oct", clients: 180 }, { mois: "Nov", clients: 240 }, { mois: "Déc", clients: 380 },
  { mois: "Jan", clients: 290 }, { mois: "Fév", clients: 420 }, { mois: "Mar", clients: 510 },
];

const CATEGORIES_DATA = [
  { name: "Vêtements", value: 45 }, { name: "Chaussures", value: 22 },
  { name: "Accessoires", value: 18 }, { name: "Beauté", value: 10 }, { name: "Épicerie", value: 5 },
];

const COLORS = ["#C9A96E", "#0A0A0F", "#6B6878", "#2E8B57", "#185FA5"];

export default function Stats() {
  return (
    <div className="page">
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "36px" }}>Statistiques par boutique</h1>
        <p style={{ color: "var(--gray)", fontSize: "14px" }}>Analyse des performances globales de la plateforme</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div className="card">
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", marginBottom: "20px" }}>CA par boutique</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={CA_BY_BOUTIQUE}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6B6878" }} />
              <YAxis tick={{ fontSize: 12, fill: "#6B6878" }} />
              <Tooltip formatter={(v) => `${v.toLocaleString("fr-FR")} €`} />
              <Bar dataKey="ca" fill="var(--gold)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", marginBottom: "20px" }}>Répartition par catégorie</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={CATEGORIES_DATA} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                {CATEGORIES_DATA.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", marginBottom: "20px" }}>Évolution des clients actifs</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={MONTHLY_CLIENTS}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="mois" tick={{ fontSize: 12, fill: "#6B6878" }} />
            <YAxis tick={{ fontSize: 12, fill: "#6B6878" }} />
            <Tooltip />
            <Line type="monotone" dataKey="clients" stroke="var(--noir)" strokeWidth={2.5} dot={{ fill: "var(--noir)", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
