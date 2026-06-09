"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentDialog = ParentDialog;
const dialog_1 = require("@/components/ui/dialog");
const create_parent_form_1 = require("@/components/school/parent/form/create-parent-form");
function ParentDialog({ open, onOpenChange, initialValues, }) {
    return (<dialog_1.Dialog open={open} onOpenChange={onOpenChange}>
      <dialog_1.DialogContent className="lg:w-250!">
        <dialog_1.DialogHeader>
          <dialog_1.DialogTitle>Crée un parent</dialog_1.DialogTitle>
          <dialog_1.DialogDescription></dialog_1.DialogDescription>
        </dialog_1.DialogHeader>
        <create_parent_form_1.CreateParentForm />
      </dialog_1.DialogContent>
    </dialog_1.Dialog>);
}
//# sourceMappingURL=parent-dialog.js.map