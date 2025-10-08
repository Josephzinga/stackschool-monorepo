import type { Request, Response } from "express";
import express from "express";
import cors from "cors";
import { config } from "dotenv";

config();

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "serveur connecter bonjour" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
