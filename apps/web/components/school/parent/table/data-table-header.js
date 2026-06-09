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
exports.DataTableHeader = DataTableHeader;
const input_1 = require("@/components/ui/input");
const table_provider_1 = require("./table-provider");
const button_1 = require("@/components/ui/button");
const button_2 = require("@/components/animate-ui/components/buttons/button");
const lucide_react_1 = require("lucide-react");
const React = __importStar(require("react"));
const react_1 = require("react");
const ui_1 = require("@stackschool/ui");
const sonner_1 = require("sonner");
const app_alert_dialog_1 = require("@/components/app-alert-dialog");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const nuqs_1 = require("nuqs");
const parent_dialog_1 = require("@/components/school/parent/parent-dialog");
const PARENT_COLUMNS = [
    { id: 'info', label: 'Parents' },
    { id: 'phoneNumber', label: 'Téléphone' },
    { id: 'profession', label: 'Profession' },
    { id: 'address', label: 'Adresse' },
    { id: 'students', label: 'Enfants' },
];
function DataTableHeader() {
    const [searchTerm, setSearchTerm] = (0, nuqs_1.useQueryState)('search', nuqs_1.parseAsString.withDefault(''));
    const { filters, setFilters, rowSelection, setRowSelection, columnVisibility, setColumnVisibility, } = (0, table_provider_1.useTable)();
    const [showFilters, setShowFilters] = (0, react_1.useState)(false);
    const [showDeleteAlert, setShowDeleteAlert] = (0, react_1.useState)(false);
    const [dialogOpen, setDialogOpen] = (0, react_1.useState)(false);
    const { currentSchool } = (0, ui_1.useUserStore)();
    const hasActiveFilters = Object.values(filters).some((v) => v !== undefined);
    const selectedCount = Object.keys(rowSelection).length;
    const handleBulkDelete = async () => {
        if (!currentSchool?.id)
            return;
        sonner_1.toast.info('La suppression en masse des parents sera bientôt disponible');
        setRowSelection({});
        setShowDeleteAlert(false);
    };
    const toggleColumn = (columnId, isVisible) => {
        setColumnVisibility((prev) => ({
            ...prev,
            [columnId]: isVisible,
        }));
    };
    return (<div className="flex flex-col gap-4 sm:gap-4">
      <div className="flex justify-between w-full ">
        <div className="flex justify-between h-10 gap-2 sm:gap-4">
          {selectedCount > 0 ? (<div className="flex items-center gap-2 bg-red-50 text-red-900 px-3 py-2 rounded-md border border-red-100">
              <span className="text-sm font-medium">
                {selectedCount} sélectionné(s)
              </span>
              <button_1.Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-900 hover:bg-red-100" onClick={() => setRowSelection({})}>
                <lucide_react_1.X className="h-4 w-4"/>
              </button_1.Button>
              <div className="h-4 w-px bg-red-200 mx-1"/>
              <button_1.Button variant="ghost" size="sm" className="h-6 px-2 text-red-700 hover:bg-red-100 hover:text-red-900 text-xs font-medium" onClick={() => setShowDeleteAlert(true)}>
                <lucide_react_1.Trash2 className="h-3 w-3 mr-1"/>
                Supprimer
              </button_1.Button>
            </div>) : (<>
              <div className="relative h-full w-60 sm:w-72">
                <input_1.Input placeholder="Rechercher un parent..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className=" pr-8"/>
                {searchTerm && (<button_1.Button variant="ghost" size="icon" onClick={() => setSearchTerm('')} className="absolute h-8 w-8 top-1/2 -translate-y-1/2 right-1 text-muted-foreground hover:text-foreground">
                    <lucide_react_1.X className="h-4 w-4"/>
                  </button_1.Button>)}
              </div>
              <button_1.Button variant={showFilters || hasActiveFilters ? 'secondary' : 'outline'} onClick={() => setShowFilters(!showFilters)} className="gap-2 h-full">
                <lucide_react_1.Filter className="h-4 w-4"/>
                <span className="hidden sm:block">Filtres</span>
                {hasActiveFilters && (<span className="ml-1 rounded-full bg-primary w-2 h-2"/>)}
              </button_1.Button>

              <dropdown_menu_1.DropdownMenu>
                <dropdown_menu_1.DropdownMenuTrigger asChild>
                  <button_1.Button variant="outline" className="gap-2 h-full">
                    <lucide_react_1.Settings2 className="h-4 w-4"/>
                    <span className="hidden sm:block">Affichage</span>
                  </button_1.Button>
                </dropdown_menu_1.DropdownMenuTrigger>
                <dropdown_menu_1.DropdownMenuContent align="start" className="w-48">
                  <dropdown_menu_1.DropdownMenuLabel>Colonnes visibles</dropdown_menu_1.DropdownMenuLabel>
                  <dropdown_menu_1.DropdownMenuSeparator />
                  {PARENT_COLUMNS.map((col) => (<dropdown_menu_1.DropdownMenuCheckboxItem key={col.id} checked={columnVisibility[col.id] !== false} onCheckedChange={(checked) => toggleColumn(col.id, checked)}>
                      {col.label}
                    </dropdown_menu_1.DropdownMenuCheckboxItem>))}
                </dropdown_menu_1.DropdownMenuContent>
              </dropdown_menu_1.DropdownMenu>
            </>)}
        </div>
        <button_2.Button onClick={() => setDialogOpen(true)} className="gap-3 w-14 sm:w-30 h-full md:w-60 cursor-pointer">
          <lucide_react_1.Plus className="h-8 w-8"/>
          <span className="hidden sm:block font-poppins font-semibold">
            Ajouter
          </span>
        </button_2.Button>
      </div>

      {showFilters && !selectedCount && (<div className="p-4 bg-slate-50 rounded-lg border">
          
          <p className="text-sm text-muted-foreground">
            Filtres avancés des parents bientôt disponibles
          </p>
        </div>)}

      {showDeleteAlert && (<app_alert_dialog_1.AppAlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert} title={`Supprimer ${selectedCount} parent(s) ?`} description="Cette action est irréversible. Les liens avec les élèves seront également supprimés." onConfirm={handleBulkDelete} confirmLabel="Supprimer" variant="destructive"/>)}
      {dialogOpen && (<parent_dialog_1.ParentDialog open={dialogOpen} onOpenChange={setDialogOpen}/>)}
    </div>);
}
//# sourceMappingURL=data-table-header.js.map