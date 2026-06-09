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
exports.DataTableHeader = DataTableHeader;
const table_provider_1 = require("./table-provider");
const button_1 = require("@/components/animate-ui/components/buttons/button");
const lucide_react_1 = require("lucide-react");
const React = __importStar(require("react"));
const react_1 = require("react");
const teacher_filters_1 = require("./teacher-filters");
const teacher_dialog_1 = require("./teacher-dialog");
const ui_1 = require("@stackschool/ui");
const sonner_1 = require("sonner");
const delete_selected_count_1 = require("@/components/school/delete-selected-count");
const app_alert_dialog_1 = require("@/components/app-alert-dialog");
const data_filters_1 = __importDefault(require("@/components/school/data-filters"));
const TEACHER_COLUMNS = [
    { id: 'info', label: 'Enseignant' },
    { id: 'speciality', label: 'Spécialité' },
    { id: 'phoneNumber', label: 'Téléphone' },
    { id: 'status', label: 'Statut' },
    { id: 'classes', label: 'Classes' },
];
function DataTableHeader() {
    const { searchTerm, setSearchTerm, filters, rowSelection, setRowSelection, columnVisibility, setColumnVisibility, } = (0, table_provider_1.useTable)();
    const [showFilters, setShowFilters] = (0, react_1.useState)(false);
    const [showDeleteAlert, setShowDeleteAlert] = (0, react_1.useState)(false);
    const [open, setOpen] = (0, react_1.useState)(false);
    const { currentSchool } = (0, ui_1.useUserStore)();
    const queryClient = (0, ui_1.useQueryClient)();
    const { mutateAsync, isPending } = (0, ui_1.useDeleteTeachersMutation)({
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['GetSchoolTeachers'],
            });
        },
    });
    const hasActiveFilters = Object.values(filters).some((v) => v !== undefined);
    const selectedCount = Object.keys(rowSelection).length;
    const handleBulkDelete = async () => {
        if (!currentSchool?.id)
            return;
        const teacherIds = Object.keys(rowSelection);
        const promise = mutateAsync({
            teacherIds,
        });
        sonner_1.toast.promise(promise, {
            loading: 'Suppression en cours...',
            success: async (data) => {
                if (data.deleteTeachers?.ok) {
                    return `${teacherIds.length} professeurs supprimé`;
                }
                else {
                    console.error(data.deleteTeachers?.message);
                    throw new Error(data.deleteTeachers?.message);
                }
            },
            error: (error) => {
                return error.message;
            },
        });
        try {
            await promise;
            setRowSelection({});
            setShowDeleteAlert(false);
        }
        catch (e) {
            console.error(e);
        }
    };
    const toggleColumn = (columnId, isVisible) => {
        setColumnVisibility((prev) => ({
            ...prev,
            [columnId]: isVisible,
        }));
    };
    return (<div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col w-full">
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {selectedCount > 0 ? (<delete_selected_count_1.DeleteSelectedCount selectedCount={selectedCount} onDelete={setShowDeleteAlert} onClose={setRowSelection}/>) : (<>
              <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
                <data_filters_1.default hasActiveFilters={hasActiveFilters} showFilters={showFilters} columns={TEACHER_COLUMNS} inputPlaceholder="Rechercher un enseignant..." columnVisibility={columnVisibility} search={searchTerm} onSearchChange={setSearchTerm} onToggleColumn={toggleColumn} onShowFilterChange={setShowFilters}/>

                
                <button_1.Button onClick={() => setOpen(true)} className="w-full sm:w-auto lg:w-auto gap-1.5 sm:gap-2 ">
                  <lucide_react_1.Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4"/>
                  <span className="sm:hidden">Ajouter</span>
                  <span className="hidden sm:inline font-semibold font-poppins">
                    Ajouter un enseignant
                  </span>
                </button_1.Button>
              </div>
            </>)}
        </div>
        
        {showFilters && !selectedCount && (<div className="mt-3 animate-in slide-in-from-top-2 duration-200">
            <teacher_filters_1.TeacherFilters />
          </div>)}
        
        {open && <teacher_dialog_1.TeacherDialog open={open} setOpen={setOpen}/>}

        {showDeleteAlert && (<app_alert_dialog_1.AppAlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert} isLoading={isPending} title={` Supprimer ${selectedCount} enseignant ${selectedCount > 1 ? 's' : ''} ?`} description="Cette action est irréversible. Les données associées (cours, notes) seront également supprimées." onConfirm={handleBulkDelete} cancelLabel="Annuler" confirmLabel="Supprimer"/>)}
      </div>
    </div>);
}
//# sourceMappingURL=data-table-header.js.map