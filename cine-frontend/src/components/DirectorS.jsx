//Esta clase se encarga de seleccionar los directores
//que tenemos creados a través de un desplegable

export default function functionDirectorS({ directores, valor, onChange, deshabilitado }) {
    return (
        <>
            <label htmlFor="director">Director:</label>
            <select
                id="director"
                value={valor}
                onChange={(e) => onChange(e.target.value)}
                disabled={deshabilitado}
            >
                <option value="">-- Elige un director --</option>
                {/* map + key estable con el id de Prisma (R8) */}
                {directores.map((d) => (
                    <option key={d.id} value={d.id}>
                        {d.nombre} {d.apellido}
                    </option>
                ))}
            </select>
        </>
    );
}