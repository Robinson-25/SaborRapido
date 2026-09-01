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
      <header className="bg-white shadow-xl/10 px-4 md:px-8 py-4 md:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-lg sm:text-xl font-bold leading-tight">
          🍔 Panel Admin — Sabor Rápido
        </p>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              setPlatoEnEdicion(null);
              setMostrarForm(true);
            }}
            className="flex-1 sm:flex-none bg-gradient-to-r from-orange-400 to-orange-800 text-zinc-100 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full font-bold text-sm sm:text-base whitespace-nowrap"
          >
            + Agregar plato
          </button>
          <button
            onClick={logout}
            className="flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-2.5 rounded-full font-medium text-zinc-600 hover:bg-zinc-100 text-sm sm:text-base whitespace-nowrap"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="px-4 md:px-8 py-6 md:py-8 max-w-[1100px] mx-auto">
        {mostrarForm && (
          <div className="bg-white rounded-2xl shadow-xl/10 p-4 sm:p-6 mb-8">
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
            <div key={categoria} className="mb-8 sm:mb-10">
              <p className="text-lg font-bold text-zinc-800 mb-3">
                {NOMBRE_CATEGORIA[categoria] || categoria} ({lista.length})
              </p>
              <div className="bg-white rounded-2xl shadow-xl/10 divide-y divide-zinc-100">
                {lista.map((plato) => (
                  <div key={plato.id} className="flex flex-col gap-3 px-4 sm:px-5 py-4">
                    {/* Fila superior: emoji + nombre + precio */}
                    <div className="flex items-center gap-3">
                      <p className="text-2xl shrink-0">{plato.emoji || "🍽️"}</p>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate">{plato.nombre}</p>
                        <p className="text-sm text-zinc-500">
                          S/{Number(plato.precio).toFixed(2)}
                          {plato.etiqueta && ` · ${plato.etiqueta}`}
                        </p>
                      </div>
                    </div>

                    {/* Fila inferior: disponibilidad + acciones */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <button
                          type="button"
                          onClick={() => alternarDisponibilidad(plato)}
                          className={`w-11 h-6 sm:w-12 sm:h-7 rounded-full relative transition-colors shrink-0 ${
                            plato.disponible ? "bg-green-500" : "bg-zinc-300"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full transition-transform ${
                              plato.disponible ? "translate-x-5" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                        <span
                          className={`text-sm font-medium ${
                            plato.disponible ? "text-green-600" : "text-zinc-400"
                          }`}
                        >
                          {plato.disponible ? "Disponible" : "Agotado"}
                        </span>
                      </label>

                      <div className="flex gap-1 sm:gap-2">
                        <button
                          onClick={() => {
                            setPlatoEnEdicion(plato);
                            setMostrarForm(true);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-medium text-orange-600 hover:bg-orange-50"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarPlato(plato)}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-medium text-red-500 hover:bg-red-50"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </main>
    </div>
  );
}
