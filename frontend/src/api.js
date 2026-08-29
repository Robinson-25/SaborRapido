const API_URL =
  import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:4000" : "");

async function manejarRespuesta(res) {
  if (!res.ok) {
    let mensaje = "Ocurrió un error inesperado.";
    try {
      const data = await res.json();
      mensaje = data.error || mensaje;
    } catch (_) {
      /* respuesta sin cuerpo JSON */
    }
    throw new Error(mensaje);
  }
  if (res.status === 204) return null;
  return res.json();
}

function headersAdmin() {
  const token = localStorage.getItem("sabor_rapido_admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // --- Públicas ---
  obtenerPlatos: (categoria) => {
    const query = categoria ? `?categoria=${categoria}` : "";
    return fetch(`${API_URL}/api/platos${query}`).then(manejarRespuesta);
  },

  // --- Admin ---
  login: (usuario, password) =>
    fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, password }),
    }).then(manejarRespuesta),

  obtenerPlatosAdmin: () =>
    fetch(`${API_URL}/api/platos?incluirNoDisponibles=1`, {
      headers: headersAdmin(),
    }).then(manejarRespuesta),

  crearPlato: (plato) =>
    fetch(`${API_URL}/api/platos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headersAdmin() },
      body: JSON.stringify(plato),
    }).then(manejarRespuesta),

  actualizarPlato: (id, cambios) =>
    fetch(`${API_URL}/api/platos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...headersAdmin() },
      body: JSON.stringify(cambios),
    }).then(manejarRespuesta),

  cambiarDisponibilidad: (id, disponible) =>
    fetch(`${API_URL}/api/platos/${id}/disponibilidad`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...headersAdmin() },
      body: JSON.stringify({ disponible }),
    }).then(manejarRespuesta),

  eliminarPlato: (id) =>
    fetch(`${API_URL}/api/platos/${id}`, {
      method: "DELETE",
      headers: headersAdmin(),
    }).then(manejarRespuesta),
};
