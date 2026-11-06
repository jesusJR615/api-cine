// Rutas no encontradas con código (404)
export function noEncontrado(req, res, next) {
  res.status(404).json({ error: "Ruta no encontrada" });
}
