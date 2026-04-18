import React, { useState } from "react";
import toast from "react-hot-toast";

const BOUTIQUES = ["Sandro Paris", "AMI Paris", "Isabel Marant", "By Terry"];

const REPORTS_DATA = [
  {
    id: "RPT-004",
    boutique: "Sandro Paris",
    periode: "Mars 2026",
    statut: "envoyé",
    dateEnvoi: "02/04/2026",
    caTotal: 26100,
    commandes: 130,
    tauxLivraison: "96%",
    noteMoyenne: 4.9,
    topProduit: "Trench Camel",
    delaiMoyen: "41 min",
  },
  {
    id: "RPT-003",
    boutique: "AMI Paris",
    periode: "Mars 2026",
    statut: "envoyé",
    dateEnvoi: "02/04/2026",
    caTotal: 17400,
    commandes: 87,
    tauxLivraison: "94%",
    noteMoyenne: 4.7,
    topProduit: "Pull Alexandre",
    delaiMoyen: "48 min",
  },
  {
    id: "RPT-002",
    boutique: "By Terry",
    periode: "Mars 2026",
    statut: "envoyé",
    dateEnvoi: "02/04/2026",
    caTotal: 8800,
    commandes: 48,
    tauxLivraison: "92%",
    noteMoyenne: 4.6,
    topProduit: "Rouge Terrybly",
    delaiMoyen: "52 min",
  },
  {
    id: "RPT-001",
    boutique: "Isabel Marant",
    periode: "Mars 2026",
    statut: "brouillon",
    dateEnvoi: null,
    caTotal: 15200,
    commandes: 76,
    tauxLivraison: "89%",
    noteMoyenne: 4.8,
    topProduit: "Robe Milena",
    delaiMoyen: "45 min",
  },
];

export default function Reporting() {
  const [reports, setReports] = useState(REPORTS_DATA);
  const [selected, setSelected] = useState("RPT-004");
  const [showGenModal, setShowGenModal] = useState(false);
  const [genForm, setGenForm] = useState({
    boutique: "Sandro Paris",
    periode: "Avril 2026",
    includeCA: true,
    includeCommandes: true,
    includeLivraison: true,
    includeAvis: true,
    includeTop: true,
  });

  const rep = reports.find((r) => r.id === selected);

  const envoyer = (id) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              statut: "envoyé",
              dateEnvoi: new Date().toLocaleDateString("fr-FR"),
            }
          : r
      )
    );
    toast.success(
      `Rapport envoyé à ${reports.find((r) => r.id === id)?.boutique}`
    );
  };

  const generer = () => {
    const newRep = {
      id: `RPT-${String(reports.length + 1).padStart(3, "0")}`,
      boutique: genForm.boutique,
      periode: genForm.periode,
      statut: "brouillon",
      dateEnvoi: null,
      caTotal: Math.floor(Math.random() * 20000) + 8000,
      commandes: Math.floor(Math.random() * 100) + 40,
      tauxLivraison: `${Math.floor(Math.random() * 8) + 90}%`,
      noteMoyenne: (Math.random() * 0.5 + 4.5).toFixed(1),
      topProduit: "—",
      delaiMoyen: `${Math.floor(Math.random() * 20) + 38} min`,
    };
    setReports((prev) => [newRep, ...prev]);
    setSelected(newRep.id);
    setShowGenModal(false);
    toast.success("Rapport généré — vérifiez avant envoi");
  };

  return (
    <div className="page" style={{ padding: "44px 52px" }}>
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
            Reporting boutiques
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}
          >
            Rapports de performance mensuels envoyés aux partenaires
          </p>
        </div>
        <button
          onClick={() => setShowGenModal(true)}
          style={{
            padding: "10px 20px",
            borderRadius: "var(--radius-sm)",
            fontSize: "12px",
            fontWeight: "600",
            background: "var(--noir)",
            color: "var(--gold)",
            border: "none",
            cursor: "pointer",
          }}
        >
          + Générer un rapport
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: "20px",
        }}
      >
        {/* Liste */}
        <div
          style={{
            background: "#fff",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--white-3)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 14px",
              borderBottom: "1px solid var(--white-3)",
              fontSize: "10px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--gray)",
            }}
          >
            Rapports générés
          </div>
          {reports.map((r) => {
            const isActive = selected === r.id;
            return (
              <div
                key={r.id}
                onClick={() => setSelected(r.id)}
                style={{
                  padding: "13px 16px",
                  borderBottom: "1px solid var(--white-3)",
                  cursor: "pointer",
                  background: isActive
                    ? "rgba(201,169,110,0.06)"
                    : "transparent",
                  borderLeft: isActive
                    ? "3px solid var(--gold)"
                    : "3px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "3px",
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: "500" }}>
                    {r.boutique}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "600",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      background: r.statut === "envoyé" ? "#e8f5ee" : "#faeeda",
                      color: r.statut === "envoyé" ? "#2e8b57" : "#b7770d",
                    }}
                  >
                    {r.statut === "envoyé" ? "Envoyé ✓" : "Brouillon"}
                  </span>
                </div>
                <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                  {r.periode} ·{" "}
                  {r.dateEnvoi ? `Envoyé le ${r.dateEnvoi}` : "Non envoyé"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Aperçu rapport */}
        {rep && (
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--white-3)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "20px 28px",
                borderBottom: "1px solid var(--white-3)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "26px",
                    fontWeight: "300",
                    marginBottom: "4px",
                  }}
                >
                  {rep.boutique}
                </div>
                <div style={{ fontSize: "13px", color: "var(--gray)" }}>
                  Rapport de performance · {rep.periode}
                </div>
              </div>
              {rep.statut === "brouillon" && (
                <button
                  onClick={() => envoyer(rep.id)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "12px",
                    fontWeight: "600",
                    background: "var(--noir)",
                    color: "var(--gold)",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ✉ Envoyer à la boutique
                </button>
              )}
              {rep.statut === "envoyé" && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "#2e8b57",
                    fontWeight: "600",
                  }}
                >
                  ✓ Envoyé le {rep.dateEnvoi}
                </span>
              )}
            </div>

            {/* Aperçu du rapport tel que reçu par la boutique */}
            <div style={{ flex: 1, overflowY: "auto", padding: "28px" }}>
              <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                {/* En-tête rapport */}
                <div
                  style={{
                    background: "var(--noir)",
                    borderRadius: "var(--radius-md)",
                    padding: "24px 28px",
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "22px",
                        letterSpacing: "6px",
                        color: "var(--gold)",
                        marginBottom: "4px",
                      }}
                    >
                      LIVRR
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.4)",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                      }}
                    >
                      Rapport de performance
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#fff",
                      }}
                    >
                      {rep.boutique}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      {rep.periode}
                    </div>
                  </div>
                </div>

                {/* KPIs */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "12px",
                    marginBottom: "20px",
                  }}
                >
                  {[
                    {
                      label: "Chiffre d'affaires",
                      val: `${rep.caTotal.toLocaleString("fr-FR")}€`,
                      sub: "CA brut généré via LIVRR",
                      color: "var(--gold-dark)",
                    },
                    {
                      label: "Commandes",
                      val: rep.commandes,
                      sub: "commandes traitées",
                      color: "#185fa5",
                    },
                    {
                      label: "Taux de livraison",
                      val: rep.tauxLivraison,
                      sub: "livraisons réussies",
                      color: "#2e8b57",
                    },
                  ].map((k) => (
                    <div
                      key={k.label}
                      style={{
                        background: "var(--gray-bg)",
                        borderRadius: "var(--radius-md)",
                        padding: "16px 18px",
                        border: "1px solid var(--white-3)",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
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
                      <div
                        style={{ fontSize: "11px", color: "var(--gray-light)" }}
                      >
                        {k.sub}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginBottom: "20px",
                  }}
                >
                  {[
                    {
                      label: "Note moyenne clients",
                      val: `★ ${rep.noteMoyenne}`,
                      color: "#b7770d",
                    },
                    {
                      label: "Délai moyen livraison",
                      val: rep.delaiMoyen,
                      color: "#185fa5",
                    },
                    {
                      label: "Produit le plus vendu",
                      val: rep.topProduit,
                      color: "var(--noir)",
                    },
                    {
                      label: "Commission LIVRR déduite",
                      val: `${Math.round(rep.caTotal * 0.15).toLocaleString(
                        "fr-FR"
                      )}€`,
                      color: "#c0392b",
                    },
                  ].map((k) => (
                    <div
                      key={k.label}
                      style={{
                        background: "var(--gray-bg)",
                        borderRadius: "var(--radius-sm)",
                        padding: "12px 14px",
                        border: "1px solid var(--white-3)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "12px", color: "var(--gray)" }}>
                        {k.label}
                      </span>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: k.color,
                        }}
                      >
                        {k.val}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    background: "rgba(201,169,110,0.06)",
                    border: "1px solid rgba(201,169,110,0.2)",
                    borderRadius: "var(--radius-md)",
                    padding: "16px 20px",
                    fontSize: "13px",
                    color: "var(--noir)",
                    lineHeight: 1.7,
                  }}
                >
                  <div
                    style={{
                      fontWeight: "600",
                      color: "var(--gold-dark)",
                      marginBottom: "6px",
                    }}
                  >
                    Message de l'équipe LIVRR
                  </div>
                  Merci pour votre confiance ce mois-ci. Vos performances sont{" "}
                  {rep.noteMoyenne >= 4.8 ? "excellentes" : "bonnes"} et
                  contribuent à la qualité de l'expérience LIVRR. Continuez
                  ainsi !
                </div>

                <div
                  style={{
                    marginTop: "16px",
                    fontSize: "11px",
                    color: "var(--gray-light)",
                    textAlign: "center",
                  }}
                >
                  Rapport généré automatiquement par la plateforme LIVRR ·{" "}
                  {rep.id}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal générer */}
      {showGenModal && (
        <div style={OVL} onClick={() => setShowGenModal(false)}>
          <div
            style={{ ...MDL, width: "440px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: "300",
                marginBottom: "20px",
              }}
            >
              Générer un rapport
            </h2>
            <label style={LBL}>Boutique</label>
            <select
              value={genForm.boutique}
              onChange={(e) =>
                setGenForm((p) => ({ ...p, boutique: e.target.value }))
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1.5px solid var(--white-3)",
                borderRadius: "var(--radius-sm)",
                fontSize: "13px",
                outline: "none",
                marginBottom: "14px",
              }}
            >
              {BOUTIQUES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <label style={LBL}>Période</label>
            <select
              value={genForm.periode}
              onChange={(e) =>
                setGenForm((p) => ({ ...p, periode: e.target.value }))
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1.5px solid var(--white-3)",
                borderRadius: "var(--radius-sm)",
                fontSize: "13px",
                outline: "none",
                marginBottom: "16px",
              }}
            >
              {["Avril 2026", "Mars 2026", "Février 2026"].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <label style={LBL}>Sections à inclure</label>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginBottom: "20px",
              }}
            >
              {[
                { key: "includeCA", label: "Chiffre d'affaires" },
                { key: "includeCommandes", label: "Volume commandes" },
                {
                  key: "includeLivraison",
                  label: "Taux de livraison & délais",
                },
                { key: "includeAvis", label: "Notes et avis clients" },
                { key: "includeTop", label: "Produits performants" },
              ].map((s) => (
                <label
                  key={s.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={genForm[s.key]}
                    onChange={() =>
                      setGenForm((p) => ({ ...p, [s.key]: !p[s.key] }))
                    }
                    style={{ width: 16, height: 16, cursor: "pointer" }}
                  />
                  {s.label}
                </label>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowGenModal(false)}
                style={bStyle("ghost")}
              >
                Annuler
              </button>
              <button onClick={generer} style={bStyle("gold")}>
                Générer le rapport
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function bStyle(t) {
  const s = {
    gold: { background: "var(--noir)", color: "var(--gold)", border: "none" },
    ghost: {
      background: "transparent",
      color: "var(--gray)",
      border: "1.5px solid var(--white-3)",
    },
  };
  return {
    padding: "9px 16px",
    borderRadius: "var(--radius-sm)",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    ...s[t],
  };
}
const OVL = {
  position: "fixed",
  inset: 0,
  background: "rgba(10,10,15,0.55)",
  zIndex: 200,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const MDL = {
  background: "#fff",
  borderRadius: "var(--radius-lg)",
  padding: "32px",
  width: "500px",
  boxShadow: "var(--shadow-lg)",
  maxHeight: "90vh",
  overflowY: "auto",
};
const LBL = {
  display: "block",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--gray)",
  marginBottom: "8px",
};
