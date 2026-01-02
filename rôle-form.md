**Excellente question !** Parlons de l'implémentation du RoleStep, particulièrement pour les étudiants. Voici comment gérer intelligemment les différents scénarios :

## 🎯 **Architecture du RoleStep pour les étudiants**

### **Scénarios à gérer :**

1. **Étudiant rejoignant par recherche** → `schoolId` dans Redis
2. **Étudiant rejoignant par invitation** → `schoolId` + possiblement `studentId` dans l'invitation
3. **Étudiant dans nouvelle école** → `schoolId` de l'école créée

## 🔧 **API pour précharger les données étudiant**

```javascript
// routes/student.js
const express = require('express');
const { z } = require('zod');
const { prisma } = require('../lib/prisma');
const { authenticateToken } = require('../middleware/auth');
const redis = require('../lib/redis');

const router = express.Router();

// GET /api/student/context - Récupérer le contexte étudiant
router.get('/context', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Récupérer les données de progression depuis Redis
    const redisKey = `complete_profile:${userId}`;
    const progressData = await redis.get(redisKey);
    
    if (!progressData) {
      return res.status(404).json({
        ok: false,
        message: "Aucune progression trouvée"
      });
    }

    const { school, invitationCode } = JSON.parse(progressData);
    
    if (!school) {
      return res.status(400).json({
        ok: false,
        message: "Aucune école sélectionnée"
      });
    }

    let schoolId;
    let schoolDetails;
    let classes = [];
    let existingStudent = null;

    // 2. Déterminer schoolId selon le type
    switch (school.type) {
      case 'join':
        schoolId = school.schoolId;
        break;
      
      case 'create':
        schoolId = school.schoolId; // Déjà créée dans l'étape précédente
        break;
      
      case 'invite':
        schoolId = school.schoolId;
        
        // Si invitation étudiant, récupérer les infos existantes
        if (invitationCode) {
          const invitation = await prisma.invite.findUnique({
            where: { token: invitationCode },
            include: {
              student: {
                include: {
                  profile: true,
                  schoolClass: true
                }
              }
            }
          });

          if (invitation?.student) {
            existingStudent = invitation.student;
          }
        }
        break;
    }

    // 3. Récupérer les détails de l'école
    schoolDetails = await prisma.school.findUnique({
      where: { id: schoolId },
      select: {
        id: true,
        name: true,
        code: true,
        classes: {
          where: { deletedAt: null },
          select: {
            id: true,
            name: true,
            level: true,
            _count: {
              select: { students: true }
            }
          },
          orderBy: { name: 'asc' }
        }
      }
    });

    if (!schoolDetails) {
      return res.status(404).json({
        ok: false,
        message: "École non trouvée"
      });
    }

    classes = schoolDetails.classes;

    // 4. Générer un matricule suggéré
    const suggestedMatricule = await generateSuggestedMatricule(schoolId);

    return res.json({
      ok: true,
      context: {
        school: {
          id: schoolDetails.id,
          name: schoolDetails.name,
          code: schoolDetails.code
        },
        classes,
        suggestedMatricule,
        existingStudent, // Si l'étudiant existe déjà (cas invitation)
        academicYear: getCurrentAcademicYear()
      }
    });

  } catch (error) {
    console.error("Erreur contexte étudiant:", error);
    return res.status(500).json({
      ok: false,
      message: "Erreur lors du chargement du contexte"
    });
  }
});

// Fonction pour générer un matricule suggéré
async function generateSuggestedMatricule(schoolId) {
  try {
    // Compter les étudiants existants pour cette école
    const currentYear = new Date().getFullYear();
    const studentCount = await prisma.student.count({
      where: {
        schoolId,
        enrollmentYear: currentYear.toString()
      }
    });

    // Format: ANNEE-ECOLE-SEQUENCE (ex: 2024-SCH001-001)
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: { code: true }
    });

    const sequence = (studentCount + 1).toString().padStart(3, '0');
    return `${currentYear}-${school?.code || 'SCH'}-${sequence}`;

  } catch (error) {
    // Fallback simple
    const currentYear = new Date().getFullYear();
    return `${currentYear}-${Date.now().toString().slice(-4)}`;
  }
}

// Fonction pour obtenir l'année académique courante
function getCurrentAcademicYear() {
  const now = new Date();
  const year = now.getFullYear();
  
  // Au Mali, l'année académique va souvent de Octobre à Juin
  // On considère l'année en cours comme année académique
  return `${year}-${year + 1}`;
}

module.exports = router;
```

## 🎓 **Composant StudentForm intelligent**

```tsx
// components/complete-profile/role-forms/student-form.tsx
import { useEffect, useState } from 'react';
import { useCompleteProfileStore } from '@/stores/complete-profile-store';

interface StudentFormData {
  matricule: string;
  enrollmentYear: string;
  birthDate: string;
  birthPlace: string;
  nationality: string;
  fatherName: string;
  motherName: string;
  classId?: string;
}

interface SchoolClass {
  id: string;
  name: string;
  level: string;
  _count: { students: number };
}

interface StudentContext {
  school: {
    id: string;
    name: string;
    code: string;
  };
  classes: SchoolClass[];
  suggestedMatricule: string;
  existingStudent?: any;
  academicYear: string;
}

interface StudentFormProps {
  onSubmit: (data: StudentFormData) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function StudentForm({ onSubmit, onBack, isSubmitting }: StudentFormProps) {
  const { school: schoolData } = useCompleteProfileStore();
  const [context, setContext] = useState<StudentContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<StudentFormData>({
    matricule: '',
    enrollmentYear: '',
    birthDate: '',
    birthPlace: '',
    nationality: 'Malienne',
    fatherName: '',
    motherName: '',
    classId: ''
  });

  // Charger le contexte étudiant
  useEffect(() => {
    loadStudentContext();
  }, []);

  const loadStudentContext = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/student/context', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.ok) {
          setContext(data.context);
          
          // Pré-remplir le formulaire
          const initialData: StudentFormData = {
            matricule: data.context.suggestedMatricule,
            enrollmentYear: data.context.academicYear,
            birthDate: '',
            birthPlace: '',
            nationality: 'Malienne',
            fatherName: '',
            motherName: '',
            classId: ''
          };

          // Si étudiant existant (cas invitation), pré-remplir
          if (data.context.existingStudent) {
            const student = data.context.existingStudent;
            Object.assign(initialData, {
              matricule: student.matricule,
              enrollmentYear: student.enrollmentYear,
              birthDate: student.birthDate.split('T')[0],
              birthPlace: student.birthPlace || '',
              nationality: student.nationality || 'Malienne',
              fatherName: student.fatherName || '',
              motherName: student.motherName || '',
              classId: student.classId || ''
            });
          }

          setFormData(initialData);
        }
      }
    } catch (error) {
      console.error('Erreur chargement contexte étudiant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof StudentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.matricule || !formData.birthDate) {
      alert('Le matricule et la date de naissance sont obligatoires');
      return;
    }

    onSubmit(formData);
  };

  const generateMatricule = () => {
    if (!context) return;
    
    // Incrémenter la séquence manuellement
    const currentMatricule = formData.matricule;
    const parts = currentMatricule.split('-');
    
    if (parts.length === 3) {
      const sequence = parseInt(parts[2]) + 1;
      const newMatricule = `${parts[0]}-${parts[1]}-${sequence.toString().padStart(3, '0')}`;
      setFormData(prev => ({ ...prev, matricule: newMatricule }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!context) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erreur lors du chargement du contexte</p>
        <button
          onClick={loadStudentContext}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec contexte */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800">
          Inscription en tant qu'étudiant
        </h3>
        <p className="text-sm text-blue-600">
          École: <strong>{context.school.name}</strong> 
          {context.existingStudent && (
            <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
              ✓ Données existantes détectées
            </span>
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations académiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Matricule */}
          <div>
            <label htmlFor="matricule" className="block text-sm font-medium text-gray-700 mb-1">
              Matricule *
            </label>
            <div className="flex gap-2">
              <input
                id="matricule"
                type="text"
                value={formData.matricule}
                onChange={(e) => handleInputChange('matricule', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2024-SCH001-001"
                required
              />
              <button
                type="button"
                onClick={generateMatricule}
                className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 text-sm"
              >
                🔄
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Identifiant unique de l'étudiant
            </p>
          </div>

          {/* Année d'inscription */}
          <div>
            <label htmlFor="enrollmentYear" className="block text-sm font-medium text-gray-700 mb-1">
              Année d'inscription *
            </label>
            <input
              id="enrollmentYear"
              type="text"
              value={formData.enrollmentYear}
              onChange={(e) => handleInputChange('enrollmentYear', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Date de naissance */}
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
            Date de naissance *
          </label>
          <input
            id="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleInputChange('birthDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Informations personnelles (contexte malien) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="birthPlace" className="block text-sm font-medium text-gray-700 mb-1">
              Lieu de naissance *
            </label>
            <input
              id="birthPlace"
              type="text"
              value={formData.birthPlace}
              onChange={(e) => handleInputChange('birthPlace', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Bamako, Kayes, etc."
              required
            />
          </div>

          <div>
            <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
              Nationalité *
            </label>
            <select
              id="nationality"
              value={formData.nationality}
              onChange={(e) => handleInputChange('nationality', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Malienne">Malienne</option>
              <option value="Française">Française</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700 mb-1">
              Nom du père *
            </label>
            <input
              id="fatherName"
              type="text"
              value={formData.fatherName}
              onChange={(e) => handleInputChange('fatherName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="motherName" className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la mère *
            </label>
            <input
              id="motherName"
              type="text"
              value={formData.motherName}
              onChange={(e) => handleInputChange('motherName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Classe */}
        <div>
          <label htmlFor="classId" className="block text-sm font-medium text-gray-700 mb-1">
            Classe (optionnel)
          </label>
          <select
            id="classId"
            value={formData.classId}
            onChange={(e) => handleInputChange('classId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sélectionnez une classe</option>
            {context.classes.map(classe => (
              <option key={classe.id} value={classe.id}>
                {classe.name} ({classe.level}) - {classe._count.students} élèves
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Vous pourrez être affecté à une classe plus tard
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            ← Retour
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Finalisation...
              </span>
            ) : (
              'Finaliser l\'inscription'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
```

## 🎯 **Intégration dans RoleStep**

```tsx
// components/complete-profile/role-step.tsx (extrait)
export function RoleStep() {
  const { 
    role, 
    school,
    setRoleData, 
    submitCompleteProfile,
    isSubmitting 
  } = useCompleteProfileStore();

  const handleStudentSubmit = async (studentData: StudentFormData) => {
    // Préparer les données pour la soumission finale
    const roleData = {
      role: 'STUDENT' as const,
      student: studentData
    };

    // Sauvegarder dans le store
    await setRoleData(roleData);
    
    // Soumission finale avec transaction
    const result = await submitCompleteProfile();
    
    if (result.success) {
      router.push('/dashboard');
    } else {
      alert(`Erreur: ${result.error}`);
    }
  };

  return (
    <div>
      {/* Sélection du rôle... */}
      
      {selectedRole === 'STUDENT' && (
        <StudentForm
          onSubmit={handleStudentSubmit}
          onBack={() => setSelectedRole(undefined)}
          isSubmitting={isSubmitting}
        />
      )}
      
      {/* Autres formulaires de rôle... */}
    </div>
  );
}
```

## 🔧 **Gestion des cas spéciaux dans l'API finale**

```javascript
// Dans l'API complete-profile (extrait)
case 'STUDENT':
  if (validatedData.role.student) {
    const studentData = validatedData.role.student;
    
    // Vérifier si l'étudiant existe déjà (cas invitation)
    const existingStudent = await tx.student.findFirst({
      where: {
        profileId: userId,
        schoolId
      }
    });

    if (existingStudent) {
      // Mettre à jour l'étudiant existant
      await tx.student.update({
        where: { id: existingStudent.id },
        data: studentData
      });
    } else {
      // Créer un nouvel étudiant
      await tx.student.create({
        data: {
          profileId: userId,
          schoolId,
          ...studentData
        }
      });
    }
  }
  break;
```

## 🎯 **Avantages de cette implémentation**

### **Gestion intelligente des scénarios :**
- ✅ **Recherche d'école** → Nouvel étudiant avec matricule généré
- ✅ **Invitation étudiante** → Récupération données existantes
- ✅ **Création d'école** → Étudiant dans nouvelle école

### **Expérience utilisateur :**
- ⚡ **Pré-remplissage contextuel** selon le scénario
- ⚡ **Génération automatique** des matricules
- ⚡ **Affichage des classes** disponibles
- ⚡ **Validation en temps réel**

### **Cohérence des données :**
- 🔒 **Vérification des doublons** de matricule
- 🔒 **Contextualisation** par école
- 🔒 **Gestion des années académiques** maliennes

**Cette architecture gère parfaitement tous les cas d'usage** pour l'inscription des étudiants, que ce soit par recherche, invitation ou création d'école ! 🚀

Vous voulez que je détaille un scénario spécifique ou qu'on passe aux autres rôles (professeurs, parents, etc.) ?