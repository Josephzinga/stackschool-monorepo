'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClassStudentAction;
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
function ClassStudentAction({ row, meta, }) {
    return (<div>
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
          <dropdown_menu_1.DropdownMenuItem onClick={() => meta?.openEdit(row.original)}>
            Modifier
          </dropdown_menu_1.DropdownMenuItem>
          <dropdown_menu_1.DropdownMenuItem onClick={() => meta?.openAdd?.(row.original)}>
            Contacter parent
          </dropdown_menu_1.DropdownMenuItem>
          <dropdown_menu_1.DropdownMenuItem variant="destructive" onClick={() => meta?.openDelete(row.original)}>
            Supprimer
          </dropdown_menu_1.DropdownMenuItem>
        </dropdown_menu_1.DropdownMenuContent>
      </dropdown_menu_1.DropdownMenu>
    </div>);
}
//# sourceMappingURL=class-action.js.map