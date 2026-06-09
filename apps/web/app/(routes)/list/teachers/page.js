'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TeacherPage;
const data_table_1 = require("@/components/school/teacher/table/data-table");
const columns_1 = require("@/components/school/teacher/table/columns");
const table_provider_1 = require("@/components/school/teacher/table/table-provider");
const data_table_header_1 = require("@/components/school/teacher/table/data-table-header");
const ui_1 = require("@stackschool/ui");
const useDebounce_1 = require("@/hooks/useDebounce");
const react_1 = require("react");
function TeacherPage() {
    return (<table_provider_1.TableProvider>
      <TeachersView />
    </table_provider_1.TableProvider>);
}
function TeachersView() {
    const { pagination, searchTerm, filters } = (0, table_provider_1.useTable)();
    const { currentSchool } = (0, ui_1.useUserStore)();
    const search = (0, useDebounce_1.useDebounce)(searchTerm.length > 1 ? searchTerm : '', 400);
    const { data, isPending } = (0, ui_1.useGetSchoolTeachersQuery)({
        input: {
            limit: pagination.pageSize,
            page: pagination.pageIndex,
            searchTerm: search,
            ...filters,
        },
    }, {
        enabled: !!currentSchool?.id,
    });
    const teacherData = (0, react_1.useMemo)(() => data?.getSchoolTeachers?.data?.map((t) => ({
        id: t?.id ?? '',
        firstname: t.user?.profile?.firstname || '',
        lastname: t.user?.profile?.lastname || '',
        email: t.user?.email || '',
        phoneNumber: t.user?.phoneNumber || '',
        photo: t.user?.profile?.photo ?? undefined,
        specialization: t.specialization ? [t.specialization] : [],
        gender: t?.user?.profile?.gender,
        diploma: t?.diploma ?? '',
        assignments: t.assignments?.flatMap((ass) => ass?.classSubjects?.group?.classes?.map((c) => ({
            class: c,
            subject: ass?.classSubjects?.subject ?? undefined,
        }))) ?? [],
        status: t.isActive || false,
        weeklyHours: t?.weeklyHours ?? 0,
    })) || [], [data]);
    const meta = data?.getSchoolTeachers.meta;
    return (<div className="flex flex-col h-full p-3 md:p-6 z-10 gap-3">
      <data_table_header_1.DataTableHeader />

      <data_table_1.DataTable columns={columns_1.columns} data={teacherData} meta={meta} isLoading={isPending}/>
    </div>);
}
//# sourceMappingURL=page.js.map