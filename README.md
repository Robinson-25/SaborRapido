# Sabor Rápido — Sistema de pedidos

Sistema completo: catálogo por categoría (Desayuno / Almuerzo / Cena), carrito de compras
que envía el pedido directo a WhatsApp, y panel admin para agregar platos o marcarlos como
agotados. Mismo diseño (naranja, Tailwind) que la web original.

```
sabor-rapido/
├── backend/     → API en Node.js + Express + PostgreSQL
└── frontend/    → React + Vite + Tailwind
```

## 1. Base de datos (Supabase — gratis)

1. Crea una cuenta en https://supabase.com y un nuevo proyecto (elige una región cercana, ej. São Paulo).
2. Ve a **SQL Editor** → **New query**, pega todo el contenido de `backend/schema.sql` y dale **Run**.
   Esto crea la tabla `platos` y siembra 9 platos de ejemplo (3 por categoría).
3. Ve a **Project Settings → Database → Connection string → URI** y copia la cadena de conexión
   (modo "Transaction", puerto 6543 es el recomendado para producción con pooling).

## 2. Backend

```bash
cd backend
cp .env.example .env
# Edita .env y pega tu DATABASE_URL de Supabase.
# Cambia también ADMIN_USER, ADMIN_PASSWORD y JWT_SECRET por valores propios.
npm install
npm run dev        # http://localhost:4000
```

Prueba que funciona: abre http://localhost:4000/api/salud (debe responder `{ ok: true }`)
y http://localhost:4000/api/platos (debe devolver los 9 platos de ejemplo).

## 3. Frontend

```bash
cd frontend
cp .env.example .env
# Edita .env: VITE_API_URL apunta a tu backend, VITE_WHATSAPP_NUMERO es tu número real
# (formato internacional sin "+", ej: 51927165123)
npm install
npm run dev         # http://localhost:5173
```

- Sitio público: `http://localhost:5173`
- Panel admin: `http://localhost:5173/admin` (usa el usuario/contraseña que pusiste en `backend/.env`)

## 4. Cómo funciona cada parte que pediste

- **Botones Desayuno / Almuerzo / Cena**: al hacer clic, el frontend pide `GET /api/platos?categoria=X`
  y muestra solo los platos de esa categoría y que estén `disponible = true`.
- **Carrito**: vive en `CartContext` (React state + `localStorage`, así no se pierde si recargas la página).
  El ícono 🛒 del header abre el panel lateral.
- **Enviar a WhatsApp**: al presionar "Enviar pedido por WhatsApp" se arma un mensaje de texto con
  todos los platos, cantidades y el total, y se abre `https://wa.me/TU_NUMERO?text=...` en una pestaña nueva
  — no necesita backend, es 100% frontend (`src/utils/whatsapp.js`).
- **Admin**: `/admin` pide usuario/contraseña (definidos en el backend), guarda un token (JWT) en el navegador,
  y con eso puede: agregar platos, editarlos, y usar el switch para marcar Disponible/Agotado al instante
  (sin borrar el plato, solo se oculta del catálogo público).

## 5. Desplegar en producción (Render)

**Backend (Web Service en Render):**
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Variables de entorno: las mismas que tu `.env` (`DATABASE_URL`, `ADMIN_USER`, `ADMIN_PASSWORD`,
  `JWT_SECRET`, `FRONTEND_URL` con la URL de tu frontend ya desplegado)

**Frontend (Static Site en Render, o Vercel/Netlify):**
- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Variables de entorno: `VITE_API_URL` (URL de tu backend en Render), `VITE_WHATSAPP_NUMERO`

Como Supabase vive fuera de Render, tus platos y cambios del admin **no se pierden** aunque
Render reinicie o redeployes el backend — eso era justo el problema de usar SQLite local.

## 6. Seguridad del login admin

Se usó autenticación simple según lo pedido: usuario/contraseña fijos guardados como variables
de entorno del backend (nunca en el código ni en el frontend), y un JWT de sesión que expira
a las 12 horas. Si más adelante quieres varios admins con sus propias cuentas, se puede evolucionar
fácilmente a una tabla `usuarios_admin` con contraseñas hasheadas (ya se instaló `bcryptjs` para eso).
