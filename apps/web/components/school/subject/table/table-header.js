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
exports.default = TableHeader;
const delete_selected_count_1 = require("@/components/school/delete-selected-count");
const data_filters_1 = __importDefault(require("@/components/school/data-filters"));
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const app_alert_dialog_1 = require("@/components/app-alert-dialog");
const table_provider_1 = require("@/components/school/subject/table/table-provider");
const React = __importStar(require("react"));
const react_1 = require("react");
const subject_filter_1 = require("@/components/school/subject/table/subject-filter");
const create_subject_dialog_1 = __importDefault(require("@/components/school/subject/table/create-subject-dialog"));
const SUBJECT_COLUMN = [
    { id: 'name', label: 'Matière' },
    { id: 'className', label: 'Classe' },
    { id: 'teacher', label: 'Professeur' },
    { id: 'coefficient', label: 'Coéff' },
    { id: 'weeklyHours', label: 'H/sem' },
];
function TableHeader() {
    const { searchTerm, setSearchTerm, setFilters, rowSelection, filters, columnVisibility, setColumnVisibility, } = (0, table_provider_1.useSubjectTable)();
    const [showFilters, setShowFilters] = (0, react_1.useState)(false);
    const [showDeleteAlert, setShowDeleteAlert] = (0, react_1.useState)(false);
    const [open, setOpen] = (0, react_1.useState)(false);
    const toggleColumn = (columnId, isVisible) => {
        setColumnVisibility((prev) => ({
            ...prev,
            [columnId]: isVisible,
        }));
    };
    const hasActiveFilters = Object.values(filters).some((v) => v !== undefined);
    const selectedCount = Object.keys(rowSelection).length;
    return (<div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col w-full">
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {0 > 0 ? (<delete_selected_count_1.DeleteSelectedCount selectedCount={0}/>) : (<>
              <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
                <data_filters_1.default hasActiveFilters={hasActiveFilters} inputPlaceholder="Rechercher une maitéres..." showFilters={showFilters} columns={SUBJECT_COLUMN} columnVisibility={columnVisibility} search={searchTerm} onSearchChange={setSearchTerm} onToggleColumn={toggleColumn} onShowFilterChange={setShowFilters}/>

                
                <button_1.Button onClick={() => setOpen(true)} className="w-full sm:w-auto lg:w-auto gap-1.5 sm:gap-2 h-10 bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary lg:ml-auto">
                  <lucide_react_1.Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4"/>
                  <span className="sm:hidden">Ajouter</span>
                  <span className="hidden sm:inline font-poppins font-semibold">
                    Ajouter une Matière
                  </span>
                </button_1.Button>
              </div>
            </>)}
        </div>
        
        {showFilters && !selectedCount && (<div className="mt-3 animate-in slide-in-from-top-2 duration-200">
            <subject_filter_1.SubjectFilter />
          </div>)}
        <create_subject_dialog_1.default open={open} onOpenChange={setOpen}/>
        <app_alert_dialog_1.AppAlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert} isLoading={false} title={` Supprimer ${selectedCount} enseignant ${selectedCount > 1 ? 's' : ''} ?`} description="Cette action est irréversible. Les données associées (cours, notes) seront également supprimées." onConfirm={() => console.log('confirm')} cancelLabel="Annuler" confirmLabel="Supprimer"/>
      </div>
    </div>);
}
//# sourceMappingURL=table-header.js.map