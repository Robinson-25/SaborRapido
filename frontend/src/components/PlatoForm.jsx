import { useState } from "react";

const VACIO = {
  nombre: "",
  descripcion: "",
  precio: "",
  categoria: "almuerzo",
  imagen: "",
  emoji: "🍽️",
  etiqueta: "",
  calorias: "",
};

export default function PlatoForm({ platoInicial, onGuardar, onCancelar, guardando }) {
  const [form, setForm] = useState(platoInicial || VACIO);

  function actualizarCampo(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function manejarEnvio(e) {
    e.preventDefault();
    onGuardar({
      ...form,
      precio: Number(form.precio),
      calorias: form.calorias ? Number(form.calorias) : null,
    });
  }

  return (
    <form onSubmit={manejarEnvio} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">Nombre del plato</label>
          <input
            required
            value={form.nombre}
            onChange={(e) => actualizarCampo("nombre", e.target.value)}
            className="border border-zinc-300 rounded-xl px-4 py-2.5 outline-none focus:border-orange-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">Categoría</label>
          <select
            value={form.categoria}
            onChange={(e) => actualizarCampo("categoria", e.target.value)}
            className="border border-zinc-300 rounded-xl px-4 py-2.5 outline-none focus:border-orange-400"
          >
            <option value="desayuno">Desayuno</option>
            <option value="almuerzo">Almuerzo</option>
            <option value="cena">Cena</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-zinc-700">Descripción</label>
        <textarea
          value={form.descripcion}
          onChange={(e) => actualizarCampo("descripcion", e.target.value)}
          className="border border-zinc-300 rounded-xl px-4 py-2.5 outline-none focus:border-orange-400 min-h-20"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">Precio (S/)</label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            value={form.precio}
            onChange={(e) => actualizarCampo("precio", e.target.value)}
            className="border border-zinc-300 rounded-xl px-4 py-2.5 outline-none focus:border-orange-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">Calorías</label>
          <input
            type="number"
            min="0"
            value={form.calorias}
            onChange={(e) => actualizarCampo("calorias", e.target.value)}
            className="border border-zinc-300 rounded-xl px-4 py-2.5 outline-none focus:border-orange-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">Emoji</label>
          <input
            value={form.emoji}
            onChange={(e) => actualizarCampo("emoji", e.target.value)}
            className="border border-zinc-300 rounded-xl px-4 py-2.5 outline-none focus:border-orange-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">Etiqueta</label>
          <select
            value={form.etiqueta}
            onChange={(e) => actualizarCampo("etiqueta", e.target.value)}
            className="border border-zinc-300 rounded-xl px-4 py-2.5 outline-none focus:border-orange-400"
          >
            <option value="">Sin etiqueta</option>
            <option value="Más Vendida">Más Vendida</option>
            <option value="Nuevo">Nuevo</option>
            <option value="Oferta">Oferta</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-zinc-700">
          URL de imagen (opcional, si no la dejas se usa el emoji como ícono)
        </label>
        <input
          value={form.imagen}
          onChange={(e) => actualizarCampo("imagen", e.target.value)}
          placeholder="https://..."
          className="border border-zinc-300 rounded-xl px-4 py-2.5 outline-none focus:border-orange-400"
        />
      </div>

      <div className="flex gap-3 justify-end mt-2">
        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            className="px-5 py-2.5 rounded-full font-medium text-zinc-600 hover:bg-zinc-100"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={guardando}
          className="bg-gradient-to-r from-orange-400 to-orange-800 text-zinc-100 px-6 py-2.5 rounded-full font-bold disabled:opacity-60"
        >
          {guardando ? "Guardando..." : "Guardar plato"}
        </button>
      </div>
    </form>
  );
}
