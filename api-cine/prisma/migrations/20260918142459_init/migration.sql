-- Tabla del Director
CREATE TABLE "Director" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" Varchar(100) NOT NULL,
    "apellido" Varchar(100) NOT NULL,
    "edad" INTEGER NOT NULL,
    "nacionalidad" Varchar(100) NOT NULL,
    pelicula Pelicula[]
);

-- Tabla de la Pelicula
CREATE TABLE "Pelicula" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" Varchar(255) NOT NULL,
    "descripcion" Text NOT NULL,
    "año" INTEGER NOT NULL,
    "genero" Varchar(100) NOT NULL,
    "valoracion" INTEGER DEFAULT 0,
    "prioridad" Varchar(20) NOT NULL DEFAULT 'Media',
    "directorID" INTEGER NOT NULL,

    --Definno la clave foranea
    CONSTRAINT fk_director FOREIGN KEY (directorID) REFERENCES Director (id) ON DELETE CASCADE
);
