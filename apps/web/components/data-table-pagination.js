'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTablePagination = DataTablePagination;
const select_1 = require("@/components/ui/select");
const button_1 = require("@/components/ui/button");
const icons_react_1 = require("@tabler/icons-react");
function DataTablePagination({ table, isLoading, renderTotalCount, }) {
    return (<div className="flex flex-col sm:flex-row items-center justify-between px-2 gap-4">
      <div className="text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (<span>
            {table.getFilteredSelectedRowModel().rows.length} sur{' '}
            {table.getFilteredRowModel().rows.length} ligne(s) sélectionnée(s).
          </span>) : (<>
            <span>{table.getFilteredRowModel().rows.length} résultat(s)</span>
          </>)}
      </div>

      <div>{renderTotalCount}</div>

      <div className="flex items-center gap-4 lg:gap-8 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium hidden sm:block">Lignes</p>
          <select_1.Select value={`${table.getState().pagination.pageSize}`} onValueChange={(value) => {
            table.setPageSize(Number(value));
        }}>
            <select_1.SelectTrigger className="h-8 w-[70px]">
              <select_1.SelectValue placeholder={table.getState().pagination.pageSize}/>
            </select_1.SelectTrigger>
            <select_1.SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (<select_1.SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </select_1.SelectItem>))}
            </select_1.SelectContent>
          </select_1.Select>
        </div>

        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} /{' '}
          {table.getPageCount()}
        </div>

        <div className="flex items-center gap-2">
          <button_1.Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage() || isLoading}>
            <span className="sr-only">Précédent</span>
            <icons_react_1.IconChevronLeft className="h-4 w-4"/>
          </button_1.Button>
          <button_1.Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.nextPage()} disabled={!table.getCanNextPage() || isLoading}>
            <span className="sr-only">Suivant</span>
            <icons_react_1.IconChevronRight className="h-4 w-4"/>
          </button_1.Button>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=data-table-pagination.js.map