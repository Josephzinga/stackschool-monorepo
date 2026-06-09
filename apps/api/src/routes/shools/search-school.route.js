"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const db_1 = require("@stackschool/db");
const router = (0, express_1.Router)();
router.get('/search', (0, express_validator_1.query)('search').notEmpty(), async (req, res) => {
    try {
        const { search } = req.query;
        const schools = await db_1.prisma.school.findMany({
            where: {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { code: { contains: search, mode: 'insensitive' } },
                    { address: { contains: search, mode: 'insensitive' } },
                ],
                deletedAt: null,
            },
            select: {
                id: true,
                name: true,
                code: true,
                slug: true,
                address: true,
                logo: true,
            },
            take: 10,
            orderBy: { name: 'desc' },
        });
        if (!schools)
            return res.status(400).json({
                ok: false,
                message: "Aucune école correspondant n'as été trouvé",
                schools: [],
            });
        return res.status(200).json({
            ok: true,
            schools,
        });
    }
    catch (error) {
        console.error('Erreur fetching schools', error);
        return res.status(500).json({
            ok: false,
            error: 'Erreur sur le recherche des écoles',
            schools: [],
        });
    }
});
exports.default = router;
//# sourceMappingURL=search-school.route.js.map