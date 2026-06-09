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
const app_data_table_1 = __importDefault(require("@/components/table/app-data-table"));
const data_table_pagination_1 = require("@/components/data-table-pagination");
const react_table_1 = require("@tanstack/react-table");
const React = __importStar(require("react"));
const react_1 = require("react");
const dialog_1 = require("@/components/ui/dialog");
const create_classSubject_form_1 = require("@/components/school/class-subject/create-classSubject-form");
const app_alert_dialog_1 = require("@/components/app-alert-dialog");
const react_query_1 = require("@tanstack/react-query");
const ui_1 = require("@stackschool/ui");
const sonner_1 = require("sonner");
const skeleton_1 = __importDefault(require("@/components/skeleton"));
function DataTable({ columns, data, isLoading, }) {
    const [selectedRow, setSelectedRow] = (0, react_1.useState)();
    const [isEditDialogOpen, setIsEditDialogOpen] = (0, react_1.useState)(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = (0, react_1.useState)(false);
    const [pagination, setPagination] = (0, react_1.useState)({
        pageIndex: 0,
        pageSize: 10,
    });
    const table = (0, react_table_1.useReactTable)({
        columns,
        data,
        getCoreRowModel: (0, react_table_1.getCoreRowModel)(),
        getPaginationRowModel: (0, react_table_1.getPaginationRowModel)(),
        onPaginationChange: setPagination,
        getFilteredRowModel: (0, react_table_1.getFilteredRowModel)(),
        getRowId: (row) => row.id,
        state: {
            pagination,
        },
        meta: {
            openEdit: (data) => {
                setSelectedRow(data);
                setIsEditDialogOpen(true);
            },
            openDelete: (data) => {
                setSelectedRow(data);
                setIsDeleteDialogOpen(true);
            },
        },
    });
    const queryClient = (0, react_query_1.useQueryClient)();
    const { mutateAsync } = (0, ui_1.useDeleteClassSubjectsMutation)({
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['GetClassSubjectTable'],
            });
            await queryClient.invalidateQueries({
                queryKey: ['GetClassDetails'],
            });
            await queryClient.invalidateQueries({ queryKey: ['getTeachersTeam'] });
        },
    });
    const handleDelete = async () => {
        const promise = mutateAsync({
            ids: selectedRow?.id,
        });
        sonner_1.toast.promise(promise, {
            loading: 'Suppression en cours...',
            success: (data) => {
                return (data?.deleteClassSubjects?.message || 'Suppression reussi avec succès');
            },
            error: 'Erreur lors de la suppression',
            toasterId: 'dashboard',
        });
        setIsDeleteDialogOpen(false);
    };
    return (<div>
      <div className="rounded-md mb-2 border relative min-h-75 overflow-x-auto">
        {isLoading ? (<skeleton_1.default />) : (<app_data_table_1.default table={table} columns={columns}/>)}
      </div>
      <data_table_pagination_1.DataTablePagination table={table}/>
      <dialog_1.Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <dialog_1.DialogContent>
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Modifier la matière</dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
          <create_classSubject_form_1.CreateClassSubjectForm initialValues={selectedRow ?? undefined} onSuccess={() => {
            setIsEditDialogOpen(false);
        }}/>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>

      <app_alert_dialog_1.AppAlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} descriptionClassName="text-[14px]!" title={'Êtes-vous absolument sûr ?'} description="Cette action est irréversible. Elle supprimera définitivement cette matière dans cette classe et tous les leçons associé." onConfirm={handleDelete} confirmLabel="Supprimer" variant="destructive"/>
    </div>);
}
//# sourceMappingURL=data-table.js.map