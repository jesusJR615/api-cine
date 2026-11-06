// Función para validar la película
export function validarPelicula(req, res, next) {
  const { titulo, descripcion, año, genero, directorID, prioridad } = req.body;

  // Compruebo los campos obligatorios
  if (!titulo || año === undefined || !genero || !directorID) {
    return res.status(400).json({
      error: "Datos incorrectos: 'titulo', 'año', 'genero' y 'directorID' son obligatorios"
    });
  }

  // Compruebo el título
  if (typeof titulo !== 'string' || titulo.trim().length < 3) {
    return res.status(400).json({ error: "El título debe ser un texto de al menos 3 caracteres" });
  }

  // Compruebo la descripción si viene informada
  if (descripcion !== undefined && (typeof descripcion !== 'string' || descripcion.trim().length < 3)) {
    return res.status(400).json({ error: "La descripción debe ser un texto de al menos 3 caracteres" });
  }

  // Compruebo el año
  const añoN = Number(año);
  if (isNaN(añoN) || !Number.isInteger(añoN) || añoN < 1895 || añoN > 2100) {
    return res.status(400).json({
      error: "El año debe ser un número entero válido (entre 1895 y 2100)"
    });
  }

  // Compruebo el género
  if (typeof genero !== 'string' || genero.trim().length < 3) {
    return res.status(400).json({ error: "El género debe ser un texto de al menos 3 caracteres" });
  }

  // Compruebo directorID
  const idDir = Number(directorID);
  if (isNaN(idDir) || !Number.isInteger(idDir) || idDir <= 0) {
    return res.status(400).json({
      error: "El ID del director debe ser un número entero positivo válido"
    });
  }

  //compruebo la prioridad
  if (prioridad !== undefined && (typeof prioridad !== 'string' || !["Alta", "Media", "Baja"].includes(prioridad))) {
    return res.status(400).json({ error: "La prioridad debe ser Alta, Media o Baja" });
  }

  next();
}


// Función para validar el filtro de la pelicula
export function validarFiltro(req, res, next){
  const prioridad = req.query.prioridad; //obtengo la prioridad de las peliculas 

  if(!prioridad){ //Si la prioridad no existe, muestro el error '400' en JSON
    return res.status(400).json({
      error: "Falta la prioridad 'Alta', 'Media' o 'Baja'"
    });
  }

  if (typeof prioridad !== "string" || !["Alta", "Media", "Baja"].includes(prioridad)) { 
    return res.status(400).json({ error: "La prioridad debe ser Alta, Media o Baja" });
  }
  next();
}