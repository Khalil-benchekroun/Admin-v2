import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0F",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-body)",
        padding: "40px",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "480px" }}>
        {/* Logo */}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            letterSpacing: "7px",
            color: "var(--gold)",
            marginBottom: "48px",
            opacity: 0.6,
          }}
        >
          LIVRR
        </div>

        {/* 404 */}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "120px",
            fontWeight: "300",
            color: "rgba(201,169,110,0.15)",
            lineHeight: 1,
            marginBottom: "8px",
            letterSpacing: "-4px",
          }}
        >
          404
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "36px",
            fontWeight: "300",
            color: "#fff",
            marginBottom: "16px",
            lineHeight: 1.2,
          }}
        >
          Page introuvable
        </h1>

        <p
          style={{
            fontSize: "15px",
            color: "rgba(255,255,255,0.35)",
            lineHeight: 1.8,
            marginBottom: "48px",
          }}
        >
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>

        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "14px 36px",
            borderRadius: "10px",
            background: "var(--gold)",
            color: "#0A0A0F",
            textDecoration: "none",
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "0.05em",
            transition: "all 0.2s",
          }}
        >
          Retour au dashboard →
        </Link>

        <div
          style={{
            marginTop: "24px",
            fontSize: "12px",
            color: "rgba(255,255,255,0.15)",
          }}
        >
          Espace Admin LIVRR
        </div>
      </div>
    </div>
  );
}
