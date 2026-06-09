"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuItems = void 0;
const lucide_react_1 = require("lucide-react");
const ROLES = {
    ADMIN: 'ADMIN',
    TEACHER: 'TEACHER',
    STUDENT: 'STUDENT',
    PARENT: 'PARENT',
};
exports.menuItems = {
    navMain: [
        {
            icon: lucide_react_1.LayoutDashboard,
            label: 'Dashboard',
            href: '/dashboard',
            visible: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
        },
        {
            icon: lucide_react_1.GraduationCap,
            label: 'Professeurs',
            href: '/list/teachers',
            visible: [ROLES.ADMIN, ROLES.TEACHER],
        },
        {
            icon: lucide_react_1.UserSquare2,
            label: 'Élèves',
            href: '/list/students',
            visible: [ROLES.ADMIN, ROLES.TEACHER],
        },
        {
            icon: lucide_react_1.Users2Icon,
            label: 'Parents',
            href: '/list/parents',
            visible: [ROLES.ADMIN, ROLES.TEACHER],
        },
        {
            icon: lucide_react_1.BookA,
            label: 'Classes',
            href: '/list/classes',
            visible: [ROLES.ADMIN, ROLES.TEACHER],
        },
        {
            icon: lucide_react_1.NotebookPen,
            label: 'Matières',
            href: '/list/subjects',
            visible: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
        },
        {
            icon: lucide_react_1.NotebookTextIcon,
            label: 'Leçons',
            href: '/list/lessons',
            visible: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT],
        },
        {
            icon: lucide_react_1.HotelIcon,
            label: 'Salles',
            href: '/list/rooms',
            visible: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT],
        },
        {
            icon: lucide_react_1.Newspaper,
            label: 'Examens',
            href: '/list/exams',
            visible: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
        },
        {
            icon: lucide_react_1.ScrollText,
            label: 'Devoirs',
            href: '/list/assignments',
            visible: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
        },
        {
            icon: lucide_react_1.ListChecks,
            label: 'Présences',
            href: '/list/attendances',
            visible: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
        },
        {
            icon: lucide_react_1.NotebookTabs,
            label: 'Résultats',
            href: '/list/results',
            visible: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
        },
        {
            icon: lucide_react_1.MessageSquareText,
            label: 'Messages',
            href: '/list/messages',
            visible: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
        },
        {
            icon: lucide_react_1.Megaphone,
            label: 'Annonces',
            href: '/list/announcements',
            visible: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
        },
        {
            icon: lucide_react_1.CalendarDays,
            label: 'Événements',
            href: '/list/events',
            visible: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
        },
    ],
    documents: [
        {
            icon: lucide_react_1.Settings,
            label: 'Paramètres',
            href: '/settings',
            visible: [ROLES.ADMIN],
        },
        {
            icon: lucide_react_1.IceCream,
            label: 'Intégrations',
            href: '/integrations',
            visible: [ROLES.ADMIN],
        },
    ],
    navSecondary: [
        {
            icon: lucide_react_1.Settings,
            label: 'Gérer mon compte',
            href: '/settings/account',
        },
        { icon: lucide_react_1.LogOut, label: 'Déconnexion', href: '/logout' },
        { icon: lucide_react_1.CircleUserRound, label: 'Profil', href: '/profile' },
    ],
};
//# sourceMappingURL=data.js.map