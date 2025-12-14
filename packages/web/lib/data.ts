import {
  GraduationCap,
  UserRound,
  BookA,
  NotebookPen,
  Newspaper,
  ScrollText,
  CalendarDays,
  MessageSquareText,
  Megaphone,
  CircleUserRound,
  Settings,
  LogOut,
  ListChecks,
  NotebookTabs,
  LayoutDashboard,
  IceCream,
} from "lucide-react";

export const menuItems = {
  navMain: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: GraduationCap, label: "Professeurs", href: "/list/teachers" },
    { icon: UserRound, label: "Élèves", href: "/list/students" },
    { icon: BookA, label: "Classes", href: "/list/classes" },

    { icon: NotebookPen, label: "Leçons", href: "/list/lessons" },
    { icon: Newspaper, label: "Examens", href: "/list/exams" },
    { icon: ScrollText, label: "Devoirs", href: "/list/assignments" },
    { icon: ListChecks, label: "Présences", href: "/list/attendances" },
    { icon: NotebookTabs, label: "Résultats", href: "/list/results" },

    {
      icon: MessageSquareText,
      label: "Messages",
      href: "/list/messages",
    },
    { icon: Megaphone, label: "Annonces", href: "/list/announcements" },
    { icon: CalendarDays, label: "Événements", href: "/list/events" },
  ],
  documents: [
    { icon: Settings, label: "Paramètres", href: "/settings" },
    { icon: IceCream, label: "Intégrations", href: "/integrations" },
  ],

  /*



  navSecondary: [
    {
      icon: Settings,
      label: "Gérer mon compte",
      href: "/settings/account",
    },
    { icon: LogOut, label: "Déconnexion", href: "/logout" },
    { icon: CircleUserRound, label: "Profil", href: "/profile" },
  ],*/
};
