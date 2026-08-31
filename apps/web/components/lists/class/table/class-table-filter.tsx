import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClassFiltersState, useClassTable } from './table-provider';
import { useGetClassesOptionsQuery, useUserStore } from '@stackschool/ui';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { TableFilterContainer } from '../../table-filter-container';

export default function ClassTableFilter() {
  const { filters, setFilters } = useClassTable();
  const { currentSchool } = useUserStore();

  const { data } = useGetClassesOptionsQuery(
    {
      input: {
        limit: 100,
      },
    },
    {
      enabled: !!currentSchool?.id,
    },
  );

  const classes = data?.getSchoolClasses.data;

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
    <TableFilterContainer>
      <div className="flex items-center gap-2 md:gap-4 py-2 px-4 ">
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
              {uniqueLevel?.map((level) => {
                if (!level) return;
                return (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                );
              })}
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
              {uniqueSection?.map((section, i) => {
                if (!section) return;
                return (
                  <SelectItem value={section!} key={section}>
                    {section}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters({})}
            className="h-8 px-2 text-muted-foreground hover:text-foreground bg-destructive/30 hover:bg-destructive/50! cursor-pointer transition-colors duration-200"
          >
            <X className="h-4 w-4 mr-1" />
            Effacer
          </Button>
        )}
      </div>
    </TableFilterContainer>
  );
}
