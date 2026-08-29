import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Header() {
  const { totalItems, setCarritoAbierto } = useCart();

  return (
    <header className="px-3 md:px-6 lg:px-10 relative z-30 py-4 md:py-6 shadow-xl/20 bg-white">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex gap-3 items-center">
          <div className="w-11 min-w-11 h-11 min-h-11 bg-gradient-to-r from-orange-400 to-orange-700 flex justify-center items-center rounded-full">
            <p className="text-zinc-100 font-bold text-lg">SR</p>
          </div>
          <p className="text-base font-bold sm:text-xl md:text-2xl">Sabor Rápido</p>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCarritoAbierto(true)}
            className="relative bg-zinc-100 hover:bg-zinc-200 transition-colors w-11 h-11 rounded-full flex items-center justify-center text-xl"
            aria-label="Abrir carrito"
          >
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          
        </div>
      </div>
    </header>
  );
}
