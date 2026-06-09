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
const table_provider_1 = require("@/components/school/class/table/table-provider");
const react_1 = require("react");
const class_dialog_1 = __importDefault(require("@/components/school/class/table/class-dialog"));
const app_alert_dialog_1 = require("@/components/app-alert-dialog");
const ui_1 = require("@stackschool/ui");
const sonner_1 = require("sonner");
const react_query_1 = require("@tanstack/react-query");
const skeleton_1 = __importDefault(require("@/components/skeleton"));
const dialog_1 = require("@/components/ui/dialog");
const create_classSubject_form_1 = require("@/components/school/class-subject/create-classSubject-form");
function DataTable({ columns, data, isLoading, meta, pagination, setPagination, }) {
    const [deleteDialogOpen, setDeleteDialogOpen] = (0, react_1.useState)(false);
    const [editDialogOpen, setEditDialogOpen] = (0, react_1.useState)(false);
    const [addOpen, setAddOpen] = (0, react_1.useState)(false);
    const [selectedRow, setSelectedRow] = (0, react_1.useState)();
    const { setRowSelection, setColumnVisibility, columnVisibility, rowSelection, } = (0, table_provider_1.useClassTable)();
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
        state: {
            columnVisibility,
            pagination,
            rowSelection,
        },
    });
    const queryClient = (0, react_query_1.useQueryClient)();
    const { mutateAsync } = (0, ui_1.useDeleteClassesMutation)({
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['GetSchoolClasses'] });
        },
    });
    const { currentSchool } = (0, ui_1.useUserStore)();
    const handleDelete = async () => {
        if (!selectedRow?.id)
            return;
        const promise = mutateAsync({
            classIds: selectedRow?.id,
            schoolId: currentSchool?.id,
        });
        sonner_1.toast.promise(promise, {
            loading: 'Suppression en cours...',
            success: (data) => {
                if (data.deleteClasses?.ok) {
                    return data.deleteClasses.message || 'Suppression réussi avec succès';
                }
                throw new Error(data.deleteClasses?.message || 'Erreur lors de la suppression');
            },
            error: (err) => {
                return err?.message;
            },
            toasterId: 'dashboard',
        });
        setDeleteDialogOpen(false);
    };
    return (<div className="space-y-4">
      <div className="rounded-md border relative min-h-75">
        {isLoading && <skeleton_1.default />}
        <app_data_table_1.default table={table} columns={columns} isLoading={isLoading}/>
      </div>

      <data_table_pagination_1.DataTablePagination table={table} isLoading={isLoading}/>

      {editDialogOpen && (<class_dialog_1.default initialValues={selectedRow} open={editDialogOpen} onOpenChange={setEditDialogOpen}/>)}

      {deleteDialogOpen && (<app_alert_dialog_1.AppAlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} onConfirm={handleDelete} description="Cette action vas supprimer cette classe et tous le donnée correspondente" title="Etes vous sur de cette action ?"/>)}

      {addOpen && (<dialog_1.Dialog open={addOpen} onOpenChange={setAddOpen}>
          <dialog_1.DialogContent>
            <dialog_1.DialogHeader>
              <dialog_1.DialogTitle></dialog_1.DialogTitle>
            </dialog_1.DialogHeader>

            <create_classSubject_form_1.CreateClassSubjectForm classId={selectedRow?.id}/>
          </dialog_1.DialogContent>
        </dialog_1.Dialog>)}
    </div>);
}
//# sourceMappingURL=data-table.js.map