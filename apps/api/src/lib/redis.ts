import { createClient } from "redis";
import { config } from "@stackschool/shared";

config();

// L'URL est récupérée depuis les variables d'environnement de Docker Compose
const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  throw new Error("REDIS_URL is not defined in environment variables");
}

export const redisClient = createClient({
  url: REDIS_URL,
});

// Gérer les événements de connexion et d'erreur
redisClient.on("connect", () => {
  console.log("Connecté à Redis !");
});

redisClient.on("error", (err) => {
  console.error("Erreur de connexion à Redis :", err);
});

// Établir la connexion
redisClient.connect();
