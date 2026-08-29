import { createContext, useContext, useState } from "react";
import { api } from "../api.js";

const AdminAuthContext = createContext(null);
const TOKEN_KEY = "sabor_rapido_admin_token";

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  async function login(usuario, password) {
    const data = await api.login(usuario, password);
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }

  return (
    <AdminAuthContext.Provider value={{ token, autenticado: !!token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth debe usarse dentro de <AdminAuthProvider>");
  return ctx;
}
