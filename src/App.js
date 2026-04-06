import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import SAV from "./pages/SAV";
import Produits from "./pages/Produits";
import Stats from "./pages/Stats";

function PrivateRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}><div style={{ color: "var(--gold)", fontFamily: "var(--font-display)", fontSize: "24px" }}>LIVRR</div></div>;
  return admin ? children : <Navigate to="/login" />;
}

function AppLayout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F2EE" }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: "240px", width: "calc(100% - 240px)", minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ style: { fontFamily: "DM Sans, sans-serif", fontSize: "14px", borderRadius: "12px", zIndex: 9999 } }} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
          <Route path="/statistiques" element={<PrivateRoute><AppLayout><Stats /></AppLayout></PrivateRoute>} />
          <Route path="/boutiques" element={<PrivateRoute><AppLayout><Boutiques /></AppLayout></PrivateRoute>} />
          <Route path="/invitations" element={<PrivateRoute><AppLayout><Invitations /></AppLayout></PrivateRoute>} />
          <Route path="/produits" element={<PrivateRoute><AppLayout><Produits /></AppLayout></PrivateRoute>} />
          <Route path="/categories" element={<PrivateRoute><AppLayout><Produits /></AppLayout></PrivateRoute>} />
          <Route path="/clients" element={<PrivateRoute><AppLayout><Clients /></AppLayout></PrivateRoute>} />
          <Route path="/clients/commandes" element={<PrivateRoute><AppLayout><Clients /></AppLayout></PrivateRoute>} />
          <Route path="/commandes" element={<PrivateRoute><AppLayout><Commandes /></AppLayout></PrivateRoute>} />
          <Route path="/retours" element={<PrivateRoute><AppLayout><Retours /></AppLayout></PrivateRoute>} />
          <Route path="/sav" element={<PrivateRoute><AppLayout><SAV /></AppLayout></PrivateRoute>} />
          <Route path="/reclamations" element={<PrivateRoute><AppLayout><SAV /></AppLayout></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
