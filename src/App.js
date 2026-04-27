import React, { useState, useEffect, createContext, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DemandesProvider } from "./context/DemandesContext";
// ✅ POINT 4 — import MessagerieProvider
import { MessagerieProvider } from "./context/MessagerieContext";
import { useRole } from "./hooks/useRole";
import "./index.css";

import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AccesRefuse from "./pages/AccesRefuse";
import Dashboard from "./pages/Dashboard";
import Boutiques from "./pages/Boutiques";
import Invitations from "./pages/Invitations";
import Clients from "./pages/Clients";
import Commandes from "./pages/Commandes";
import Retours from "./pages/Retours";
import Livraisons from "./pages/Livraisons";
import SAV from "./pages/SAV";
import Produits from "./pages/Produits";
import Stats from "./pages/Stats";
import Finance from "./pages/Finance";
import Abonnements from "./pages/Abonnements";
import Moderation from "./pages/Moderation";
import Parametres from "./pages/Parametres";
import Comptes from "./pages/Comptes";
import ZoneService from "./pages/ZoneService";
import Notifications from "./pages/Notifications";
import AuditLog from "./pages/AuditLog";
import Parrainage from "./pages/Parrainage";
import Avis from "./pages/Avis";
import Integrations from "./pages/Integrations";
import Litiges from "./pages/Litiges";
import Remboursements from "./pages/Remboursements";
import OnboardingAdmin from "./pages/OnboardingAdmin";
import Messagerie from "./pages/Messagerie";
import Facturation from "./pages/Facturation";
import Reporting from "./pages/Reporting";
import CategoriesAdmin from "./pages/CategoriesAdmin";
import HistoriqueReclamations from "./pages/HistoriqueReclamations";
import TutorialAdmin from "./pages/TutorialAdmin";
import Activite from "./pages/Activite";
import Coupons from "./pages/Coupons";
import RechercheGlobale from "./components/RechercheGlobale";
import ModeDemo from "./components/ModeDemo";

// ── Theme Context ──
export const ThemeContext = createContext({ dark: false, toggle: () => {} });
export const useTheme = () => useContext(ThemeContext);

function ThemeProvider({ children }) {
  const [dark, setDark] = useState(
    () => localStorage.getItem("livrr_admin_theme") === "dark"
  );
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("livrr_admin_theme", dark ? "dark" : "light");
  }, [dark]);
  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ── Page transition ──
function PageTransition({ children }) {
  const location = useLocation();
  const [displayed, setDisplayed] = useState(children);
  const [phase, setPhase] = useState("in");
  useEffect(() => {
    setPhase("out");
    const t = setTimeout(() => {
      setDisplayed(children);
      setPhase("in");
    }, 180);
    return () => clearTimeout(t);
  }, [location.pathname]);
  return (
    <div style={{
      opacity: phase === "in" ? 1 : 0,
      transform: phase === "in" ? "translateY(0)" : "translateY(6px)",
      transition: "opacity 0.25s ease, transform 0.25s ease",
    }}>
      {displayed}
    </div>
  );
}

// ── Private route (authentification) ──
function PrivateRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading)
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0A0A0F" }}>
        <div style={{ fontFamily: "var(--font-display)", color: "var(--gold)", fontSize: "24px", letterSpacing: "6px" }}>
          LIVRR
        </div>
      </div>
    );
  return admin ? children : <Navigate to="/login" />;
}

// ── Role guard (autorisation) ──
function RoleRoute({ page, children }) {
  const { peutAcceder, role } = useRole();
  if (!peutAcceder(page)) {
    return <AccesRefuse role={role} />;
  }
  return children;
}

// ── Layout avec sidebar ──
function AppLayout({ children }) {
  const [showRecherche, setShowRecherche] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setShowRecherche(true); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--gray-bg,#F7F5F2)" }}>
      <Sidebar onSearchClick={() => setShowRecherche(true)} onDemoClick={() => setShowDemo((d) => !d)} />
      <main style={{ flex: 1, marginLeft: "240px", width: "calc(100% - 240px)", minHeight: "100vh", position: "relative" }}>
        {showDemo && <ModeDemo onClose={() => setShowDemo(false)} />}
        <PageTransition>{children}</PageTransition>
      </main>
      {showRecherche && <RechercheGlobale onClose={() => setShowRecherche(false)} />}
    </div>
  );
}

// ── Wrapper : authentifié + layout ──
const PR = ({ children }) => (
  <PrivateRoute>
    <AppLayout>{children}</AppLayout>
  </PrivateRoute>
);

// ── Wrapper : authentifié + layout + rôle ──
const PRR = ({ page, children }) => (
  <PrivateRoute>
    <AppLayout>
      <RoleRoute page={page}>
        {children}
      </RoleRoute>
    </AppLayout>
  </PrivateRoute>
);

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DemandesProvider>
          {/* ✅ POINT 4 — MessagerieProvider wrappé ici pour partager l'état
              entre Boutiques.js et Messagerie.js */}
          <MessagerieProvider>
            <Router>
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "14px",
                    borderRadius: "12px",
                    zIndex: 9999,
                  },
                }}
              />
              <Routes>
                {/* Pages publiques */}
                <Route path="/login" element={<Login />} />
                <Route path="/tutorial" element={<TutorialAdmin />} />

                {/* Pages accessibles à tous les rôles */}
                <Route path="/" element={<PR><Dashboard /></PR>} />
                <Route path="/statistiques" element={<PR><Stats /></PR>} />
                <Route path="/boutiques" element={<PR><Boutiques /></PR>} />
                <Route path="/messagerie" element={<PRR page="messagerie"><Messagerie /></PRR>} />
                <Route path="/produits" element={<PR><Produits /></PR>} />
                <Route path="/categories" element={<PR><CategoriesAdmin /></PR>} />
                <Route path="/commandes" element={<PR><Commandes /></PR>} />
                <Route path="/livraisons" element={<PR><Livraisons /></PR>} />
                <Route path="/retours" element={<PR><Retours /></PR>} />
                <Route path="/sav" element={<PR><SAV /></PR>} />
                <Route path="/historique-reclamations" element={<PR><HistoriqueReclamations /></PR>} />
                <Route path="/moderation" element={<PR><Moderation /></PR>} />
                <Route path="/avis" element={<PR><Avis /></PR>} />

                {/* Pages SAV uniquement (pas Ops) */}
                <Route path="/clients" element={<PRR page="clients"><Clients /></PRR>} />
                <Route path="/parrainage" element={<PRR page="parrainage"><Parrainage /></PRR>} />

                {/* Pages Admin uniquement */}
                <Route path="/invitations" element={<PRR page="invitations"><Invitations /></PRR>} />
                <Route path="/onboarding" element={<PRR page="onboarding"><OnboardingAdmin /></PRR>} />
                <Route path="/abonnements" element={<PRR page="abonnements"><Abonnements /></PRR>} />
                <Route path="/finance" element={<PRR page="finance"><Finance /></PRR>} />
                <Route path="/remboursements" element={<PRR page="remboursements"><Remboursements /></PRR>} />
                <Route path="/facturation" element={<PRR page="facturation"><Facturation /></PRR>} />
                <Route path="/reporting" element={<PRR page="reporting"><Reporting /></PRR>} />
                <Route path="/litiges" element={<PRR page="litiges"><Litiges /></PRR>} />
                <Route path="/parametres" element={<PRR page="parametres"><Parametres /></PRR>} />
                <Route path="/zones" element={<PRR page="zones"><ZoneService /></PRR>} />
                <Route path="/notifications" element={<PRR page="notifications"><Notifications /></PRR>} />
                <Route path="/integrations" element={<PRR page="integrations"><Integrations /></PRR>} />
                <Route path="/audit" element={<PRR page="audit"><AuditLog /></PRR>} />
                <Route path="/comptes" element={<PRR page="comptes"><Comptes /></PRR>} />
                <Route path="/activite" element={<PRR page="activite"><Activite /></PRR>} />
                <Route path="/coupons" element={<PRR page="coupons"><Coupons /></PRR>} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </MessagerieProvider>
        </DemandesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
