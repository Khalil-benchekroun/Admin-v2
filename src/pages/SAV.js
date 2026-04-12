import React, { useState } from "react";
import toast from "react-hot-toast";

export default function SAV() {
  return (
    <div className="page">
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
            SAV
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}
          >
            Page en cours de construction
          </p>
        </div>
      </div>
      <div className="card" style={{ textAlign: "center", padding: "60px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚧</div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "28px",
            fontWeight: "300",
            marginBottom: "8px",
          }}
        >
          En cours de développement
        </h3>
        <p style={{ color: "var(--gray)", fontSize: "14px" }}>
          Cette section sera disponible prochainement.
        </p>
      </div>
    </div>
  );
}
