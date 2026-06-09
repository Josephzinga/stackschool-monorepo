'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherDialog = TeacherDialog;
const dialog_1 = require("@/components/ui/dialog");
const create_teacher_form_1 = require("@/components/school/teacher/form/create-teacher-form");
function TeacherDialog({ open, setOpen, defaultValues, }) {
    const handleSuccess = () => {
        setOpen(false);
    };
    return (<dialog_1.Dialog open={open} onOpenChange={setOpen}>
      <dialog_1.DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
        <dialog_1.DialogHeader>
          <dialog_1.DialogTitle>Nouveau Professeur</dialog_1.DialogTitle>
          <dialog_1.DialogDescription>
            Remplissez les informations pour ajouter un enseignant à l'école.
          </dialog_1.DialogDescription>
        </dialog_1.DialogHeader>

        <div className="py-4">
          
          <create_teacher_form_1.CreateTeacherForm editDefaultValues={defaultValues} onSuccess={handleSuccess}/>
        </div>
      </dialog_1.DialogContent>
    </dialog_1.Dialog>);
}
//# sourceMappingURL=teacher-dialog.js.map