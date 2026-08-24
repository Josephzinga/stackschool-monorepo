import {SchoolRole} from '@stackschool/contracts';

export interface RoleConstant {
  value: SchoolRole;
  label: string;
  icon: string;
  description: string;
}

export const allRoles: RoleConstant[] = [
  {
    value: 'STUDENT',
    label: 'Élève',
    description: 'Je suis étudiant dans cette école',
    icon: '🎓',
  },
  {
    value: 'TEACHER',
    label: 'Professeur',
    description: "J'enseigne dans cette école",
    icon: '👨‍🏫',
  },
  {
    value: 'PARENT',
    label: 'Parent',
    description: "Je suis parents d'élève(s)",
    icon: '👨‍👩‍👧‍👦',
  },
  {
    value: 'STAFF',
    label: 'Personnel',
    description: "Je travaille dans l'administration",
    icon: '💼',
  },
  {
    value: 'ADMIN',
    label: 'Administrateur',
    description: 'Je gère cette école',
    icon: '⚙️',
  },
];
