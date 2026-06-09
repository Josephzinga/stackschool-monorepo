'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionCards = SectionCards;
const react_1 = __importDefault(require("react"));
const icons_react_1 = require("@tabler/icons-react");
const lucide_react_1 = require("lucide-react");
const user_card_1 = __importDefault(require("@/components/user-card"));
function getTrend(current, previous) {
    const diff = current - previous;
    let trend = 'STABLE';
    if (diff > 0)
        trend = 'UP';
    else if (diff < 0)
        trend = 'DOWN';
    const percent = previous > 0 ? (diff / previous) * 100 : null;
    return { trend, diff, percent };
}
function formatCurrency(value) {
    return new Intl.NumberFormat('fr-FR').format(Math.round(value));
}
function SectionCards({ stats }) {
    const currentRevenue = Number(stats?.monthlyRevenue?.currentMonth ?? 0);
    const previousRevenue = Number(stats?.monthlyRevenue?.previousMonth ?? 0);
    const revenueTrend = getTrend(currentRevenue, previousRevenue);
    let revenueBadgeTitle = '';
    if (revenueTrend.percent !== null) {
        revenueBadgeTitle = `${revenueTrend.percent > 0 ? '+' : ''}${revenueTrend.percent.toFixed(1)}%`;
    }
    else {
        revenueBadgeTitle = currentRevenue > 0 ? 'Nouveau' : '0%';
    }
    const badgeMap = {
        UP: {
            className: 'bg-green-50 text-green-700 border-green-200',
            Icon: lucide_react_1.ArrowUp,
        },
        DOWN: {
            className: 'bg-red-50 text-red-700 border-red-200',
            Icon: lucide_react_1.ArrowDown,
        },
        STABLE: {
            className: 'bg-slate-50 text-slate-700 border-slate-200',
            Icon: lucide_react_1.Minus,
        },
    };
    const revenueBadge = badgeMap[revenueTrend.trend];
    return (<div className="flex flex-col justify-between md:flex-row gap-2 w-full flex-wrap">
      
      <user_card_1.default DescriptionIcon={lucide_react_1.Users2Icon} info="Inscrits pour l'année en cours" title={stats?.totalStudents || 0} description="Total Élèves" badgeTitle="Actifs" badgeClassName="bg-green-50 text-green-700 border-green-200"/>

      
      <user_card_1.default DescriptionIcon={lucide_react_1.UserIcon} title={stats?.totalTeachers || 0} description="Enseignants" badgeTitle="Actifs" info="Corps professoral actif" badgeClassName="bg-green-50 text-green-700 border-green-200"/>

      
      <user_card_1.default description="Classes" title={stats?.totalClasses || 0} badgeTitle="+2" info="Salles de classe ouvertes" DescriptionIcon={icons_react_1.IconSchool} badgeClassName="bg-amber-50 text-amber-700 border-amber-200"/>

      
      <user_card_1.default title={`${formatCurrency(currentRevenue)} FCA`} description="Revenus Mensuels" badgeTitle={revenueBadgeTitle} badgeClassName={revenueBadge.className} info={previousRevenue > 0
            ? `Par rapport à ${new Intl.NumberFormat('fr-FR').format(previousRevenue)} FCA`
            : 'Pas de revenus le mois précédent'} DescriptionIcon={undefined} badgeIcon={revenueBadge.Icon}/>
    </div>);
}
exports.default = SectionCards;
//# sourceMappingURL=section-cards.js.map