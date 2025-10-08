import {
  House,
  GraduationCap,
  UserRound,
  Users,
  BookOpenText,
  BookA,
  NotebookPen,
  Newspaper,
  ScrollText,
  FileChartColumn,
  CalendarCheck2,
  CalendarDays,
  MessageSquareText,
  Megaphone,
  CircleUserRound,
  Settings,
  LogOut,
} from "lucide-react";

export const menuItems = [
  {
    title: "SCOLARITÉ",
    items: [
      { icon: GraduationCap, label: "Professeurs", href: "/list/teachers" },
      { icon: UserRound, label: "Élèves", href: "/list/students" },
      { icon: BookA, label: "Classes", href: "/list/classes" },
    ],
  },
  {
    title: "COURS ET EXAMENS",
    items: [
      { icon: NotebookPen, label: "Leçons", href: "/list/lessons" },
      { icon: Newspaper, label: "Examens", href: "/list/exams" },
      { icon: ScrollText, label: "Devoirs", href: "/list/assignments" },
    ],
  },
  {
    title: "COMMUNICATION",
    items: [
      { icon: MessageSquareText, label: "Messages", href: "/list/messages" },
      { icon: Megaphone, label: "Annonces", href: "/list/announcements" },
      { icon: CalendarDays, label: "Événements", href: "/list/events" },
    ],
  },
  {
    title: "AUTRES",
    items: [
      { icon: CircleUserRound, label: "Profil", href: "/profile" },
      { icon: Settings, label: "Paramètres", href: "/settings" },
      { icon: LogOut, label: "Déconnexion", href: "/logout" },
    ],
  },
];
