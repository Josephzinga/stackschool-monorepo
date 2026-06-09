'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassStudentList = ClassStudentList;
const columns_1 = require("@/components/school/class/student-table/columns");
const data_table_1 = require("@/components/school/class/student-table/data-table");
const ui_1 = require("@stackschool/ui");
const react_1 = require("react");
const table_header_1 = require("@/components/school/class/student-table/table-header");
const nuqs_1 = require("nuqs");
function ClassStudentList({ classId }) {
    const [search] = (0, nuqs_1.useQueryState)('search');
    const searchTerm = (0, react_1.useDeferredValue)(search);
    const { data, isPending, isError, error } = (0, ui_1.useGetClassStudentsQuery)({
        input: {
            classId: classId,
            searchTerm,
        },
    }, {
        enabled: !!classId,
    });
    const studentData = (0, react_1.useMemo)(() => data?.getSchoolStudents.data?.map((s) => ({
        id: s.id,
        firstname: s.user?.profile?.firstname ?? '',
        lastname: s.user?.profile?.lastname ?? '',
        gender: s.user?.profile?.gender,
        photo: s.user?.profile?.photo ?? undefined,
        matricule: s.matricule,
        studentNumber: s.studentNumber,
        status: s.status,
    })) || [], [data]);
    const meta = data?.getSchoolStudents.meta;
    return (<div className="space-y-2">
      <table_header_1.ClassStudentTableHeader />
      <data_table_1.DataTable data={studentData} columns={columns_1.columns} meta={meta} classId={classId} isLoading={isPending}/>
    </div>);
}
//# sourceMappingURL=class-student-list.js.map