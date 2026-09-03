export const dayMapping = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const;
export const dayConstants = [
  { value: 'MONDAY', label: 'Lundi' },
  { value: 'TUESDAY', label: 'Mardi' },
  { value: 'WEDNESDAY', label: 'Mercredi' },
  { value: 'THURSDAY', label: 'Jeudi' },
  { value: 'FRIDAY', label: 'Vendredi' },
  { value: 'SATURDAY', label: 'Samedi' },
];

export const dayLabel = {
  SUNDAY: 'Lundi',
  MONDAY: 'Mardi',
  TUESDAY: 'Mercredi',
  WEDNESDAY: 'Jeudi',
  THURSDAY: 'Vendredi',
  FRIDAY: 'Samedi',
  SATURDAY: 'Dimanche',
} as const;
