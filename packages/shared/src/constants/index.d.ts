import { Day } from '@stackschool/db';
export declare const REFERENCE_DATE: Date;
export declare const dayConstant: {
    value: string;
    label: string;
}[];
export declare const dayMapping: Record<Day, number>;
export declare const lessonStatusConfig: {
    readonly PLANNED: {
        readonly label: "Planifiée";
        readonly badgeClass: "bg-blue-100 text-blue-800";
        readonly eventClass: "border-blue-400 bg-blue-50";
        readonly icon: "calendar";
    };
    readonly ONGOING: {
        readonly label: "En cours";
        readonly badgeClass: "bg-green-100 text-green-800";
        readonly eventClass: "border-green-400 bg-green-50";
        readonly icon: "play";
    };
    readonly COMPLETED: {
        readonly label: "Terminée";
        readonly badgeClass: "bg-emerald-100 text-emerald-800";
        readonly eventClass: "border-emerald-400 bg-emerald-50";
        readonly icon: "check";
    };
    readonly CANCELLED: {
        readonly label: "Annulée";
        readonly badgeClass: "bg-red-100 text-red-800";
        readonly eventClass: "border-red-400 bg-red-50 line-through";
        readonly icon: "x";
    };
    readonly POSTPONED: {
        readonly label: "Reportée";
        readonly badgeClass: "bg-orange-100 text-orange-800";
        readonly eventClass: "border-orange-400 bg-orange-50";
        readonly icon: "clock";
    };
};
//# sourceMappingURL=index.d.ts.map