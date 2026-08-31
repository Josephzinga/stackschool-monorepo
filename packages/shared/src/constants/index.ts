export const REFERENCE_DATE = new Date(2024, 0, 1);
export const dayConstants = [
  { value: 'MONDAY', label: 'Lundi' },
  { value: 'TUESDAY', label: 'Mardi' },
  { value: 'WEDNESDAY', label: 'Mercredi' },
  { value: 'THURSDAY', label: 'Jeudi' },
  { value: 'FRIDAY', label: 'Vendredi' },
  { value: 'SATURDAY', label: 'Samedi' },
];
export const dayMapping = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

export const StaffPositionLabels = {
  SECRETARY: 'Secrétaire',
  GUARDIAN: 'Gardien',
  SUPERVISOR: 'Surveillant',
  ACCOUNTANT: 'Comptable',
  LIBRARIAN: 'Bibliothécaire',
  NURSE: 'Infirmier(ère)',
  CLEANER: "Agent d'entretien",
  MAINTENANCE: 'Maintenance',
  OTHER: 'Autre',
} as const;
