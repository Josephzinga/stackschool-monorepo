`docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"`

Parfait 👏 ton serveur **Express tourne bien dans Docker**, mais le fait que **`localhost:5000` ne réponde pas dans ton navigateur** est tout à fait normal — c’est un **piège classique** avec Docker !

Voici ce qu’il faut comprendre 👇

---

## ⚠️ Pourquoi `localhost:5000` ne marche pas

Quand tu lances ton serveur Express **dans un conteneur Docker**, le port 5000 est **ouvert à l’intérieur du conteneur**, pas sur ta machine hôte (Ubuntu).
👉 Pour y accéder depuis ton navigateur (hors du container), tu dois **mapper le port** du container vers ta machine.

---

## ✅ 1️⃣ Vérifie ton `docker-compose.yml`

Dans la partie `backend:`, tu dois avoir quelque chose comme ceci :

```yaml
services:
  backend:
    build:
      context: .
      dockerfile: dockerfile.backend
    ports:
      - "5000:5000"
    volumes:
      - ./backend:/app
    command: npm run dev
```

### 🔍 Explication :

- Le premier `5000` → port de ta machine (ce que tu tapes dans le navigateur)
- Le second `5000` → port du conteneur (celui qu’Express écoute)

👉 Si tu ne mets **pas** la ligne `ports: - "5000:5000"`, ton serveur n’est **pas exposé** à l’extérieur du container.

---

## ✅ 2️⃣ Vérifie que ton Express écoute **sur `0.0.0.0`** (et pas `localhost`)

Dans ton `src/index.ts`, tu dois avoir quelque chose comme :

```ts
import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend listening on port ${PORT}`);
});
```

### 🚫 Mauvais exemple :

```ts
app.listen(PORT, "localhost", () => {
  console.log(`Listening on port ${PORT}`);
});
```

→ Dans Docker, `localhost` ne veut pas dire ta machine, mais **l’intérieur du container lui-même**, donc il n’est pas accessible de l’extérieur.

---

## ✅ 3️⃣ Redémarre ton container backend uniquement

Pas besoin de rebuild tout ton projet :

```bash
docker-compose restart backend
```

ou si tu veux être sûr :

```bash
docker-compose up -d --build backend
```

Puis vérifie les logs :

```bash
docker-compose logs -f backend
```

---

## ✅ 4️⃣ Teste maintenant

Ouvre ton navigateur et essaie :
👉 [http://localhost:5000](http://localhost:5000)

Tu devrais voir la réponse `"Hello from backend!"` ou ce que tu as mis dans ta route.

---

## ⚡ Vérification rapide

Si ça ne marche toujours pas :

1. Vérifie que le container tourne :

   ```bash
   docker ps
   ```

2. Teste depuis ton terminal hôte :

   ```bash
   curl http://localhost:5000
   ```

   Si ça ne répond pas → soit le port n’est pas exposé, soit ton serveur écoute sur `localhost` au lieu de `0.0.0.0`.

---

Souhaite-tu que je regarde **ton fichier `docker-compose.yml` et ton `src/index.ts`** (Express) pour te dire exactement où corriger ?
Tu peux juste copier-coller ces deux fichiers ici.
