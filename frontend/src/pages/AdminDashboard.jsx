import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useAdminAuth } from "../context/AdminAuth.jsx";
import PlatoForm from "../components/PlatoForm.jsx";

const NOMBRE_CATEGORIA = {
  desayuno: "Desayuno",
  almuerzo: "Almuerzo",
  cena: "Cena",
};

export default function AdminDashboard() {
  const { logout } = useAdminAuth();
  const [platos, setPlatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [platoEnEdicion, setPlatoEnEdicion] = useState(null);
  const [guardando, setGuardando] = useState(false);

  function cargarPlatos() {
    setCargando(true);
    api
      .obtenerPlatosAdmin()
      .then(setPlatos)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    cargarPlatos();
  }, []);

  async function alternarDisponibilidad(plato) {
    try {
      const actualizado = await api.cambiarDisponibilidad(plato.id, !plato.disponible);
      setPlatos((prev) => prev.map((p) => (p.id === plato.id ? actualizado : p)));
    } catch (err) {
      alert(err.message);
    }
  }

  async function eliminarPlato(plato) {
    if (!confirm(`¿Eliminar "${plato.nombre}" definitivamente?`)) return;
    try {
      await api.eliminarPlato(plato.id);
      setPlatos((prev) => prev.filter((p) => p.id !== plato.id));
    } catch (err) {
      alert(err.message);
    }
  }

  async function guardarPlato(datos) {
    setGuardando(true);
    try {
      if (platoEnEdicion) {
        const actualizado = await api.actualizarPlato(platoEnEdicion.id, datos);
        setPlatos((prev) => prev.map((p) => (p.id === platoEnEdicion.id ? actualizado : p)));
      } else {
        const creado = await api.crearPlato(datos);
        setPlatos((prev) => [...prev, creado]);
      }
      setMostrarForm(false);
      setPlatoEnEdicion(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setGuardando(false);
    }
  }

  const platosPorCategoria = platos.reduce((acc, p) => {
    (acc[p.categoria] ||= []).push(p);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <header className="bg-white shadow-xl/10 px-4 md:px-8 py-5 flex items-center justify-between">
        <p className="text-xl font-bold">🍔 Panel Admin — Sabor Rápido</p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setPlatoEnEdicion(null);
              setMostrarForm(true);
            }}
            className="bg-gradient-to-r from-orange-400 to-orange-800 text-zinc-100 px-5 py-2.5 rounded-full font-bold"
          >
            + Agregar plato
          </button>
          <button
            onClick={logout}
            className="px-5 py-2.5 rounded-full font-medium text-zinc-600 hover:bg-zinc-100"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="px-4 md:px-8 py-8 max-w-[1100px] mx-auto">
        {mostrarForm && (
          <div className="bg-white rounded-2xl shadow-xl/10 p-6 mb-8">
            <p className="text-lg font-bold mb-4">
              {platoEnEdicion ? `Editar: ${platoEnEdicion.nombre}` : "Nuevo plato"}
            </p>
            <PlatoForm
              platoInicial={platoEnEdicion}
              guardando={guardando}
              onGuardar={guardarPlato}
              onCancelar={() => {
                setMostrarForm(false);
                setPlatoEnEdicion(null);
              }}
            />
          </div>
        )}

        {cargando && <p className="text-zinc-500">Cargando platos…</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!cargando &&
          Object.entries(platosPorCategoria).map(([categoria, lista]) => (
            <div key={categoria} className="mb-10">
              <p className="text-lg font-bold text-zinc-800 mb-3">
                {NOMBRE_CATEGORIA[categoria] || categoria} ({lista.length})
              </p>
              <div className="bg-white rounded-2xl shadow-xl/10 divide-y divide-zinc-100">
                {lista.map((plato) => (
                  <div
                    key={plato.id}
                    className="flex flex-wrap items-center gap-4 px-5 py-4"
                  >
                    <p className="text-2xl">{plato.emoji || "🍽️"}</p>
                    <div className="flex-1 min-w-[180px]">
                      <p className="font-bold">{plato.nombre}</p>
                      <p className="text-sm text-zinc-500">
                        S/{Number(plato.precio).toFixed(2)}
                        {plato.etiqueta && ` · ${plato.etiqueta}`}
                      </p>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <span
                        className={`text-sm font-medium ${
                          plato.disponible ? "text-green-600" : "text-zinc-400"
                        }`}
                      >
                        {plato.disponible ? "Disponible" : "Agotado"}
                      </span>
                      <button
                        type="button"
                        onClick={() => alternarDisponibilidad(plato)}
                        className={`w-12 h-7 rounded-full relative transition-colors ${
                          plato.disponible ? "bg-green-500" : "bg-zinc-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                            plato.disponible ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </label>

                    <button
                      onClick={() => {
                        setPlatoEnEdicion(plato);
                        setMostrarForm(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-4 py-2 rounded-full text-sm font-medium text-orange-600 hover:bg-orange-50"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarPlato(plato)}
                      className="px-4 py-2 rounded-full text-sm font-medium text-red-500 hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </main>
    </div>
  );
}
