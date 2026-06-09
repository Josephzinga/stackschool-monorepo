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
exports.default = DataTableHeader;
const button_1 = require("@/components/animate-ui/components/buttons/button");
const lucide_react_1 = require("lucide-react");
const table_provider_1 = require("./table-provider");
const delete_selected_count_1 = require("@/components/school/delete-selected-count");
const data_filters_1 = __importDefault(require("@/components/school/data-filters"));
const app_alert_dialog_1 = require("@/components/app-alert-dialog");
const React = __importStar(require("react"));
const react_1 = require("react");
const react_query_1 = require("@tanstack/react-query");
const class_table_filter_1 = __importDefault(require("./class-table-filter"));
const class_dialog_1 = __importDefault(require("@/components/school/class/table/class-dialog"));
const CLASSES_COLUMN = [
    {
        id: 'name',
        label: 'Classe',
    },
    {
        id: 'level',
        label: 'Niveau',
    },
    {
        id: 'section',
        label: 'Section',
    },
    {
        id: 'supervisor',
        label: 'Prof. Principal',
    },
    {
        id: 'students',
        label: 'Élèves',
    },
    {
        id: 'subjects',
        label: 'Matières',
    },
    {
        id: 'teachers',
        label: 'Professeurs',
    },
];
function DataTableHeader() {
    const { searchTerm, setSearchTerm, setColumnVisibility, columnVisibility, filters, setRowSelection, rowSelection, } = (0, table_provider_1.useClassTable)();
    const [showDeleteAlert, setShowDeleteAlert] = (0, react_1.useState)(false);
    const [open, setOpen] = (0, react_1.useState)(false);
    const [showFilters, setShowFilters] = (0, react_1.useState)(false);
    const hasActiveFilters = Object.keys(filters).some((v) => v !== undefined);
    const selectedCount = Object.values(rowSelection).length;
    const queryClient = (0, react_query_1.useQueryClient)();
    const isPending = false;
    const toggleColumns = (columnId, isVisible) => {
        setColumnVisibility((prev) => ({
            ...prev,
            [columnId]: isVisible,
        }));
    };
    function handleDelete() { }
    return (<div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col w-full">
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {selectedCount > 0 ? (<delete_selected_count_1.DeleteSelectedCount selectedCount={selectedCount} onDelete={() => setShowDeleteAlert(true)} onClose={() => setRowSelection({})}/>) : (<>
              <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
                <data_filters_1.default inputPlaceholder="Rechercher un élève..." onShowFilterChange={setShowFilters} hasActiveFilters={hasActiveFilters} search={searchTerm} showFilters={showFilters} onSearchChange={setSearchTerm} onToggleColumn={toggleColumns} columns={CLASSES_COLUMN} columnVisibility={columnVisibility}/>

                
                <button_1.Button hoverScale={0.95} tapScale={0.9} onClick={() => setOpen(true)} className="w-full cursor-pointer sm:w-auto lg:w-auto gap-1.5 sm:gap-2 h-10 bg-linear-to-tr from-primary to-primary/50 hover:from-primary/90 hover:to-primary lg:ml-auto">
                  <lucide_react_1.Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4"/>
                  <span className="sm:hidden">Ajouter</span>
                  <span className="hidden sm:inline font-medium">
                    Ajouter une Classe
                  </span>
                </button_1.Button>
              </div>
              <class_dialog_1.default open={open} onOpenChange={setOpen}/>
            </>)}
        </div>

        
        {showFilters && !selectedCount && (<div className="mt-3 animate-in slide-in-from-top-2 duration-200">
            <class_table_filter_1.default />
          </div>)}

        <app_alert_dialog_1.AppAlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert} title={`Supprimer ${selectedCount} élève(s) ?`} description="Cette action archivera les élèves sélectionnés. Ils ne pourront plus accéder à la plateforme." onConfirm={handleDelete} isLoading={isPending} confirmLabel="Supprimer" variant="destructive"/>
      </div>
    </div>);
}
//# sourceMappingURL=data-table-header.js.map