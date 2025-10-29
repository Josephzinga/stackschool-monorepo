import { Router, type Request, Response } from "express";
import { body, query } from "express-validator";
import { prisma } from "../../lib/prisma";

const router = Router();

router.get(
  "/schools",
  query("search").notEmpty(),
  async (req: Request, res: Response) => {
    try {
      const { search } = req.query as { search: string };

      const schools = await prisma.school.findMany({
        where: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { code: { contains: search, mode: "insensitive" } },
            { address: { contains: search, mode: "insensitive" } },
          ],
          deletedAt: null, // exclure les école supprimer
        },
        select: {
          id: true,
          name: true,
          code: true,
          slug: true,
          address: true,
        },
        take: 10,
        orderBy: { name: "desc" },
      });

      if (!schools)
        return res.status(400).json({
          ok: false,
          message: "Aucune école conrrespondant n'as été trouvé",
          schools: [],
        });

      return res.status(200).json({
        ok: true,
        schools,
      });
    } catch (error) {
      console.error("Erreur fetching schools", error);
      return res.status(500).json({
        ok: false,
        error: "Erreur sur le recherche des écoles",
        schools: [],
      });
    }
  }
);

export default router;
