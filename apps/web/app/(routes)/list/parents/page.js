'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParentPage;
const useDebounce_1 = require("@/hooks/useDebounce");
const data_table_1 = require("@/components/school/parent/table/data-table");
const ui_1 = require("@stackschool/ui");
const nuqs_1 = require("nuqs");
const column_1 = require("@/components/school/parent/table/column");
const data_table_header_1 = require("@/components/school/parent/table/data-table-header");
const table_provider_1 = require("@/components/school/parent/table/table-provider");
const navigation_1 = require("next/navigation");
const react_1 = require("react");
function ParentPage({ searchParams, }) {
    return (<table_provider_1.TableProvider>
      <ParentView />
    </table_provider_1.TableProvider>);
}
function ParentView() {
    const search = (0, navigation_1.useSearchParams)();
    const searchTerm = search.get('search');
    const [pagination, setPagination] = (0, nuqs_1.useQueryStates)({
        pageIndex: nuqs_1.parseAsInteger.withDefault(0),
        pageSize: nuqs_1.parseAsInteger.withDefault(10),
    });
    const [filter, setFilter] = (0, nuqs_1.useQueryStates)({
        studentId: nuqs_1.parseAsString.withDefault(''),
        payementStatus: nuqs_1.parseAsString.withDefault(''),
    });
    const { currentSchool } = (0, ui_1.useUserStore)();
    const debouncedSearchTerm = (0, useDebounce_1.useDebounce)(searchTerm, 400);
    const { data, isLoading } = (0, ui_1.useGetSchoolParentsQuery)({
        filter: {
            page: pagination.pageIndex,
            limit: pagination.pageSize,
            searchTerm: debouncedSearchTerm,
        },
    }, {
        enabled: !!currentSchool?.id,
    });
    const parentsData = (0, react_1.useMemo)(() => {
        return (data?.getSchoolParents?.data?.map((parent) => ({
            id: parent?.id,
            firstname: parent?.user?.profile?.firstname ?? '',
            lastname: parent.user?.profile?.lastname ?? '',
            phoneNumber: parent?.user?.phoneNumber ?? '',
            profession: parent.profession ?? '',
            students: parent.parentStudent?.map((s) => ({
                id: s?.student?.id,
                firstname: s?.student?.user?.profile?.firstname ?? '',
                lastname: s?.student?.user?.profile?.lastname ?? '',
                relationType: 'MOTHER',
                classe: s?.student?.schoolClass,
            })) || [],
        })) || []);
    }, [data]);
    const meta = data?.getSchoolParents?.meta;
    return (<div className="flex flex-col h-full p-4 md:p-6 gap-4">
      <data_table_header_1.DataTableHeader />
      <data_table_1.DataTable columns={column_1.columns} data={parentsData || []} meta={meta} isLoading={isLoading}/>
    </div>);
}
//# sourceMappingURL=page.js.map