//Esta clase se encarga de solicitar la apikey para poder
//realizar peticiones como añadir, actualizar, editar o eliminar
import { useState } from "react";
import { CLAVE_SESSION } from "../services/api";

export default function ApiKey({ apiKey, onGuardar }) {
  const [valor, setValor] = useState("");

  //para enviar el formulario, primero tienes que guardar la clave
  function claveGuardada(c) {
    c.preventDefault();
    sessionStorage.setItem(CLAVE_SESSION, valor);
    onGuardar(valor);
    setValor("");
  }
  //Quito la clave, si ya no se va a utilizar
  function claveQuitada() {
    sessionStorage.removeItem(CLAVE_SESSION);
    onGuardar("");
  }
  return (
    //Creo una seccion y dentro de está seccion creo un formulario
    <section className="api-key" aria-label="Clave API">
      <form onSubmit={claveGuardada}>
        <label htmlFor="api-key">Clave de API:</label>
        <input
          id="api-key"
          type="password"
          value={valor}
          onChange={(c) => setValor(c.target.value)}
          placeholder="Escribe aquí tu clave"
        ></input>
        <button type="submit">Usar clave</button>
      </form>
    
     {/* Estado de la clave (R9) */}
      {apiKey ? (
        <p>
          Clave activa para esta sesión.{" "}
          <button type="button" onClick={claveQuitada}>
            Quitar
          </button>
        </p>
      ) : (
        <p>Sin clave: solo podrás consultar.</p>
      )}
    </section>
  );
}
