'use client';
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.columns = void 0;
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const checkbox_1 = require("@/components/ui/checkbox");
const avatar_1 = require("@/components/ui/avatar");
const React = __importStar(require("react"));
const badge_1 = require("@/components/ui/badge");
const utils_1 = require("@/lib/utils");
const link_1 = __importDefault(require("next/link"));
const table_provider_1 = require("./table-provider");
const student_table_actions_1 = require("./student-table-actions");
exports.columns = [
    {
        id: 'select',
        header: ({ table }) => (<checkbox_1.Checkbox checked={table.getIsAllRowsSelected() ||
                (table.getIsSomePageRowsSelected() && 'indeterminate')} className="cursor-pointer" onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}/>),
        cell: ({ row }) => (<checkbox_1.Checkbox className="cursor-pointer" checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)}/>),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'info',
        header: () => {
            const { setFilters } = (0, table_provider_1.useTable)();
            return (<button_1.Button variant="ghost" onClick={() => {
                    const sort = {
                        field: 'firstname',
                        order: 'ASC',
                    };
                    setFilters((prev) => ({ ...prev, sort }));
                }}>
          Élèves
          <lucide_react_1.ArrowUpDown className="ml-2 h-4 w-4"/>
        </button_1.Button>);
        },
        cell: ({ row }) => {
            const photo = row.original.photo;
            const id = row.original.id;
            return (<link_1.default href={`/list/students/${id}`} className="block max-w-80 md:max-w-100 h-full">
          <div className="flex gap-2 items-center hover:bg-accent rounded-md transition-colors cursor-pointer">
            <avatar_1.Avatar className="h-10 w-10">
              <avatar_1.AvatarImage src={photo ?? undefined}/>
              <avatar_1.AvatarFallback className="bg-primary/10 text-primary text-xs">
                {row.original.firstname?.[0]}
                {row.original.lastname?.[0]}
              </avatar_1.AvatarFallback>
            </avatar_1.Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm text-foreground">
                {row.original.firstname} {row.original.lastname}
              </span>
              <span className="text-xs tracking-tight md:tracking-normal text-wrap text-muted-foreground">
                {row.original.email || row.original.phoneNumber}
              </span>
            </div>
          </div>
        </link_1.default>);
        },
    },
    {
        accessorKey: 'matricule',
        header: 'Matricule',
        cell: ({ row }) => {
            const matricule = row.original.matricule;
            return (<div className="w-35 h-full items-center justify-center">
          <span className="font-inter text-xs">{matricule}</span>
        </div>);
        },
    },
    {
        accessorKey: 'className',
        header: 'Classe',
        cell: ({ row }) => {
            const classeName = row.original.className;
            return <p className="text-xs xl:text-sm px-2 h-5">{classeName}</p>;
        },
    },
    {
        accessorKey: 'section',
        header: 'Section',
        cell: ({ row }) => {
            const section = row.original.section;
            return (<div>
          <p className="text-xs xl:text-sm px-2 h-5">{section || '-'}</p>
        </div>);
        },
    },
    {
        accessorKey: 'level',
        header: 'Niveau',
        cell: ({ row }) => {
            const level = row.original.level;
            return (<div className="flex flex-wrap gap-1">
          <badge_1.Badge variant="outline" className="font-normal text-xs">
            {level}
          </badge_1.Badge>
        </div>);
        },
    },
    {
        accessorKey: 'enrollmentYear',
        header: 'Inscription',
        cell: ({ row }) => {
            const enrollmentYear = row.original.enrollmentYear;
            return <badge_1.Badge className="bg-primary/40">{enrollmentYear}</badge_1.Badge>;
        },
    },
    {
        accessorKey: 'status',
        header: 'Statut',
        cell: ({ row }) => {
            return (<badge_1.Badge variant="outline" className={(0, utils_1.cn)('font-medium px-2 py-0.5 text-xs border-0', row.original.status
                    ? 'bg-chart-4/10 text-chart-4 ring-1 ring-green-600/20'
                    : 'bg-destructive/10 text-destructive ring-1 ring-red-600/20')}>
          {row.original.status ? 'Actif' : 'Inactif'}
        </badge_1.Badge>);
        },
    },
    {
        accessorKey: 'actions',
        cell: ({ row }) => <student_table_actions_1.StudentTableActions row={row}/>,
    },
];
//# sourceMappingURL=columns.js.map