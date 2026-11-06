import prisma from "../lib/prisma.js";

// Función para mostrar la lista de directores
export async function listaDirectores(req, res) {
  try {
    const directores = await prisma.director.findMany({ // findMany() obtengo todos los directores
      orderBy: { id: "asc" }, //ordeno el id de manera ascendente, se muestra '1,2,3,4'
    });

    res.json(directores); //Envio la respuesta en JSON
  } catch (error) {
    res.status(500).json({ error: "No se pudieron obtener los directores" }); //Error '500' si no se encuentra el director
  }
}

// Función para mostrar un director por id
export async function obtenerDirectorID(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) { //Comprubo que el usuario introduce un número y no una cadena de texto
      return res.status(400).json({ error: "El id debe ser un numero entero" });
    }

    const director = await prisma.director.findUnique({ // findUnique() obtengo el director por su id
      where: { id },
    });

    if (!director) { // si el director no existe, error '404'
      return res.status(404).json({ error: "Director no encontrado" });
    }

    res.json(director); // Envio la respuesta en JSON
  } catch (error) {
    res.status(500).json({ error: "No se pudo obtener el director" });
  }
}

// Función para crear un Director
export async function crearDirector(req, res) {
  try {
    const { nombre, apellido, edad, nacionalidad } = req.body; //Datos con los que se va a crear el director

    if (!nombre || !apellido || edad === undefined || !nacionalidad) { //Comprubo que el usuario a introducido todos los campos obligatorios
      return res.status(400).json({ error: "Completa el JSON con los campos obligatorios." });
    }

    const director = await prisma.director.create({ //Creo el nuevo director
      data: {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        edad: Number(edad),
        nacionalidad: nacionalidad.trim(),
      }
    });

    res.status(201).json(director); //Envio la respuesta en JSON
  } catch (error) {
    res.status(500).json({ error: "No se pudo crear el director" });
  }
}

// Función para actualizar el director
export async function actualizarDirector(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) { // Compruebo que el 'id' debe de ser un núemro y no una cadena de texto
      return res.status(400).json({ error: "El id debe ser un numero entero" });
    }

    const existente = await prisma.director.findUnique({ //Actualizo los valores de un director a trvavés de su id
      where: { id }
    });

    if (!existente) { //Si el director no existe error '404'
      return res.status(404).json({ error: "Director no encontrado" });
    }

    const { nombre, apellido, edad, nacionalidad } = req.body; //Datos con los que se va actualizar el director

    const datos = {}; //objeto vacio para almacenar los datos a actualizar

    if (nombre !== undefined) { // Se compruba que el nombre no sea 'undefined' y que tenga 3 caracteres o más
      if (typeof nombre !== "string" || nombre.trim().length < 3) {
        return res.status(400).json({
          error: "El nombre debe tener al menos 3 caracteres"
        });
      }
      datos.nombre = nombre.trim(); //El nombre se almacena en el objeto 'datos'
    }

    if (apellido !== undefined) {
      if (typeof apellido !== "string" || apellido.trim().length < 3) {
        return res.status(400).json({
          error: "El apellido debe tener al menos 3 caracteres"
        });
      }
      datos.apellido = apellido.trim();
    }

    if (edad !== undefined) {
      const edadN = Number(edad);
      if (isNaN(edadN) || !Number.isInteger(edadN) || edadN < 18 || edadN > 66) {
        return res.status(400).json({
          error: "La edad debe de ser un número entero entre 18 y 66"
        });
      }
      datos.edad = edadN;
    }

    if (nacionalidad !== undefined) {
      if (typeof nacionalidad !== "string" || nacionalidad.trim().length < 4) {
        return res.status(400).json({
          error: "La nacionalidad debe tener al menos 4 caracteres"
        });
      }
      datos.nacionalidad = nacionalidad.trim();
    }

    const director = await prisma.director.update({ //Actualizamos los datos del director por su id
      where: { id },
      data: datos
    });

    res.json(director); //Envio la respuesta JSON
  } catch (error) {
    res.status(500).json({ error: "No se pudo actualizar el director" });
  }
}

// Función para eliminar el director
export async function eliminarDirector(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) { //Comprubo que el usuario introduce un némero entero y no una cadena de texto
      return res.status(400).json({ error: "El id debe ser un numero entero" });
    }

    const existente = await prisma.director.findUnique({ //findUnique() obtengo el director a traves de su 'id'
      where: { id }
    });

    if (!existente) {
      return res.status(404).json({ error: "Director no encontrado" });
    }

    // Evitamos eliminar el director si tiene películas asociadas
    const peliculasAsociadas = await prisma.pelicula.count({ //Cuento las peliculas que dirige el director a traves de su 'id'
      where: { directorID: id }
    });

    if (peliculasAsociadas > 0) { // si el director tiene peliculas asociados, salta el error '400'
      return res.status(400).json({
        error: "No se puede eliminar el director ya que tiene películas asociadas"
      });
    }

    await prisma.director.delete({ //Elimino el director por su 'id'
      where: { id }
    });

    res.json({ mensaje: "Director eliminado correctamente" }); //Envio la respuesta en JSON
  } catch (error) {
    res.status(500).json({ error: "No se pudo eliminar el director" });
  }
}

