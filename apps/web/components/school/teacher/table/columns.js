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
const react_1 = require("react");
const badge_1 = require("@/components/ui/badge");
const utils_1 = require("@/lib/utils");
const link_1 = __importDefault(require("next/link"));
const teacher_table_actions_1 = require("./teacher-table-actions");
const popover_1 = require("@/components/ui/popover");
exports.columns = [
    {
        id: 'select',
        header: ({ table }) => (<checkbox_1.Checkbox className="cursor-pointer" checked={table.getIsAllRowsSelected() ||
                (table.getIsSomePageRowsSelected() && 'indeterminate')} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}/>),
        cell: ({ row }) => (<checkbox_1.Checkbox className="cursor-pointer" checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)}/>),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'info',
        header: ({ column }) => {
            return (<button_1.Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Enseignant
          <lucide_react_1.ArrowUpDown className="ml-2 h-4 w-4"/>
        </button_1.Button>);
        },
        cell: ({ row }) => {
            const photo = row.original.photo;
            const id = row.original.id;
            return (<link_1.default href={`/list/teachers/${id}`} className="block w-full h-full">
          <div className="flex gap-3 items-center hover:bg-accent p-1 rounded-md transition-colors cursor-pointer">
            <avatar_1.Avatar className="h-10 w-10">
              <avatar_1.AvatarImage src={photo}/>
              <avatar_1.AvatarFallback className="bg-primary/10 text-primary text-xs">
                {row.original.firstname?.[0]}
                {row.original.lastname?.[0]}
              </avatar_1.AvatarFallback>
            </avatar_1.Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm text-foreground">
                {row.original.firstname} {row.original.lastname}
              </span>
              <span className="text-xs text-muted-foreground">
                {row.original.email}
              </span>
            </div>
          </div>
        </link_1.default>);
        },
    },
    {
        accessorKey: 'phoneNumber',
        header: 'Téléphone',
        cell: ({ row }) => (<span className="text-sm text-muted-foreground">
        {row.original.phoneNumber || '-'}
      </span>),
    },
    {
        accessorKey: 'assignments.subject',
        header: () => (<div>
        <p className="font-inter font-semibold">Matières.</p>
      </div>),
        cell: ({ row }) => {
            const [open, setOpen] = (0, react_1.useState)(false);
            const subjects = [
                ...new Set(row.original.assignments?.map((ass) => ass?.subject?.name)),
            ];
            if (subjects?.length === 0)
                return (<span className="text-muted-foreground text-xs italic">
            Non assignée
          </span>);
            const firstSubject = subjects[0];
            const remainingCount = subjects.length - 1;
            return (<popover_1.Popover open={open} onOpenChange={setOpen}>
          <popover_1.PopoverTrigger disabled={!remainingCount} asChild onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <button onClick={() => setOpen(true)} className="text-xs border px-2 py-1 rounded-lg hover:bg-accent transition">
              {firstSubject}
              {remainingCount > 0 && (<span className="text-blue-600 ml-1">{` +${remainingCount}`}</span>)}
            </button>
          </popover_1.PopoverTrigger>
          <popover_1.PopoverContent className="w-48 px-2" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <ul className="space-y-1 text-xs">
              {subjects.map((c, index) => (<li key={`sub-${index}`} className="px-2 py-1 rounded-md hover:bg-muted">
                  {c}
                </li>))}
            </ul>
          </popover_1.PopoverContent>
        </popover_1.Popover>);
        },
    },
    {
        accessorKey: 'assignments.class',
        header: 'Classes',
        cell: ({ row }) => {
            const [open, setOpen] = (0, react_1.useState)(false);
            const classes = [
                ...new Set(row.original.assignments
                    ?.map((ass) => ass?.class?.name?.trim())
                    ?.filter(Boolean)),
            ];
            if (classes.length === 0) {
                return (<span className="text-muted-foreground text-xs italic">
            Non assignée
          </span>);
            }
            const firstClass = classes[0];
            const remainingCount = classes.length - 1;
            return (<popover_1.Popover open={open} onOpenChange={setOpen}>
          <popover_1.PopoverTrigger disabled={!remainingCount} asChild onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <button onClick={() => setOpen(true)} className="text-xs border px-2 py-1 rounded-lg hover:bg-accent transition">
              {firstClass}
              {remainingCount > 0 && (<span className="text-blue-600 ml-1">{` +${remainingCount}`}</span>)}
            </button>
          </popover_1.PopoverTrigger>
          <popover_1.PopoverContent className="w-48 px-2" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <ul className="space-y-1 text-xs">
              {classes.map((c, index) => (<li key={index} className="px-2 py-1 rounded-md hover:bg-muted">
                  {c}
                </li>))}
            </ul>
          </popover_1.PopoverContent>
        </popover_1.Popover>);
        },
    },
    {
        accessorKey: 'weeklyHours',
        header: 'H/sem',
        cell: ({ row }) => {
            return <span>{row.original.weeklyHours} h</span>;
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
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => <teacher_table_actions_1.TeacherTableActions row={row}/>,
    },
];
//# sourceMappingURL=columns.js.map