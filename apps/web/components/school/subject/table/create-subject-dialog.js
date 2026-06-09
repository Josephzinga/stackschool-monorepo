"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CreateSubjectDialog;
const dialog_1 = require("@/components/ui/dialog");
const subject_form_1 = __importDefault(require("@/components/school/subject/subject-form"));
function CreateSubjectDialog({ open, onOpenChange, }) {
    return (<dialog_1.Dialog open={open} onOpenChange={onOpenChange}>
      <dialog_1.DialogContent>
        <dialog_1.DialogHeader>
          <dialog_1.DialogTitle>Crée une matière</dialog_1.DialogTitle>
        </dialog_1.DialogHeader>
        <subject_form_1.default onSuccess={() => onOpenChange(!open)}/>
      </dialog_1.DialogContent>
    </dialog_1.Dialog>);
}
//# sourceMappingURL=create-subject-dialog.js.map