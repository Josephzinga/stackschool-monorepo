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
exports.default = AppDataTable;
const table_1 = require("@/components/ui/table");
const react_table_1 = require("@tanstack/react-table");
const React = __importStar(require("react"));
function AppDataTable({ table, columns, isLoading, }) {
    return (<table_1.Table>
      <table_1.TableHeader>
        {table?.getHeaderGroups()?.map((headerGroup) => (<table_1.TableRow key={headerGroup.id} className="h-10 bg-slate-100 dark:bg-slate-900">
            {headerGroup.headers.map((header) => {
                return (<table_1.TableHead key={header.id} className="font-semibold px-1 md:px-2 font-inter text-md whitespace-nowrap">
                  {header.isPlaceholder
                        ? null
                        : (0, react_table_1.flexRender)(header.column.columnDef.header, header.getContext())}
                </table_1.TableHead>);
            })}
          </table_1.TableRow>))}
      </table_1.TableHeader>
      <table_1.TableBody>
        {table.getRowModel().rows?.length ? (table.getRowModel().rows.map((row) => (<table_1.TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className="h-16 even:bg-slate-50 dark:even:bg-gray-950 hover:dark:even:bg-slate-950 ">
              {row.getVisibleCells().map((cell) => (<table_1.TableCell key={cell.id} className="font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                  {(0, react_table_1.flexRender)(cell.column.columnDef.cell, cell.getContext())}
                </table_1.TableCell>))}
            </table_1.TableRow>))) : (<table_1.TableRow>
            <table_1.TableCell colSpan={columns.length} className="h-24 text-center">
              {isLoading ? 'Chargement...' : 'Aucun résultat.'}
            </table_1.TableCell>
          </table_1.TableRow>)}
      </table_1.TableBody>
    </table_1.Table>);
}
//# sourceMappingURL=app-data-table.js.map