'use client';
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTable = DataTable;
const react_table_1 = require("@tanstack/react-table");
const React = __importStar(require("react"));
const react_1 = require("react");
const table_provider_1 = require("./table-provider");
const react_use_1 = require("react-use");
const data_table_pagination_1 = require("@/components/data-table-pagination");
const app_data_table_1 = __importDefault(require("@/components/table/app-data-table"));
function DataTable({ columns, data, isLoading, meta, }) {
    const [sorting, setSorting] = (0, react_1.useState)([]);
    const [columnFilters, setColumnFilters] = (0, react_1.useState)([]);
    const { pagination, setPagination, rowSelection, setRowSelection, columnVisibility, setColumnVisibility, } = (0, table_provider_1.useTable)();
    const { width } = (0, react_use_1.useWindowSize)();
    (0, react_1.useEffect)(() => {
        if (width < 640) {
            setColumnVisibility({
                phoneNumber: false,
                classes: false,
                specialization: false,
                status: false,
            });
        }
        else if (width < 1200) {
            setColumnVisibility({
                select: true,
                phoneNumber: false,
                classes: false,
                specialization: true,
                status: false,
            });
        }
        else if (width < 1500) {
            setColumnVisibility({
                phoneNumber: true,
                status: true,
                classes: true,
            });
        }
        else {
            setColumnVisibility({});
        }
    }, [width, setColumnVisibility]);
    const table = (0, react_table_1.useReactTable)({
        columns,
        data,
        getCoreRowModel: (0, react_table_1.getCoreRowModel)(),
        getPaginationRowModel: (0, react_table_1.getPaginationRowModel)(),
        onPaginationChange: setPagination,
        getFilteredRowModel: (0, react_table_1.getFilteredRowModel)(),
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getRowId: (row) => row.id,
        rowCount: meta?.total,
        manualPagination: true,
        state: {
            columnFilters,
            columnVisibility,
            pagination,
            rowSelection,
        },
    });
    return (<div className="w-full h-full font-poppins z-10 flex flex-col gap-4">
      <div className="rounded-md border relative min-h-75 overflow-x-auto">
        {isLoading && (<div className="absolute inset-0 bg-white/50 dark:bg-slate-800/70 z-50 flex flex-col backdrop-blur-sm">
            {Array.from({ length: 5 }).map((_, i) => (<div key={i} className="flex justify-between items-center flex-row animate-pulse px-4 w-full h-14 even:bg-slate-50 dark:even:bg-slate-950">
                {Array.from({ length: 5 }).map((_, i) => (<div key={i} className="h-5 w-25 bg-slate-700 rounded-sm"/>))}
              </div>))}
          </div>)}

        <app_data_table_1.default table={table} isLoading={isLoading} columns={columns}/>
      </div>
      <data_table_pagination_1.DataTablePagination table={table} isLoading={isLoading}/>
    </div>);
}
//# sourceMappingURL=data-table.js.map