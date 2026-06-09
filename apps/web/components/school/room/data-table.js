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
exports.RoomDataTable = RoomDataTable;
const react_1 = __importStar(require("react"));
const skeleton_1 = __importDefault(require("@/components/skeleton"));
const app_data_table_1 = __importDefault(require("@/components/table/app-data-table"));
const data_table_pagination_1 = require("@/components/data-table-pagination");
const react_table_1 = require("@tanstack/react-table");
const dialog_1 = require("@/components/ui/dialog");
const room_form_1 = require("@/components/school/room/room-form");
function RoomDataTable({ columns, isLoading, data, meta, }) {
    const [pagination, setPagination] = (0, react_1.useState)({
        pageIndex: 0,
        pageSize: 10,
    });
    const [deleteDialogOpen, setDeleteDialogOpen] = (0, react_1.useState)(false);
    const [editDialogOpen, setEditDialogOpen] = (0, react_1.useState)(false);
    const [selectedRow, setSelectedRow] = (0, react_1.useState)();
    const table = (0, react_table_1.useReactTable)({
        columns,
        data,
        getCoreRowModel: (0, react_table_1.getCoreRowModel)(),
        getPaginationRowModel: (0, react_table_1.getPaginationRowModel)(),
        onPaginationChange: setPagination,
        getFilteredRowModel: (0, react_table_1.getFilteredRowModel)(),
        getRowId: (row) => row.id,
        rowCount: meta?.total,
        state: {
            pagination,
        },
        meta: {
            openEdit: (data) => {
                setSelectedRow(data);
                setEditDialogOpen(true);
            },
            openDelete: (data) => {
                setSelectedRow(data);
                setDeleteDialogOpen(true);
            },
        },
    });
    const initialValues = {
        ...selectedRow,
        defaultClassId: selectedRow?.defaultForClass?.id,
    };
    return (<div className="w-full h-full font-poppins z-10 flex flex-col gap-4">
      <div className="rounded-md mb-2 border relative min-h-75 overflow-x-auto">
        {isLoading ? (<skeleton_1.default />) : (<app_data_table_1.default table={table} columns={columns}/>)}
      </div>
      <data_table_pagination_1.DataTablePagination table={table} isLoading={isLoading}/>

      <dialog_1.Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <dialog_1.DialogContent>
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Modifier cette salle</dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
          <room_form_1.RoomForm initialValues={initialValues} onSucces={() => setEditDialogOpen(false)}/>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
//# sourceMappingURL=data-table.js.map