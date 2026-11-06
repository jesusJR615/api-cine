//Esta clase se encarga de la lista de películas
//se controla el estado (R9), que se utiliza cuando está cargando
//habido un error en la carga, sin datos o tiene datos mal introducidos

import PeliculaI from "./PeliculaI";

export default function PeliculaL({peliculas, cargando, error, onEditar, onEliminar}){

    //compruebo si la película esta cargando (GET)
    if(cargando){
        return <p className="estdo">Película cargando......</p>
    }

    //Compruebo el error, ya que puede ser que el servidor del backen este apagado
    if(error){
        return(
            <p role="alert" className="estado error">
                No se puede cargar la lista de películas: {error}
            </p>
        );
    }

    //Si el servidor responde, puede ser que responda con datos o sin datos
    return(
        <section aria-label="Películas">
            <h2>Películas ({peliculas.length})</h2>

            {/* Si las películas no tienen datos, contro el código (R9) */}
            <ul className="lista-peliculas">
                {peliculas.map((pelicula) => (
                    <PeliculaI
                        key={pelicula.id}
                        pelicula={pelicula}
                        editar={onEditar}
                        eliminar={onEliminar}
                    />
                ))}
            </ul>
        </section>
    )
}