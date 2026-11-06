import { Router } from "express";

import {
  listaDirectores,
  obtenerDirectorID,
  crearDirector,
  actualizarDirector,
  eliminarDirector
} from "../controllers/directores.controllers.js"; //Importo todos los métodos creados anteriormente en la clase directores.controllers

import { validarDirector } from "../middleware/validarDirector.js";  //Importo las validades
import { peliculasDirector } from '../controllers/peliculas.controllers.js'; //Importo el método 'peliculasDirector' para obtener las peliculas 
                                                                             //que dirige un director
import { comprobarApiKey } from "../middleware/apikey.js"; //Importo la api-key

//Defino las rutas
const router = Router();

router.get("/", listaDirectores);
router.get("/:id", obtenerDirectorID);
router.get("/:id/peliculas", peliculasDirector);

router.post("/", comprobarApiKey, validarDirector, crearDirector);
router.patch("/:id", comprobarApiKey, actualizarDirector);
router.delete("/:id", comprobarApiKey, eliminarDirector);

export default router;