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
import "./index.css";

import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
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
import OnboardingAdmin from "./pages/OnboardingAdmin";
import Messagerie from "./pages/Messagerie";
import Facturation from "./pages/Facturation";
import Reporting from "./pages/Reporting";
import CategoriesAdmin from "./pages/CategoriesAdmin";
import HistoriqueReclamations from "./pages/HistoriqueReclamations";
import Remboursements from "./pages/Remboursements";

// ── Theme Context ──
export const ThemeContext = createContext({ dark: false, toggle: () => {} });
export const useTheme = () => useContext(ThemeContext);

function ThemeProvider({ children }) {
  const [dark, setDark] = useState(
    () => localStorage.getItem("livrr_admin_theme") === "dark"
  );
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      dark ? "dark" : "light"
    );
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
    <div
      style={{
        opacity: phase === "in" ? 1 : 0,
        transform: phase === "in" ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
      }}
    >
      {displayed}
    </div>
  );
}

function PrivateRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#0A0A0F",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--gold)",
            fontSize: "24px",
            letterSpacing: "6px",
          }}
        >
          LIVRR
        </div>
      </div>
    );
  return admin ? children : <Navigate to="/login" />;
}

function AppLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--gray-bg,#F7F5F2)",
      }}
    >
      <Sidebar />
      <main
        style={{
          flex: 1,
          marginLeft: "240px",
          width: "calc(100% - 240px)",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}

const PR = ({ children }) => (
  <PrivateRoute>
    <AppLayout>{children}</AppLayout>
  </PrivateRoute>
);

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
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
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PR>
                  <Dashboard />
                </PR>
              }
            />
            <Route
              path="/statistiques"
              element={
                <PR>
                  <Stats />
                </PR>
              }
            />
            <Route
              path="/boutiques"
              element={
                <PR>
                  <Boutiques />
                </PR>
              }
            />
            <Route
              path="/invitations"
              element={
                <PR>
                  <Invitations />
                </PR>
              }
            />
            <Route
              path="/abonnements"
              element={
                <PR>
                  <Abonnements />
                </PR>
              }
            />
            <Route
              path="/commandes"
              element={
                <PR>
                  <Commandes />
                </PR>
              }
            />
            <Route
              path="/retours"
              element={
                <PR>
                  <Retours />
                </PR>
              }
            />
            <Route
              path="/livraisons"
              element={
                <PR>
                  <Livraisons />
                </PR>
              }
            />
            <Route
              path="/clients"
              element={
                <PR>
                  <Clients />
                </PR>
              }
            />
            <Route
              path="/finance"
              element={
                <PR>
                  <Finance />
                </PR>
              }
            />
            <Route
              path="/sav"
              element={
                <PR>
                  <SAV />
                </PR>
              }
            />
            <Route
              path="/moderation"
              element={
                <PR>
                  <Moderation />
                </PR>
              }
            />
            <Route
              path="/produits"
              element={
                <PR>
                  <Produits />
                </PR>
              }
            />
            <Route
              path="/parametres"
              element={
                <PR>
                  <Parametres />
                </PR>
              }
            />
            <Route
              path="/comptes"
              element={
                <PR>
                  <Comptes />
                </PR>
              }
            />
            <Route
              path="/zones"
              element={
                <PR>
                  <ZoneService />
                </PR>
              }
            />
            <Route
              path="/notifications"
              element={
                <PR>
                  <Notifications />
                </PR>
              }
            />
            <Route
              path="/audit"
              element={
                <PR>
                  <AuditLog />
                </PR>
              }
            />
            <Route
              path="/parrainage"
              element={
                <PR>
                  <Parrainage />
                </PR>
              }
            />
            <Route
              path="/avis"
              element={
                <PR>
                  <Avis />
                </PR>
              }
            />
            <Route
              path="/integrations"
              element={
                <PR>
                  <Integrations />
                </PR>
              }
            />
            <Route
              path="/litiges"
              element={
                <PR>
                  <Litiges />
                </PR>
              }
            />
            <Route
              path="/onboarding"
              element={
                <PR>
                  <OnboardingAdmin />
                </PR>
              }
            />
            <Route
              path="/messagerie"
              element={
                <PR>
                  <Messagerie />
                </PR>
              }
            />
            <Route
              path="/facturation"
              element={
                <PR>
                  <Facturation />
                </PR>
              }
            />
            <Route
              path="/reporting"
              element={
                <PR>
                  <Reporting />
                </PR>
              }
            />
            <Route
              path="/remboursements"
              element={
                <PR>
                  <Remboursements />
                </PR>
              }
            />
            <Route
              path="/categories"
              element={
                <PR>
                  <CategoriesAdmin />
                </PR>
              }
            />
            <Route
              path="/historique-reclamations"
              element={
                <PR>
                  <HistoriqueReclamations />
                </PR>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
