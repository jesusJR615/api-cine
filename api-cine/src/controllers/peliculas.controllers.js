import prisma from "../lib/prisma.js";

// Función para mostrar la lista de peliculas
export async function listaPeliculas(req, res) {
  try {
    const peliculas = await prisma.pelicula.findMany({ //Bucar todas las películas que incluyen algun director y se ordenan por orden ascendente
                                                      //A través de su 'id'
      include: { director: true },
      orderBy: { id: "asc" },
    });

    res.json(peliculas); //Devuelvo la respuesta en JSON
  } catch (error) {
    res.status(500).json({ error: "No se pudieron obtener las películas" });
  }
}

// Función para filtrar películas por prioridad
export async function filtradorPeliculas(req, res) {
  try {
    const { prioridad } = req.query; //Realizo el req.query para obtener la prioridad de la película

    const peliculas = await prisma.pelicula.findMany({ //Busco todas las peliculas por su prioridad, en el que se incluye el director y
                                                      //las ordeno en por su 'id' en orden ascendente
      where: { prioridad },
      include: { director: true },
      orderBy: { id: "asc" },
    });

    res.json(peliculas); //Devuelvo la respuesta en JSON
  } catch (error) {
    res.status(500).json({ error: "No se pudieron obtener las películas" });
  }
}

// Función para mostrar una película por id
export async function obtenerPeliculaID(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) { //Compruebo que el usuario introduce un núemro entero, en lugar de una cadena de texto
      return res.status(400).json({ error: "El id debe ser un número entero" });
    }

    const pelicula = await prisma.pelicula.findUnique({ //Busco una película por su 'id' en el que se incluye el director
      where: { id },
      include: { director: true },
    });

    if (!pelicula) { //Si la película no existe devvuelvo un JSON error '404'
      return res.status(404).json({ error: "Película no encontrada" });
    }

    res.status(200).json(pelicula); //Devuelvo la respuesta correcta en JSON
  } catch (error) {
    res.status(500).json({ error: "No se pudo obtener la película" });
  }
}

// Función para crear la película
export async function crearPelicula(req, res) {
  try {
    const { titulo, descripcion, año, genero, valoracion, directorID, prioridad } = req.body;

    if (!titulo || año === undefined || !genero || !directorID) { //Compruebo que el usuario ha introducido los campos obligatorios
                                                                  //como 'titulo', 'año', ''genero' y 'directorID'
      return res.status(400).json({ error: "Completa el JSON con los campos obligatorios." });
    }

    if (prioridad !== undefined && !["Alta", "Media", "Baja"].includes(prioridad)) { //Comprubo que el usuario introduce bien la prioridad
      return res.status(400).json({ error: "La prioridad debe ser Alta, Media o Baja" });
    }

    // Verificar si el director existe
    const directorExiste = await prisma.director.findUnique({
      where: { id: Number(directorID) }
    });

    if (!directorExiste) {
      return res.status(404).json({ error: "El director especificado no existe" });
    }

    const pelicula = await prisma.pelicula.create({ //Creo la nueva película con los datos que ha introducido el usuario
      data: {
        titulo: titulo.trim(),
        descripcion: descripcion ? descripcion.trim() : "",
        año: Number(año),
        genero: genero.trim(),
        valoracion: valoracion !== undefined ? Number(valoracion) : 0,
        prioridad: prioridad !== undefined ? prioridad : "Media", //Si el usuario no introduce la priroridad, por defecto se asigna 'Media'
        directorID: Number(directorID)
      }
    });

    res.status(201).json(pelicula); //Envio la respuesta en JSON
  } catch (error) {
    res.status(500).json({ error: "No se pudo crear la película" });
  }
}

// Función para actualizar la película
export async function actualizarPelicula(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "El id debe ser un número entero" });
    }

    const existente = await prisma.pelicula.findUnique({
      where: { id }
    });

    if (!existente) {
      return res.status(404).json({ error: "Película no encontrada" });
    }

    const { titulo, descripcion, año, genero, valoracion, prioridad, directorID } = req.body;

    const datos = {}; //objeto vacio para almacenar los datos ha actualizar

    if (titulo !== undefined) {
      if (typeof titulo !== "string" || titulo.trim().length < 3) { //compruebo que el titulo no sea 'undefined'
                                                                    // y que tenga almenos 3 caracteres
        return res.status(400).json({
          error: "El título debe tener al menos 3 caracteres"
        });
      }
      datos.titulo = titulo.trim(); //Añado el titulo al objeto vacio 'datos'
    }

    if (descripcion !== undefined) {
      if (typeof descripcion !== "string" || descripcion.trim().length < 3) {
        return res.status(400).json({
          error: "La descripción debe tener al menos 3 caracteres"
        });
      }
      datos.descripcion = descripcion.trim();
    }

    if (año !== undefined) {
      const añoN = Number(año);
      if (isNaN(añoN) || !Number.isInteger(añoN) || añoN < 1895 || añoN > 2100) { //Comprubo que el año no sea 'undefined'
                                                                                  //y que el año de la película debe ser entre 1985 y 2100
        return res.status(400).json({
          error: "El año de la película debe ser un número entero válido (entre 1895 y 2100)"
        });
      }
      datos.año = añoN;
    }

    if (valoracion !== undefined) {
      const valN = Number(valoracion);
      if (isNaN(valN) || !Number.isInteger(valN) || valN < 0 || valN > 10) {
        return res.status(400).json({
          error: "La valoración debe ser un número entero entre 0 y 10"
        });
      }
      datos.valoracion = valN;
    }

    if (genero !== undefined) {
      if (typeof genero !== "string" || genero.trim().length < 3) {
        return res.status(400).json({
          error: "El género debe tener al menos 3 caracteres"
        });
      }
      datos.genero = genero.trim(); 
    }

    if (prioridad !== undefined) {
      if (typeof prioridad !== "string" || !["Alta", "Media", "Baja"].includes(prioridad)) { //Comprubo que el usuario introduce bien la prioridad
        return res.status(400).json({
          error: "La prioridad debe ser Alta, Media o Baja"
        });
      }
      datos.prioridad = prioridad; 
    }

    if (directorID !== undefined) {
      const dirID = Number(directorID);
      if (isNaN(dirID) || !Number.isInteger(dirID) || dirID <= 0) { //Comprubo que el 'directorID' no sea 'undefined'
                                                                    //y que sea un número entero positivo o igual a 0
        return res.status(400).json({
          error: "El ID del director debe ser un número entero positivo"
        });
      }

      const directorExiste = await prisma.director.findUnique({ //findUnique() obtengo el director a trves de su 'id'
        where: { id: dirID }
      });

      if (!directorExiste) { //Si el director no existe devuelvo el error '404' en JSON
         return res.status(404).json({
          error: "El director especificado no existe"
        });
      }

      datos.directorID = dirID;
    }

    const peliculaActualizada = await prisma.pelicula.update({ //Actualizo una película concreta a traves de su 'id'
      where: { id },
      data: datos
    });

    res.status(200).json(peliculaActualizada); //Envio la respuesta en JSON
  } catch (error) {
    res.status(500).json({ error: "No se pudo actualizar la película" });
  }
}

// Función para obtener todas las películas de un director
export async function peliculasDirector(req, res) {
  try {
    const directorID = Number(req.params.id);

    if (!Number.isInteger(directorID)) { //Comprubo que el 'directorID' sea un numero entero y no una cadena de texto
      return res.status(400).json({ error: "El ID del director debe ser un número entero" });
    }

    const director = await prisma.director.findUnique({//findUnique() obtengo el director a traves de su 'id'
      where: { id: directorID }
    });

    if (!director) { //Si el director no existe devuelvo el error '404' en JSON
      return res.status(404).json({
        error: "Director no encontrado"
      });
    }

    const peliculas = await prisma.pelicula.findMany({//findMany() obtengo todas las peliculas de un director a traves de 
                                                      //su 'id' en orden ascendente
      where: { directorID: directorID },
      orderBy: { id: "asc" }
    });

    res.status(200).json(peliculas); //Envio la respuesta en JSON
  } catch (error) {
    res.status(500).json({
      error: "No se pueden obtener las películas del director"
    });
  }
}

// Función para eliminar la película
export async function eliminarPelicula(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) { //Comprubo que el 'id' introducido sea un número entero y no una cadena de texto
      return res.status(400).json({ error: "El id debe ser un número entero" });
    }

    const existente = await prisma.pelicula.findUnique({ //Busco una pelicula concreta a traves de su 'id'
      where: { id }
    });

    if (!existente) { //Si la pelicula no existe devuelvo el error '404' en JSON
      return res.status(404).json({ error: "Película no encontrada" });
    }

    await prisma.pelicula.delete({ //Elimino la película a traves de su 'id'
      where: { id }
    });

    res.json({ mensaje: "Película eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "No se pudo eliminar la película" });
  }
}
