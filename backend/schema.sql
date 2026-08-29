-- Ejecuta este script una vez en tu base de datos (Supabase: SQL Editor > New query > pegar y Run)

CREATE TABLE IF NOT EXISTS platos (
  id           SERIAL PRIMARY KEY,
  nombre       TEXT NOT NULL,
  descripcion  TEXT NOT NULL DEFAULT '',
  precio       NUMERIC(10, 2) NOT NULL,
  categoria    TEXT NOT NULL CHECK (categoria IN ('desayuno', 'almuerzo', 'cena')),
  imagen       TEXT NOT NULL DEFAULT '',
  emoji        TEXT NOT NULL DEFAULT '🍽️',
  etiqueta     TEXT NOT NULL DEFAULT '', -- ej: "Más Vendida", "Nuevo", "Oferta" (vacío = sin etiqueta)
  calorias     INTEGER,
  disponible   BOOLEAN NOT NULL DEFAULT true,
  creado_en    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Datos de ejemplo, uno por categoría (puedes editarlos luego desde el admin)
INSERT INTO platos (nombre, descripcion, precio, categoria, imagen, emoji, etiqueta, calorias, disponible)
VALUES
  ('Pan con Huevo y Jamón', 'Pan fresco, huevo frito, jamón y queso, acompañado de café o jugo.', 8.50, 'desayuno', '', '🍳', 'Más Pedido', 380, true),
  ('Tamal Criollo', 'Tamal de maíz relleno de pollo, servido con salsa criolla y pan.', 7.00, 'desayuno', '', '🌽', 'Nuevo', 420, true),
  ('Jugo + Sandwich Mixto', 'Jugo natural de tu elección más sandwich de pollo y palta.', 9.90, 'desayuno', '', '🥪', '', 350, true),

  ('Hamburguesa Suprema', 'Doble carne de res premium, queso cheddar derretido, tocino crujiente, lechuga fresca, tomate y nuestra salsa especial secreta.', 18.99, 'almuerzo', '', '🍔', 'Más Vendida', 650, true),
  ('Pollo Crujiente Deluxe', 'Pechuga de pollo empanizada con mezcla de especias secretas, ensalada mixta, aguacate fresco y aderezo ranch casero.', 16.99, 'almuerzo', '', '🍗', 'Nuevo', 580, true),
  ('Combo Familiar', '4 hamburguesas clásicas, papas fritas grandes, aros de cebolla crujientes y 4 bebidas a elección.', 45.99, 'almuerzo', '', '👨‍👩‍👧‍👦', 'Oferta', 2400, true),

  ('Parrilla Mixta', 'Selección de carnes a la parrilla con papas doradas y ensalada de la casa.', 32.90, 'cena', '', '🍖', 'Más Vendida', 890, true),
  ('Pasta Alfredo', 'Fettuccine en salsa alfredo cremosa con pollo a la plancha.', 21.50, 'cena', '', '🍝', '', 720, true),
  ('Pizza Familiar', 'Pizza grande a elección de 2 sabores, ideal para compartir en la cena.', 38.00, 'cena', '', '🍕', 'Oferta', 1600, true);
