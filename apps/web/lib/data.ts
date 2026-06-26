import {
  BookA,
  Briefcase,
  CalendarDays,
  CircleUserRound,
  GraduationCap,
  HotelIcon,
  IceCream,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Megaphone,
  MessageSquareText,
  Newspaper,
  NotebookPen,
  NotebookTabs,
  NotebookTextIcon,
  ScrollText,
  Settings,
  Users2Icon,
  UserSquare2,
} from 'lucide-react';

// Définition des rôles pour la clarté
const ROLES = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
  STAFF: 'STAFF',
};

export const menuItems = {
  navMain: [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/dashboard',
      visible: [
        ROLES.ADMIN,
        ROLES.TEACHER,
        ROLES.STUDENT,
        ROLES.PARENT,
        ROLES.STAFF,
      ],
    },
    {
      icon: GraduationCap,
      label: 'Professeurs',
      href: '/list/teachers',
      visible: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STAFF],
    },
    {
      icon: UserSquare2,
      label: 'Élèves',
      href: '/list/students',
      visible: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STAFF],
    },
    {
      icon: Users2Icon,
      label: 'Parents',
      href: '/list/parents',
      visible: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STAFF],
    },
    {
      icon: Briefcase,
      label: 'Personnels',
      href: '/list/staff',
      visible: [ROLES.ADMIN, ROLES.STAFF],
    },
    {
      icon: BookA,
      label: 'Classes',
      href: '/list/classes',
      visible: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STAFF],
    },
    {
      icon: NotebookPen,
      label: 'Matières',
      href: '/list/subjects',
      visible: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
    },
    {
      icon: NotebookTextIcon,
      label: 'Leçons',
      href: '/list/lessons',
      visible: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT],
    },
    {
      icon: HotelIcon,
      label: 'Salles',
      href: '/list/rooms',
      visible: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.STAFF],
    },
    {
      icon: Newspaper,
      label: 'Examens',
      href: '/list/exams',
      visible: [
        ROLES.ADMIN,
        ROLES.TEACHER,
        ROLES.STUDENT,
        ROLES.PARENT,
        ROLES.STAFF,
      ],
    },
    {
      icon: ScrollText,
      label: 'Devoirs',
      href: '/list/assignments',
      visible: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
    },
    {
      icon: ListChecks,
      label: 'Présences',
      href: '/list/attendances',
      visible: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
    },
    {
      icon: NotebookTabs,
      label: 'Résultats',
      href: '/list/results',
      visible: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
    },
    {
      icon: MessageSquareText,
      label: 'Messages',
      href: '/list/messages',
      visible: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
    },
    {
      icon: Megaphone,
      label: 'Annonces',
      href: '/list/announcements',
      visible: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
    },
    {
      icon: CalendarDays,
      label: 'Événements',
      href: '/list/events',
      visible: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
    },
  ],
  documents: [
    {
      icon: Settings,
      label: 'Paramètres',
      href: '/settings',
      visible: [ROLES.ADMIN],
    },
    {
      icon: IceCream,
      label: 'Intégrations',
      href: '/integrations',
      visible: [ROLES.ADMIN],
    },
  ],

  navSecondary: [
    {
      icon: Settings,
      label: 'Gérer mon compte',
      href: '/settings/account',
    },
    { icon: LogOut, label: 'Déconnexion', href: '/logout' },
    { icon: CircleUserRound, label: 'Profil', href: '/profile' },
  ],
};
