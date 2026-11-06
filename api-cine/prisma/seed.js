import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "file:./prod.db",
    },
  },
});

async function main() {
  // Datos iniciales para el Director
  const director = await prisma.director.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nombre: "Christopher",
      apellido: "Nolan",
      edad: 53,
      nacionalidad: "Británica",
    },
  });

  // Datos iniciales para la Película
  await prisma.pelicula.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      titulo: "Origen",
      descripcion: "Un ladrón que roba secretos corporativos mediante el uso de la tecnología de sueños compartidos.",
      año: 2010,
      genero: "Ciencia ficción",
      valoracion: 9,
      prioridad: "Alta",
      directorID: director.id,
    },
  });

  console.log("completado: Director + Película creados");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
