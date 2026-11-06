import { useState, useEffect } from 'react'; // Utilizo 'useEffect' para sincronizar un elemento que ha sido renderizado en la pantalla 
import * as api from "./services/api";
import ApiKey from "./components/ApiKey";
import DirectorF from "./components/DirectorF";
import PeliculaF from "./components/PeliculaF";
import PeliculaL from "./components/PeliculaL";

export default function App() {
  //Controlo el estado (R6), en el que solo reemplaza
  const [peliculas, setPeliculas] = useState([]);
  const [directores, setDirectores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
  const [errorAccion, setErrorAccion] = useState("");
  const [apiKey, setApiKey] = useState(() => sessionStorage.getItem(api.CLAVE_SESSION) ?? "");
  const [peliculaEditar, setPeliculaEditar] = useState(null);
  const [filtarPrioridad, setFiltrarPrioridad] = useState("");
  const [ocupado, setOcupado] = useState(false);

  //Controlo el estado (R7), en el que utilizo 'useEffect' con la contante 'filtarPrioridad'
  useEffect(() => {
    let cancelado = false;
    //Creo la funcion 'cargar()'
    async function cargar() {
      setCargando(true);
      setErrorCarga("");

      //Creo un try catch para controlar las excepciónes que puedan ocurrir
      try {
        //Pido las películas con prioridad y sin prioridad, y los directores
        const [peliculas, directores] = await Promise.all([
          filtarPrioridad ? api.obtenerPeliculasPrioridad(filtarPrioridad) : api.obtenerPeliculas(),
          api.obtenerDirectores(),
        ]);
        if (!cancelado) {
          setPeliculas(peliculas);
          setDirectores(directores);
        }
      } catch (error) {
        //Compruebo si el servidor de (api-cine) está apagado
        if (!cancelado) {
          setErrorCarga(error.message);
        };
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    }

    //llamo a la funcion cargar()
    cargar();

    return () => {
      cancelado = true;
    };

  }, [filtarPrioridad]);


  //Controlo el estado (R16), creo la función 'peliculasRefrescar()' 
  //ya que tras crear, editar o eleminar una pelicula se refleje automaticamente, sin tener que recargar la página
  async function peliculasRefrescar() {
    try {
      const datos = filtarPrioridad ? await api.obtenerPeliculasPrioridad(filtarPrioridad) : await api.obtenerPeliculas();
      setPeliculas(datos) //llamo al set de peliculas, ya que creo un nuevo array
    } catch (error) {
      setErrorAccion(error.message);
    }
  }

  //Controlo el estado (R16), creo la funcion 'directoresRefrescar
  //ya que tras crear, editar o eleminar un director se refleje automaticamente, sin tener que recargar la página
  async function directoresRefrescar() {
    try {
      setDirectores(await api.obtenerDirectores());
    } catch (error) {
      setErrorAccion(error.message);
    }
  }

  //Creo el método 'ejecutarAccion' para comprobar el method: POST, PATCH y DELETE
  async function ejecutarAccion(operacion, refresco = peliculasRefrescar) {
    setOcupado(true);
    setErrorAccion("");
    try {
      await operacion();
      await refresco();
      return true;
    } catch (error) {
      setErrorAccion(error.message);
      return false;
    } finally {
      setOcupado(false);
    }
  }

  //Creo los handers para interactuar con la interfaz
  //Controlo el estado (R13), creo la funcion 'crearHanders'
  function crearHanders(datosPelicula) {
    return ejecutarAccion(() => api.crearPelicula(datosPelicula, apiKey));
  }

  //Controlo el estado (R14), creo la función actualiarHanders
  async function actualizarHanders(datosPelicula) {
    const ok = await ejecutarAccion(() => api.actualizarPelicula(peliculaEditar.id, datosPelicula, apiKey));
    //Compruebo el estado ok
    if (ok) {
      setPeliculaEditar(null);
    }
  }

  //Controlo el estado (R15), creo la función eliminarHanders
  function eliminarHanders(pelicula) {
    const seguro = window.confirm(`¿Seguro que quieres eliminar "${pelicula.titulo}"?`);
    //Compruebo el seguro
    if (!seguro) return;
    return ejecutarAccion(() => api.eliminarpelicula(pelicula.id, apiKey));
  }

  //controlo el estado (R13), creo la función crearDirectorHanders
  function crearDirectorHanders(datosDirector) {
    return ejecutarAccion(
      () => api.crearDirector(datosDirector, apiKey), directoresRefrescar
    );
  }


  //Creo el HTML
  return (
    <main className="app">
      <h1>Cine — Gestión de películas</h1>

      {/* Controlo los estados (R18, R19, R20) */}
      <ApiKey apiKey={apiKey} onGuardar={setApiKey} />

      {/*Controlo el estado  (R17) */}
      {errorAccion && (
        <p role="alert" className="banner-error">
          {errorAccion}{" "}
          <button onClick={() => setErrorAccion("")}>Cerrar</button>
        </p>
      )}
      <DirectorF onCrear={crearDirectorHanders} ocupado={ocupado} />

      <PeliculaF
        key={peliculaEditar ? peliculaEditar.id : "nueva"}
        directores={directores}
        peliculaEditar={peliculaEditar}
        onGuardar={(datos) =>
          peliculaEditar ? actualizarHanders(datos) : crearHanders(datos)
        }
        onCancelar={() => setPeliculaEditar(null)}
        ocupado={ocupado}
      />

      {/* Controlo el estado ( R11), sirve para filtar por prioridad */}
      <section className="filtro" aria-label="Filtro por prioridad">
        <label htmlFor="filtro">Filtrar por prioridad:</label>
        <select
          id="filtro"
          value={filtarPrioridad}
          onChange={(e) => setFiltrarPrioridad(e.target.value)}
        >
          <option value="">Todas</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
      </section>

      {/* Controlo los estados (R8, R9) */}
      <PeliculaL
        peliculas={peliculas}
        cargando={cargando}
        error={errorCarga}
        onEditar={setPeliculaEditar}
        onEliminar={eliminarHanders}
      />
    </main>
  );
}




