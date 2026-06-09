'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherFilters = TeacherFilters;
const select_1 = require("@/components/ui/select");
const label_1 = require("@/components/ui/label");
const switch_1 = require("@/components/ui/switch");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const ui_1 = require("@stackschool/ui");
const table_provider_1 = require("@/components/school/teacher/table/table-provider");
function TeacherFilters() {
    const { filters, setFilters } = (0, table_provider_1.useTable)();
    const { data: subjectsData } = (0, ui_1.useGetSubjectsOptionsQuery)({
        input: {
            limit: 100,
        },
    });
    const { data: classesData } = (0, ui_1.useGetClassesOptionsQuery)({
        input: {
            limit: 100,
        },
    });
    const classes = classesData?.getSchoolClasses.data;
    const seenSubjects = new Map();
    const subjects = subjectsData?.getSchoolSubjects?.data;
    const updateFilter = (key, value) => {
        setFilters({ ...filters, [key]: value === 'ALL' ? undefined : value });
    };
    const clearFilters = () => {
        setFilters({});
    };
    const hasActiveFilters = Object.values(filters).some((v) => v !== undefined);
    return (<div className="flex flex-wrap items-end gap-4 p-4 bg-accent rounded-lg border shadow-lg">
      
      <div className="flex flex-col gap-1.5">
        <label_1.Label className="text-xs font-medium">Classe</label_1.Label>

        <select_1.Select value={filters.classId || 'ALL'} onValueChange={(val) => updateFilter('classId', val)}>
          <select_1.SelectTrigger className="w-[180px] h-8 bg-white">
            <select_1.SelectValue placeholder="Toutes les classes"/>
          </select_1.SelectTrigger>
          <select_1.SelectContent>
            <select_1.SelectItem value="ALL">Toutes les classes</select_1.SelectItem>

            {classes?.map((cls) => (<select_1.SelectItem key={cls.id} value={cls.id}>
                {cls.name}
              </select_1.SelectItem>))}
          </select_1.SelectContent>
        </select_1.Select>
      </div>

      
      <div className="flex flex-col gap-1.5">
        <label_1.Label className="text-xs font-medium text-muted-foreground">
          Matière
        </label_1.Label>
        <select_1.Select value={filters.subjectId || 'ALL'} onValueChange={(val) => updateFilter('subjectId', val)}>
          <select_1.SelectTrigger className="w-45 h-8 bg-white">
            <select_1.SelectValue placeholder="Toutes les matières"/>
          </select_1.SelectTrigger>
          <select_1.SelectContent>
            <select_1.SelectItem value="ALL">Toutes les matières</select_1.SelectItem>
            {subjects?.map((sub) => (<select_1.SelectItem key={sub?.id} value={sub?.id}>
                {sub?.name}
              </select_1.SelectItem>))}
          </select_1.SelectContent>
        </select_1.Select>
      </div>

      
      <div className="flex flex-col gap-1.5">
        <label_1.Label className="text-xs font-medium text-muted-foreground">
          Statut
        </label_1.Label>
        <select_1.Select value={filters.isActive === undefined ? 'ALL' : String(filters.isActive)} onValueChange={(val) => updateFilter('isActive', val === 'ALL' ? undefined : val === 'true')}>
          <select_1.SelectTrigger className="w-[140px] h-8 bg-white">
            <select_1.SelectValue placeholder="Tous"/>
          </select_1.SelectTrigger>
          <select_1.SelectContent>
            <select_1.SelectItem value="ALL">Tous</select_1.SelectItem>
            <select_1.SelectItem value="true">Actif</select_1.SelectItem>
            <select_1.SelectItem value="false">Inactif</select_1.SelectItem>
          </select_1.SelectContent>
        </select_1.Select>
      </div>

      
      <div className="flex items-center gap-2 pb-1.5 h-8">
        <switch_1.Switch id="supervisor-mode" checked={filters.isSupervisor || false} onCheckedChange={(val) => updateFilter('isSupervisor', val || undefined)}/>
        <label_1.Label htmlFor="supervisor-mode" className="cursor-pointer">
          Prof. Principal
        </label_1.Label>
      </div>

      
      {hasActiveFilters && (<button_1.Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-muted-foreground hover:text-foreground bg-destructive/30 hover:bg-destructive/50! cursor-pointer transition-colors duration-200">
          <lucide_react_1.X className="h-4 w-4 mr-1"/>
          Effacer
        </button_1.Button>)}
    </div>);
}
//# sourceMappingURL=teacher-filters.js.map