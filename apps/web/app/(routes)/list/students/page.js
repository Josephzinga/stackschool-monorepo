'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const data_table_1 = require("@/components/school/student/table/data-table");
const ui_1 = require("@stackschool/ui");
const columns_1 = require("@/components/school/student/table/columns");
const table_provider_1 = require("@/components/school/student/table/table-provider");
const data_table_header_1 = require("@/components/school/student/table/data-table-header");
const useDebounce_1 = require("@/hooks/useDebounce");
const navigation_1 = require("next/navigation");
function default_1() {
    return (<table_provider_1.TableProvider>
      <StudentView />
    </table_provider_1.TableProvider>);
}
function StudentView() {
    const searchParams = (0, navigation_1.useSearchParams)();
    const teacherId = searchParams.get('teacherId');
    const { filters, pagination, searchTerm } = (0, table_provider_1.useTable)();
    const search = (0, useDebounce_1.useDebounce)(searchTerm, 400);
    const { data, isPending } = (0, ui_1.useGetSchoolStudentsQuery)({
        input: {
            ...filters,
            sort: filters.sort,
            limit: pagination.pageSize,
            page: pagination.pageIndex,
            searchTerm: search,
            teacherId,
        },
    });
    const StudentsData = data?.getSchoolStudents?.data.map((s) => ({
        id: s.id,
        phoneNumber: s.user?.phoneNumber ?? '',
        firstname: s.user?.profile?.firstname ?? '',
        lastname: s.user?.profile?.lastname ?? '',
        email: s.user?.email ?? '',
        level: s.schoolClass?.level,
        status: true,
        className: s.schoolClass?.name ?? '',
        section: s.schoolClass?.section ?? '',
        photo: s.user?.profile?.photo,
        enrollmentYear: s?.enrollmentYear ?? '',
        matricule: s.matricule,
    })) || [];
    const meta = data?.getSchoolStudents.meta;
    return (<div className="flex-1 flex flex-col bg-background p-2 gap-2 md:gap-4 md:p-4 ">
      <data_table_header_1.DataTableHeader />
      <data_table_1.DataTable columns={columns_1.columns} meta={meta} data={StudentsData} isLoading={isPending}/>
    </div>);
}
//# sourceMappingURL=page.js.map