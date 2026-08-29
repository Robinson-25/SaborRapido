import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "sabor_rapido_carrito";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function agregarPlato(plato) {
    setItems((prev) => {
      const existente = prev.find((p) => p.id === plato.id);
      if (existente) {
        return prev.map((p) =>
          p.id === plato.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      }
      return [...prev, { ...plato, cantidad: 1 }];
    });
    setCarritoAbierto(true);
  }

  function cambiarCantidad(id, delta) {
    setItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, cantidad: p.cantidad + delta } : p))
        .filter((p) => p.cantidad > 0)
    );
  }

  function quitarPlato(id) {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  function vaciarCarrito() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, p) => sum + p.cantidad, 0);
  const totalPrecio = items.reduce(
    (sum, p) => sum + p.cantidad * Number(p.precio),
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        agregarPlato,
        cambiarCantidad,
        quitarPlato,
        vaciarCarrito,
        totalItems,
        totalPrecio,
        carritoAbierto,
        setCarritoAbierto,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
