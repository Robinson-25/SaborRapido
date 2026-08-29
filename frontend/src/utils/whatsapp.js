const NUMERO_WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMERO || "51993942839";

export function construirLinkWhatsApp(items, total) {
  const lineas = items.map(
    (p) => `• ${p.cantidad}x ${p.nombre} — S/${(p.precio * p.cantidad).toFixed(2)}`
  );

  const mensaje = [
    "¡Hola! 👋 Quiero hacer un pedido en *Sabor Rápido*:",
    "",
    ...lineas,
    "",
    `*Total: S/${total.toFixed(2)}*`,
    "",
    "Quedo atento/a para confirmar dirección y forma de pago. ¡Gracias!",
  ].join("\n");

  const mensajeCodificado = encodeURIComponent(mensaje);
  return `https://wa.me/${NUMERO_WHATSAPP}?text=${mensajeCodificado}`;
}
