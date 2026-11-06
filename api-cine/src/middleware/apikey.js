import "dotenv/config";

export function comprobarApiKey(req, res, next) {
  const apiKey = req.header("api-key"); // apiKey ->  'api-key' es la clave de la api para realizar las peticiones

  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      error: "Clave de API incorrecta o ausente"
    });
  }

  next();
}
