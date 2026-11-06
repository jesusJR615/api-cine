import fs from "node:fs";
import path from "node:path";

const cliPath = path.resolve("node_modules/prisma/build/cli.js");

if (fs.existsSync(cliPath)) {
  const original = fs.readFileSync(cliPath, "utf8");
  const target = 'let c=a.split("://")[0].toLowerCase();';
  const replacement = 'let c=(a.startsWith("file:")?"file":a.split("://")[0]).toLowerCase();';

  if (original.includes(target)) {
    fs.writeFileSync(cliPath, original.replace(target, replacement), "utf8");
    console.log("✔ Parche de Prisma Studio aplicado correctamente para SQLite (protocolo file:).");
  }
}
