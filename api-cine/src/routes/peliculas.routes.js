import { Router } from "express";

import {
  listaPeliculas,
  filtradorPeliculas,
  obtenerPeliculaID,
  crearPelicula,
  actualizarPelicula,
  eliminarPelicula
} from "../controllers/peliculas.controllers.js";//Importo todos los métodos creados anteriormente en la clase peliculas.controllers

import { validarPelicula, validarFiltro } from "../middleware/validarPelicula.js"; //Importo las validades de las peliculas, junto con el filtro

import { comprobarApiKey } from "../middleware/apikey.js"; //Importo la apiKey 'api-key'

//Defino las rutas
const router = Router();

router.get("/", listaPeliculas);
router.get("/filtrar", validarFiltro, filtradorPeliculas);
router.get("/:id", obtenerPeliculaID);

router.post("/", comprobarApiKey, validarPelicula, crearPelicula);
router.patch("/:id", comprobarApiKey, actualizarPelicula);
router.delete("/:id", comprobarApiKey, eliminarPelicula);

export default router;