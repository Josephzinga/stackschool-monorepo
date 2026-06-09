'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectView = SubjectView;
const ui_1 = require("@stackschool/ui");
const columns_1 = require("@/components/school/subject/table/columns");
const data_table_1 = require("@/components/school/subject/table/data-table");
const table_header_1 = __importDefault(require("@/components/school/subject/table/table-header"));
const table_provider_1 = require("@/components/school/subject/table/table-provider");
function SubjectView() {
    const { searchTerm, pagination, filters } = (0, table_provider_1.useSubjectTable)();
    const { data, isPending, isError } = (0, ui_1.useGetSchoolSubjectsQuery)({
        input: {
            limit: pagination.pageSize,
            page: pagination.pageIndex,
            searchTerm,
            classId: filters.classId,
            teacherId: filters.teacherId,
        },
    });
    const subjectData = data?.getSchoolSubjects?.data?.map((s) => ({
        id: s.id,
        code: s?.code,
        name: s?.name,
        category: s?.category,
        mainTeacher: {
            id: s?.mainTeacher?.id,
            firstname: s?.mainTeacher?.user?.profile?.firstname,
            lastname: s?.mainTeacher?.user?.profile?.lastname,
            photo: s?.mainTeacher?.user?.profile?.photo,
        },
        classes: s.classSubject?.map((cs) => cs?.group?.classes) || [],
        totalWeeklyHours: s.totalWeeklyHours ?? 0,
    })) || [];
    return (<div className="flex-1 flex flex-col gap-4 p-2 sm:p-4">
      <table_header_1.default />
      <data_table_1.SubjectDataTable meta={data?.getSchoolSubjects?.meta} isLoading={isPending} data={subjectData} columns={columns_1.columns}/>
    </div>);
}
//# sourceMappingURL=subject-view.js.map