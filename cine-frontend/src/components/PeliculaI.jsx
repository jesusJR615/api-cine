//Esta clase consiste en la creación de trajetas
//para mostrar el contenido de una peícula

export default function PeliculaI({pelicula, editar, eliminar}){
    return(
        <li className="peliculaI">
            <div>
                <strong>{pelicula.titulo}</strong> ({pelicula.año}) — {pelicula.genero}
                <p>{pelicula.descripcion}</p>
                <p>
                    valoración: {pelicula.valoracion}/10 . Prioridad: {pelicula.prioridad}
                </p>
                 <p>
                    Director:{" "}
                    {pelicula.director
                        ? `${pelicula.director.nombre} ${pelicula.director.apellido}`
                        : "Sin director"}
                </p>
            </div>

             {/*Controlo el estado (R14, R15) */}
             <div className="botones">
                <button onClick={() => editar(pelicula)}>Editar</button>
                <button onClick={() => eliminar(pelicula)}>Eliminar</button>
             </div>
        </li>
    )
}