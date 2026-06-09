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
const app_data_table_1 = __importDefault(require("@/components/table/app-data-table"));
const data_table_pagination_1 = require("@/components/data-table-pagination");
const skeleton_1 = __importDefault(require("@/components/skeleton"));
function DataTable({ columns, data, isLoading, meta, }) {
    const { pagination, setPagination, rowSelection, setRowSelection, columnVisibility, setColumnVisibility, } = (0, table_provider_1.useTable)();
    const { width } = (0, react_use_1.useWindowSize)();
    (0, react_1.useEffect)(() => {
        if (width < 540) {
            setColumnVisibility({
                section: false,
                enrollmentYear: false,
                level: false,
                className: false,
                matricule: false,
                select: false,
                status: false,
            });
        }
        else if (width < 1024) {
            setColumnVisibility({
                select: true,
                section: false,
                enrollmentYear: false,
                level: false,
                matricule: false,
                status: true,
            });
        }
        else if (width < 1400) {
            setColumnVisibility({
                select: true,
                section: false,
                matricule: true,
                status: true,
                enrollmentYear: false,
                level: false,
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
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getRowId: (row) => row.id,
        rowCount: meta?.total,
        manualPagination: true,
        manualFiltering: true,
        state: {
            columnVisibility,
            pagination,
            rowSelection,
        },
    });
    const renderTotalCount = () => (<div>
      <p className="opacity-80 font-sans ">
        Nombre total des élèves:{' '}
        <span className="text-primary font-sans font-semibold text-lg">
          {meta?.total}
        </span>{' '}
      </p>
    </div>);
    return (<div className="w-full h-full font-poppins z-10 flex flex-col gap-4">
      <>
        <div className="rounded-md mb-2 border relative min-h-75 overflow-x-auto">
          {isLoading ? (<skeleton_1.default />) : (<app_data_table_1.default table={table} columns={columns} isLoading={isLoading}/>)}
        </div>
        <data_table_pagination_1.DataTablePagination table={table} isLoading={isLoading} renderTotalCount={renderTotalCount()}/>
      </>
    </div>);
}
//# sourceMappingURL=data-table.js.map