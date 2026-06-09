'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentDialog = StudentDialog;
const dialog_1 = require("@/components/ui/dialog");
const create_student_form_1 = require("@/components/school/student/form/create-student-form");
const ui_1 = require("@stackschool/ui");
const lucide_react_1 = require("lucide-react");
function StudentDialog({ open, setOpen, studentId, }) {
    const handleSuccess = () => {
        setOpen(false);
    };
    const { currentSchool } = (0, ui_1.useUserStore)();
    const { data, isPending } = (0, ui_1.useGetStudentDetailsQuery)({
        id: studentId,
    }, {
        enabled: open && !!studentId && !!currentSchool?.id,
    });
    return (<dialog_1.Dialog open={open} onOpenChange={setOpen}>
      <dialog_1.DialogContent className="sm:max-w-150 font-poppins max-h-[80vh] md:max-h-[90vh]">
        {studentId && isPending ? (<div className="flex justify-center items-center min-h-60 h-full">
            <lucide_react_1.LoaderCircleIcon className="text-primary h-15 w-15 animate-spin"/>
          </div>) : (<>
            <dialog_1.DialogHeader className="flex w-full justify-center items-center">
              <dialog_1.DialogTitle className="text-2xl font-semibold">
                Nouvel élève
              </dialog_1.DialogTitle>
              <dialog_1.DialogDescription className="-tracking-tighter">
                Remplissez les informations pour ajouter un élève à l'école.
              </dialog_1.DialogDescription>
            </dialog_1.DialogHeader>

            <div className="py-4">
              <create_student_form_1.CreateStudentForm initialValues={data?.student ?? undefined} onSuccess={handleSuccess}/>
            </div>
          </>)}
      </dialog_1.DialogContent>
    </dialog_1.Dialog>);
}
//# sourceMappingURL=student-dialog.js.map