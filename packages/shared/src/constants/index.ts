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
export const lessonStatusConfig = {
  PLANNED: {
    label: 'Planifiée',
    badgeClass: 'bg-blue-100 text-blue-800',
    eventClass: 'border-blue-400 bg-blue-50',
    icon: 'calendar', // ou composant icône
  },
  ONGOING: {
    label: 'En cours',
    badgeClass: 'bg-green-100 text-green-800',
    eventClass: 'border-green-400 bg-green-50',
    icon: 'play',
  },
  COMPLETED: {
    label: 'Terminée',
    badgeClass: 'bg-emerald-100 text-emerald-800',
    eventClass: 'border-emerald-400 bg-emerald-50',
    icon: 'check',
  },
  CANCELLED: {
    label: 'Annulée',
    badgeClass: 'bg-red-100 text-red-800',
    eventClass: 'border-red-400 bg-red-50 line-through',
    icon: 'x',
  },
  POSTPONED: {
    label: 'Reportée',
    badgeClass: 'bg-orange-100 text-orange-800',
    eventClass: 'border-orange-400 bg-orange-50',
    icon: 'clock',
  },
} as const;

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
