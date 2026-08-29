import { useCart } from "../context/CartContext.jsx";

const COLOR_ETIQUETA = {
  "Más Vendida": "bg-red-500",
  "Más Pedido": "bg-red-500",
  Nuevo: "bg-green-500",
  Oferta: "bg-purple-500",
};

export default function PlatoCard({ plato }) {
  const { agregarPlato } = useCart();
  const colorEtiqueta = COLOR_ETIQUETA[plato.etiqueta] || "bg-orange-500";

  return (
    <div className="rounded-2xl shadow-xl/10 pb-3 bg-white flex flex-col">
      <div
        className="bg-center bg-cover w-full h-60 rounded-t-[inherit] relative bg-zinc-200"
        style={plato.imagen ? { backgroundImage: `url(${plato.imagen})` } : undefined}
      >
        {plato.etiqueta && (
          <div className="absolute top-4 left-3">
            <p className={`${colorEtiqueta} text-zinc-100 text-sm font-semibold px-3 rounded-full py-1`}>
              {plato.etiqueta}
            </p>
          </div>
        )}
        <div className="absolute right-3 top-4 bg-zinc-100 p-1.5 rounded-full">
          <p className="text-2xl">{plato.emoji || "🍽️"}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 py-4 px-6 flex-1">
        <p className="text-2xl font-bold">{plato.nombre}</p>
        <p className="text-zinc-700 text-base flex-1">{plato.descripcion}</p>
        <div className="flex justify-between items-center">
          <p className="text-3xl font-bold text-orange-500">S/{Number(plato.precio).toFixed(2)}</p>
          {plato.calorias && <p className="text-zinc-600 text-sm">{plato.calorias}cal</p>}
        </div>
        <button
          onClick={() => agregarPlato(plato)}
          className="bg-gradient-to-r from-orange-400 to-orange-800 h-12 rounded-2xl text-zinc-100 font-bold mt-2 hover:opacity-90 transition-opacity"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
