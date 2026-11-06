//Esta clase se encarga del formulario del director
import { useState } from "react";

//Elementos o atributos que cuenta el director
const estdoI = { nombre: "", apellido: "", edad: "", nacionalidad: "" };

export default function DirectorF({ onCrear, ocupado }) {
  const [datos, setDatos] = useState(estdoI);
  const [errorFormulario, setErrorFormulario] = useState("");

  //Actualizacion del estado (R6)
  function cambiarCampo(campo, valor) {
    setDatos((anterior) => ({ ...anterior, [campo]: valor }));
  }

  //Envío del director con el estado (R10)
  async function Envio(e) {
    e.preventDefault(); //para que el navegador no recargue la página

    const edad = Number(datos.edad); //convierto la edad a un número entero

    //Realizo las comprobaciones de nombre, apellidos, edad y nacionalidad
    if (datos.nombre.trim().length < 3) {
      setErrorFormulario("El nombre debe tener al menos 3 caracteres.");
      return;
    }
    if (datos.apellido.trim().length < 3) {
      setErrorFormulario("El apellido debe tener al menos 3 caracteres.");
      return;
    }
    if (!Number.isInteger(edad) || edad < 18 || edad > 66) {
      setErrorFormulario("La edad debe ser un número entero entre 18 y 66.");
      return;
    }
    if (datos.nacionalidad.trim().length < 4) {
      setErrorFormulario("La nacionalidad debe tener al menos 4 caracteres.");
      return;
    }
    setErrorFormulario("");

    //Creo el JSON con los datos que espera el backend (api-cine)
    const json = await onCrear({
      nombre: datos.nombre.trim(),
      apellido: datos.apellido.trim(),
      edad,
      nacionalidad: datos.nacionalidad.trim(),
    });

    //Realizo una comprobación para saber si la creación fue correctamente
    if (json) setDatos(estdoI);
  }

  return (
    //Creo una sección y dentro de ella creo el formulario con sus respectivos campos
    <section aria-label="Formulario de directores">
      <h2>Nuevo director</h2>
      {/* Manejo el estado (R11) */}
      <form onSubmit={Envio}>
        <div>
          <label htmlFor="nombre">Nombre:</label>
          <input
            id="nombre"
            value={datos.nombre}
            onChange={(e) => cambiarCampo("nombre", e.target.value)}
            disabled={ocupado}
          />
        </div>
        <div>
          <label htmlFor="apellido">Apellido:</label>
          <input
            id="apellido"
            value={datos.apellido}
            onChange={(e) => cambiarCampo("apellido", e.target.value)}
            disabled={ocupado}
          />
        </div>
        <div>
          <label htmlFor="edad">Edad (18-66):</label>
          <input
            id="edad"
            type="number"
            value={datos.edad}
            onChange={(e) => cambiarCampo("edad", e.target.value)}
            disabled={ocupado}
          />
        </div>
        <div>
          <label htmlFor="nacionalidad">Nacionalidad:</label>
          <input
            id="nacionalidad"
            value={datos.nacionalidad}
            onChange={(e) => cambiarCampo("nacionalidad", e.target.value)}
            disabled={ocupado}
          />
        </div>

        {/* Manejo el estado (R9, R17) */}
        {errorFormulario && <p role="alert">{errorFormulario}</p>}

        <button type="submit" disabled={ocupado}>
          {ocupado ? "Guardando..." : "Crear director"}
        </button>
      </form>
    </section>
  );
}
