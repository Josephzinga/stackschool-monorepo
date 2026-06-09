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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTable = DataTable;
const react_table_1 = require("@tanstack/react-table");
const table_1 = require("@/components/ui/table");
const React = __importStar(require("react"));
const react_1 = require("react");
const spinner_1 = require("@/components/ui/spinner");
const table_provider_1 = require("./table-provider");
const react_use_1 = require("react-use");
const data_table_pagination_1 = require("@/components/data-table-pagination");
function DataTable({ columns, data, isLoading, meta, }) {
    const { pagination, setPagination, rowSelection, setRowSelection, columnVisibility, setColumnVisibility, } = (0, table_provider_1.useTable)();
    const { width } = (0, react_use_1.useWindowSize)();
    (0, react_1.useEffect)(() => {
        if (width < 640) {
            setColumnVisibility({
                select: false,
                phoneNumber: false,
                address: false,
                profession: false,
                students: false,
            });
        }
        else if (width < 1024) {
            setColumnVisibility({
                select: true,
                phoneNumber: false,
                address: false,
                profession: true,
                students: true,
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
        onPaginationChange: setPagination,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getRowId: (row) => row.id,
        rowCount: meta?.total,
        manualPagination: true,
        state: {
            columnVisibility,
            pagination,
            rowSelection,
        },
    });
    return (<div className="w-full h-full font-poppins z-10 flex flex-col gap-4">
      <div className="rounded-md border relative min-h-75 overflow-x-auto">
        {isLoading && (<div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <spinner_1.Spinner className="h-8 w-8 text-primary"/>
          </div>)}

        <table_1.Table>
          <table_1.TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (<table_1.TableRow key={headerGroup.id} className="h-10 bg-slate-100 dark:bg-slate-900">
                {headerGroup.headers.map((header) => (<table_1.TableHead key={header.id} className="font-semibold font-inter text-md whitespace-nowrap">
                    {header.isPlaceholder
                    ? null
                    : (0, react_table_1.flexRender)(header.column.columnDef.header, header.getContext())}
                  </table_1.TableHead>))}
              </table_1.TableRow>))}
          </table_1.TableHeader>
          <table_1.TableBody>
            {table.getRowModel().rows?.length ? (table.getRowModel().rows.map((row) => (<table_1.TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className="h-14 even:bg-slate-50 dark:even:bg-slate-950 ">
                  {row.getVisibleCells().map((cell) => (<table_1.TableCell key={cell.id} className="font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                      {(0, react_table_1.flexRender)(cell.column.columnDef.cell, cell.getContext())}
                    </table_1.TableCell>))}
                </table_1.TableRow>))) : (<table_1.TableRow>
                <table_1.TableCell colSpan={columns.length} className="h-24 text-center">
                  {isLoading ? 'Chargement...' : 'Aucun résultat.'}
                </table_1.TableCell>
              </table_1.TableRow>)}
          </table_1.TableBody>
        </table_1.Table>
      </div>

      <data_table_pagination_1.DataTablePagination table={table} isLoading={isLoading}/>
    </div>);
}
//# sourceMappingURL=data-table.js.map