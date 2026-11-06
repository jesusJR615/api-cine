// Función para validar el director
export function validarDirector(req, res, next) {
  const { nombre, apellido, edad, nacionalidad } = req.body;

  // Compruebo los campos obligatorios
  if (!nombre || !apellido || edad === undefined || !nacionalidad) {
    return res.status(400).json({
      error: "Datos incorrectos: 'nombre', 'apellido', 'edad', 'nacionalidad' son obligatorios"
    });
  }

  // Compruebo el nombre
  if (typeof nombre !== 'string' || nombre.trim().length < 3) {
    return res.status(400).json({
      error: "El nombre debe de tener al menos 3 caracteres"
    });
  }

  // Compruebo el apellido
  if (typeof apellido !== 'string' || apellido.trim().length < 3) {
    return res.status(400).json({
      error: "El apellido debe de tener al menos 3 caracteres"
    });
  }

  // Compruebo la edad
  const edadN = Number(edad);
  if (isNaN(edadN) || !Number.isInteger(edadN) || edadN < 18 || edadN > 66) {
    return res.status(400).json({
      error: "La edad debe de ser un número entero entre 18 y 66"
    });
  }

  // Compruebo la nacionalidad
  if (typeof nacionalidad !== 'string' || nacionalidad.trim().length < 4) {
    return res.status(400).json({
      error: "La nacionalidad debe de tener al menos 4 caracteres"
    });
  }

  next();
}