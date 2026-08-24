'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
  Subject,
  useGetClassesOptionsQuery,
  useGetSubjectsOptionsQuery,
} from '@stackschool/ui';
import {
  TeacherFiltersState,
  useTable,
} from '@/components/school/teacher/table/table-provider';

export function TeacherFilters() {
  const { filters, setFilters } = useTable();

  const { data: subjectsData } = useGetSubjectsOptionsQuery({
    input: {
      limit: 100,
    },
  });

  const { data: classesData } = useGetClassesOptionsQuery({
    input: {
      limit: 100,
    },
  });
  const classes = classesData?.getSchoolClasses.data;
  const seenSubjects = new Map<string, Subject>();

  const subjects = subjectsData?.getSchoolSubjects?.data;

  const updateFilter = (key: keyof TeacherFiltersState, value: any) => {
    setFilters({ ...filters, [key]: value === 'ALL' ? undefined : value });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined);

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 bg-secondary rounded-lg border shadow-lg">
      {/* Filtre Classe */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium">Classe</Label>

        <Select
          value={filters.classId || 'ALL'}
          onValueChange={(val) => updateFilter('classId', val)}
        >
          <SelectTrigger className="w-[180px] h-8 bg-white">
            <SelectValue placeholder="Toutes les classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Toutes les classes</SelectItem>

            {classes?.map((cls) => (
              <SelectItem key={cls.id} value={cls.id!}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtre Spécialité */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          Matière
        </Label>
        <Select
          value={filters.subjectId || 'ALL'}
          onValueChange={(val) => updateFilter('subjectId', val)}
        >
          <SelectTrigger className="w-45 h-8 bg-white">
            <SelectValue placeholder="Toutes les matières" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Toutes les matières</SelectItem>
            {subjects?.map((sub) => (
              <SelectItem key={sub?.id} value={sub?.id!}>
                {sub?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtre Statut */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          Statut
        </Label>
        <Select
          value={
            filters.isActive === undefined ? 'ALL' : String(filters.isActive)
          }
          onValueChange={(val) =>
            updateFilter('isActive', val === 'ALL' ? undefined : val === 'true')
          }
        >
          <SelectTrigger className="w-[140px] h-8 bg-white">
            <SelectValue placeholder="Tous" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous</SelectItem>
            <SelectItem value="true">Actif</SelectItem>
            <SelectItem value="false">Inactif</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filtre Titulaire */}
      <div className="flex items-center gap-2 pb-1.5 h-8">
        <Switch
          id="supervisor-mode"
          checked={filters.isSupervisor || false}
          onCheckedChange={(val) =>
            updateFilter('isSupervisor', val || undefined)
          }
        />
        <Label htmlFor="supervisor-mode" className="cursor-pointer">
          Prof. Principal
        </Label>
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-8 px-2 text-muted-foreground hover:text-foreground bg-destructive/30 hover:bg-destructive/50! cursor-pointer transition-colors duration-200"
        >
          <X className="h-4 w-4 mr-1" />
          Effacer
        </Button>
      )}
    </div>
  );
}
