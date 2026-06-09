'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStudentDetails = UpdateStudentDetails;
const sheet_1 = require("@/components/ui/sheet");
const create_student_form_1 = require("@/components/school/student/form/create-student-form");
const react_query_1 = require("@tanstack/react-query");
function UpdateStudentDetails({ open, onOpenChange, studentData, }) {
    const useQuery = (0, react_query_1.useQueryClient)();
    const getCacheDelais = async () => { };
    return (<sheet_1.Sheet open={open} onOpenChange={onOpenChange}>
      <sheet_1.SheetContent side="right" className="sm:max-w-none w-full sm:w-[600px] md:w-[700px] overflow-y-auto">
        <sheet_1.SheetHeader>
          <sheet_1.SheetTitle>Modifier les informations</sheet_1.SheetTitle>
          <sheet_1.SheetDescription>
            Modifiez les détails de l'élève et de ses parents.
          </sheet_1.SheetDescription>
        </sheet_1.SheetHeader>

        <div className="py-6 px-4 md:px-6">
          <create_student_form_1.CreateStudentForm mode="FULL_EDIT" initialValues={studentData}/>
        </div>
      </sheet_1.SheetContent>
    </sheet_1.Sheet>);
}
//# sourceMappingURL=update-student-details.js.map