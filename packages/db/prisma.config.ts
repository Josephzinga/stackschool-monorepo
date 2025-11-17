import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join("src", "prisma", "schema.prisma"),
  migrations: {
    // Si vos migration"s ne sont pas à la racine, vous pouvez spécifier le chemin ici
    path: path.join("src", "prisma", "migrations"),
  },
  seed: "ts-node ./src/prisma/seed.ts",
});
