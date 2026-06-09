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
const avatar_1 = require("@/components/ui/avatar");
const badge_1 = require("@/components/ui/badge");
const checkbox_1 = require("@/components/ui/checkbox");
const React = __importStar(require("react"));
const link_1 = __importDefault(require("next/link"));
const class_action_1 = __importDefault(require("@/components/school/class/student-table/class-action"));
exports.columns = [
    {
        id: 'select',
        header: ({ table }) => (<checkbox_1.Checkbox checked={table.getIsAllRowsSelected() ||
                (table.getIsSomePageRowsSelected() && 'indeterminate')} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all"/>),
        cell: ({ row }) => (<checkbox_1.Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row"/>),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'studentNumber',
        header: 'N°',
        cell: ({ row }) => {
            return <span>{row.original.studentNumber}</span>;
        },
    },
    {
        accessorKey: 'user.profile',
        header: 'Élève',
        cell: ({ row }) => {
            return (<link_1.default href={`/list/students/${row.original.id}`} className="block max-w-80 md:max-w-100 h-full">
          <div className="flex gap-2 items-center hover:bg-accent rounded-md transition-colors cursor-pointer">
            <avatar_1.Avatar className="h-10 w-10">
              <avatar_1.AvatarImage src={row.original.photo ?? undefined}/>
              <avatar_1.AvatarFallback className="bg-primary/10 text-primary text-xs">
                {row.original.firstname?.[0]}
                {row.original.lastname?.[0]}
              </avatar_1.AvatarFallback>
            </avatar_1.Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm text-foreground">
                {row.original.firstname} {row.original.lastname}
              </span>
            </div>
          </div>
        </link_1.default>);
        },
    },
    {
        accessorKey: 'gender',
        header: 'Sexe',
        cell: ({ row }) => {
            return <div>{row.original.gender}</div>;
        },
    },
    {
        accessorKey: 'matricule',
        header: 'Matricule',
        cell: ({ row }) => {
            return <badge_1.Badge variant="outline">{row.original.matricule}</badge_1.Badge>;
        },
    },
    {
        accessorKey: 'attendanceStatus',
        header: 'Présence',
    },
    {
        accessorKey: 'status',
        header: 'Statut',
        cell: ({ row }) => (<badge_1.Badge variant={row.original.status === 'ACTIVE' ? 'success' : 'outline'}>
        {row.original.status}
      </badge_1.Badge>),
    },
    {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row, table }) => (<class_action_1.default row={row} meta={table.options.meta}/>),
    },
];
//# sourceMappingURL=columns.js.map