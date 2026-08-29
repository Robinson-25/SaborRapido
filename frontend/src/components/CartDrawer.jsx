import { useCart } from "../context/CartContext.jsx";
import { construirLinkWhatsApp } from "../utils/whatsapp.js";

export default function CartDrawer() {
  const {
    items,
    carritoAbierto,
    setCarritoAbierto,
    cambiarCantidad,
    quitarPlato,
    totalPrecio,
    vaciarCarrito,
  } = useCart();

  if (!carritoAbierto) return null;

  function enviarPorWhatsApp() {
    const link = construirLinkWhatsApp(items, totalPrecio);
    window.open(link, "_blank");
    vaciarCarrito();
    setCarritoAbierto(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* fondo oscuro */}
      <button
        className="absolute inset-0 bg-black/50"
        onClick={() => setCarritoAbierto(false)}
        aria-label="Cerrar carrito"
      />

      {/* panel */}
      <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right">
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200">
          <p className="text-xl font-bold">🛒 Tu pedido</p>
          <button
            onClick={() => setCarritoAbierto(false)}
            className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-lg"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
              <p className="text-5xl">🍽️</p>
              <p className="text-zinc-600">Tu carrito está vacío.</p>
              <p className="text-zinc-400 text-sm">Elige Desayuno, Almuerzo o Cena y agrega tus platos favoritos.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {items.map((p) => (
                <div key={p.id} className="flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center text-2xl shrink-0">
                    {p.emoji || "🍽️"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{p.nombre}</p>
                    <p className="text-orange-500 font-bold">S/{Number(p.precio).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => cambiarCantidad(p.id, -1)}
                      className="w-7 h-7 rounded-full bg-zinc-100 font-bold"
                    >
                      −
                    </button>
                    <p className="w-5 text-center font-medium">{p.cantidad}</p>
                    <button
                      onClick={() => cambiarCantidad(p.id, 1)}
                      className="w-7 h-7 rounded-full bg-zinc-100 font-bold"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => quitarPlato(p.id)}
                    className="text-zinc-400 hover:text-red-500 ml-1"
                    aria-label={`Quitar ${p.nombre}`}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-zinc-200 px-6 py-5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-medium text-zinc-600">Total</p>
              <p className="text-3xl font-bold text-orange-500">S/{totalPrecio.toFixed(2)}</p>
            </div>
            <button
              onClick={enviarPorWhatsApp}
              className="bg-green-500 hover:bg-green-600 transition-colors h-14 rounded-full text-lg font-bold text-zinc-100 flex items-center justify-center gap-2"
            >
              💬 Enviar pedido por WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
