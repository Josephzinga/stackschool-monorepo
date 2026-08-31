'use client';
import { useGetClassesOptionsQuery, useUserStore } from '@stackschool/ui';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
  StudentFilterState,
  useStudentTable,
} from '@/components/lists/student/table/table-provider';
import { TableFilterContainer } from '../../table-filter-container';

export default function StudentFilter() {
  const { filters, setFilters, clearFilters } = useStudentTable();
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

  const hasActiveFilters = Object.keys(filters).some((v) => !v);

  const uniqueLevel = [...new Set(classes?.map((item) => item?.level))];
  const uniqueSection = [...new Set(classes?.map((item) => item?.section))];

  const updateFilter = (
    key: keyof StudentFilterState,
    val: string | boolean,
  ) => {
    setFilters({ [key]: val });
  };
  return (
    <TableFilterContainer>
      <div className="flex flex-wrap items-end gap-2 lg:gap-4 py-2 px-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium text-muted-foreground font-poppins">
            Niveau
          </Label>
          <Select
            value={filters.level || 'ALL'}
            onValueChange={(val) => updateFilter('level', val!)}
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
            onValueChange={(val) => updateFilter('section', val!)}
          >
            <SelectTrigger className="w-45 h-8 font-jost">
              <SelectValue placeholder="Toutes les matières" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Toutes les sections</SelectItem>
              {uniqueSection.length !== 0 &&
                uniqueSection.map((section, i) => {
                  if (!section) return;
                  return (
                    <SelectItem value={section} key={section}>
                      {section}
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium">Classe</Label>

          <Select
            value={filters.classId || 'ALL'}
            onValueChange={(val) => updateFilter('classId', val!)}
          >
            <SelectTrigger className="w-45 h-8 font-jost">
              <SelectValue placeholder="Toutes les classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Toutes les classes</SelectItem>

              {classes?.map((cls) => (
                <SelectItem key={cls?.id} value={cls?.id!}>
                  {cls?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtre Statut */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium text-muted-foreground font-poppins">
            Statut
          </Label>
          <Select
            value={
              filters.isActive === undefined ? 'ALL' : String(filters.isActive)
            }
            onValueChange={(val) =>
              updateFilter('isActive', val === 'ALL' ? false : val)
            }
          >
            <SelectTrigger className="w-35 h-8 font-jost">
              <SelectValue placeholder="Tous" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tous</SelectItem>
              <SelectItem value="true">Actif</SelectItem>
              <SelectItem value="false">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Reset */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearFilters()}
            className="h-8 px-2 text-destructive hover:text-destructive/80 bg-destructive/10 hover:bg-destructive/20 cursor-pointer"
          >
            <X className="h-4 w-4 mr-1 text-destructive" />
            Effacer
          </Button>
        )}
      </div>
    </TableFilterContainer>
  );
}
