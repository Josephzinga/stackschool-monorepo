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
import { useQuery, useUserStore } from '@stackschool/ui';
import { useTable } from '@/components/table/teacher/table-provider';
import { api } from '@stackschool/shared';

interface TeacherFiltersProps {
  filters: {
    classId?: string;
    specialization?: string;
    isActive?: boolean;
    isSupervisor?: boolean;
  };
  onChange: (filters: any) => void;
}

export function TeacherFilters() {
  const { currentSchool } = useUserStore();
  const { filters, setFilters } = useTable();

  const { data } = useQuery({
    queryKey: ['classes', currentSchool?.id],
    queryFn: async () => {
      const res = await api.get(
        `/api/schools/${currentSchool?.id}/classes?pageIndex=${0}&limit=${100}`,
      );
      if (res.data.ok) return res.data.classes;
    },
    enabled: !!currentSchool?.id,
  });

  // Liste des spécialités (Idéalement chargée depuis le backend ou une constante partagée)
  const specializations = [
    'Mathématiques',
    'Français',
    'Anglais',
    'Histoire-Géo',
    'Physique-Chimie',
    'SVT',
    'Philosophie',
    'EPS',
    'Informatique',
  ];

  const updateFilter = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value === 'ALL' ? undefined : value });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined);

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 bg-accent rounded-lg border shadow-lg mb-4">
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

            {data?.map((cls: { id: string; name: string }) => (
              <SelectItem key={cls.id} value={cls.id}>
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
          value={filters.specialization || 'ALL'}
          onValueChange={(val) => updateFilter('specialization', val)}
        >
          <SelectTrigger className="w-45 h-8 bg-white">
            <SelectValue placeholder="Toutes les matières" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Toutes les matières</SelectItem>
            {specializations.map((spec) => (
              <SelectItem key={spec} value={spec}>
                {spec}
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
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Effacer
        </Button>
      )}
    </div>
  );
}
