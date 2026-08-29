import { useState } from "react";
import { useAdminAuth } from "../context/AdminAuth.jsx";

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function manejarEnvio(e) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      await login(usuario, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-50">
      <form
        onSubmit={manejarEnvio}
        className="bg-white rounded-2xl shadow-xl/10 p-8 w-full max-w-sm flex flex-col gap-5"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 bg-gradient-to-r from-orange-400 to-orange-700 flex justify-center items-center rounded-full">
            <p className="text-zinc-100 font-bold text-xl">SR</p>
          </div>
          <p className="text-xl font-bold">Panel Admin — Sabor Rápido</p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">Usuario</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="border border-zinc-300 rounded-xl px-4 py-2.5 outline-none focus:border-orange-400"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-zinc-300 rounded-xl px-4 py-2.5 outline-none focus:border-orange-400"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={cargando}
          className="bg-gradient-to-r from-orange-400 to-orange-800 text-zinc-100 h-12 rounded-full font-bold disabled:opacity-60"
        >
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
