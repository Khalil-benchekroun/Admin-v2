import React, { useState } from "react";
import toast from "react-hot-toast";

const DOSSIERS_DATA = [
  {
    id: "ONB-005",
    boutique: "Rouje",
    email: "bonjour@rouje.com",
    responsable: "Jeanne D.",
    telephone: "+33 6 12 34 56 78",
    adresse: "18 Rue du Dragon, 75006 Paris",
    siret: "88123456700012",
    plan: "classic",
    dateInscription: "08/04/2026",
    statut: "en_cours",
    checklist: {
      infos_legales: true,
      rib: true,
      contrat: false,
      catalogue: false,
      photos_boutique: false,
      horaires: true,
    },
    notes: "En attente du contrat signé et du catalogue initial.",
    historique: [
      { action: "Inscription via lien INV-012", par: "Rouje", heure: "10:05", date: "08/04/2026" },
      { action: "Dossier créé — validation en cours", par: "Système", heure: "10:05", date: "08/04/2026" },
      { action: "Infos légales vérifiées ✓", par: "Khalil B.", heure: "14:30", date: "09/04/2026" },
      { action: "RIB validé ✓", par: "Khalil B.", heure: "14:32", date: "09/04/2026" },
    ],
  },
  {
    id: "ONB-004",
    boutique: "Maison Kitsuné",
    email: "retail@maisonkitsune.com",
    responsable: "Sophie L.",
    telephone: "+33 6 98 76 54 32",
    adresse: "52 Rue Richelieu, 75001 Paris",
    siret: "77234567800023",
    plan: "signature",
    dateInscription: "11/04/2026",
    statut: "en_attente_signature",
    checklist: {
      infos_legales: true,
      rib: true,
      contrat: false,
      catalogue: true,
      photos_boutique: true,
      horaires: true,
    },
    notes: "Contrat envoyé le 12/04 — en attente de signature DocuSign.",
    historique: [
      { action: "Inscription via lien INV-011", par: "Maison Kitsuné", heure: "09:20", date: "11/04/2026" },
      { action: "Dossier créé", par: "Système", heure: "09:20", date: "11/04/2026" },
      { action: "Dossier complet vérifié", par: "Khalil B.", heure: "11:00", date: "12/04/2026" },
      { action: "Contrat envoyé via DocuSign", par: "Khalil B.", heure: "11:15", date: "12/04/2026" },
    ],
  },
  {
    id: "ONB-003",
    boutique: "Sandro Paris",
    email: "contact@sandro.fr",
    responsable: "Marie Leclerc",
    telephone: "+33 1 45 67 89 00",
    adresse: "22 Rue des Francs-Bourgeois, 75004 Paris",
    siret: "44123456700001",
    plan: "prestige",
    dateInscription: "10/01/2026",
    statut: "activé",
    checklist: {
      infos_legales: true,
      rib: true,
      contrat: true,
      catalogue: true,
      photos_boutique: true,
      horaires: true,
    },
    notes: "Boutique partenaire Day 1. Tout validé.",
    historique: [
      { action: "Inscription", par: "Sandro Paris", heure: "09:00", date: "10/01/2026" },
      { action: "Dossier validé et boutique activée", par: "Khalil B.", heure: "16:00", date: "12/01/2026" },
    ],
  },
];

const CHECKLIST_CFG = {
  infos_legales:  { label: "Informations légales (SIRET, adresse)", required: true },
  rib:            { label: "RIB / Coordonnées bancaires", required: true },
  contrat:        { label: "Contrat LIVRR signé", required: true },
  catalogue:      { label: "Catalogue initial importé (min. 5 produits)", required: true },
  photos_boutique:{ label: "Photos de la boutique", required: false },
  horaires:       { label: "Horaires d'ouverture configurés", required: true },
};

const STATUT_CFG = {
  en_cours:             { label: "En cours",         color: "#185fa5", bg: "#eff6ff", dot: "#3B82F6" },
  en_attente_signature: { label: "Attente signature", color: "#b7770d", bg: "#faeeda", dot: "#F59E0B" },
  activé:               { label: "Activé ✓",         color: "#2e8b57", bg: "#e8f5ee", dot: "#10B981" },
  refusé:               { label: "Refusé",            color: "#c0392b", bg: "#fef2f2", dot: "#EF4444" },
};

const PLAN_CFG = {
  classic:   { label: "Classic",   color: "#6B7280" },
  signature: { label: "Signature", color: "#3B82F6" },
  prestige:  { label: "Prestige",  color: "#C9A96E" },
};

export default function OnboardingAdmin() {
  const [dossiers, setDossiers] = useState(DOSSIERS_DATA);
  const [selected, setSelected] = useState("ONB-005");
  const [filterStatut, setFilterStatut] = useState("all");
  const [showRefusModal, setShowRefusModal] = useState(false);
  const [refusMotif, setRefusMotif] = useState("");
  const [noteText, setNoteText] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  const dos = dossiers.find((d) => d.id === selected);

  const filtres = dossiers.filter(
    (d) => filterStatut === "all" || d.statut === filterStatut
  );

  const stats = {
    total: dossiers.length,
    enCours: dossiers.filter((d) => d.statut === "en_cours").length,
    attenteSig: dossiers.filter((d) => d.statut === "en_attente_signature").length,
    activés: dossiers.filter((d) => d.statut === "activé").length,
  };

  const checklistComplete = (checklist) =>
    Object.entries(CHECKLIST_CFG)
      .filter(([, v]) => v.required)
      .every(([k]) => checklist[k]);

  // ✅ POINT 7 — toggleCheck met à jour les notes automatiquement
  const toggleCheck = (key) => {
    if (dos?.statut === "activé") return;
    setDossiers((prev) =>
      prev.map((d) => {
        if (d.id !== selected) return d;
        const nouvelleValeur = !d.checklist[key];
        const actionLabel = `${CHECKLIST_CFG[key].label} — ${nouvelleValeur ? "validé ✓" : "dévalidé"}`;
        const noteAuto = `${actionLabel} le ${today()} à ${now()}`;
        return {
          ...d,
          checklist: { ...d.checklist, [key]: nouvelleValeur },
          // ✅ Note interne générée automatiquement à chaque toggle
          notes: d.notes ? d.notes + "\n" + noteAuto : noteAuto,
          historique: [
            ...d.historique,
            { action: actionLabel, par: "Khalil B.", heure: now(), date: today() },
          ],
        };
      })
    );
  };

  const activerBoutique = () => {
    if (!checklistComplete(dos.checklist)) {
      toast.error("Complétez tous les éléments obligatoires avant d'activer");
      return;
    }
    setDossiers((prev) =>
      prev.map((d) =>
        d.id === selected
          ? {
              ...d,
              statut: "activé",
              historique: [
                ...d.historique,
                { action: "Boutique activée sur la plateforme", par: "Khalil B.", heure: now(), date: today() },
              ],
            }
          : d
      )
    );
    toast.success("Boutique activée — visible sur la plateforme");
  };

  const refuserDossier = () => {
    if (!refusMotif.trim()) { toast.error("Motif obligatoire"); return; }
    setDossiers((prev) =>
      prev.map((d) =>
        d.id === selected
          ? {
              ...d,
              statut: "refusé",
              notes: d.notes + `\nRefus : ${refusMotif}`,
              historique: [
                ...d.historique,
                { action: `Dossier refusé — ${refusMotif}`, par: "Khalil B.", heure: now(), date: today() },
              ],
            }
          : d
      )
    );
    setShowRefusModal(false);
    setRefusMotif("");
    toast.success("Dossier refusé — boutique notifiée");
  };

  const ajouterNote = () => {
    if (!noteText.trim()) return;
    setDossiers((prev) =>
      prev.map((d) =>
        d.id === selected
          ? { ...d, notes: d.notes ? d.notes + "\n" + noteText.trim() : noteText.trim() }
          : d
      )
    );
    setNoteText("");
    setShowNoteInput(false);
    toast.success("Note ajoutée");
  };

  return (
    <div className="page" style={{ padding: "44px 52px" }}>
      <div style={{ marginBottom: "36px" }}>
        <div style={SUPRA}>Administration</div>
        <h1 style={H1}>Onboarding boutiques</h1>
        <p style={SUB}>Validation des dossiers partenaires et activation sur la plateforme</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "28px" }}>
        {[
          { label: "Total dossiers",   val: stats.total,      color: "var(--noir)" },
          { label: "En cours",         val: stats.enCours,    color: "#185fa5" },
          { label: "Attente signature", val: stats.attenteSig, color: "#b7770d" },
          { label: "Activés",          val: stats.activés,    color: "#2e8b57" },
        ].map((k) => (
          <div key={k.label} style={kpiCard}>
            <div style={kpiLabel}>{k.label}</div>
            <div style={{ ...kpiVal, color: k.color }}>{k.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "20px" }}>
        {/* Liste */}
        <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--white-3)", overflow: "hidden" }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--white-3)" }}>
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              <button onClick={() => setFilterStatut("all")} style={fBtn(filterStatut === "all")}>Tous</button>
              {Object.entries(STATUT_CFG).map(([k, v]) => (
                <button key={k} onClick={() => setFilterStatut(k)} style={fBtn(filterStatut === k, v.color, v.bg)}>{v.label}</button>
              ))}
            </div>
          </div>
          {filtres.map((d) => {
            const sc = STATUT_CFG[d.statut];
            const pc = PLAN_CFG[d.plan];
            const done = Object.values(d.checklist).filter(Boolean).length;
            const total = Object.keys(d.checklist).length;
            const isActive = selected === d.id;
            return (
              <div key={d.id} onClick={() => setSelected(d.id)} style={{ padding: "14px 16px", borderBottom: "1px solid var(--white-3)", cursor: "pointer", background: isActive ? "rgba(201,169,110,0.06)" : "transparent", borderLeft: isActive ? "3px solid var(--gold)" : "3px solid transparent", transition: "all 0.15s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "500" }}>{d.boutique}</span>
                  <span style={{ fontSize: "10px", fontWeight: "600", padding: "2px 8px", borderRadius: "12px", background: sc.bg, color: sc.color }}>{sc.label}</span>
                </div>
                <div style={{ fontSize: "11px", color: "var(--gray)", marginBottom: "6px" }}>
                  {d.responsable} · <span style={{ color: pc.color, fontWeight: "600" }}>{pc.label}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ flex: 1, height: 4, background: "var(--white-3)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(done / total) * 100}%`, background: done === total ? "#10B981" : "var(--gold)", borderRadius: "4px" }} />
                  </div>
                  <span style={{ fontSize: "10px", color: "var(--gray)", whiteSpace: "nowrap" }}>{done}/{total}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Détail */}
        {dos && (
          <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--white-3)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 28px", borderBottom: "1px solid var(--white-3)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: "300", marginBottom: "6px" }}>{dos.boutique}</div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "20px", background: STATUT_CFG[dos.statut].bg, color: STATUT_CFG[dos.statut].color }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: STATUT_CFG[dos.statut].dot, display: "inline-block", marginRight: "5px" }} />
                    {STATUT_CFG[dos.statut].label}
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "20px", background: `rgba(${PLAN_CFG[dos.plan].color === "#C9A96E" ? "201,169,110" : PLAN_CFG[dos.plan].color === "#3B82F6" ? "59,130,246" : "107,114,128"},0.1)`, color: PLAN_CFG[dos.plan].color }}>
                    {PLAN_CFG[dos.plan].label}
                  </span>
                </div>
              </div>

              {dos.statut !== "activé" && dos.statut !== "refusé" && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setShowRefusModal(true)} style={bStyle("error")}>Refuser</button>

                  {dos.statut === "en_cours" && !dos.checklist.contrat && (
                    <button
                      onClick={() => {
                        setDossiers((prev) => prev.map((d) => d.id === selected ? { ...d, statut: "en_attente_signature", historique: [...d.historique, { action: "Contrat envoyé via DocuSign", par: "Khalil B.", heure: now(), date: today() }] } : d));
                        toast.success("📧 Contrat DocuSign envoyé à " + dos.responsable);
                      }}
                      style={{ ...bStyle("ghost"), borderColor: "#185fa5", color: "#185fa5" }}
                    >
                      📝 Envoyer contrat DocuSign
                    </button>
                  )}

                  {dos.statut === "en_attente_signature" && (
                    <button
                      onClick={() => {
                        setDossiers((prev) => prev.map((d) => d.id === selected ? { ...d, checklist: { ...d.checklist, contrat: true }, statut: "en_cours", notes: d.notes ? d.notes + `\nContrat LIVRR signé — validé le ${today()} à ${now()}` : `Contrat LIVRR signé — validé le ${today()} à ${now()}`, historique: [...d.historique, { action: "Contrat signé ✓ — DocuSign confirmé", par: "Système", heure: now(), date: today() }] } : d));
                        toast.success("✅ Contrat signé confirmé");
                      }}
                      style={{ ...bStyle("ghost"), borderColor: "#2e8b57", color: "#2e8b57" }}
                    >
                      ✓ Marquer contrat signé
                    </button>
                  )}

                  {/* ✅ POINT 7 — Toujours "Activer la boutique", grisé si incomplet */}
                  <button
                    onClick={checklistComplete(dos.checklist) ? activerBoutique : undefined}
                    disabled={!checklistComplete(dos.checklist)}
                    title={!checklistComplete(dos.checklist) ? "Complétez tous les éléments obligatoires pour activer" : ""}
                    style={{
                      ...bStyle("gold"),
                      opacity: checklistComplete(dos.checklist) ? 1 : 0.45,
                      cursor: checklistComplete(dos.checklist) ? "pointer" : "not-allowed",
                      filter: checklistComplete(dos.checklist) ? "none" : "grayscale(30%)",
                    }}
                  >
                    🚀 Activer la boutique
                  </button>
                </div>
              )}
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                <div>
                  <STitle>Informations</STitle>
                  <IBox>
                    <IRow label="Responsable" val={dos.responsable} />
                    <IRow label="Email" val={dos.email} />
                    <IRow label="Téléphone" val={dos.telephone} />
                    <IRow label="Adresse" val={dos.adresse} />
                    <IRow label="SIRET" val={dos.siret} mono />
                    <IRow label="Inscription" val={dos.dateInscription} />
                  </IBox>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <STitle style={{ margin: 0 }}>Checklist validation</STitle>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: checklistComplete(dos.checklist) ? "#2e8b57" : "#b7770d" }}>
                      {Object.values(dos.checklist).filter(Boolean).length}/{Object.keys(dos.checklist).length} éléments
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {Object.entries(CHECKLIST_CFG).map(([key, cfg]) => (
                      <div key={key} onClick={() => toggleCheck(key)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "var(--radius-sm)", background: dos.checklist[key] ? "#e8f5ee" : "var(--gray-bg)", border: `1px solid ${dos.checklist[key] ? "#bbf7d0" : "var(--white-3)"}`, cursor: dos.statut !== "activé" ? "pointer" : "default", transition: "all 0.15s" }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: dos.checklist[key] ? "#10B981" : "var(--white-3)", border: `2px solid ${dos.checklist[key] ? "#10B981" : "var(--gray-light)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {dos.checklist[key] && <span style={{ color: "#fff", fontSize: "11px", fontWeight: "800" }}>✓</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: "12px", fontWeight: "500", color: dos.checklist[key] ? "#2e8b57" : "var(--noir)" }}>{cfg.label}</span>
                          {cfg.required && !dos.checklist[key] && (
                            <span style={{ fontSize: "10px", color: "#c0392b", marginLeft: "6px", fontWeight: "600" }}>obligatoire</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <STitle style={{ margin: 0 }}>Notes internes</STitle>
                  {!showNoteInput && (
                    <button onClick={() => setShowNoteInput(true)} style={{ fontSize: "11px", fontWeight: "600", color: "var(--gold-dark)", padding: "3px 10px", border: "1px dashed var(--gold)", borderRadius: "20px", cursor: "pointer", background: "rgba(201,169,110,0.05)" }}>
                      + Ajouter
                    </button>
                  )}
                </div>
                <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "var(--radius-md)", padding: "12px 16px", fontSize: "13px", color: dos.notes ? "var(--noir)" : "var(--gray-light)", fontStyle: dos.notes ? "normal" : "italic", whiteSpace: "pre-wrap", lineHeight: 1.6, marginBottom: showNoteInput ? "10px" : 0 }}>
                  {dos.notes || "Aucune note."}
                </div>
                {showNoteInput && (
                  <div>
                    <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Note interne…" rows={3} autoFocus style={{ width: "100%", padding: "10px 12px", border: "1.5px solid var(--gold)", borderRadius: "var(--radius-sm)", fontSize: "13px", resize: "none", outline: "none", marginBottom: "8px" }} />
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <button onClick={() => { setShowNoteInput(false); setNoteText(""); }} style={bStyle("ghost")}>Annuler</button>
                      <button onClick={ajouterNote} style={bStyle("gold")}>Enregistrer</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Historique */}
              <div>
                <STitle>Historique du dossier</STitle>
                {dos.historique.map((h, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--gold)", border: "2px solid var(--gold-lighter)", flexShrink: 0, marginTop: 2 }} />
                      {i < dos.historique.length - 1 && <div style={{ width: 1, flex: 1, background: "var(--white-3)", marginTop: 3 }} />}
                    </div>
                    <div style={{ paddingBottom: "3px" }}>
                      <div style={{ fontSize: "13px", fontWeight: "500" }}>{h.action}</div>
                      <div style={{ fontSize: "11px", color: "var(--gray)" }}>par {h.par} · {h.heure} · {h.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal refus */}
      {showRefusModal && (
        <div style={OVL} onClick={() => setShowRefusModal(false)}>
          <div style={{ ...MDL, width: "440px" }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: "300", marginBottom: "6px" }}>Refuser le dossier</h2>
            <p style={{ fontSize: "13px", color: "var(--gray)", marginBottom: "20px" }}>{dos?.boutique}</p>
            <label style={LBL}>Motif de refus *</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
              {["Dossier incomplet — documents manquants", "SIRET invalide ou introuvable", "Boutique non conforme aux critères LIVRR", "Zone géographique non couverte", "Activité non compatible avec la plateforme"].map((m) => (
                <button key={m} onClick={() => setRefusMotif(m)} style={{ textAlign: "left", padding: "9px 12px", borderRadius: "var(--radius-sm)", fontSize: "13px", border: `1.5px solid ${refusMotif === m ? "#c0392b" : "var(--white-3)"}`, background: refusMotif === m ? "#fef2f2" : "transparent", color: refusMotif === m ? "#c0392b" : "var(--noir)", cursor: "pointer", fontWeight: refusMotif === m ? "600" : "400" }}>{m}</button>
              ))}
            </div>
            <textarea value={refusMotif} onChange={(e) => setRefusMotif(e.target.value)} placeholder="Ou motif personnalisé…" rows={2} style={{ width: "100%", padding: "10px 12px", border: "1.5px solid var(--white-3)", borderRadius: "var(--radius-sm)", fontSize: "13px", resize: "none", outline: "none", marginBottom: "20px" }} />
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowRefusModal(false)} style={bStyle("ghost")}>Annuler</button>
              <button onClick={refuserDossier} style={bStyle("error")}>Confirmer le refus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function STitle({ children, style }) {
  return <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gray)", marginBottom: "10px", ...style }}>{children}</div>;
}
function IBox({ children }) {
  return <div style={{ background: "var(--gray-bg)", borderRadius: "var(--radius-md)", padding: "14px 18px", border: "1px solid var(--white-3)" }}>{children}</div>;
}
function IRow({ label, val, mono }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "7px", gap: "12px" }}>
      <span style={{ fontSize: "12px", color: "var(--gray)", flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: "12px", fontWeight: "500", textAlign: "right", fontFamily: mono ? "monospace" : "inherit" }}>{val}</span>
    </div>
  );
}
function fBtn(active, color, bg) {
  return { padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", cursor: "pointer", border: `1.5px solid ${active ? color || "var(--gold)" : "var(--white-3)"}`, background: active ? bg || "rgba(201,169,110,0.08)" : "transparent", color: active ? color || "var(--gold-dark)" : "var(--gray)" };
}
function bStyle(t) {
  const s = {
    gold:  { background: "var(--noir)", color: "var(--gold)", border: "none" },
    ghost: { background: "transparent", color: "var(--gray)", border: "1.5px solid var(--white-3)" },
    error: { background: "#fef2f2", color: "var(--error)", border: "1.5px solid #fecaca" },
  };
  return { padding: "9px 16px", borderRadius: "var(--radius-sm)", fontSize: "12px", fontWeight: "600", cursor: "pointer", ...s[t] };
}

const SUPRA = { fontSize: "11px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gray)", marginBottom: "8px" };
const H1 = { fontFamily: "var(--font-display)", fontSize: "44px", fontWeight: "300", lineHeight: 1.1 };
const SUB = { color: "var(--gray)", fontSize: "14px", marginTop: "6px" };
const kpiCard = { background: "#fff", borderRadius: "var(--radius-md)", padding: "18px 20px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--white-3)" };
const kpiLabel = { fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gray)", marginBottom: "8px" };
const kpiVal = { fontSize: "30px", fontFamily: "var(--font-display)", fontWeight: "300", lineHeight: 1 };
const OVL = { position: "fixed", inset: 0, background: "rgba(10,10,15,0.55)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" };
const MDL = { background: "#fff", borderRadius: "var(--radius-lg)", padding: "32px", width: "500px", boxShadow: "var(--shadow-lg)", maxHeight: "90vh", overflowY: "auto" };
const LBL = { display: "block", fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gray)", marginBottom: "8px" };
const now = () => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
const today = () => new Date().toLocaleDateString("fr-FR");
