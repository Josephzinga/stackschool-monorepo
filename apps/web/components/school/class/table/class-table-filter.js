"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClassTableFilter;
const label_1 = require("@/components/ui/label");
const select_1 = require("@/components/ui/select");
const table_provider_1 = require("./table-provider");
const ui_1 = require("@stackschool/ui");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
function ClassTableFilter() {
    const { filters, setFilters } = (0, table_provider_1.useClassTable)();
    const { currentSchool } = (0, ui_1.useUserStore)();
    const { data } = (0, ui_1.useGetClassesOptionsQuery)({
        input: {
            limit: 100,
        },
    }, {
        enabled: !!currentSchool?.id,
    });
    const classes = data?.getSchoolClasses.data;
    const hasActiveFilters = Object.keys(filters).some((v) => v !== undefined);
    const uniqueLevel = [...new Set(classes?.map((item) => item?.level))];
    const uniqueSection = [...new Set(classes?.map((item) => item?.section))];
    const updateFilter = (key, val) => {
        setFilters((prev) => ({ ...prev, [key]: val === 'ALL' ? undefined : val }));
    };
    return (<div className="flex flex-wrap items-end gap-4 p-4 bg-accent rounded-lg border shadow-lg">
      <div className="flex flex-col gap-1.5">
        <label_1.Label className="text-xs font-medium text-muted-foreground font-poppins">
          Niveau
        </label_1.Label>
        <select_1.Select value={filters.level || 'ALL'} onValueChange={(val) => updateFilter('level', val)}>
          <select_1.SelectTrigger className="font-jost w-45 h-8">
            <select_1.SelectValue placeholder="Touts les niveaux"/>
          </select_1.SelectTrigger>
          <select_1.SelectContent>
            <select_1.SelectItem value="ALL">Toutes les niveaux</select_1.SelectItem>
            {uniqueLevel?.map((level) => {
            if (!level)
                return;
            return (<select_1.SelectItem key={level} value={level}>
                  {level}
                </select_1.SelectItem>);
        })}
          </select_1.SelectContent>
        </select_1.Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label_1.Label className="text-xs font-medium text-muted-foreground font-poppins">
          Section
        </label_1.Label>
        <select_1.Select value={filters.section || 'ALL'} onValueChange={(val) => updateFilter('section', val)}>
          <select_1.SelectTrigger className="w-45 h-8 font-jost">
            <select_1.SelectValue placeholder="Toutes les matières"/>
          </select_1.SelectTrigger>
          <select_1.SelectContent>
            <select_1.SelectItem value="ALL">Toutes les sections</select_1.SelectItem>
            {uniqueSection?.map((section, i) => {
            if (!section)
                return;
            return (<select_1.SelectItem value={section} key={section}>
                  {section}
                </select_1.SelectItem>);
        })}
          </select_1.SelectContent>
        </select_1.Select>
      </div>

      {hasActiveFilters && (<button_1.Button variant="ghost" size="sm" onClick={() => setFilters({})} className="h-8 px-2 text-muted-foreground hover:text-foreground bg-destructive/30 hover:bg-destructive/50! cursor-pointer transition-colors duration-200">
          <lucide_react_1.X className="h-4 w-4 mr-1"/>
          Effacer
        </button_1.Button>)}
    </div>);
}
//# sourceMappingURL=class-table-filter.js.map