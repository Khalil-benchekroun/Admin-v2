import React, { useState } from "react";
import toast from "react-hot-toast";

const DEFAULT_CONFIG = {
  commissions: { classic: 18, signature: 15, prestige: 12 },
  delais: {
    acceptationBoutique: 5,
    preparationEstimee: 20,
    livraisonEstimee: 40,
    retourMax: 7,
  },
  plateforme: {
    nomPlateforme: "LIVRR",
    villeActive: "Paris",
    zoneKm: 10,
    commandeMinimum: 30,
    fraisLivraisonBase: 4.9,
    fraisLivraisonExpress: 9.9,
    abonnementClientMensuel: 9.9,
    abonnementClientAnnuel: 89,
  },
  horaires: {
    lunVen: { ouverture: "09:00", fermeture: "21:00" },
    samedi: { ouverture: "10:00", fermeture: "22:00" },
    dimanche: { ouverture: "11:00", fermeture: "20:00" },
  },
  legal: {
    cgu: "Conditions Générales d'Utilisation\n\nDernière mise à jour : Février 2026\n\nEn utilisant la plateforme LIVRR, vous acceptez les présentes conditions...",
    cgv: "Conditions Générales de Vente\n\nDernière mise à jour : Février 2026\n\nToute commande passée via LIVRR implique l'acceptation des présentes CGV...",
    politique:
      "Politique de confidentialité\n\nLIVRR s'engage à protéger vos données personnelles conformément au RGPD...",
  },
};

const JOURS = [
  { key: "lunVen", label: "Lun → Ven" },
  { key: "samedi", label: "Samedi" },
  { key: "dimanche", label: "Dimanche" },
];

export default function Parametres() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [onglet, setOnglet] = useState("commissions");
  const [saved, setSaved] = useState({});
  const [editLegal, setEditLegal] = useState(null);

  const set = (section, key, val) => {
    setConfig((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: val },
    }));
    setSaved((prev) => ({ ...prev, [section]: false }));
  };

  const setNested = (section, parent, key, val) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: { ...prev[section][parent], [key]: val },
      },
    }));
    setSaved((prev) => ({ ...prev, [section]: false }));
  };

  const sauvegarder = (section) => {
    setSaved((prev) => ({ ...prev, [section]: true }));
    toast.success("Paramètres enregistrés");
  };

  const ONGLETS = [
    { id: "commissions", label: "Commissions" },
    { id: "delais", label: "Délais" },
    { id: "plateforme", label: "Plateforme" },
    { id: "horaires", label: "Horaires" },
    { id: "legal", label: "Textes légaux" },
  ];

  return (
    <div className="page" style={{ padding: "44px 52px" }}>
      <div style={{ marginBottom: "36px" }}>
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
          Paramètres
        </h1>
        <p style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}>
          Configuration globale de la plateforme LIVRR
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "200px 1fr",
          gap: "24px",
        }}
      >
        {/* Nav latérale */}
        <div
          style={{
            background: "#fff",
            borderRadius: "var(--radius-lg)",
            padding: "12px",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--white-3)",
            alignSelf: "start",
          }}
        >
          {ONGLETS.map((o) => (
            <button
              key={o.id}
              onClick={() => setOnglet(o.id)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                fontSize: "13px",
                fontWeight: onglet === o.id ? "600" : "400",
                background:
                  onglet === o.id ? "rgba(201,169,110,0.08)" : "transparent",
                color: onglet === o.id ? "var(--gold-dark)" : "var(--gray)",
                border: "none",
                cursor: "pointer",
                marginBottom: "2px",
                textAlign: "left",
                transition: "all 0.15s",
              }}
            >
              {o.label}
              {saved[o.id] === false && (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#b7770d",
                    flexShrink: 0,
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Contenu */}
        <div
          style={{
            background: "#fff",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--white-3)",
            overflow: "hidden",
          }}
        >
          {/* ── Commissions ── */}
          {onglet === "commissions" && (
            <Section
              title="Commissions par plan"
              sub="Taux prélevés sur chaque vente selon le plan de la boutique"
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "20px",
                  marginBottom: "32px",
                }}
              >
                {[
                  {
                    key: "classic",
                    label: "Classic",
                    color: "#6B7280",
                    bg: "rgba(107,114,128,0.08)",
                  },
                  {
                    key: "signature",
                    label: "Signature",
                    color: "#3B82F6",
                    bg: "rgba(59,130,246,0.08)",
                  },
                  {
                    key: "prestige",
                    label: "Prestige",
                    color: "#C9A96E",
                    bg: "rgba(201,169,110,0.08)",
                  },
                ].map((plan) => (
                  <div
                    key={plan.key}
                    style={{
                      background: plan.bg,
                      borderRadius: "var(--radius-md)",
                      padding: "20px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: plan.color,
                        marginBottom: "12px",
                      }}
                    >
                      {plan.label}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <input
                        type="number"
                        min="0"
                        max="50"
                        step="0.5"
                        value={config.commissions[plan.key]}
                        onChange={(e) =>
                          set(
                            "commissions",
                            plan.key,
                            parseFloat(e.target.value)
                          )
                        }
                        style={{
                          width: "80px",
                          padding: "10px 12px",
                          border: `2px solid ${plan.color}40`,
                          borderRadius: "var(--radius-sm)",
                          fontSize: "20px",
                          fontWeight: "600",
                          textAlign: "center",
                          outline: "none",
                          background: "#fff",
                          color: plan.color,
                          fontFamily: "var(--font-display)",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "22px",
                          fontWeight: "300",
                          color: plan.color,
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        %
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--gray)",
                        marginTop: "8px",
                      }}
                    >
                      Sur 1 000€ →{" "}
                      <strong>
                        {Math.round(
                          (1000 * config.commissions[plan.key]) / 100
                        )}
                        €
                      </strong>{" "}
                      pour LIVRR
                    </div>
                  </div>
                ))}
              </div>
              <SaveBtn onSave={() => sauvegarder("commissions")} />
            </Section>
          )}

          {/* ── Délais ── */}
          {onglet === "delais" && (
            <Section
              title="Délais & temporalités"
              sub="Règles de temps appliquées automatiquement par la plateforme"
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "32px",
                }}
              >
                {[
                  {
                    key: "acceptationBoutique",
                    label: "Délai max acceptation boutique",
                    unit: "min",
                    desc: "Passé ce délai, la commande est automatiquement annulée",
                  },
                  {
                    key: "preparationEstimee",
                    label: "Préparation estimée (défaut)",
                    unit: "min",
                    desc: "Affiché au client après acceptation boutique",
                  },
                  {
                    key: "livraisonEstimee",
                    label: "Livraison estimée (défaut)",
                    unit: "min",
                    desc: "Estimation affichée avant attribution coursier",
                  },
                  {
                    key: "retourMax",
                    label: "Délai de retour autorisé",
                    unit: "jours",
                    desc: "Fenêtre après livraison pour initier un retour",
                  },
                ].map((d) => (
                  <div
                    key={d.key}
                    style={{
                      background: "var(--gray-bg)",
                      borderRadius: "var(--radius-md)",
                      padding: "18px",
                      border: "1px solid var(--white-3)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "var(--noir)",
                        marginBottom: "4px",
                      }}
                    >
                      {d.label}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--gray)",
                        marginBottom: "12px",
                      }}
                    >
                      {d.desc}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <input
                        type="number"
                        min="1"
                        value={config.delais[d.key]}
                        onChange={(e) =>
                          set("delais", d.key, parseInt(e.target.value))
                        }
                        style={{
                          width: "80px",
                          padding: "9px 12px",
                          border: "1.5px solid var(--white-3)",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "16px",
                          fontWeight: "600",
                          textAlign: "center",
                          outline: "none",
                          background: "#fff",
                        }}
                      />
                      <span style={{ fontSize: "13px", color: "var(--gray)" }}>
                        {d.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <SaveBtn onSave={() => sauvegarder("delais")} />
            </Section>
          )}

          {/* ── Plateforme ── */}
          {onglet === "plateforme" && (
            <Section
              title="Configuration plateforme"
              sub="Paramètres généraux de fonctionnement"
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "32px",
                }}
              >
                {[
                  {
                    key: "nomPlateforme",
                    label: "Nom de la plateforme",
                    type: "text",
                  },
                  { key: "villeActive", label: "Ville active", type: "text" },
                  {
                    key: "zoneKm",
                    label: "Rayon de livraison (km)",
                    type: "number",
                  },
                  {
                    key: "commandeMinimum",
                    label: "Commande minimum (€)",
                    type: "number",
                  },
                  {
                    key: "fraisLivraisonBase",
                    label: "Frais livraison standard (€)",
                    type: "number",
                  },
                  {
                    key: "fraisLivraisonExpress",
                    label: "Frais livraison express (€)",
                    type: "number",
                  },
                  {
                    key: "abonnementClientMensuel",
                    label: "Abonnement client mensuel (€)",
                    type: "number",
                  },
                  {
                    key: "abonnementClientAnnuel",
                    label: "Abonnement client annuel (€)",
                    type: "number",
                  },
                ].map((f) => (
                  <div
                    key={f.key}
                    style={{
                      background: "var(--gray-bg)",
                      borderRadius: "var(--radius-md)",
                      padding: "16px 18px",
                      border: "1px solid var(--white-3)",
                    }}
                  >
                    <label
                      style={{
                        display: "block",
                        fontSize: "11px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--gray)",
                        marginBottom: "8px",
                      }}
                    >
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      value={config.plateforme[f.key]}
                      onChange={(e) =>
                        set(
                          "plateforme",
                          f.key,
                          f.type === "number"
                            ? parseFloat(e.target.value)
                            : e.target.value
                        )
                      }
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        border: "1.5px solid var(--white-3)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "14px",
                        fontWeight: "500",
                        outline: "none",
                        background: "#fff",
                      }}
                    />
                  </div>
                ))}
              </div>
              <SaveBtn onSave={() => sauvegarder("plateforme")} />
            </Section>
          )}

          {/* ── Horaires ── */}
          {onglet === "horaires" && (
            <Section
              title="Horaires de la plateforme"
              sub="Créneaux pendant lesquels les commandes sont acceptées"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  marginBottom: "32px",
                }}
              >
                {JOURS.map((j) => (
                  <div
                    key={j.key}
                    style={{
                      background: "var(--gray-bg)",
                      borderRadius: "var(--radius-md)",
                      padding: "18px 20px",
                      border: "1px solid var(--white-3)",
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <div
                      style={{
                        minWidth: "90px",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "var(--noir)",
                      }}
                    >
                      {j.label}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "10px",
                            fontWeight: "700",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: "var(--gray)",
                            marginBottom: "4px",
                          }}
                        >
                          Ouverture
                        </label>
                        <input
                          type="time"
                          value={config.horaires[j.key].ouverture}
                          onChange={(e) =>
                            setNested(
                              "horaires",
                              j.key,
                              "ouverture",
                              e.target.value
                            )
                          }
                          style={{
                            padding: "8px 12px",
                            border: "1.5px solid var(--white-3)",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "14px",
                            fontWeight: "500",
                            outline: "none",
                            background: "#fff",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "16px",
                          color: "var(--gray-light)",
                          marginTop: "16px",
                        }}
                      >
                        →
                      </span>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "10px",
                            fontWeight: "700",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: "var(--gray)",
                            marginBottom: "4px",
                          }}
                        >
                          Fermeture
                        </label>
                        <input
                          type="time"
                          value={config.horaires[j.key].fermeture}
                          onChange={(e) =>
                            setNested(
                              "horaires",
                              j.key,
                              "fermeture",
                              e.target.value
                            )
                          }
                          style={{
                            padding: "8px 12px",
                            border: "1.5px solid var(--white-3)",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "14px",
                            fontWeight: "500",
                            outline: "none",
                            background: "#fff",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        marginLeft: "auto",
                        fontSize: "12px",
                        color: "var(--gray)",
                      }}
                    >
                      {(() => {
                        const [oh, om] = config.horaires[j.key].ouverture
                          .split(":")
                          .map(Number);
                        const [fh, fm] = config.horaires[j.key].fermeture
                          .split(":")
                          .map(Number);
                        const diff = fh * 60 + fm - (oh * 60 + om);
                        return `${Math.floor(diff / 60)}h${
                          diff % 60 > 0
                            ? String(diff % 60).padStart(2, "0")
                            : ""
                        }`;
                      })()}
                    </div>
                  </div>
                ))}
              </div>
              <SaveBtn onSave={() => sauvegarder("horaires")} />
            </Section>
          )}

          {/* ── Textes légaux ── */}
          {onglet === "legal" && (
            <Section
              title="Textes légaux"
              sub="CGU, CGV et politique de confidentialité"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  marginBottom: "32px",
                }}
              >
                {[
                  {
                    key: "cgu",
                    label: "Conditions Générales d'Utilisation (CGU)",
                  },
                  { key: "cgv", label: "Conditions Générales de Vente (CGV)" },
                  { key: "politique", label: "Politique de confidentialité" },
                ].map((doc) => (
                  <div
                    key={doc.key}
                    style={{
                      background: "var(--gray-bg)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--white-3)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "14px 18px",
                        borderBottom: "1px solid var(--white-3)",
                        background: "#fff",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "var(--noir)",
                        }}
                      >
                        {doc.label}
                      </div>
                      <button
                        onClick={() =>
                          setEditLegal(editLegal === doc.key ? null : doc.key)
                        }
                        style={{
                          padding: "6px 14px",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "11px",
                          fontWeight: "600",
                          border: "1.5px solid var(--white-3)",
                          background:
                            editLegal === doc.key
                              ? "rgba(201,169,110,0.08)"
                              : "transparent",
                          color:
                            editLegal === doc.key
                              ? "var(--gold-dark)"
                              : "var(--gray)",
                          cursor: "pointer",
                        }}
                      >
                        {editLegal === doc.key ? "Fermer" : "Modifier"}
                      </button>
                    </div>
                    {editLegal === doc.key ? (
                      <textarea
                        value={config.legal[doc.key]}
                        onChange={(e) => set("legal", doc.key, e.target.value)}
                        rows={10}
                        style={{
                          width: "100%",
                          padding: "16px 18px",
                          border: "none",
                          fontSize: "13px",
                          lineHeight: 1.7,
                          outline: "none",
                          background: "var(--gray-bg)",
                          resize: "vertical",
                          fontFamily: "var(--font-body)",
                          display: "block",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          padding: "14px 18px",
                          fontSize: "12px",
                          color: "var(--gray)",
                          lineHeight: 1.6,
                          maxHeight: "80px",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        {config.legal[doc.key].slice(0, 200)}…
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <SaveBtn onSave={() => sauvegarder("legal")} />
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────
function Section({ title, sub, children }) {
  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "10px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--gray)",
            marginBottom: "4px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            fontWeight: "300",
          }}
        >
          {sub}
        </div>
      </div>
      {children}
    </div>
  );
}

function SaveBtn({ onSave }) {
  return (
    <div
      style={{
        borderTop: "1px solid var(--white-3)",
        paddingTop: "20px",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <button
        onClick={onSave}
        style={{
          padding: "11px 28px",
          borderRadius: "var(--radius-sm)",
          fontSize: "13px",
          fontWeight: "600",
          background: "var(--noir)",
          color: "var(--gold)",
          border: "none",
          cursor: "pointer",
          letterSpacing: "0.05em",
        }}
      >
        Enregistrer les modifications
      </button>
    </div>
  );
}
