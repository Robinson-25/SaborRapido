import { Router } from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();
const CATEGORIAS_VALIDAS = ["desayuno", "almuerzo", "cena"];

// GET /api/platos?categoria=almuerzo
// Público. Por defecto solo devuelve platos disponibles.
// El admin manda ?incluirNoDisponibles=1 para verlos todos.
router.get("/", async (req, res) => {
  const { categoria, incluirNoDisponibles } = req.query;

  const condiciones = [];
  const valores = [];

  if (categoria) {
    if (!CATEGORIAS_VALIDAS.includes(categoria)) {
      return res.status(400).json({ error: "Categoría inválida." });
    }
    valores.push(categoria);
    condiciones.push(`categoria = $${valores.length}`);
  }

  if (!incluirNoDisponibles) {
    condiciones.push("disponible = true");
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(" AND ")}` : "";

  try {
    const { rows } = await pool.query(
      `SELECT * FROM platos ${where} ORDER BY categoria, id`,
      valores
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudieron obtener los platos." });
  }
});

// POST /api/platos  (solo admin)
router.post("/", requireAdmin, async (req, res) => {
  const {
    nombre,
    descripcion = "",
    precio,
    categoria,
    imagen = "",
    emoji = "🍽️",
    etiqueta = "",
    calorias = null,
    disponible = true,
  } = req.body;

  if (!nombre || !precio || !categoria) {
    return res.status(400).json({ error: "Nombre, precio y categoría son obligatorios." });
  }
  if (!CATEGORIAS_VALIDAS.includes(categoria)) {
    return res.status(400).json({ error: "Categoría inválida." });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO platos (nombre, descripcion, precio, categoria, imagen, emoji, etiqueta, calorias, disponible)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [nombre, descripcion, precio, categoria, imagen, emoji, etiqueta, calorias, disponible]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo crear el plato." });
  }
});

// PUT /api/platos/:id  (solo admin) - editar cualquier campo
router.put("/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const campos = [
    "nombre",
    "descripcion",
    "precio",
    "categoria",
    "imagen",
    "emoji",
    "etiqueta",
    "calorias",
    "disponible",
  ];

  const actualizaciones = [];
  const valores = [];

  for (const campo of campos) {
    if (req.body[campo] !== undefined) {
      valores.push(req.body[campo]);
      actualizaciones.push(`${campo} = $${valores.length}`);
    }
  }

  if (actualizaciones.length === 0) {
    return res.status(400).json({ error: "No enviaste ningún campo para actualizar." });
  }

  valores.push(id);

  try {
    const { rows } = await pool.query(
      `UPDATE platos SET ${actualizaciones.join(", ")} WHERE id = $${valores.length} RETURNING *`,
      valores
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Plato no encontrado." });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo actualizar el plato." });
  }
});

// PATCH /api/platos/:id/disponibilidad (solo admin) - atajo rápido para el switch
router.patch("/:id/disponibilidad", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { disponible } = req.body;

  if (typeof disponible !== "boolean") {
    return res.status(400).json({ error: "'disponible' debe ser true o false." });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE platos SET disponible = $1 WHERE id = $2 RETURNING *`,
      [disponible, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Plato no encontrado." });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo actualizar la disponibilidad." });
  }
});

// DELETE /api/platos/:id (solo admin)
router.delete("/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query("DELETE FROM platos WHERE id = $1", [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: "Plato no encontrado." });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo eliminar el plato." });
  }
});

export default router;
