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
const checkbox_1 = require("@/components/ui/checkbox");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const avatar_1 = require("@/components/ui/avatar");
const link_1 = __importDefault(require("next/link"));
const class_action_1 = __importDefault(require("@/components/school/class/table/class-action"));
const popover_1 = require("@/components/ui/popover");
const React = __importStar(require("react"));
const react_1 = require("react");
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
        accessorKey: 'name',
        header: ({ column }) => {
            return (<button_1.Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Classe
          <lucide_react_1.ArrowUpDown className="ml-2 h-4 w-4"/>
        </button_1.Button>);
        },
        cell: ({ row }) => (<link_1.default href={`/list/classes/${row.original.id}`} className="font-medium hover:underline">
        {row.getValue('name')}
      </link_1.default>),
    },
    {
        accessorKey: 'level',
        header: 'Niveau',
        cell: ({ row }) => <badge_1.Badge variant="outline">{row.getValue('level')}</badge_1.Badge>,
    },
    {
        accessorKey: 'section',
        header: 'Section',
        cell: ({ row }) => row.getValue('section') || '-',
    },
    {
        accessorKey: 'supervisor',
        header: 'Prof. Principal',
        cell: ({ row }) => {
            const supervisor = row.original.supervisor;
            if (!supervisor?.id)
                return (<span className="text-muted-foreground text-xs">Non assigné</span>);
            const profile = supervisor.profile;
            return (<div className="flex items-center gap-2">
          <avatar_1.Avatar className="h-10 w-10">
            <avatar_1.AvatarImage src={profile?.photo || undefined}/>
            <avatar_1.AvatarFallback className="text-[10px]">
              {profile?.firstname?.[0]}
              {profile?.lastname?.[0]}
            </avatar_1.AvatarFallback>
          </avatar_1.Avatar>
          <span className="text-sm">
            {profile?.firstname} {profile?.lastname}
          </span>
        </div>);
        },
    },
    {
        accessorKey: 'students',
        header: () => (<div className="flex items-center gap-1">
        <span>Élèves</span>
      </div>),
        cell: ({ row }) => (<div className="flex justify-center items-center ">
        <span className="font-medium font-inter text-xs sm:text-sm text-center">
          {row.original?._count?.students}
        </span>
      </div>),
    },
    {
        accessorKey: 'subjects',
        header: 'Matières',
        cell: ({ row }) => {
            const [open, setOpen] = (0, react_1.useState)(false);
            const subjects = row.original.subjects;
            const firstSubject = subjects?.[0];
            const remainingCount = (subjects?.length || 1) - 1;
            if (subjects && subjects.length === 0) {
                return (<span className="text-xs text-muted-foreground italic">
            Aucune matière assigné
          </span>);
            }
            return (<popover_1.Popover open={open} onOpenChange={setOpen}>
          <popover_1.PopoverTrigger disabled={!remainingCount} asChild onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <button onClick={() => setOpen(true)} className="text-xs border px-2 py-1 rounded-lg hover:bg-accent transition">
              {firstSubject?.name} <span>{firstSubject?.code}</span>
              {remainingCount > 0 && (<span className="text-blue-600 ml-1">{` +${remainingCount}`}</span>)}
            </button>
          </popover_1.PopoverTrigger>
          <popover_1.PopoverContent className="w-48 px-2 " onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <ul className="space-y-1 text-xs">
              {subjects?.map((sub) => (<li key={sub?.id} className="px-2 py-1 rounded-md hover:bg-muted">
                  {sub?.name} <span className="text-primary">{sub?.code}</span>
                </li>))}
            </ul>
          </popover_1.PopoverContent>
        </popover_1.Popover>);
        },
    },
    {
        accessorKey: 'teachers',
        header: 'Professeurs',
        cell: ({ row }) => {
            const [open, setOpen] = (0, react_1.useState)(false);
            const teachers = row.original.teachers;
            const firstTeacher = teachers?.[0];
            const remainingCount = (teachers?.length || 1) - 1;
            if (teachers && teachers.length === 0) {
                return (<span className="text-xs text-muted-foreground italic">
            Aucun enseignant assigné
          </span>);
            }
            return (<popover_1.Popover open={open} onOpenChange={setOpen}>
          <popover_1.PopoverTrigger disabled={!remainingCount} asChild onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <button onClick={() => setOpen(true)} className="text-xs border px-2 py-1 rounded-lg hover:bg-accent transition">
              {firstTeacher?.firstname} {firstTeacher?.lastname}
              {remainingCount > 0 && (<span className="text-blue-600 ml-1">{` +${remainingCount}`}</span>)}
            </button>
          </popover_1.PopoverTrigger>
          <popover_1.PopoverContent className="w-48 px-2" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <ul className="space-y-1 text-xs">
              {teachers?.map((t) => (<li key={t?.id} className="px-2 py-1 rounded-md hover:bg-muted">
                  {t?.firstname} {t?.lastname}
                </li>))}
            </ul>
          </popover_1.PopoverContent>
        </popover_1.Popover>);
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row, table }) => (<class_action_1.default row={row} meta={table.options.meta}/>),
    },
];
//# sourceMappingURL=columns.js.map