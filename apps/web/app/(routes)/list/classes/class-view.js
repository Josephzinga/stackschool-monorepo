'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassView = ClassView;
const ui_1 = require("@stackschool/ui");
const data_table_1 = require("@/components/school/class/table/data-table");
const columns_1 = require("@/components/school/class/table/columns");
const useDebounce_1 = require("@/hooks/useDebounce");
const data_table_header_1 = __importDefault(require("@/components/school/class/table/data-table-header"));
const table_provider_1 = require("@/components/school/class/table/table-provider");
const navigation_1 = require("next/navigation");
const react_1 = require("react");
function ClassView() {
    const { searchTerm, pagination, setPagination, filters } = (0, table_provider_1.useClassTable)();
    const debouncedSearch = (0, useDebounce_1.useDebounce)(searchTerm, 400);
    const searchParams = (0, navigation_1.useSearchParams)();
    const teacherId = searchParams.get('teacherId');
    const { data, isLoading } = (0, ui_1.useGetSchoolClassesQuery)({
        input: {
            page: pagination.pageIndex,
            limit: pagination.pageSize,
            searchTerm: debouncedSearch,
            teacherId,
            section: filters?.section,
            level: filters?.level,
        },
    });
    const classesData = (0, react_1.useMemo)(() => data?.getSchoolClasses?.data?.map((c) => ({
        ...c,
        supervisor: {
            id: c.supervisor?.user?.id,
            profile: {
                id: c.supervisor?.user?.profile?.id,
                firstname: c.supervisor?.user?.profile?.firstname ?? '',
                lastname: c.supervisor?.user?.profile?.lastname ?? '',
                photo: c.supervisor?.user?.profile?.photo ?? undefined,
            },
        },
        teachers: c.teachers?.map((t) => ({
            id: t?.id ?? '',
            firstname: t?.user?.profile?.firstname ?? '',
            lastname: t?.user?.profile?.lastname ?? '',
        })) || [],
        subjects: c.subjects,
        _count: {
            students: (c?._count?.students?.male || 0) +
                (c?._count?.students?.female || 0),
            subjects: c._count?.subjects || 0,
            teachers: c._count?.teachers || 0,
        },
    })) || [], [data]);
    const meta = data?.getSchoolClasses.meta;
    return (<div className="flex flex-col h-full p-4 md:p-6 gap-4">
      <data_table_header_1.default />

      <data_table_1.DataTable columns={columns_1.columns} data={classesData} meta={meta} isLoading={isLoading} pagination={pagination} setPagination={setPagination}/>
    </div>);
}
//# sourceMappingURL=class-view.js.map