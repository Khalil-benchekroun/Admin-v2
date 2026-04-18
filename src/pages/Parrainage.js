import React, { useState } from "react";
import toast from "react-hot-toast";

// ── Mock Data ──────────────────────────────────────────────
const REGLES_DEFAULT = {
  recompenseParrain: 15, // € offerts au parrain après 1ère commande du filleul
  recompenseFilleul: 10, // € offerts au filleul sur sa 1ère commande
  commandeMinFilleul: 50, // montant minimum commande filleul pour déclencher la récompense
  expirationLienJours: 30, // durée de validité du lien de parrainage
  pointsFideliteParrain: 200, // points fidélité bonus pour le parrain
  maxFilleulsParParrain: 10, // nb max de filleuls par parrain
  actif: true,
};

const PARRAINAGES_DATA = [
  {
    id: "PAR-041",
    parrain: { nom: "Sophie M.", id: "CLT-001", avatar: "S" },
    filleul: { nom: "Alice K.", email: "alice.k@email.fr", avatar: "A" },
    statut: "converti",
    dateInvitation: "10/04/2026",
    dateConversion: "14/04/2026",
    commandeFilleul: 89,
    recompenseParrain: 15,
    recompenseFilleul: 10,
    recompensesVersées: true,
  },
  {
    id: "PAR-040",
    parrain: { nom: "Karim T.", id: "CLT-002", avatar: "K" },
    filleul: { nom: "Marc D.", email: "marc.d@email.fr", avatar: "M" },
    statut: "converti",
    dateInvitation: "08/04/2026",
    dateConversion: "11/04/2026",
    commandeFilleul: 245,
    recompenseParrain: 15,
    recompenseFilleul: 10,
    recompensesVersées: true,
  },
  {
    id: "PAR-039",
    parrain: { nom: "Sophie M.", id: "CLT-001", avatar: "S" },
    filleul: { nom: "Julie P.", email: "julie.p@email.fr", avatar: "J" },
    statut: "en_attente",
    dateInvitation: "15/04/2026",
    dateConversion: null,
    commandeFilleul: null,
    recompenseParrain: null,
    recompenseFilleul: 10,
    recompensesVersées: false,
  },
  {
    id: "PAR-038",
    parrain: { nom: "Emma B.", id: "CLT-005", avatar: "E" },
    filleul: { nom: "Lina S.", email: "lina.s@email.fr", avatar: "L" },
    statut: "en_attente",
    dateInvitation: "16/04/2026",
    dateConversion: null,
    commandeFilleul: null,
    recompenseParrain: null,
    recompenseFilleul: 10,
    recompensesVersées: false,
  },
  {
    id: "PAR-037",
    parrain: { nom: "Yasmine B.", id: "CLT-003", avatar: "Y" },
    filleul: { nom: "Rania M.", email: "rania.m@email.fr", avatar: "R" },
    statut: "expiré",
    dateInvitation: "01/03/2026",
    dateConversion: null,
    commandeFilleul: null,
    recompenseParrain: null,
    recompenseFilleul: null,
    recompensesVersées: false,
  },
  {
    id: "PAR-036",
    parrain: { nom: "Karim T.", id: "CLT-002", avatar: "K" },
    filleul: { nom: "Samir B.", email: "samir.b@email.fr", avatar: "S" },
    statut: "converti",
    dateInvitation: "20/03/2026",
    dateConversion: "24/03/2026",
    commandeFilleul: 320,
    recompenseParrain: 15,
    recompenseFilleul: 10,
    recompensesVersées: true,
  },
  {
    id: "PAR-035",
    parrain: { nom: "Lucas D.", id: "CLT-004", avatar: "L" },
    filleul: { nom: "Nina F.", email: "nina.f@email.fr", avatar: "N" },
    statut: "en_attente",
    dateInvitation: "17/04/2026",
    dateConversion: null,
    commandeFilleul: null,
    recompenseParrain: null,
    recompenseFilleul: 10,
    recompensesVersées: false,
  },
];

const STATUT_CFG = {
  converti: {
    label: "Converti ✓",
    color: "#2e8b57",
    bg: "#e8f5ee",
    dot: "#10B981",
  },
  en_attente: {
    label: "En attente",
    color: "#185fa5",
    bg: "#eff6ff",
    dot: "#3B82F6",
  },
  expiré: { label: "Expiré", color: "#6B7280", bg: "#f3f4f6", dot: "#9CA3AF" },
};

// Top parrains
function getTopParrains(data) {
  const map = {};
  data.forEach((p) => {
    const key = p.parrain.id;
    if (!map[key])
      map[key] = { ...p.parrain, total: 0, convertis: 0, gains: 0 };
    map[key].total++;
    if (p.statut === "converti") {
      map[key].convertis++;
      map[key].gains += p.recompenseParrain || 0;
    }
  });
  return Object.values(map).sort((a, b) => b.convertis - a.convertis);
}

export default function Parrainage() {
  const [parrainages, setParrainages] = useState(PARRAINAGES_DATA);
  const [regles, setRegles] = useState(REGLES_DEFAULT);
  const [filterStatut, setFilterStatut] = useState("all");
  const [search, setSearch] = useState("");
  const [onglet, setOnglet] = useState("liste"); // liste | regles | stats
  const [editRegles, setEditRegles] = useState(false);
  const [editForm, setEditForm] = useState({});

  const filtres = parrainages.filter((p) => {
    return (
      (filterStatut === "all" || p.statut === filterStatut) &&
      (p.parrain.nom.toLowerCase().includes(search.toLowerCase()) ||
        p.filleul.nom.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const stats = {
    total: parrainages.length,
    convertis: parrainages.filter((p) => p.statut === "converti").length,
    enAttente: parrainages.filter((p) => p.statut === "en_attente").length,
    tauxConversion: Math.round(
      (parrainages.filter((p) => p.statut === "converti").length /
        parrainages.filter((p) => p.statut !== "expiré").length) *
        100
    ),
    recompensesTotal: parrainages
      .filter((p) => p.recompensesVersées)
      .reduce(
        (s, p) => s + (p.recompenseParrain || 0) + (p.recompenseFilleul || 0),
        0
      ),
    caGeneré: parrainages
      .filter((p) => p.statut === "converti")
      .reduce((s, p) => s + (p.commandeFilleul || 0), 0),
  };

  const topParrains = getTopParrains(parrainages);

  const sauvegarderRegles = () => {
    setRegles((prev) => ({ ...prev, ...editForm }));
    setEditRegles(false);
    toast.success("Règles de parrainage mises à jour");
  };

  const verserManuellement = (id) => {
    setParrainages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, recompensesVersées: true } : p))
    );
    toast.success("Récompenses versées manuellement");
  };

  return (
    <div className="page" style={{ padding: "44px 52px" }}>
      {/* Header */}
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
            Parrainage
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}
          >
            Suivi des parrainages clients et gestion des récompenses
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: "6px",
            background: "#fff",
            padding: "5px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--white-3)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {[
            { id: "liste", label: "Parrainages" },
            { id: "stats", label: "Statistiques" },
            { id: "regles", label: "Règles" },
          ].map((o) => (
            <button
              key={o.id}
              onClick={() => setOnglet(o.id)}
              style={{
                padding: "7px 16px",
                borderRadius: "var(--radius-sm)",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                background: onglet === o.id ? "var(--noir)" : "transparent",
                color: onglet === o.id ? "var(--gold)" : "var(--gray)",
                border: "none",
                transition: "all 0.18s",
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "12px",
          marginBottom: "28px",
        }}
      >
        {[
          {
            label: "Total invitations",
            val: stats.total,
            color: "var(--noir)",
          },
          { label: "Convertis", val: stats.convertis, color: "#2e8b57" },
          { label: "En attente", val: stats.enAttente, color: "#185fa5" },
          {
            label: "Taux conversion",
            val: `${stats.tauxConversion}%`,
            color: "var(--gold-dark)",
          },
          {
            label: "Récompenses versées",
            val: `${stats.recompensesTotal}€`,
            color: "#c0392b",
          },
          { label: "CA généré", val: `${stats.caGeneré}€`, color: "#2e8b57" },
        ].map((k) => (
          <div
            key={k.label}
            style={{
              background: "#fff",
              borderRadius: "var(--radius-md)",
              padding: "16px 18px",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--white-3)",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: "700",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--gray)",
                marginBottom: "8px",
              }}
            >
              {k.label}
            </div>
            <div
              style={{
                fontSize: "22px",
                fontFamily: "var(--font-display)",
                fontWeight: "300",
                color: k.color,
                lineHeight: 1,
              }}
            >
              {k.val}
            </div>
          </div>
        ))}
      </div>

      {/* ── Onglet : Liste ── */}
      {onglet === "liste" && (
        <div>
          {/* Filtres */}
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--radius-lg)",
              padding: "14px 20px",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--white-3)",
              marginBottom: "16px",
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              placeholder="Parrain, filleul, ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "7px 12px",
                border: "1px solid var(--white-3)",
                borderRadius: "var(--radius-sm)",
                fontSize: "13px",
                background: "var(--gray-bg)",
                outline: "none",
                minWidth: "200px",
              }}
            />
            <div
              style={{ width: 1, height: 20, background: "var(--white-3)" }}
            />
            {["all", "converti", "en_attente", "expiré"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatut(s)}
                style={fBtn(
                  filterStatut === s,
                  s !== "all" ? STATUT_CFG[s]?.color : null,
                  s !== "all" ? STATUT_CFG[s]?.bg : null
                )}
              >
                {s === "all" ? "Tous" : STATUT_CFG[s].label}
              </button>
            ))}
            <span
              style={{
                marginLeft: "auto",
                fontSize: "12px",
                color: "var(--gray)",
              }}
            >
              {filtres.length} parrainage{filtres.length > 1 ? "s" : ""}
            </span>
          </div>

          {/* Table */}
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--white-3)",
              overflow: "hidden",
            }}
          >
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
                    "Réf.",
                    "Parrain",
                    "Filleul",
                    "Date invitation",
                    "Statut",
                    "Commande filleul",
                    "Récompenses",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "11px 16px",
                        textAlign: "left",
                        fontSize: "10px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--gray)",
                        borderBottom: "1px solid var(--white-3)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtres.map((p) => {
                  const sc = STATUT_CFG[p.statut];
                  return (
                    <tr
                      key={p.id}
                      style={{ borderBottom: "1px solid var(--white-3)" }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          fontWeight: "700",
                          color: "var(--gold-dark)",
                          fontSize: "11px",
                          fontFamily: "monospace",
                        }}
                      >
                        {p.id}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Av letter={p.parrain.avatar} />
                          <span style={{ fontWeight: "500" }}>
                            {p.parrain.nom}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Av letter={p.filleul.avatar} color="#185fa5" />
                          <div>
                            <div style={{ fontWeight: "500" }}>
                              {p.filleul.nom}
                            </div>
                            <div
                              style={{ fontSize: "11px", color: "var(--gray)" }}
                            >
                              {p.filleul.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "12px",
                          color: "var(--gray)",
                        }}
                      >
                        {p.dateInvitation}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "600",
                            padding: "3px 10px",
                            borderRadius: "12px",
                            background: sc.bg,
                            color: sc.color,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: sc.dot,
                            }}
                          />
                          {sc.label}
                        </span>
                        {p.dateConversion && (
                          <div
                            style={{
                              fontSize: "10px",
                              color: "var(--gray)",
                              marginTop: "2px",
                            }}
                          >
                            Converti le {p.dateConversion}
                          </div>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontWeight: p.commandeFilleul ? "600" : "400",
                          color: p.commandeFilleul
                            ? "var(--noir)"
                            : "var(--gray-light)",
                        }}
                      >
                        {p.commandeFilleul ? `${p.commandeFilleul}€` : "—"}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {p.statut === "converti" && (
                          <div>
                            <div
                              style={{ fontSize: "12px", color: "var(--gray)" }}
                            >
                              +{p.recompenseParrain}€ parrain · +
                              {p.recompenseFilleul}€ filleul
                            </div>
                            <span
                              style={{
                                fontSize: "10px",
                                fontWeight: "600",
                                color: p.recompensesVersées
                                  ? "#2e8b57"
                                  : "#b7770d",
                              }}
                            >
                              {p.recompensesVersées
                                ? "✓ Versées"
                                : "⏳ En attente"}
                            </span>
                          </div>
                        )}
                        {p.statut === "en_attente" && (
                          <span
                            style={{
                              fontSize: "11px",
                              color: "var(--gray-light)",
                            }}
                          >
                            En attente de commande
                          </span>
                        )}
                        {p.statut === "expiré" && (
                          <span
                            style={{
                              fontSize: "11px",
                              color: "var(--gray-light)",
                            }}
                          >
                            Lien expiré
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {p.statut === "converti" && !p.recompensesVersées && (
                          <button
                            onClick={() => verserManuellement(p.id)}
                            style={{
                              padding: "5px 12px",
                              borderRadius: "var(--radius-sm)",
                              fontSize: "11px",
                              fontWeight: "600",
                              background: "#e8f5ee",
                              color: "#2e8b57",
                              border: "1px solid #bbf7d0",
                              cursor: "pointer",
                            }}
                          >
                            Verser
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Onglet : Stats ── */}
      {onglet === "stats" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          {/* Top parrains */}
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
                fontSize: "10px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--gray)",
                marginBottom: "16px",
              }}
            >
              Top parrains
            </div>
            {topParrains.map((p, i) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                  paddingBottom: "16px",
                  borderBottom:
                    i < topParrains.length - 1
                      ? "1px solid var(--white-3)"
                      : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "22px",
                    fontWeight: "300",
                    color: i === 0 ? "var(--gold)" : "var(--gray-light)",
                    width: "24px",
                    textAlign: "center",
                  }}
                >
                  {i + 1}
                </div>
                <Av letter={p.avatar} />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      marginBottom: "2px",
                    }}
                  >
                    {p.nom}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                    {p.total} invitation{p.total > 1 ? "s" : ""} · {p.convertis}{" "}
                    converti{p.convertis > 1 ? "s" : ""}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#2e8b57",
                    }}
                  >
                    +{p.gains}€
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--gray)" }}>
                    gains
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Funnel conversion */}
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
                fontSize: "10px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--gray)",
                marginBottom: "16px",
              }}
            >
              Funnel de conversion
            </div>
            {[
              {
                label: "Invitations envoyées",
                val: stats.total,
                pct: 100,
                color: "#C9A96E",
              },
              {
                label: "Non expirées",
                val:
                  stats.total -
                  parrainages.filter((p) => p.statut === "expiré").length,
                pct: Math.round(
                  ((stats.total -
                    parrainages.filter((p) => p.statut === "expiré").length) /
                    stats.total) *
                    100
                ),
                color: "#3B82F6",
              },
              {
                label: "1ère commande passée",
                val: stats.convertis + stats.enAttente,
                pct: Math.round(
                  ((stats.convertis + stats.enAttente) / stats.total) * 100
                ),
                color: "#10B981",
              },
              {
                label: "Récompenses versées",
                val: parrainages.filter((p) => p.recompensesVersées).length,
                pct: Math.round(
                  (parrainages.filter((p) => p.recompensesVersées).length /
                    stats.total) *
                    100
                ),
                color: "#2e8b57",
              },
            ].map((f) => (
              <div key={f.label} style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "5px",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "var(--gray)" }}>
                    {f.label}
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600" }}>
                      {f.val}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: f.color,
                        fontWeight: "600",
                      }}
                    >
                      {f.pct}%
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    height: 8,
                    background: "var(--white-3)",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${f.pct}%`,
                      background: f.color,
                      borderRadius: "8px",
                      transition: "width 0.4s",
                    }}
                  />
                </div>
              </div>
            ))}

            <div
              style={{
                marginTop: "20px",
                paddingTop: "16px",
                borderTop: "1px solid var(--white-3)",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--gray)",
                  marginBottom: "10px",
                }}
              >
                Règles actives
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[
                  `+${regles.recompenseParrain}€ au parrain`,
                  `+${regles.recompenseFilleul}€ au filleul`,
                  `Min. ${regles.commandeMinFilleul}€`,
                  `Lien valable ${regles.expirationLienJours}j`,
                ].map((r) => (
                  <span
                    key={r}
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      padding: "3px 10px",
                      borderRadius: "10px",
                      background: "rgba(201,169,110,0.1)",
                      color: "var(--gold-dark)",
                    }}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Onglet : Règles ── */}
      {onglet === "regles" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--radius-lg)",
              padding: "28px",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--white-3)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <div>
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
                  Configuration
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "22px",
                    fontWeight: "300",
                  }}
                >
                  Règles de parrainage
                </div>
              </div>
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                {/* Toggle programme actif */}
                <span style={{ fontSize: "12px", color: "var(--gray)" }}>
                  Programme
                </span>
                <div
                  onClick={() => setRegles((p) => ({ ...p, actif: !p.actif }))}
                  style={{
                    width: 36,
                    height: 20,
                    borderRadius: "10px",
                    background: regles.actif ? "var(--gold)" : "#D1D5DB",
                    cursor: "pointer",
                    position: "relative",
                    transition: "background 0.2s",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 3,
                      left: regles.actif ? 19 : 3,
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: "#fff",
                      transition: "left 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: regles.actif ? "#2e8b57" : "var(--gray)",
                  }}
                >
                  {regles.actif ? "Actif" : "Inactif"}
                </span>
              </div>
            </div>

            {!editRegles ? (
              <div>
                {[
                  {
                    label: "Récompense parrain (€)",
                    val: `${regles.recompenseParrain}€`,
                    desc: "Crédit offert au parrain après 1ère commande du filleul",
                  },
                  {
                    label: "Récompense filleul (€)",
                    val: `${regles.recompenseFilleul}€`,
                    desc: "Réduction sur la 1ère commande du filleul",
                  },
                  {
                    label: "Commande minimum filleul",
                    val: `${regles.commandeMinFilleul}€`,
                    desc: "Montant minimum pour déclencher les récompenses",
                  },
                  {
                    label: "Durée de validité du lien",
                    val: `${regles.expirationLienJours} jours`,
                    desc: "Après expiration, le lien ne fonctionne plus",
                  },
                  {
                    label: "Points fidélité bonus",
                    val: `+${regles.pointsFideliteParrain} pts`,
                    desc: "Points supplémentaires accordés au parrain",
                  },
                  {
                    label: "Max filleuls par parrain",
                    val: regles.maxFilleulsParParrain,
                    desc: "Limite pour éviter les abus",
                  },
                ].map((r) => (
                  <div
                    key={r.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      padding: "12px 0",
                      borderBottom: "1px solid var(--white-3)",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: "500",
                          marginBottom: "2px",
                        }}
                      >
                        {r.label}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                        {r.desc}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "var(--gold-dark)",
                        flexShrink: 0,
                        marginLeft: "16px",
                      }}
                    >
                      {r.val}
                    </span>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setEditForm({ ...regles });
                    setEditRegles(true);
                  }}
                  style={{
                    marginTop: "20px",
                    ...bStyle("gold"),
                    width: "100%",
                  }}
                >
                  Modifier les règles
                </button>
              </div>
            ) : (
              <div>
                {[
                  { label: "Récompense parrain (€)", key: "recompenseParrain" },
                  { label: "Récompense filleul (€)", key: "recompenseFilleul" },
                  {
                    label: "Commande minimum filleul (€)",
                    key: "commandeMinFilleul",
                  },
                  {
                    label: "Durée de validité du lien (jours)",
                    key: "expirationLienJours",
                  },
                  {
                    label: "Points fidélité bonus parrain",
                    key: "pointsFideliteParrain",
                  },
                  {
                    label: "Max filleuls par parrain",
                    key: "maxFilleulsParParrain",
                  },
                ].map((f) => (
                  <div key={f.key} style={{ marginBottom: "14px" }}>
                    <label style={LBL}>{f.label}</label>
                    <input
                      type="number"
                      value={editForm[f.key] || ""}
                      onChange={(e) =>
                        setEditForm((p) => ({
                          ...p,
                          [f.key]: parseInt(e.target.value) || 0,
                        }))
                      }
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1.5px solid var(--gold)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "13px",
                        outline: "none",
                      }}
                    />
                  </div>
                ))}
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <button
                    onClick={() => setEditRegles(false)}
                    style={{ ...bStyle("ghost"), flex: 1 }}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={sauvegarderRegles}
                    style={{ ...bStyle("gold"), flex: 1 }}
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Aperçu règles */}
          <div
            style={{
              background: "var(--noir)",
              borderRadius: "var(--radius-lg)",
              padding: "28px",
              color: "#fff",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.35)",
                marginBottom: "16px",
              }}
            >
              Aperçu client — Message d'invitation
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: "var(--radius-md)",
                padding: "20px",
                border: "1px solid rgba(255,255,255,0.08)",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "20px",
                  fontWeight: "300",
                  color: "var(--gold)",
                  marginBottom: "10px",
                }}
              >
                LIVRR
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                }}
              >
                Invitez vos proches, profitez ensemble !
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.6,
                  marginBottom: "14px",
                }}
              >
                Partagez votre code et recevez{" "}
                <strong style={{ color: "var(--gold)" }}>
                  {regles.recompenseParrain}€
                </strong>{" "}
                dès que votre filleul passe sa première commande (minimum{" "}
                {regles.commandeMinFilleul}€). Votre filleul reçoit{" "}
                <strong style={{ color: "var(--gold)" }}>
                  {regles.recompenseFilleul}€
                </strong>{" "}
                de réduction immédiate.
              </div>
              <div
                style={{
                  background: "rgba(201,169,110,0.15)",
                  border: "1px solid rgba(201,169,110,0.3)",
                  borderRadius: "var(--radius-sm)",
                  padding: "10px 14px",
                  fontFamily: "monospace",
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "var(--gold)",
                  textAlign: "center",
                  letterSpacing: "4px",
                }}
              >
                LIVRR-{"{"}CODE{"}"}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.3)",
                  marginTop: "10px",
                  textAlign: "center",
                }}
              >
                Lien valable {regles.expirationLienJours} jours · Max{" "}
                {regles.maxFilleulsParParrain} filleuls
              </div>
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.25)",
                lineHeight: 1.6,
              }}
            >
              Les récompenses sont créditées automatiquement après validation de
              la 1ère commande du filleul. En cas d'annulation, les récompenses
              sont annulées.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Av({ letter, color }) {
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: `rgba(${
          color === "#185fa5" ? "59,130,246" : "201,169,110"
        },0.1)`,
        border: `1px solid rgba(${
          color === "#185fa5" ? "59,130,246" : "201,169,110"
        },0.25)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        fontWeight: "700",
        color: color || "var(--gold-dark)",
        flexShrink: 0,
      }}
    >
      {letter}
    </div>
  );
}
function fBtn(active, color, bg) {
  return {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
    border: `1.5px solid ${active ? color || "var(--gold)" : "var(--white-3)"}`,
    background: active ? bg || "rgba(201,169,110,0.08)" : "transparent",
    color: active ? color || "var(--gold-dark)" : "var(--gray)",
  };
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
const LBL = {
  display: "block",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--gray)",
  marginBottom: "8px",
};
