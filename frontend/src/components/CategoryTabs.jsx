const CATEGORIAS = [
  { id: "desayuno", label: "Desayuno", emoji: "" },
  { id: "almuerzo", label: "Almuerzo", emoji: "" },
  { id: "cena", label: "Cena", emoji: "" },
];

export default function CategoryTabs({ categoriaActiva, onSelect }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-[700px] mx-auto">
      {CATEGORIAS.map((cat) => {
        const activa = categoriaActiva === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex-1 h-16 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 transition-all ${
              activa
                ? "bg-gradient-to-r from-orange-400 to-orange-800 text-zinc-100 shadow-lg shadow-orange-300/50"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            <span className="text-2xl">{cat.emoji}</span>
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
