'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectFilter = SubjectFilter;
const label_1 = require("@/components/ui/label");
const combobox_1 = require("@/components/ui/combobox");
const react_1 = __importDefault(require("react"));
const ui_1 = require("@stackschool/ui");
const table_provider_1 = require("@/components/school/subject/table/table-provider");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
function SubjectFilter() {
    const { filters, setFilters } = (0, table_provider_1.useSubjectTable)();
    const { data } = (0, ui_1.useGetClassesAndTeachersQuery)({
        limit: 100,
    });
    const teachers = data?.getSchoolTeachers.data;
    const classes = data?.getSchoolClasses.data;
    const hasActiveFilters = Object.keys(filters).some((v) => v !== undefined);
    return (<div className="flex flex-wrap items-end gap-4 p-4 bg-accent rounded-lg border shadow-lg">
      
      <div className="flex flex-col gap-1.5">
        <label_1.Label className="text-xs font-medium">Professeur</label_1.Label>

        <combobox_1.Combobox items={teachers} onValueChange={(value) => {
            const id = teachers?.find((t) => t?.user?.profile?.lastname === value)?.id;
            if (id)
                setFilters({ ...filters, teacherId: id });
        }} itemToStringValue={(itemValue) => itemValue?.user?.profile?.lastname}>
          <combobox_1.ComboboxInput className="max-w-50" placeholder="Selectionner un professeur" showClear/>
          <combobox_1.ComboboxContent>
            <combobox_1.ComboboxEmpty>Aucun résultat trouvé.</combobox_1.ComboboxEmpty>
            <combobox_1.ComboboxList>
              {(item) => (<combobox_1.ComboboxItem className="text-xs font-poppins" key={item?.id} value={item?.user?.profile?.lastname}>
                  {item?.user?.profile?.lastname}{' '}
                  {item?.user?.profile?.firstname}
                </combobox_1.ComboboxItem>)}
            </combobox_1.ComboboxList>
          </combobox_1.ComboboxContent>
        </combobox_1.Combobox>
      </div>

      <div className="flex flex-col gap-1.5">
        <label_1.Label className="text-xs font-medium text-muted-foreground">
          Classe
        </label_1.Label>
        <combobox_1.Combobox items={classes} onValueChange={(value) => {
            const id = classes?.find((c) => c?.name === value)?.id;
            if (id)
                setFilters({ ...filters, classId: id });
        }} itemToStringValue={(itemValue) => itemValue?.name}>
          <combobox_1.ComboboxInput className="max-w-50" placeholder="Selectionner une classe" showClear/>
          <combobox_1.ComboboxContent>
            <combobox_1.ComboboxEmpty>Aucun résultat trouvé.</combobox_1.ComboboxEmpty>
            <combobox_1.ComboboxList>
              {(item) => (<combobox_1.ComboboxItem key={item?.id} value={item?.name}>
                  {item?.name}
                </combobox_1.ComboboxItem>)}
            </combobox_1.ComboboxList>
          </combobox_1.ComboboxContent>
        </combobox_1.Combobox>
      </div>

      {hasActiveFilters && (<button_1.Button variant="ghost" size="sm" onClick={() => setFilters({})} className="h-8 px-2 text-destructive hover:text-destructive/80 bg-destructive/10 hover:bg-destructive/20 cursor-pointer">
          <lucide_react_1.X className="h-4 w-4 mr-1 text-destructive"/>
          Effacer
        </button_1.Button>)}
    </div>);
}
//# sourceMappingURL=subject-filter.js.map