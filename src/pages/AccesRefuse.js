import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AccesRefuse({ role }) {
  const location = useLocation();

  const roleLabel =
    {
      superadmin: "Super Admin",
      admin: "Admin Plateforme",
      sav: "SAV / Support",
      ops: "Ops / Modération",
    }[role] || role;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--gray-bg)",
        fontFamily: "var(--font-body)",
        padding: "40px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "480px",
          background: "#fff",
          borderRadius: "var(--radius-lg)",
          padding: "52px 40px",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--white-3)",
        }}
      >
        {/* Icône */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#fef2f2",
            border: "2px solid #fecaca",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            margin: "0 auto 24px",
          }}
        >
          🔒
        </div>

        {/* Titre */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "32px",
            fontWeight: "300",
            marginBottom: "12px",
            color: "var(--noir)",
            lineHeight: 1.2,
          }}
        >
          Accès non autorisé
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: "14px",
            color: "var(--gray)",
            lineHeight: 1.7,
            marginBottom: "20px",
          }}
        >
          Votre rôle{" "}
          <strong style={{ color: "var(--noir)" }}>{roleLabel}</strong> ne vous
          donne pas accès à cette section.
        </p>

        {/* Rôle badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            background: "var(--gray-bg)",
            border: "1px solid var(--white-3)",
            borderRadius: "20px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background:
                role === "sav"
                  ? "#3B82F6"
                  : role === "admin"
                  ? "#8B5CF6"
                  : "#10B981",
            }}
          />
          <span
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "var(--gray)",
            }}
          >
            Connecté en tant que {roleLabel}
          </span>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <p
            style={{
              fontSize: "12px",
              color: "var(--gray-light)",
              marginBottom: "20px",
            }}
          >
            Si vous pensez que c'est une erreur, contactez l'Admin Plateforme.
          </p>
        </div>

        {/* Bouton retour */}
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "12px 28px",
            borderRadius: "var(--radius-sm)",
            background: "var(--noir)",
            color: "var(--gold)",
            textDecoration: "none",
            fontSize: "13px",
            fontWeight: "600",
            letterSpacing: "0.04em",
          }}
        >
          ← Retour au dashboard
        </Link>
      </div>
    </div>
  );
}
