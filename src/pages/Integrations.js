import React, { useState } from "react";
import toast from "react-hot-toast";

// ── Mock Data ──────────────────────────────────────────────
const PARTENAIRES_DATA = [
  {
    id: "coursier_fr",
    nom: "Coursier.fr",
    type: "logistique",
    logo: "🛵",
    statut: "connecté",
    environnement: "production",
    apiUrl: "https://api.coursier.fr/v2",
    apiKey: "crf_live_••••••••••••4a2f",
    webhook: "https://api.livrr.fr/webhooks/coursier-fr",
    latence: "42ms",
    uptime: "99.8%",
    derniereSync: "Il y a 2 min",
    coursiers: 3,
    livraisons30j: 312,
    delaiMoyen: "44 min",
    events: [
      { type: "livraison.prise_en_charge", actif: true },
      { type: "livraison.en_route", actif: true },
      { type: "livraison.livrée", actif: true },
      { type: "livraison.incident", actif: true },
      { type: "coursier.disponible", actif: true },
    ],
    logs: [
      {
        heure: "14:35",
        event: "livraison.livrée",
        commande: "LV-00407",
        statut: "200 OK",
      },
      {
        heure: "14:22",
        event: "livraison.en_route",
        commande: "LV-00412",
        statut: "200 OK",
      },
      {
        heure: "14:12",
        event: "livraison.prise_en_charge",
        commande: "LV-00412",
        statut: "200 OK",
      },
      {
        heure: "13:58",
        event: "livraison.incident",
        commande: "LV-00409",
        statut: "200 OK",
      },
      {
        heure: "13:45",
        event: "livraison.livrée",
        commande: "LV-00406",
        statut: "200 OK",
      },
    ],
    contact: {
      nom: "Équipe API Coursier.fr",
      email: "api@coursier.fr",
      tel: "+33 1 23 45 67 89",
    },
  },
  {
    id: "top_chrono",
    nom: "Top Chrono",
    type: "logistique",
    logo: "⚡",
    statut: "connecté",
    environnement: "production",
    apiUrl: "https://api.topchrono.fr/v1",
    apiKey: "tch_prod_••••••••••••8b3c",
    webhook: "https://api.livrr.fr/webhooks/top-chrono",
    latence: "67ms",
    uptime: "99.2%",
    derniereSync: "Il y a 8 min",
    coursiers: 2,
    livraisons30j: 198,
    delaiMoyen: "51 min",
    events: [
      { type: "livraison.prise_en_charge", actif: true },
      { type: "livraison.en_route", actif: true },
      { type: "livraison.livrée", actif: true },
      { type: "livraison.incident", actif: true },
      { type: "coursier.disponible", actif: false },
    ],
    logs: [
      {
        heure: "14:19",
        event: "livraison.en_route",
        commande: "LV-00411",
        statut: "200 OK",
      },
      {
        heure: "13:45",
        event: "livraison.livrée",
        commande: "LV-00406",
        statut: "200 OK",
      },
      {
        heure: "13:10",
        event: "livraison.prise_en_charge",
        commande: "LV-00406",
        statut: "200 OK",
      },
      {
        heure: "12:55",
        event: "livraison.livrée",
        commande: "LV-00402",
        statut: "500 Error",
      },
      {
        heure: "12:30",
        event: "livraison.en_route",
        commande: "LV-00402",
        statut: "200 OK",
      },
    ],
    contact: {
      nom: "Support Top Chrono",
      email: "support@topchrono.fr",
      tel: "+33 1 98 76 54 32",
    },
  },
];

const STATUT_CFG = {
  connecté: {
    label: "Connecté",
    color: "#2e8b57",
    bg: "#e8f5ee",
    dot: "#10B981",
    pulse: true,
  },
  dégradé: {
    label: "Dégradé",
    color: "#b7770d",
    bg: "#faeeda",
    dot: "#F59E0B",
    pulse: false,
  },
  déconnecté: {
    label: "Déconnecté",
    color: "#c0392b",
    bg: "#fef2f2",
    dot: "#EF4444",
    pulse: false,
  },
};

export default function Integrations() {
  const [partenaires, setPartenaires] = useState(PARTENAIRES_DATA);
  const [selected, setSelected] = useState("coursier_fr");
  const [onglet, setOnglet] = useState("apercu"); // apercu | webhooks | logs | config
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newKey, setNewKey] = useState("");

  const p = partenaires.find((x) => x.id === selected);

  const testerConnexion = (id) => {
    toast.loading("Test de connexion…", { id: "test" });
    setTimeout(() => {
      toast.success(
        `Connexion ${PARTENAIRES_DATA.find((x) => x.id === id)?.nom} : OK`,
        { id: "test" }
      );
    }, 1800);
  };

  const toggleEvent = (eventType) => {
    setPartenaires((prev) =>
      prev.map((x) =>
        x.id === selected
          ? {
              ...x,
              events: x.events.map((e) =>
                e.type === eventType ? { ...e, actif: !e.actif } : e
              ),
            }
          : x
      )
    );
    toast.success("Webhook mis à jour");
  };

  const rotateKey = () => {
    if (!newKey.trim()) {
      toast.error("Saisissez la nouvelle clé");
      return;
    }
    setPartenaires((prev) =>
      prev.map((x) =>
        x.id === selected
          ? {
              ...x,
              apiKey: newKey.slice(0, 8) + "••••••••••••" + newKey.slice(-4),
            }
          : x
      )
    );
    setShowKeyModal(false);
    setNewKey("");
    toast.success("Clé API mise à jour");
  };

  const logColor = (statut) =>
    statut.startsWith("200") ? "#2e8b57" : "#c0392b";

  return (
    <div className="page" style={{ padding: "44px 52px" }}>
      {/* Header */}
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
          Intégrations logistiques
        </h1>
        <p style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}>
          Connexions API Coursier.fr et Top Chrono — webhooks et monitoring
        </p>
      </div>

      {/* Cards partenaires */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        {partenaires.map((part) => {
          const sc = STATUT_CFG[part.statut];
          const isSelected = selected === part.id;
          return (
            <div
              key={part.id}
              onClick={() => {
                setSelected(part.id);
                setOnglet("apercu");
              }}
              style={{
                background: "#fff",
                borderRadius: "var(--radius-lg)",
                padding: "22px 24px",
                boxShadow: "var(--shadow-sm)",
                border: `2px solid ${
                  isSelected ? "var(--gold)" : "var(--white-3)"
                }`,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "10px",
                      background: "var(--gray-bg)",
                      border: "1px solid var(--white-3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "22px",
                    }}
                  >
                    {part.logo}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        marginBottom: "3px",
                      }}
                    >
                      {part.nom}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--gray)" }}>
                      {part.apiUrl}
                    </div>
                  </div>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  {sc.pulse && (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: sc.dot,
                        boxShadow: `0 0 8px ${sc.dot}`,
                        animation: "pulse 2s infinite",
                      }}
                    />
                  )}
                  {!sc.pulse && (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: sc.dot,
                      }}
                    />
                  )}
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: sc.color,
                    }}
                  >
                    {sc.label}
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "10px",
                }}
              >
                {[
                  { label: "Latence", val: part.latence },
                  { label: "Uptime", val: part.uptime },
                  { label: "Coursiers", val: part.coursiers },
                  { label: "Livraisons 30j", val: part.livraisons30j },
                ].map((s) => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "var(--noir)",
                      }}
                    >
                      {s.val}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--gray)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Détail partenaire sélectionné */}
      {p && (
        <div
          style={{
            background: "#fff",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--white-3)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "18px 24px 0",
              borderBottom: "1px solid var(--white-3)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "14px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "20px",
                  fontWeight: "300",
                }}
              >
                {p.nom} — Configuration détaillée
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => testerConnexion(p.id)}
                  style={bStyle("ghost")}
                >
                  Tester la connexion
                </button>
                <button
                  onClick={() => setShowKeyModal(true)}
                  style={bStyle("gold")}
                >
                  Renouveler la clé API
                </button>
              </div>
            </div>
            <div style={{ display: "flex" }}>
              {[
                { id: "apercu", label: "Aperçu" },
                { id: "webhooks", label: `Webhooks (${p.events.length})` },
                { id: "logs", label: "Logs récents" },
                { id: "config", label: "Configuration" },
              ].map((o) => (
                <button
                  key={o.id}
                  onClick={() => setOnglet(o.id)}
                  style={{
                    padding: "8px 18px",
                    fontSize: "12px",
                    fontWeight: "600",
                    background: "none",
                    color: onglet === o.id ? "var(--gold-dark)" : "var(--gray)",
                    cursor: "pointer",
                    borderBottom:
                      onglet === o.id
                        ? "2px solid var(--gold)"
                        : "2px solid transparent",
                    marginBottom: "-1px",
                    transition: "all 0.15s",
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: "24px" }}>
            {/* Aperçu */}
            {onglet === "apercu" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "20px",
                }}
              >
                <div>
                  <STitle>Statut temps réel</STitle>
                  <IBox>
                    <IRow label="Statut" val={p.statut} />
                    <IRow label="Environnement" val={p.environnement} />
                    <IRow label="Latence" val={p.latence} />
                    <IRow label="Uptime 30j" val={p.uptime} />
                    <IRow label="Dernière sync" val={p.derniereSync} />
                  </IBox>
                </div>
                <div>
                  <STitle>Performance</STitle>
                  <IBox>
                    <IRow label="Coursiers actifs" val={p.coursiers} />
                    <IRow label="Livraisons (30j)" val={p.livraisons30j} />
                    <IRow label="Délai moyen" val={p.delaiMoyen} />
                    <IRow
                      label="Webhooks actifs"
                      val={`${p.events.filter((e) => e.actif).length}/${
                        p.events.length
                      }`}
                    />
                    <IRow
                      label="Erreurs (30j)"
                      val={
                        p.logs.filter((l) => !l.statut.startsWith("200")).length
                      }
                    />
                  </IBox>
                </div>
                <div>
                  <STitle>Contact technique</STitle>
                  <IBox>
                    <IRow label="Nom" val={p.contact.nom} />
                    <IRow label="Email" val={p.contact.email} />
                    <IRow label="Téléphone" val={p.contact.tel} />
                  </IBox>
                  <div
                    style={{
                      marginTop: "12px",
                      background: "var(--gray-bg)",
                      borderRadius: "var(--radius-sm)",
                      padding: "10px 12px",
                      border: "1px solid var(--white-3)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--gray)",
                        marginBottom: "5px",
                      }}
                    >
                      Webhook URL
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        fontFamily: "monospace",
                        color: "var(--noir)",
                        wordBreak: "break-all",
                      }}
                    >
                      {p.webhook}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Webhooks */}
            {onglet === "webhooks" && (
              <div style={{ maxWidth: "600px" }}>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--gray)",
                    marginBottom: "16px",
                    lineHeight: 1.6,
                  }}
                >
                  Les webhooks permettent à {p.nom} d'envoyer les mises à jour
                  de statut en temps réel vers LIVRR. Activez uniquement les
                  événements nécessaires.
                </div>
                {p.events.map((e) => (
                  <div
                    key={e.type}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "14px 16px",
                      borderRadius: "var(--radius-md)",
                      background: "var(--gray-bg)",
                      border: "1px solid var(--white-3)",
                      marginBottom: "8px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: "500",
                          fontFamily: "monospace",
                          marginBottom: "2px",
                          color: e.actif ? "var(--noir)" : "var(--gray-light)",
                        }}
                      >
                        {e.type}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                        {e.type === "livraison.prise_en_charge" &&
                          "Déclenché quand un coursier prend en charge la commande"}
                        {e.type === "livraison.en_route" &&
                          "Déclenché quand le coursier est en route vers le client"}
                        {e.type === "livraison.livrée" &&
                          "Déclenché à la livraison effective — met à jour le statut commande"}
                        {e.type === "livraison.incident" &&
                          "Déclenché en cas d'incident de livraison"}
                        {e.type === "coursier.disponible" &&
                          "Déclenché quand un coursier devient disponible"}
                      </div>
                    </div>
                    <div
                      onClick={() => toggleEvent(e.type)}
                      style={{
                        width: 36,
                        height: 20,
                        borderRadius: "10px",
                        background: e.actif ? "var(--gold)" : "#D1D5DB",
                        cursor: "pointer",
                        position: "relative",
                        flexShrink: 0,
                        transition: "background 0.2s",
                        marginLeft: "16px",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 3,
                          left: e.actif ? 19 : 3,
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          background: "#fff",
                          transition: "left 0.2s",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Logs */}
            {onglet === "logs" && (
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--gray)",
                    marginBottom: "14px",
                  }}
                >
                  Derniers événements reçus depuis {p.nom}
                </div>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "13px",
                  }}
                >
                  <thead>
                    <tr style={{ background: "var(--gray-bg)" }}>
                      {["Heure", "Événement", "Commande", "Statut HTTP"].map(
                        (h) => (
                          <th
                            key={h}
                            style={{
                              padding: "10px 14px",
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
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {p.logs.map((l, i) => (
                      <tr
                        key={i}
                        style={{
                          borderBottom: "1px solid var(--white-3)",
                          background: !l.statut.startsWith("200")
                            ? "rgba(192,57,43,0.02)"
                            : "transparent",
                        }}
                      >
                        <td
                          style={{
                            padding: "11px 14px",
                            fontFamily: "monospace",
                            fontSize: "12px",
                            color: "var(--gray)",
                          }}
                        >
                          {l.heure}
                        </td>
                        <td
                          style={{
                            padding: "11px 14px",
                            fontFamily: "monospace",
                            fontSize: "12px",
                            color: "var(--noir)",
                          }}
                        >
                          {l.event}
                        </td>
                        <td
                          style={{
                            padding: "11px 14px",
                            fontWeight: "600",
                            color: "var(--gold-dark)",
                            fontSize: "12px",
                          }}
                        >
                          {l.commande}
                        </td>
                        <td style={{ padding: "11px 14px" }}>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              fontFamily: "monospace",
                              padding: "2px 8px",
                              borderRadius: "10px",
                              background: l.statut.startsWith("200")
                                ? "#e8f5ee"
                                : "#fef2f2",
                              color: logColor(l.statut),
                            }}
                          >
                            {l.statut}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {p.logs.some((l) => !l.statut.startsWith("200")) && (
                  <div
                    style={{
                      marginTop: "14px",
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: "var(--radius-sm)",
                      padding: "10px 14px",
                      fontSize: "12px",
                      color: "#c0392b",
                    }}
                  >
                    ⚠ Des erreurs ont été détectées. Vérifiez la configuration
                    du webhook et contactez {p.contact.email}.
                  </div>
                )}
              </div>
            )}

            {/* Config */}
            {onglet === "config" && (
              <div style={{ maxWidth: "560px" }}>
                {[
                  { label: "URL de l'API", val: p.apiUrl },
                  { label: "Clé API (masquée)", val: p.apiKey },
                  { label: "URL Webhook LIVRR", val: p.webhook },
                  { label: "Environnement", val: p.environnement },
                ].map((r) => (
                  <div key={r.label} style={{ marginBottom: "14px" }}>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "var(--gray)",
                        marginBottom: "6px",
                      }}
                    >
                      {r.label}
                    </div>
                    <div
                      style={{
                        background: "var(--gray-bg)",
                        border: "1px solid var(--white-3)",
                        borderRadius: "var(--radius-sm)",
                        padding: "10px 14px",
                        fontSize: "13px",
                        fontFamily: "monospace",
                        color: "var(--noir)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ wordBreak: "break-all" }}>{r.val}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(r.val);
                          toast.success("Copié !");
                        }}
                        style={{
                          marginLeft: "8px",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "10px",
                          fontWeight: "600",
                          border: "1px solid var(--white-3)",
                          background: "#fff",
                          color: "var(--gray)",
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                      >
                        Copier
                      </button>
                    </div>
                  </div>
                ))}
                <div
                  style={{
                    marginTop: "20px",
                    background: "#fffbeb",
                    border: "1px solid #fde68a",
                    borderRadius: "var(--radius-sm)",
                    padding: "12px 14px",
                    fontSize: "12px",
                    color: "#b7770d",
                    lineHeight: 1.6,
                  }}
                >
                  ⚠ Ne partagez jamais votre clé API. En cas de compromission,
                  utilisez "Renouveler la clé API" immédiatement.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal : renouveler clé */}
      {showKeyModal && (
        <div style={OVL} onClick={() => setShowKeyModal(false)}>
          <div
            style={{ ...MDL, width: "440px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: "300",
                marginBottom: "6px",
              }}
            >
              Renouveler la clé API
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "20px",
              }}
            >
              {p?.nom} — Ancienne clé : {p?.apiKey}
            </p>
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "var(--radius-sm)",
                padding: "10px 14px",
                fontSize: "12px",
                color: "#c0392b",
                marginBottom: "16px",
              }}
            >
              ⚠ Le renouvellement invalidera immédiatement l'ancienne clé.
              Assurez-vous d'avoir obtenu la nouvelle clé auprès de {p?.nom}{" "}
              avant de continuer.
            </div>
            <label style={LBL}>Nouvelle clé API *</label>
            <input
              type="text"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="Collez la nouvelle clé API ici…"
              autoFocus
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1.5px solid var(--white-3)",
                borderRadius: "var(--radius-sm)",
                fontSize: "13px",
                fontFamily: "monospace",
                outline: "none",
                marginBottom: "20px",
              }}
            />
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowKeyModal(false)}
                style={bStyle("ghost")}
              >
                Annuler
              </button>
              <button onClick={rotateKey} style={bStyle("gold")}>
                Confirmer le renouvellement
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.3)} }`}</style>
    </div>
  );
}

function STitle({ children }) {
  return (
    <div
      style={{
        fontSize: "10px",
        fontWeight: "700",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--gray)",
        marginBottom: "10px",
      }}
    >
      {children}
    </div>
  );
}
function IBox({ children }) {
  return (
    <div
      style={{
        background: "var(--gray-bg)",
        borderRadius: "var(--radius-md)",
        padding: "14px 16px",
        border: "1px solid var(--white-3)",
      }}
    >
      {children}
    </div>
  );
}
function IRow({ label, val }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "7px",
        gap: "12px",
      }}
    >
      <span style={{ fontSize: "12px", color: "var(--gray)", flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontSize: "12px", fontWeight: "500", textAlign: "right" }}>
        {val}
      </span>
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
