/**
 * Génère un matricule unique basé sur un préfixe et une séquence aléatoire.
 * Format : PREFIX-ANNEE-XXXX (ex: STU-2024-A1B2)
 * 
 * @param type 'STUDENT' | 'SCHOOL' | 'CLASS' | 'TEACHER'
 * @returns string
 */
export function generateMatricule(type: 'STUDENT' | 'SCHOOL' | 'CLASS' | 'TEACHER'): string {
  const year = new Date().getFullYear();
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  switch (type) {
    case 'STUDENT':
      return `STU-${year}-${randomPart}`;
    case 'TEACHER':
      return `TCH-${year}-${randomPart}`;
    case 'SCHOOL':
      return `SCH-${randomPart}${Math.floor(Math.random() * 100)}`;
    case 'CLASS':
      return `CLS-${randomPart}`;
    default:
      return `GEN-${randomPart}`;
  }
}

/**
 * Génère une suggestion de matricule pour un étudiant basé sur son nom.
 * Ex: Jean Dupont -> JD-2024-X1
 */
export function generateStudentMatricule(firstname: string, lastname: string): string {
  const year = new Date().getFullYear();
  const initials = (firstname[0] + lastname[0]).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000); // 4 chiffres
  return `${initials}${year}-${random}`;
}
