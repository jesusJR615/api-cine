//Esta clase consiste en la creación del formularió de películas
import { useState } from "react";
import DirectorS from "./DirectorS";

//Creo los elementos del formulario vacios
//Valoración por defecto a 0 y prioridad por defecto 'Media'
const elementosVacios = {
    titulo: "",
    descripcion: "",
    anio: "",
    genero: "",
    valoracion: "0",
    prioridad: "Media",
    directorID: "",
};

//Creo la funcion 'estadoPelicula' para convertir los elementos del backend 'api-cine'
//al formaulario
function estadoPelicula(pelicula) {
    //Compruebo el estado de la pelicula
    if (!pelicula) return elementosVacios;
    return {
        titulo: pelicula.titulo,
        descripcion: pelicula.descripcion,
        anio: String(pelicula.año), //convierto el año de la pelicula a texto (String) ya que los input del formulario se manejan con texto
        genero: pelicula.genero,
        valoracion: String(pelicula.valoracion), //Realizo exactamente lo mismo que en año
        prioridad: pelicula.prioridad,
        directorID: String(pelicula.directorID), //Realizo lo mismo que el año y que la valoración
    };
}

//Creo la funcion 'formPelicula' para crear el formulario donde se van a introducir los valores
export default function FormPelicula({ directores, peliculaEditar, onGuardar, onCancelar, ocupado }) {
    const [datos, setDatos] = useState(() => estadoPelicula(peliculaEditar));
    const [errorFormulario, setErrorFormulario] = useState("");

    //Manejo el estado (R6) para realizar la actualización de los campos del formulario
    function cambiarCampo(campo, valor) {
        setDatos((anterior) => ({ ...anterior, [campo]: valor }));
    }

    //Manejo el envio del formulario
    function envioFormulario(e) {
        e.preventDefault();

        //convierto a string anio, valoracion y directorID ya que son números enteros y el formulario, solo maneja texto (String)
        const anio = Number(datos.anio);
        const valoracion = Number(datos.valoracion);
        const directorID = Number(datos.directorID);

        //Realizo todas las comprobaciones
        // Validaciones del cliente (el backend también valida: doble red de seguridad)
        if (datos.titulo.trim().length < 3) {
            setErrorFormulario("El título debe tener al menos 3 caracteres.");
            return;
        }
        if (datos.descripcion.trim() && datos.descripcion.trim().length < 3) {
            setErrorFormulario("La descripción, si se rellena, debe tener al menos 3 caracteres.");
            return;
        }
        if (!Number.isInteger(anio) || anio < 1895 || anio > 2100) {
            setErrorFormulario("El año debe ser un número entero entre 1895 y 2100.");
            return;
        }
        if (!Number.isInteger(valoracion) || valoracion < 0 || valoracion > 10) {
            setErrorFormulario("La valoración debe ser un número entero entre 0 y 10.");
            return;
        }
        if (!directorID) {
            setErrorFormulario("Debes elegir un director.");
            return;
        }

        setErrorFormulario("");

        //Creo el cuerpo JSON para las peticiones POST Y PATCH
        onGuardar({
            titulo: datos.titulo.trim(),
            descripcion: datos.descripcion.trim(),
            año: anio,
            genero: datos.genero.trim(),
            valoracion,
            prioridad: datos.prioridad,
            directorID,
        });

    }

    //creación del formulario con HTML
    return (
        <section aria-label="Formulario de películas">
            <h2>{peliculaEditar ? `Editar: ${peliculaEditar.titulo}` : "Nueva película"}</h2>

            <form onSubmit={envioFormulario}> {/* manejo el estado (R11) */}
                <div>
                    <label htmlFor="titulo">Título:</label>
                    <input
                        id="titulo"
                        value={datos.titulo}
                        onChange={(e) => cambiarCampo("titulo", e.target.value)}
                        disabled={ocupado}
                    />
                </div>

                <div>
                    <label htmlFor="descripcion">Descripción:</label>
                    <input
                        id="descripcion"
                        value={datos.descripcion}
                        onChange={(e) => cambiarCampo("descripcion", e.target.value)}
                        disabled={ocupado}
                    />
                </div>

                <div>
                    <label htmlFor="anio">Año:</label>
                    <input
                        id="anio"
                        type="number" //el tipo lo establezco númerico, pero en el imput del formulario sigue siendo un texto (String)
                        value={datos.anio}
                        onChange={(e) => cambiarCampo("anio", e.target.value)}
                        disabled={ocupado}
                    />
                </div>

                <div>
                    <label htmlFor="genero">Género:</label>
                    <input
                        id="genero"
                        value={datos.genero}
                        onChange={(e) => cambiarCampo("genero", e.target.value)}
                        disabled={ocupado}
                    />
                </div>

                <div>
                    <label htmlFor="valoracion">Valoración (0-10):</label>
                    <input
                        id="valoracion"
                        type="number" //Ocurre los mismo que en el año (anio)
                        min="0"
                        max="10"
                        value={datos.valoracion}
                        onChange={(e) => cambiarCampo("valoracion", e.target.value)}
                        disabled={ocupado}
                    />
                </div>

                <div>
                    <label htmlFor="prioridad">Prioridad:</label>
                    <select
                        id="prioridad"
                        value={datos.prioridad}
                        onChange={(e) => cambiarCampo("prioridad", e.target.value)}
                        disabled={ocupado}
                    >
                        {/* Prioridad que se establecio y que se controlo en (api-cine)*/}
                        <option value="Alta">Alta</option>
                        <option value="Media">Media</option>
                        <option value="Baja">Baja</option>
                    </select>
                </div>

                {/* controlo el estado (R5), llamo a la clase DirectorS, para poder seleccionar un director */}
                <DirectorS
                    directores={directores}
                    valor={datos.directorID}
                    onChange={(v) => cambiarCampo("directorID", v)}
                    deshabilitado={ocupado}
                />

                {/* controlo el estado (R9, R17), este estado indica que habido un error en el formulario al crear la película */}
                {errorFormulario && <p role="alert">{errorFormulario}</p>}

                <button type="submit" disabled={ocupado}>
                    {ocupado ? "Guardando..." : peliculaEditar ? "Guardar cambios" : "Crear película"}
                </button>

                {/* controlo el estado (R9), este estado salta cuando una película esta ocupada o no se ha podido cancelar */}
                {peliculaEditar && (
                    <button type="button" onClick={onCancelar} disabled={ocupado}>
                        Cancelar
                    </button>
                )}
            </form>
        </section>
    );

}