import { Routes, Route } from "react-router-dom";
import { AdminAuthProvider, useAdminAuth } from "./context/AdminAuth.jsx";
import Header from "./components/Header.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import Home from "./pages/Home.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function SitioPublico() {
  return (
    <>
      <Header />
      <Home />
      <CartDrawer />
    </>
  );
}

function RutaAdmin() {
  const { autenticado } = useAdminAuth();
  return autenticado ? <AdminDashboard /> : <AdminLogin />;
}

export default function App() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="/" element={<SitioPublico />} />
        <Route path="/admin" element={<RutaAdmin />} />
      </Routes>
    </AdminAuthProvider>
  );
}
