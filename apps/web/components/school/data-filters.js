"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DataHeaderInput;
const react_1 = __importDefault(require("react"));
const input_1 = require("@/components/ui/input");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
function DataHeaderInput({ search, onSearchChange, inputPlaceholder, onToggleColumn, columnVisibility, columns, showFilters, hasActiveFilters, onShowFilterChange, }) {
    return (<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 lg:flex-initial">
      <div className="relative flex-1 max-w-100 lg:w-96">
        <input_1.Input placeholder={inputPlaceholder} value={search} onChange={(event) => onSearchChange?.(event.target.value)} className="pr-8 w-full"/>
        {search && (<button_1.Button variant="ghost" size="icon" onClick={() => onSearchChange?.('')} className="absolute h-7 w-7 top-1/2 -translate-y-1/2 right-2 text-muted-foreground hover:text-foreground">
            <lucide_react_1.X className="h-3.5 w-3.5"/>
          </button_1.Button>)}
      </div>

      <div className="flex items-center gap-2">
        
        <button_1.Button variant={showFilters || hasActiveFilters ? 'secondary' : 'outline'} onClick={() => onShowFilterChange?.(!showFilters)} className="gap-1.5 sm:gap-2 flex-1 h-10 sm:flex-initial">
          <lucide_react_1.Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4"/>
          <span className="sm:hidden">Filtres</span>
          <span className="hidden sm:inline">Filtres</span>
          {hasActiveFilters && (<span className="ml-0.5 sm:ml-1 rounded-full bg-primary w-1.5 h-1.5 sm:w-2 sm:h-2"/>)}
        </button_1.Button>

        
        <dropdown_menu_1.DropdownMenu>
          <dropdown_menu_1.DropdownMenuTrigger asChild>
            <button_1.Button variant="outline" className="gap-1.5 sm:gap-2 h-10 flex-1 sm:flex-initial">
              <lucide_react_1.Settings2 className="h-3.5 w-3.5 sm:h-4 sm:w-4"/>
              <span className="sm:hidden">Colonnes</span>
              <span className="hidden sm:inline">Affichage</span>
            </button_1.Button>
          </dropdown_menu_1.DropdownMenuTrigger>
          <dropdown_menu_1.DropdownMenuContent align="start" className="w-48 sm:w-56">
            <dropdown_menu_1.DropdownMenuLabel className="text-xs sm:text-sm">
              Colonnes visibles
            </dropdown_menu_1.DropdownMenuLabel>
            <dropdown_menu_1.DropdownMenuSeparator />
            <div className="max-h-64 overflow-y-auto">
              {columns?.map((col) => (<dropdown_menu_1.DropdownMenuCheckboxItem key={col.id} checked={columnVisibility?.[col.id] !== false} onCheckedChange={(checked) => onToggleColumn?.(col.id, checked)} className="text-xs sm:text-sm">
                  {col.label}
                </dropdown_menu_1.DropdownMenuCheckboxItem>))}
            </div>
          </dropdown_menu_1.DropdownMenuContent>
        </dropdown_menu_1.DropdownMenu>
      </div>
    </div>);
}
//# sourceMappingURL=data-filters.js.map