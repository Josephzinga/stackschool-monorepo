"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClassDialog;
const dialog_1 = require("@/components/ui/dialog");
const create_class_form_1 = __importDefault(require("@/components/school/class/create-class-form"));
function ClassDialog({ open, onOpenChange, initialValues, }) {
    return (<dialog_1.Dialog onOpenChange={onOpenChange} open={open}>
      <dialog_1.DialogContent>
        <dialog_1.DialogHeader>
          <dialog_1.DialogTitle>Nouveau classe</dialog_1.DialogTitle>
          <dialog_1.DialogDescription>
            Remplissez les informations pour ajouter une classe à l'école.
          </dialog_1.DialogDescription>
        </dialog_1.DialogHeader>

        <create_class_form_1.default editDefaultValues={initialValues} onSuccess={() => onOpenChange(false)}/>
      </dialog_1.DialogContent>
    </dialog_1.Dialog>);
}
//# sourceMappingURL=class-dialog.js.map