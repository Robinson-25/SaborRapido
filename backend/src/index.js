import express from "express";
import cors from "cors";
import "dotenv/config";
import platosRouter from "./routes/platos.js";
import authRouter from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 4000;

const origenesPermitidos = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        origenesPermitidos.includes(origin) ||
        /\.vercel\.app$/.test(new URL(origin).hostname)
      ) {
        return callback(null, true);
      }
      return callback(new Error("No permitido por CORS"));
    },
  })
);

app.use(express.json());

app.get("/api/salud", (req, res) => {
  res.json({ ok: true, mensaje: "API Sabor Rápido funcionando 🍔" });
});

app.use("/api/auth", authRouter);
app.use("/api/platos", platosRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada." });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`✅ API corriendo en http://localhost:${PORT}`);
  });
}

export default app;
