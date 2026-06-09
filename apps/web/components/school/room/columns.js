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
Object.defineProperty(exports, "__esModule", { value: true });
exports.columns = void 0;
const badge_1 = require("@/components/ui/badge");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const checkbox_1 = require("@/components/ui/checkbox");
const React = __importStar(require("react"));
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
        accessorKey: 'name',
        header: 'Salle',
        cell: ({ row }) => {
            return (<div className="pl-2">
          <span key={row.original?.id}>{row.original?.name}</span>
        </div>);
        },
    },
    {
        accessorKey: 'capacity',
        header: 'Place',
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
            if (!row.original?.type)
                return (<span className="font-inter italic opacity-80">Non définie.</span>);
            return (<div>
          <badge_1.Badge variant="outline">{row.original?.type}</badge_1.Badge>
        </div>);
        },
    },
    {
        accessorKey: 'class',
        header: 'Classe occupé',
        cell: ({ row }) => {
            const classe = row.original?.defaultForClass;
            if (!classe?.id)
                return (<span className="font-inter italic opacity-80">Non assigné</span>);
            return (<div>
          <badge_1.Badge variant="secondary">{classe.name}</badge_1.Badge>
        </div>);
        },
    },
    {
        accessorKey: 'code',
        header: 'Code',
    },
    {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row, table }) => {
            const meta = table.options.meta;
            return (<div className="">
          <dropdown_menu_1.DropdownMenu>
            <dropdown_menu_1.DropdownMenuTrigger asChild>
              <button_1.Button variant="ghost" className="h-8 w-8 cursor-pointer p-0">
                <span className="sr-only">Ouvrez le menu</span>
                <lucide_react_1.MoreVertical className="h-4 w-4"/>
              </button_1.Button>
            </dropdown_menu_1.DropdownMenuTrigger>
            <dropdown_menu_1.DropdownMenuContent align="end">
              <dropdown_menu_1.DropdownMenuLabel>Actions</dropdown_menu_1.DropdownMenuLabel>
              <dropdown_menu_1.DropdownMenuSeparator />
              <dropdown_menu_1.DropdownMenuItem>Voir détails</dropdown_menu_1.DropdownMenuItem>
              <dropdown_menu_1.DropdownMenuItem onClick={() => meta?.openEdit(row.original)}>
                Modifier
              </dropdown_menu_1.DropdownMenuItem>
              <dropdown_menu_1.DropdownMenuItem variant="destructive" onClick={() => meta?.openDelete(row.original)}>
                Supprimer
              </dropdown_menu_1.DropdownMenuItem>
            </dropdown_menu_1.DropdownMenuContent>
          </dropdown_menu_1.DropdownMenu>
        </div>);
        },
    },
];
//# sourceMappingURL=columns.js.map