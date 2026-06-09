'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceTable = AttendanceTable;
const react_table_1 = require("@tanstack/react-table");
const data_table_pagination_1 = require("@/components/data-table-pagination");
const app_data_table_1 = __importDefault(require("@/components/table/app-data-table"));
const react_hook_form_1 = require("react-hook-form");
const page1_1 = require("@/app/(routes)/list/attendances/page1");
const zod_1 = require("@hookform/resolvers/zod");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
function AttendanceTable({ columns, data, isLoading, }) {
    const methods = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(page1_1.attendanceSchema),
    });
    const [currentStatus, setCurrentStatus] = (0, react_1.useState)([]);
    const { handleSubmit } = methods;
    const queryClient = (0, react_query_1.useQueryClient)();
    const table = (0, react_table_1.useReactTable)({
        data,
        columns,
        getCoreRowModel: (0, react_table_1.getCoreRowModel)(),
        getFilteredRowModel: (0, react_table_1.getFilteredRowModel)(),
        meta: {
            onChange: (data, status) => {
                queryClient.getQueryData(['']);
                setCurrentStatus((prev) => [
                    ...prev,
                    { id: data?.id, userType: data?.userType, status },
                ]);
                console.log(data, 'status', status);
            },
        },
        getPaginationRowModel: (0, react_table_1.getPaginationRowModel)(),
    });
    console.log('currentStatus', currentStatus);
    const onSubmit = (data) => {
        handleSubmit(currentStatus);
    };
    if (isLoading) {
        return (<div className="rounded-md border">
        <div className="h-96 flex items-center justify-center text-muted-foreground">
          Chargement...
        </div>
      </div>);
    }
    return (<react_hook_form_1.FormProvider {...methods}>
      <div className="space-y-4">
        <div className="rounded-md border">
          <app_data_table_1.default table={table} columns={columns}/>
        </div>
        <data_table_pagination_1.DataTablePagination table={table}/>
      </div>
    </react_hook_form_1.FormProvider>);
}
//# sourceMappingURL=manual-attendace-table.js.map