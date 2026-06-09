'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupDataTable = GroupDataTable;
const react_1 = require("react");
const react_table_1 = require("@tanstack/react-table");
const app_data_table_1 = __importDefault(require("@/components/table/app-data-table"));
const data_table_pagination_1 = require("@/components/data-table-pagination");
const skeleton_1 = __importDefault(require("@/components/skeleton"));
function GroupDataTable({ columns, data, isLoading, meta, }) {
    const [pagination, setPagination] = (0, react_1.useState)({
        pageSize: 10,
        pageIndex: 0,
    });
    const [rowSelection, setRowSelection] = (0, react_1.useState)();
    const table = (0, react_table_1.useReactTable)({
        columns,
        data,
        getCoreRowModel: (0, react_table_1.getCoreRowModel)(),
        getPaginationRowModel: (0, react_table_1.getPaginationRowModel)(),
        onPaginationChange: setPagination,
        getFilteredRowModel: (0, react_table_1.getFilteredRowModel)(),
        getRowId: (row) => row.id,
        rowCount: meta?.total,
        manualPagination: true,
        manualFiltering: true,
        state: {
            pagination,
        },
    });
    return (<div className="w-full h-full font-poppins z-10 flex flex-col gap-4">
      <div className="rounded-md mb-2 border relative min-h-75 overflow-x-auto">
        <skeleton_1.default isLoading={isLoading}/>
        <app_data_table_1.default table={table} columns={columns} isLoading={isLoading}/>
      </div>
      <data_table_pagination_1.DataTablePagination table={table} isLoading={isLoading}/>
    </div>);
}
//# sourceMappingURL=data-table.js.map