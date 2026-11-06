import "dotenv/config";
import express from 'express';
import directorRoutes from './routes/director.routes.js';
import peliculasRoutes from './routes/peliculas.routes.js';
import { noEncontrado } from './middleware/error.js';
import { logger } from './middleware/logger.js';
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const PRODUCCION = process.env.NODE_ENV === "production";

//Establezco el CORS de forma dinámica, para que cuando este en local se utilice localHost y cuando este en produción se utilice la url
const origenes = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:4173"];

app.use(cors({ origin: origenes }));
app.use(express.json());
app.use(logger);

//Chekeo si el servicio esta activo o inactivo
app.get("/", (req, res) => {
  res.json({ estado: "ok", servicio: "api-cine" });
});

// Rutas API
app.use('/api/directores', directorRoutes);
app.use('/api/peliculas', peliculasRoutes);

// 404
app.use(noEncontrado);

//Errores globales
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: PRODUCCION ? "Error interno del servidor" : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});