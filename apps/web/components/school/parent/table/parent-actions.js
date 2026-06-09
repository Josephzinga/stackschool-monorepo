'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentActions = ParentActions;
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const button_1 = require("@/components/ui/button");
const icons_react_1 = require("@tabler/icons-react");
const react_1 = require("react");
const app_alert_dialog_1 = require("@/components/app-alert-dialog");
const sonner_1 = require("sonner");
function ParentActions({ row, meta, }) {
    const [showDeleteAlert, setShowDeleteAlert] = (0, react_1.useState)(false);
    const handleDelete = async () => {
        sonner_1.toast.info('La suppression des parents sera bientôt disponible');
        setShowDeleteAlert(false);
    };
    return (<>
      <dropdown_menu_1.DropdownMenu>
        <dropdown_menu_1.DropdownMenuTrigger asChild>
          <button_1.Button variant="ghost" className="data-[state=open]:bg-muted text-muted-foreground flex size-8" size="icon">
            <icons_react_1.IconDotsVertical className="h-4 w-4"/>
            <span className="sr-only">Ouvrir le menu</span>
          </button_1.Button>
        </dropdown_menu_1.DropdownMenuTrigger>
        <dropdown_menu_1.DropdownMenuContent align="end" className="w-32">
          <dropdown_menu_1.DropdownMenuItem onClick={() => console.log('Edit', row.original.id)}>
            Editer
          </dropdown_menu_1.DropdownMenuItem>
          <dropdown_menu_1.DropdownMenuItem onClick={() => console.log('Copy', row.original.id)}>
            Copier
          </dropdown_menu_1.DropdownMenuItem>
          <dropdown_menu_1.DropdownMenuSeparator />
          <dropdown_menu_1.DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => setShowDeleteAlert(true)}>
            Supprimer
          </dropdown_menu_1.DropdownMenuItem>
        </dropdown_menu_1.DropdownMenuContent>
      </dropdown_menu_1.DropdownMenu>

      <app_alert_dialog_1.AppAlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert} title="Supprimer ce parent ?" description="Cette action est irréversible. Les liens avec les élèves seront également supprimés." onConfirm={handleDelete} confirmLabel="Supprimer" variant="destructive"/>
    </>);
}
//# sourceMappingURL=parent-actions.js.map