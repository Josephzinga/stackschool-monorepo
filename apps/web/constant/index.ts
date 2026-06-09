import { SubjectCategory, TransportMode } from '@stackschool/ui';
import { Calendar, Check, Clock, Play, X } from 'lucide-react';

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
    color: '#1E9DF1FF',
    badgeClass: 'bg-blue-100 text-blue-800',
    eventClass: 'border-blue-400 bg-blue-900',
    icon: Calendar, // ou composant icône
  },
  ONGOING: {
    label: 'En cours',
    color: '#17BF63FF',
    badgeClass: 'bg-green-100 text-green-900',
    eventClass: 'border-green-400 #fff',
    icon: Play,
  },
  COMPLETED: {
    label: 'Terminée',
    color: '#1de7a1',
    badgeClass: 'bg-emerald-100 text-emerald-800',
    eventClass: 'border-emerald-400 bg-emerald-50',
    icon: Check,
  },
  CANCELLED: {
    label: 'Annulée',
    color: '#FF0000',
    badgeClass: 'bg-red-100 text-red-800',
    eventClass: 'border-red-400 bg-red-50 line-through',
    icon: X,
  },
  POSTPONED: {
    label: 'Reportée',
    color: '#cb9d2e',

    badgeClass: 'bg-orange-100 text-orange-800',
    eventClass: 'border-orange-400 bg-orange-50',
    icon: Clock,
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
