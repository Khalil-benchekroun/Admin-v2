import React from "react";

export default function ModeDemo({ onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "linear-gradient(90deg, #C9A96E, #b7890d)",
        padding: "8px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "14px" }}>🎬</span>
        <span
          style={{
            fontSize: "12px",
            fontWeight: "700",
            color: "#0A0A0F",
            letterSpacing: "0.05em",
          }}
        >
          MODE DÉMO — Données fictives pour présentation
        </span>
        <span style={{ fontSize: "11px", color: "rgba(10,10,15,0.6)" }}>
          Toutes les données affichées sont simulées
        </span>
      </div>
      <button
        onClick={onClose}
        style={{
          background: "rgba(10,10,15,0.15)",
          border: "none",
          cursor: "pointer",
          padding: "4px 12px",
          borderRadius: "20px",
          fontSize: "11px",
          fontWeight: "700",
          color: "#0A0A0F",
        }}
      >
        Quitter le mode démo ✕
      </button>
    </div>
  );
}
