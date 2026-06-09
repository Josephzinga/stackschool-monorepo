"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transportMode = exports.categoryMap = exports.lessonStatusConfig = exports.studentStatusLabel = void 0;
const ui_1 = require("@stackschool/ui");
const lucide_react_1 = require("lucide-react");
exports.studentStatusLabel = {
    ACTIVE: 'Actif',
    SUSPENDED: 'Suspendu',
    EXPELLED: 'Exclu',
    TRANSFERRED: 'Transféré',
    DROPPED_OUT: 'Abandon',
    GRADUATED: 'Diplômé',
    INACTIVE: 'Inactif',
    DECEASED: 'Décédé',
};
exports.lessonStatusConfig = {
    PLANNED: {
        label: 'Planifiée',
        color: '#1E9DF1FF',
        badgeClass: 'bg-blue-100 text-blue-800',
        eventClass: 'border-blue-400 bg-blue-900',
        icon: lucide_react_1.Calendar,
    },
    ONGOING: {
        label: 'En cours',
        color: '#17BF63FF',
        badgeClass: 'bg-green-100 text-green-900',
        eventClass: 'border-green-400 #fff',
        icon: lucide_react_1.Play,
    },
    COMPLETED: {
        label: 'Terminée',
        color: '#1de7a1',
        badgeClass: 'bg-emerald-100 text-emerald-800',
        eventClass: 'border-emerald-400 bg-emerald-50',
        icon: lucide_react_1.Check,
    },
    CANCELLED: {
        label: 'Annulée',
        color: '#FF0000',
        badgeClass: 'bg-red-100 text-red-800',
        eventClass: 'border-red-400 bg-red-50 line-through',
        icon: lucide_react_1.X,
    },
    POSTPONED: {
        label: 'Reportée',
        color: '#cb9d2e',
        badgeClass: 'bg-orange-100 text-orange-800',
        eventClass: 'border-orange-400 bg-orange-50',
        icon: lucide_react_1.Clock,
    },
};
exports.categoryMap = [
    { value: ui_1.SubjectCategory.General, label: 'Géneral' },
    { value: ui_1.SubjectCategory.Literary, label: 'Litérature' },
    { value: ui_1.SubjectCategory.Scientific, label: 'Science' },
    { value: ui_1.SubjectCategory.Sport, label: 'Sport' },
];
exports.transportMode = [
    { value: ui_1.TransportMode.Walk, label: 'Pied' },
    { value: ui_1.TransportMode.Bus, label: 'Bus' },
    { value: ui_1.TransportMode.Car, label: 'Voiture' },
    { value: ui_1.TransportMode.Moto, label: 'Moto' },
    { value: ui_1.TransportMode.Taxi, label: 'Taxi' },
    { value: ui_1.TransportMode.Other, label: 'Autre' },
];
//# sourceMappingURL=index.js.map