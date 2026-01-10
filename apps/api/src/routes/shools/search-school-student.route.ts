import { Router } from 'express';
import { prisma } from '@stackschool/db';
import { isAuthenticated } from '../../middlewares/auth';
import { createServiceError } from '../../utils/api-errors';
import { safeValidateSchema } from '../../utils/validate-schema.util';
import { SearchStudentParams, searchStudentSchema } from '@stackschool/shared';

const router = Router();

/**
 * Recherche des étudiants dans une école spécifique par nom, prénom ou matricule.
 * Nécessite d'être authentifié et de fournir un schoolId.
 */
router.get('/students/search', isAuthenticated, async (req, res, next) => {
  try {
    const { searchTerm, schoolId } = req.query as SearchStudentParams;
    console.log('query', searchTerm, 'SchoolId', schoolId);
    const errors = safeValidateSchema<SearchStudentParams>(
      searchStudentSchema,
      {
        searchTerm,
        schoolId,
      },
    );
    if (errors) return next(errors);

    // 2. Construire la requête Prisma sécurisée
    const students = await prisma.student.findMany({
      where: {
        // Condition AND : doit être dans cette école ET correspondre à la recherche
        schoolId: schoolId,
        OR: [
          { matricule: { contains: searchTerm, mode: 'insensitive' } },
          {
            profile: {
              firstname: { contains: searchTerm, mode: 'insensitive' },
            },
          },
          {
            profile: {
              lastname: { contains: searchTerm, mode: 'insensitive' },
            },
          },
        ],
      },
      take: 10, // Limiter les résultats pour la performance
      select: {
        id: true,
        matricule: true,
        schoolClass: {
          select: { name: true },
        },
        profile: {
          select: {
            firstname: true,
            lastname: true,
            photo: true,
          },
        },
      },
    });

    // 3. Formater les données pour le frontend
    const formattedStudents = students.map((s) => ({
      id: s.id,
      matricule: s.matricule,
      firstName: s.profile.firstname,
      lastName: s.profile.lastname,
      photo: s.profile.photo,
      className: s.schoolClass?.name,
    }));

    return res.json({
      ok: true,
      students: formattedStudents,
    });
  } catch (error) {
    next(
      createServiceError(
        'Erreur lors de la recherche des étudiants',
        500,
        error,
      ),
    );
  }
});

export default router;
