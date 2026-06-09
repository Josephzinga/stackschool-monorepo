import { SubjectCategory, TransportMode } from '@stackschool/ui';
export declare const studentStatusLabel: {
    ACTIVE: string;
    SUSPENDED: string;
    EXPELLED: string;
    TRANSFERRED: string;
    DROPPED_OUT: string;
    GRADUATED: string;
    INACTIVE: string;
    DECEASED: string;
};
export declare const lessonStatusConfig: {
    readonly PLANNED: {
        readonly label: "Planifiée";
        readonly color: "#1E9DF1FF";
        readonly badgeClass: "bg-blue-100 text-blue-800";
        readonly eventClass: "border-blue-400 bg-blue-900";
        readonly icon: import("react").ForwardRefExoticComponent<Omit<import("lucide-react").LucideProps, "ref"> & import("react").RefAttributes<SVGSVGElement>>;
    };
    readonly ONGOING: {
        readonly label: "En cours";
        readonly color: "#17BF63FF";
        readonly badgeClass: "bg-green-100 text-green-900";
        readonly eventClass: "border-green-400 #fff";
        readonly icon: import("react").ForwardRefExoticComponent<Omit<import("lucide-react").LucideProps, "ref"> & import("react").RefAttributes<SVGSVGElement>>;
    };
    readonly COMPLETED: {
        readonly label: "Terminée";
        readonly color: "#1de7a1";
        readonly badgeClass: "bg-emerald-100 text-emerald-800";
        readonly eventClass: "border-emerald-400 bg-emerald-50";
        readonly icon: import("react").ForwardRefExoticComponent<Omit<import("lucide-react").LucideProps, "ref"> & import("react").RefAttributes<SVGSVGElement>>;
    };
    readonly CANCELLED: {
        readonly label: "Annulée";
        readonly color: "#FF0000";
        readonly badgeClass: "bg-red-100 text-red-800";
        readonly eventClass: "border-red-400 bg-red-50 line-through";
        readonly icon: import("react").ForwardRefExoticComponent<Omit<import("lucide-react").LucideProps, "ref"> & import("react").RefAttributes<SVGSVGElement>>;
    };
    readonly POSTPONED: {
        readonly label: "Reportée";
        readonly color: "#cb9d2e";
        readonly badgeClass: "bg-orange-100 text-orange-800";
        readonly eventClass: "border-orange-400 bg-orange-50";
        readonly icon: import("react").ForwardRefExoticComponent<Omit<import("lucide-react").LucideProps, "ref"> & import("react").RefAttributes<SVGSVGElement>>;
    };
};
export declare const categoryMap: {
    value: SubjectCategory;
    label: string;
}[];
export declare const transportMode: {
    value: TransportMode;
    label: string;
}[];
//# sourceMappingURL=index.d.ts.map