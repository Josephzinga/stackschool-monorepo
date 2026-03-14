import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClassFiltersState, useClassTable } from './table-provider';
import { useGetClassSubjectsQuery, useUserStore } from '@stackschool/ui';

export default function ClassTableFilter() {
  const { filters, setFilters } = useClassTable();
  const { currentSchool } = useUserStore();

  const { data } = useGetClassSubjectsQuery(
    {
      input: {
        schoolId: currentSchool?.id!,
      },
    },
    {
      enabled: !!currentSchool?.id,
    },
  );

  const classes = data?.getClassSubjects;

  const hasActiveFilters = Object.keys(filters).some((v) => v !== undefined);

  const uniqueLevel = [...new Set(classes?.map((item) => item?.level))];
  const uniqueSection = [...new Set(classes?.map((item) => item?.section))];

  const updateFilter = (
    key: keyof ClassFiltersState,
    val: string | boolean | undefined,
  ) => {
    setFilters((prev) => ({ ...prev, [key]: val === 'ALL' ? undefined : val }));
  };
  return (
    <div className="flex flex-wrap items-end gap-4 p-4 bg-accent rounded-lg border shadow-lg">
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium text-muted-foreground font-poppins">
          Niveau
        </Label>
        <Select
          value={filters.level || 'ALL'}
          onValueChange={(val) => updateFilter('level', val)}
        >
          <SelectTrigger className="font-jost w-45 h-8">
            <SelectValue placeholder="Touts les niveaux" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Toutes les niveaux</SelectItem>
            {uniqueLevel?.map((level) => (
              <SelectItem key={level} value={level!}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium text-muted-foreground font-poppins">
          Section
        </Label>
        <Select
          value={filters.section || 'ALL'}
          onValueChange={(val) => updateFilter('section', val)}
        >
          <SelectTrigger className="w-45 h-8 font-jost">
            <SelectValue placeholder="Toutes les matières" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Toutes les sections</SelectItem>
            {uniqueSection?.map((section, i) => (
              <SelectItem value={section!} key={section}>
                {section}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
