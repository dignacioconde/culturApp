// Utilidades de texto de la demo de orquestación (CACH-0106). No las usa la app.

/** Pone en mayúscula la primera letra y deja el resto igual. */
export function capitalize(text) {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}
