import { SubjectCategory, TransportMode } from '@stackschool/ui';

export const studentStatusLabel = {
  ACTIVE: 'Actif',
  SUSPENDED: 'Suspendu',
  EXPELLED: 'Exclu',
  TRANSFERRED: 'Transféré',
  DROPPED_OUT: 'Abandon',
  GRADUATED: 'Diplômé',
  INACTIVE: 'Inactif',
  DECEASED: 'Décédé',
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

export const categoryMap = [
  { value: SubjectCategory.General, label: 'Géneral' },
  { value: SubjectCategory.Literary, label: 'Litérature' },
  { value: SubjectCategory.Scientific, label: 'Science' },
  { value: SubjectCategory.Sport, label: 'Sport' },
];

export const transportMode = [
  { value: TransportMode.Walk, label: 'Pied' },
  { value: TransportMode.Bus, label: 'Bus' },
  { value: TransportMode.Car, label: 'Voiture' },
  { value: TransportMode.Moto, label: 'Moto' },
  { value: TransportMode.Taxi, label: 'Taxi' },
  { value: TransportMode.Other, label: 'Autre' },
];
