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
exports.SubjectTableAction = SubjectTableAction;
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const button_1 = require("@/components/ui/button");
const icons_react_1 = require("@tabler/icons-react");
const React = __importStar(require("react"));
const react_1 = require("react");
const ui_1 = require("@stackschool/ui");
const sonner_1 = require("sonner");
const app_alert_dialog_1 = require("@/components/app-alert-dialog");
function SubjectTableAction({ row }) {
    const [openDeleteDialog, setOpenDeleteDialog] = (0, react_1.useState)(false);
    const queryClient = (0, ui_1.useQueryClient)();
    const { mutateAsync, isPending } = (0, ui_1.useDeleteSubjectsMutation)({
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: ['GetSchoolSubjects'] });
        },
    });
    const handleDelete = async () => {
        const promise = mutateAsync({
            subjectIds: row.original.id,
        });
        sonner_1.toast.promise(promise, {
            loading: 'Suppression en cours...',
            success: (data) => {
                if (data?.deleteSubjects?.ok) {
                    return (data.deleteSubjects?.message || 'Matière supprimer avec succès');
                }
                else {
                    throw new Error(data?.deleteSubjects?.message ||
                        'Erreur lors de la suppression de la matière');
                }
            },
            error: (err) => {
                return err?.message;
            },
            toasterId: 'dashboard',
        });
        setOpenDeleteDialog(false);
    };
    return (<div className="w-full flex justify-center">
      <dropdown_menu_1.DropdownMenu>
        <dropdown_menu_1.DropdownMenuTrigger asChild>
          <button_1.Button variant="ghost" className="data-[state=open]:bg-muted text-muted-foreground flex size-8 cursor-pointer" size="icon">
            <icons_react_1.IconDotsVertical />
            <span className="sr-only">Ouvrez le menu</span>
          </button_1.Button>
        </dropdown_menu_1.DropdownMenuTrigger>
        <dropdown_menu_1.DropdownMenuContent align="end" className="w-32">
          <dropdown_menu_1.DropdownMenuItem onClick={() => console.log('Modifier')}>
            Modifier
          </dropdown_menu_1.DropdownMenuItem>
          <dropdown_menu_1.DropdownMenuItem onClick={() => console.log('Copy')}>
            Copier
          </dropdown_menu_1.DropdownMenuItem>
          <dropdown_menu_1.DropdownMenuSeparator />
          <dropdown_menu_1.DropdownMenuItem onClick={() => setOpenDeleteDialog(true)} variant="destructive">
            Supprimer
          </dropdown_menu_1.DropdownMenuItem>
        </dropdown_menu_1.DropdownMenuContent>
      </dropdown_menu_1.DropdownMenu>

      <app_alert_dialog_1.AppAlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog} title={'Êtes-vous absolument sûr ?'} description="Cette action est irréversible. Elle supprimera définitivement cette matière et toutes les données associées de l'école." onConfirm={handleDelete} confirmLabel="Supprimer" variant="destructive"/>
    </div>);
}
//# sourceMappingURL=subject-table-action.js.map