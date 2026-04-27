import React, { useState } from "react";
import toast from "react-hot-toast";

const AVIS_DATA = [
  {
    id: "AV-041",
    client: "Sophie M.",
    boutique: "Sandro Paris",
    produit: "Robe Midi Fleurie",
    commande: "LV-00248",
    note: 5,
    date: "09/04/2026",
    commentaire:
      "Livraison ultra rapide, moins de 45 minutes ! La robe est exactement comme sur les photos. Je recommande vivement cette boutique.",
    reponse: null,
    signale: false,
    statut: "publié",
  },
  {
    id: "AV-040",
    client: "Marie L.",
    boutique: "Sandro Paris",
    produit: "Trench Camel",
    commande: "LV-00246",
    note: 4,
    date: "07/04/2026",
    commentaire:
      "Très bonne expérience globale. Le livreur était très courtois. Juste un petit bémol sur l'emballage qui aurait pu être un peu plus soigné.",
    reponse:
      "Merci pour votre retour ! Nous prenons note pour l'emballage. À bientôt !",
    signale: false,
    statut: "publié",
  },
  {
    id: "AV-039",
    client: "Camille D.",
    boutique: "AMI Paris",
    produit: "Blazer Structuré",
    commande: "LV-00240",
    note: 5,
    date: "05/04/2026",
    commentaire:
      "Parfait du début à la fin. Le blazer est magnifique et la livraison en 38 minutes c'est impressionnant pour Paris.",
    reponse: null,
    signale: false,
    statut: "publié",
  },
  {
    id: "AV-038",
    client: "Julie P.",
    boutique: "Sandro Paris",
    produit: "Robe Fleurie",
    commande: "LV-00235",
    note: 3,
    date: "03/04/2026",
    commentaire:
      "La livraison a pris plus de temps que prévu (1h20). Le produit est bien mais j'attendais mieux côté rapidité.",
    reponse: null,
    signale: false,
    statut: "publié",
  },
  {
    id: "AV-037",
    client: "Emma B.",
    boutique: "By Terry",
    produit: "Sérum Éclat Visage",
    commande: "LV-00228",
    note: 5,
    date: "01/04/2026",
    commentaire:
      "Expérience 5 étoiles. Le sérum est authentique et la boutique a même ajouté un petit mot personnalisé.",
    reponse:
      "Merci Emma ! Votre satisfaction est notre priorité. Nous espérons vous revoir bientôt ✨",
    signale: false,
    statut: "publié",
  },
  {
    id: "AV-036",
    client: "Lucas D.",
    boutique: "By Terry",
    produit: "Rouge Terrybly #302",
    commande: "LV-00409",
    note: 2,
    date: "10/04/2026",
    commentaire:
      "Produit reçu endommagé dans son emballage. La boutique n'a pas répondu à mes messages. Très déçu pour ce prix.",
    reponse: null,
    signale: true,
    statut: "signalé",
  },
  {
    id: "AV-035",
    client: "Nadia S.",
    boutique: "AMI Paris",
    produit: "Pull Alexandre",
    commande: "LV-00374",
    note: 1,
    date: "05/04/2026",
    commentaire:
      "Arnaque totale. L'article ne correspond pas du tout à la description. J'exige un remboursement immédiat.",
    reponse: null,
    signale: true,
    statut: "signalé",
  },
  {
    id: "AV-034",
    client: "Yasmine B.",
    boutique: "Isabel Marant",
    produit: "Robe Milena",
    commande: "LV-00390",
    note: 4,
    date: "16/04/2026",
    commentaire:
      "Belle robe, qualité au rendez-vous. Livraison dans les temps. Petit bémol sur la couture.",
    reponse: null,
    signale: false,
    statut: "en_attente",
  },
  {
    id: "AV-033",
    client: "Karim T.",
    boutique: "AMI Paris",
    produit: "Pull Alexandre",
    commande: "LV-00411",
    note: 5,
    date: "10/04/2026",
    commentaire:
      "Commande parfaite, livraison en 52 minutes. Qualité irréprochable. Je recommande sans hésitation.",
    reponse: null,
    signale: false,
    statut: "en_attente",
  },
];

const STATUT_CFG = {
  publié: { label: "Publié", color: "#2e8b57", bg: "#e8f5ee", dot: "#10B981" },
  en_attente: {
    label: "En attente",
    color: "#b7770d",
    bg: "#faeeda",
    dot: "#F59E0B",
  },
  signalé: {
    label: "Signalé",
    color: "#c0392b",
    bg: "#fef2f2",
    dot: "#EF4444",
  },
  masqué: { label: "Masqué", color: "#6B7280", bg: "#f3f4f6", dot: "#9CA3AF" },
};

const BOUTIQUES = ["Sandro Paris", "AMI Paris", "Isabel Marant", "By Terry"];

function Stars({ note }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{ fontSize: "14px", color: i <= note ? "#F59E0B" : "#E5E7EB" }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function NoteBar({ note, total, count }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "4px",
      }}
    >
      <span style={{ fontSize: "11px", color: "var(--gray)", width: "8px" }}>
        {note}
      </span>
      <span style={{ fontSize: "11px", color: "#F59E0B" }}>★</span>
      <div
        style={{
          flex: 1,
          height: 6,
          background: "var(--white-3)",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: "#F59E0B",
            borderRadius: "6px",
            transition: "width 0.4s",
          }}
        />
      </div>
      <span
        style={{
          fontSize: "11px",
          color: "var(--gray)",
          width: "28px",
          textAlign: "right",
        }}
      >
        {count}
      </span>
    </div>
  );
}

export default function Avis() {
  const [avis, setAvis] = useState(AVIS_DATA);
  const [selected, setSelected] = useState(null);
  const [filterNote, setFilterNote] = useState("all");
  const [filterStatut, setFilterStatut] = useState("all");
  const [filterBoutique, setFilterBoutique] = useState("all");
  const [search, setSearch] = useState("");
  const [reponseText, setReponseText] = useState("");
  const [showReponse, setShowReponse] = useState(false);

  const av = selected ? avis.find((a) => a.id === selected) : null;

  const filtres = avis.filter((a) => {
    return (
      (filterNote === "all" || a.note === parseInt(filterNote)) &&
      (filterStatut === "all" || a.statut === filterStatut) &&
      (filterBoutique === "all" || a.boutique === filterBoutique) &&
      (a.client.toLowerCase().includes(search.toLowerCase()) ||
        a.boutique.toLowerCase().includes(search.toLowerCase()) ||
        a.commentaire.toLowerCase().includes(search.toLowerCase()) ||
        a.id.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const stats = {
    total: avis.length,
    moyenne: (avis.reduce((s, a) => s + a.note, 0) / avis.length).toFixed(1),
    publies: avis.filter((a) => a.statut === "publié").length,
    signales: avis.filter((a) => a.statut === "signalé").length,
    enAttente: avis.filter((a) => a.statut === "en_attente").length,
    sansReponse: avis.filter((a) => !a.reponse && a.statut === "publié").length,
    parNote: [5, 4, 3, 2, 1].map((n) => ({
      note: n,
      count: avis.filter((a) => a.note === n).length,
    })),
  };

  const changerStatut = (id, statut) => {
    setAvis((prev) => prev.map((a) => (a.id === id ? { ...a, statut } : a)));
    toast.success(`Avis : ${STATUT_CFG[statut].label}`);
  };

  const publierReponse = () => {
    if (!reponseText.trim()) {
      toast.error("Réponse vide");
      return;
    }
    setAvis((prev) =>
      prev.map((a) =>
        a.id === selected ? { ...a, reponse: reponseText.trim() } : a
      )
    );
    setReponseText("");
    setShowReponse(false);
    toast.success("Réponse publiée");
  };

  const noteColor = (n) =>
    n >= 4 ? "#2e8b57" : n === 3 ? "#b7770d" : "#c0392b";

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
          Avis clients
        </h1>
        <p style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}>
          Modération des avis, réponses et suivi des notes par boutique
        </p>
      </div>

      {/* KPIs + Distribution notes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 280px",
          gap: "14px",
          marginBottom: "28px",
        }}
      >
        {[
          { label: "Total avis", val: stats.total, color: "var(--noir)" },
          {
            label: "Note moyenne",
            val: `★ ${stats.moyenne}`,
            color: "#F59E0B",
          },
          { label: "Signalés", val: stats.signales, color: "#c0392b" },
          { label: "En attente", val: stats.enAttente, color: "#b7770d" },
          { label: "Sans réponse", val: stats.sansReponse, color: "#185fa5" },
        ].map((k) => (
          <div
            key={k.label}
            style={{
              background: "#fff",
              borderRadius: "var(--radius-md)",
              padding: "18px 20px",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--white-3)",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: "700",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
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
              }}
            >
              {k.val}
            </div>
          </div>
        ))}
        {/* Distribution */}
        <div
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
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--gray)",
              marginBottom: "10px",
            }}
          >
            Distribution
          </div>
          {stats.parNote.map((n) => (
            <NoteBar
              key={n.note}
              note={n.note}
              count={n.count}
              total={stats.total}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 420px",
          gap: "20px",
        }}
      >
        {/* Liste avis */}
        <div
          style={{
            background: "#fff",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--white-3)",
            display: "flex",
            flexDirection: "column",
            maxHeight: "calc(100vh - 290px)",
            overflow: "hidden",
          }}
        >
          {/* Filtres */}
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid var(--white-3)",
            }}
          >
            <input
              type="text"
              placeholder="Client, boutique, commentaire…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid var(--white-3)",
                borderRadius: "var(--radius-sm)",
                fontSize: "13px",
                background: "var(--gray-bg)",
                outline: "none",
                marginBottom: "10px",
              }}
            />
            <div
              style={{
                display: "flex",
                gap: "5px",
                flexWrap: "wrap",
                marginBottom: "6px",
              }}
            >
              <button
                onClick={() => setFilterStatut("all")}
                style={fBtn(filterStatut === "all")}
              >
                Tous
              </button>
              {Object.entries(STATUT_CFG).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setFilterStatut(k)}
                  style={fBtn(filterStatut === k, v.color, v.bg)}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              <button
                onClick={() => setFilterNote("all")}
                style={fBtn(filterNote === "all")}
              >
                Toutes notes
              </button>
              {[5, 4, 3, 2, 1].map((n) => (
                <button
                  key={n}
                  onClick={() =>
                    setFilterNote(
                      n === parseInt(filterNote) ? "all" : String(n)
                    )
                  }
                  style={fBtn(filterNote === String(n), noteColor(n))}
                >
                  {"★".repeat(n)}
                </button>
              ))}
              <select
                value={filterBoutique}
                onChange={(e) => setFilterBoutique(e.target.value)}
                style={{
                  padding: "4px 8px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: "600",
                  border: "1.5px solid var(--white-3)",
                  background: "transparent",
                  color: "var(--gray)",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="all">Toutes boutiques</option>
                {BOUTIQUES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtres.map((a) => {
              const sc = STATUT_CFG[a.statut];
              const isActive = selected === a.id;
              return (
                <div
                  key={a.id}
                  onClick={() => {
                    setSelected(isActive ? null : a.id);
                    setShowReponse(false);
                  }}
                  style={{
                    padding: "14px 18px",
                    borderBottom: "1px solid var(--white-3)",
                    cursor: "pointer",
                    background: isActive
                      ? "rgba(201,169,110,0.06)"
                      : a.statut === "signalé"
                      ? "rgba(192,57,43,0.02)"
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
                      alignItems: "flex-start",
                      marginBottom: "6px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Stars note={a.note} />
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: noteColor(a.note),
                        }}
                      >
                        {a.note}/5
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        background: sc.bg,
                        color: sc.color,
                      }}
                    >
                      {sc.label}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      marginBottom: "3px",
                    }}
                  >
                    {a.client}{" "}
                    <span style={{ fontWeight: "400", color: "var(--gray)" }}>
                      — {a.boutique}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--gray)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginBottom: "4px",
                    }}
                  >
                    {a.commentaire}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "11px",
                      color: "var(--gray-light)",
                    }}
                  >
                    <span>{a.produit}</span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {a.reponse && (
                        <span style={{ color: "#2e8b57", fontWeight: "600" }}>
                          ✓ Répondu
                        </span>
                      )}
                      {a.signale && (
                        <span style={{ color: "#c0392b", fontWeight: "600" }}>
                          ⚠ Signalé
                        </span>
                      )}
                      <span>{a.date}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtres.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px",
                  color: "var(--gray)",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>⭐</div>
                <div style={{ fontSize: "13px" }}>Aucun avis trouvé</div>
              </div>
            )}
          </div>
        </div>

        {/* Détail avis */}
        {!av ? (
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--white-3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--gray)",
              minHeight: "300px",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⭐</div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "22px",
                fontWeight: "300",
                marginBottom: "8px",
              }}
            >
              Sélectionnez un avis
            </div>
            <div style={{ fontSize: "13px" }}>
              Cliquez pour modérer et répondre
            </div>
          </div>
        ) : (
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-sm)",
              border: `1px solid ${
                av.statut === "signalé" ? "#fecaca" : "var(--white-3)"
              }`,
              display: "flex",
              flexDirection: "column",
              maxHeight: "calc(100vh - 290px)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "18px 22px",
                borderBottom: "1px solid var(--white-3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "4px",
                    }}
                  >
                    <Stars note={av.note} />
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: noteColor(av.note),
                      }}
                    >
                      {av.note}/5
                    </span>
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: "500" }}>
                    {av.client}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--gray)" }}>
                    {av.boutique} · {av.produit} · {av.date}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    background: STATUT_CFG[av.statut].bg,
                    color: STATUT_CFG[av.statut].color,
                  }}
                >
                  {STATUT_CFG[av.statut].label}
                </span>
              </div>
              {/* Actions modération */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {av.statut === "en_attente" && (
                  <button
                    onClick={() => changerStatut(av.id, "publié")}
                    style={bStyle("success")}
                  >
                    ✓ Publier
                  </button>
                )}
                {av.statut !== "masqué" && av.statut !== "en_attente" && (
                  <button
                    onClick={() => changerStatut(av.id, "masqué")}
                    style={bStyle("ghost")}
                  >
                    Masquer
                  </button>
                )}
                {av.statut === "masqué" && (
                  <button
                    onClick={() => changerStatut(av.id, "publié")}
                    style={bStyle("success")}
                  >
                    Republier
                  </button>
                )}
                {av.statut !== "signalé" && (
                  <button
                    onClick={() => changerStatut(av.id, "signalé")}
                    style={bStyle("error")}
                  >
                    Signaler
                  </button>
                )}
                {av.statut === "signalé" && (
                  <>
                    <button
                      onClick={() => changerStatut(av.id, "publié")}
                      style={bStyle("success")}
                    >
                      Valider (publier)
                    </button>
                    <button
                      onClick={() => changerStatut(av.id, "masqué")}
                      style={bStyle("error")}
                    >
                      Masquer définitivement
                    </button>
                  </>
                )}
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "18px 22px" }}>
              {/* Commentaire */}
              <div style={{ marginBottom: "20px" }}>
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
                  Commentaire client
                </div>
                <div
                  style={{
                    background: "var(--gray-bg)",
                    borderRadius: "var(--radius-md)",
                    padding: "14px 16px",
                    fontSize: "13px",
                    lineHeight: 1.7,
                    color: "var(--noir)",
                    border: "1px solid var(--white-3)",
                    fontStyle: "italic",
                  }}
                >
                  « {av.commentaire} »
                </div>
              </div>

              {/* Réponse existante */}
              {av.reponse && (
                <div style={{ marginBottom: "20px" }}>
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
                    Réponse LIVRR
                  </div>
                  <div
                    style={{
                      background: "rgba(201,169,110,0.06)",
                      border: "1px solid rgba(201,169,110,0.2)",
                      borderRadius: "var(--radius-md)",
                      padding: "14px 16px",
                      fontSize: "13px",
                      lineHeight: 1.7,
                      color: "var(--noir)",
                    }}
                  >
                    {av.reponse}
                  </div>
                </div>
              )}

              {/* Zone réponse */}
              {!av.reponse && (
                <div>
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
                    Répondre au nom de LIVRR
                  </div>
                  {!showReponse ? (
                    <button
                      onClick={() => setShowReponse(true)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "12px",
                        fontWeight: "600",
                        border: "1.5px dashed var(--gold)",
                        background: "rgba(201,169,110,0.04)",
                        color: "var(--gold-dark)",
                        cursor: "pointer",
                      }}
                    >
                      + Rédiger une réponse
                    </button>
                  ) : (
                    <div>
                      <textarea
                        value={reponseText}
                        onChange={(e) => setReponseText(e.target.value)}
                        placeholder="Réponse officielle LIVRR…"
                        rows={4}
                        autoFocus
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "1.5px solid var(--gold)",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "13px",
                          resize: "none",
                          outline: "none",
                          marginBottom: "8px",
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          onClick={() => {
                            setShowReponse(false);
                            setReponseText("");
                          }}
                          style={bStyle("ghost")}
                        >
                          Annuler
                        </button>
                        <button onClick={publierReponse} style={bStyle("gold")}>
                          Publier la réponse
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Infos commande */}
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
                    marginBottom: "8px",
                  }}
                >
                  Infos commande
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                  }}
                >
                  {[
                    { label: "Réf. commande", val: av.commande },
                    { label: "ID avis", val: av.id },
                    { label: "Boutique", val: av.boutique },
                    { label: "Produit", val: av.produit },
                  ].map((r) => (
                    <div
                      key={r.label}
                      style={{
                        background: "var(--gray-bg)",
                        borderRadius: "var(--radius-sm)",
                        padding: "8px 10px",
                        border: "1px solid var(--white-3)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          color: "var(--gray)",
                          marginBottom: "2px",
                        }}
                      >
                        {r.label}
                      </div>
                      <div style={{ fontSize: "12px", fontWeight: "500" }}>
                        {r.val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
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
    error: {
      background: "#fef2f2",
      color: "var(--error)",
      border: "1.5px solid #fecaca",
    },
    success: {
      background: "#e8f5ee",
      color: "#2e8b57",
      border: "1.5px solid #bbf7d0",
    },
  };
  return {
    padding: "7px 14px",
    borderRadius: "var(--radius-sm)",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    ...s[t],
  };
}
