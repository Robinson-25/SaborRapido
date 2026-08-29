import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

// POST /api/auth/login  { usuario, password }
router.post("/login", (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ error: "Falta usuario o contraseña." });
  }

  const usuarioOk = usuario === process.env.ADMIN_USER;
  const passwordOk = password === process.env.ADMIN_PASSWORD;

  if (!usuarioOk || !passwordOk) {
    return res.status(401).json({ error: "Usuario o contraseña incorrectos." });
  }

  const token = jwt.sign({ usuario }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });

  res.json({ token });
});

export default router;
