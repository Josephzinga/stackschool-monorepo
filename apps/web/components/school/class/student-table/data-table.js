'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTable = DataTable;
const react_table_1 = require("@tanstack/react-table");
const data_table_pagination_1 = require("@/components/data-table-pagination");
const app_data_table_1 = __importDefault(require("@/components/table/app-data-table"));
const react_1 = require("react");
const app_alert_dialog_1 = require("@/components/app-alert-dialog");
const react_query_1 = require("@tanstack/react-query");
const skeleton_1 = __importDefault(require("@/components/skeleton"));
const dialog_1 = require("@/components/ui/dialog");
const create_student_form_1 = require("@/components/school/student/form/create-student-form");
function DataTable({ columns, data, isLoading, meta, classId, }) {
    const [deleteDialogOpen, setDeleteDialogOpen] = (0, react_1.useState)(false);
    const [editDialogOpen, setEditDialogOpen] = (0, react_1.useState)(false);
    const [addOpen, setAddOpen] = (0, react_1.useState)(false);
    const [selectedRow, setSelectedRow] = (0, react_1.useState)();
    const table = (0, react_table_1.useReactTable)({
        columns,
        data,
        getCoreRowModel: (0, react_table_1.getCoreRowModel)(),
        getPaginationRowModel: (0, react_table_1.getPaginationRowModel)(),
        getFilteredRowModel: (0, react_table_1.getFilteredRowModel)(),
        getRowId: (row) => row.id,
        rowCount: meta?.total,
        manualPagination: true,
        manualFiltering: true,
        meta: {
            openEdit: (data) => {
                setSelectedRow(data);
                setEditDialogOpen(true);
            },
            openDelete: (data) => {
                setSelectedRow(data);
                setDeleteDialogOpen(true);
            },
            openAdd: (data1) => {
                setSelectedRow(data1);
                setAddOpen(true);
            },
        },
    });
    const queryClient = (0, react_query_1.useQueryClient)();
    const handleDelete = async () => { };
    return (<div className="space-y-4">
      <div className="rounded-md border relative min-h-75">
        {isLoading && <skeleton_1.default />}
        <app_data_table_1.default table={table} columns={columns} isLoading={isLoading}/>
      </div>

      <data_table_pagination_1.DataTablePagination table={table} isLoading={isLoading}/>

      {deleteDialogOpen && (<app_alert_dialog_1.AppAlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} onConfirm={handleDelete} description="Cette action vas supprimer cette classe et tous le donnée correspondente" title="Etes vous sur de cette action ?"/>)}

      {addOpen && (<dialog_1.Dialog open={addOpen} onOpenChange={setAddOpen}>
          <dialog_1.DialogContent>
            <dialog_1.DialogHeader>
              <dialog_1.DialogTitle></dialog_1.DialogTitle>
            </dialog_1.DialogHeader>

            <create_student_form_1.CreateStudentForm initialValues={{
                schoolClass: { id: classId },
                id: selectedRow?.id,
            }}/>
          </dialog_1.DialogContent>
        </dialog_1.Dialog>)}
    </div>);
}
//# sourceMappingURL=data-table.js.map