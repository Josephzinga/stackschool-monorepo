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
const link_1 = __importDefault(require("next/link"));
const avatar_1 = require("@/components/ui/avatar");
const React = __importStar(require("react"));
const react_1 = require("react");
const checkbox_1 = require("@/components/ui/checkbox");
const popover_1 = require("@/components/ui/popover");
const parent_actions_1 = require("@/components/school/parent/table/parent-actions");
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
        header: 'Parents',
        cell: ({ row }) => {
            return (<link_1.default href={`/list/parents/${row.original.id}`} className="block w-full h-full">
          <div className="flex gap-3 items-center hover:bg-accent p-1 rounded-md transition-colors cursor-pointer">
            <avatar_1.Avatar className="h-10 w-10">
              <avatar_1.AvatarImage src={row.original?.photo}/>
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
        header: 'Numéro de tel',
        cell: ({ row }) => {
            return <span>{row.original.phoneNumber ?? 'Non assigné'}</span>;
        },
    },
    {
        accessorKey: 'profession',
        header: 'Proféssion',
        cell: ({ row }) => {
            return <span>{row.original.profession}</span>;
        },
    },
    {
        accessorKey: 'address',
        header: 'Adresse',
        cell: ({ row }) => {
            return <span>{row.original.address || '-'}</span>;
        },
    },
    {
        accessorKey: 'students',
        header: 'Enfant (s)',
        cell: ({ row }) => {
            const [open, setOpen] = (0, react_1.useState)(false);
            const student = row.original.students;
            const firstStudent = student[0];
            const remainingCount = student.length - 1;
            return (<popover_1.Popover open={open} onOpenChange={setOpen}>
          <popover_1.PopoverTrigger asChild onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <button onClick={() => setOpen(true)} className="text-xs border px-2 py-1 rounded-lg hover:bg-accent transition">
              {firstStudent?.firstname} {firstStudent?.lastname}
              {remainingCount > 0 && (<span className="text-blue-600 ml-1">{` +${remainingCount}`}</span>)}
            </button>
          </popover_1.PopoverTrigger>
          <popover_1.PopoverContent className="w-48 px-2" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <div className="grid grid-cols-2 text-xs">
              {student?.map((s) => (<div key={s.id} className="px-2 py-1 rounded-md hover:bg-muted">
                  {s.firstname} {s.lastname}
                </div>))}
            </div>
          </popover_1.PopoverContent>
        </popover_1.Popover>);
        },
    },
    {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row, table }) => (<parent_actions_1.ParentActions row={row} meta={table.options.meta}/>),
    },
];
//# sourceMappingURL=column.js.map