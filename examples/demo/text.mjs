// Utilidades de texto de la demo de orquestación (CACH-0106). No las usa la app.

/** Pone en mayúscula la primera letra y deja el resto igual. */
export function capitalize(text) {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** Convierte un texto en slug: minúsculas, sin tildes y con guiones simples. */
export function slugify(text) {
  if (!text) return ''
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
