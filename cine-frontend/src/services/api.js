//url definida en en la clase '.env'
const BASE_URL = import.meta.env.VITE_API_URL;
//Clave API del proyecto
export const CLAVE_SESSION = "cine-api-key";

//Creo una funcion genérica llamada 'paticion' en el que todas las peticiones
//realizadas pasen primero por esta antes de pasar por su función correspondiente.
//method es el método que se va a utilizar para realizar esa petición: GET, POST, PUT, PATCH, DELETE
async function peticion(ruta, {method = "GET", body, apikey} = {}) {
    //Cabera HTTP
    const cabecera = {};
    //realizo dos comprobaciones
    if(body) cabecera["Content-Type"] = "application/json";
    if(method !== "GET") cabecera["api-key"] = apikey ?? "";
    let respuesta;
    try {
        respuesta = await fetch(`${BASE_URL}${ruta}`, {
            method,
            headers: cabecera,
            body: body ? JSON.stringify(body) : undefined, 
        });
    } catch {
        throw new Error("No se pudo conectar con el servidor. Arranca el servidor (api-cine) puerto 3000");
    }
    // El backend (api-cine) responde con un JSON, si falla la respuesta convierto los datos a null
    let datos = null;
    try {
        datos = await respuesta.json();
    } catch {
    }

    // controlo el estado (R17), significa que la respuesta no se ha enviado correctamente.
    if (!respuesta.ok) {
        throw new Error(datos?.error || `Error en el servidor (${respuesta.status})`);
    }

    return datos;
    
}

//Method -> GET
//creo el método 'obtenerPeliculas', en el que controlo el estado (R12)
export function obtenerPeliculas(){
    return peticion("/api/peliculas");
}

//Creo el método 'obtenerPeliculasPrioridad', la prioridad puede ser Alta, Media o Baja
export function obtenerPeliculasPrioridad(prioridad){
    return peticion(`/api/peliculas/filtrar?prioridad=${encodeURIComponent(prioridad)}`);
}


//Al crear un nuevo director (POST) se requiere la api-key
//se controla el estado de la clave (R18)
export function crearDirector(director, apikey){
    //Retornamos la ruta donde se va ha realizar el POST
    // con los datos del director.
    return peticion("/api/directores", {method: "POST", body: director, apikey});
}


//Method -> POST
//Creo el método 'crearPelicula', controlo el estado (R13)
export function crearPelicula(pelicula, apikey){
    return peticion("/api/peliculas", {method: "POST", body: pelicula, apikey});
}

//Creo el método 'actualizarPelicula', controlo el estado (R14)
export function actualizarPelicula(id, pelicula, apikey){
    return peticion(`/api/peliculas/${id}`, { method: "PATCH", body: pelicula, apikey });
}

//Creo el método 'eliminarpelicula', controlo el estado (R15)
export function eliminarpelicula(id, apikey){
    return peticion(`/api/peliculas/${id}`, { method: "DELETE", apikey });
}



//Creo el método 'obtenerDirectores', controlo el estado (R12)
export function obtenerDirectores(){
    return peticion("/api/directores");
}



