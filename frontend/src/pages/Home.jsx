import { useEffect, useState } from "react";
import { api } from "../api.js";
import CategoryTabs from "../components/CategoryTabs.jsx";
import PlatoCard from "../components/PlatoCard.jsx";

export default function Home() {
  const [categoriaActiva, setCategoriaActiva] = useState("almuerzo");
  const [platos, setPlatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setCargando(true);
    setError("");
    api
      .obtenerPlatos(categoriaActiva)
      .then(setPlatos)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [categoriaActiva]);

  return (
    <main className="relative z-0">
      <section className="px-4 md:px-8 lg:px-10 py-10 overflow-hidden">
        <div className="relative z-[1] text-center max-w-[800px] mx-auto">
          <div className="px-4 py-2 w-fit bg-zinc-100 rounded-full mx-auto">
            <p className="text-sm text-orange-800 font-medium">
              🚚 Entrega GRATIS en pedidos 
            </p>
          </div>

          <h1 className="text-zinc-800 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[44px] sm:leading-[56px] mt-6">
            ¿Qué se te antoja <span className="text-orange-500">hoy</span>?
          </h1>

          <p className="text-zinc-600 text-lg sm:text-xl mt-6 leading-8">
            Elige tu momento del día y arma tu pedido en segundos.
          </p>
        </div>

        <div className="mt-10">
          <CategoryTabs categoriaActiva={categoriaActiva} onSelect={setCategoriaActiva} />
        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-10 pb-20">
        {cargando && (
          <p className="text-center text-zinc-500 py-16">Cargando platos…</p>
        )}

        {!cargando && error && (
          <p className="text-center text-red-500 py-16">
            No se pudieron cargar los platos: {error}
          </p>
        )}

        {!cargando && !error && platos.length === 0 && (
          <p className="text-center text-zinc-500 py-16">
            No hay platos disponibles en esta categoría por ahora. ¡Vuelve pronto!
          </p>
        )}

        {!cargando && !error && platos.length > 0 && (
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
            {platos.map((plato) => (
              <PlatoCard key={plato.id} plato={plato} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
