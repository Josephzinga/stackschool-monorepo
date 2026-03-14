'use client';
import { Label } from '@/components/ui/label';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import React from 'react';
import { useGetNavigationDataQuery } from '@stackschool/ui';
import { useSubjectTable } from '@/components/school/subject/table/table-provider';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function SubjectFilter() {
  const { filters, setFilters } = useSubjectTable();
  const { data } = useGetNavigationDataQuery();

  const teachers = data?.getClassTeacher?.teacher;
  const classes = data?.getClassTeacher?.class;

  const hasActiveFilters = Object.keys(filters).some((v) => v !== undefined);

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 bg-accent rounded-lg border shadow-lg">
      {/* Filtre Classe */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium">Professeur</Label>

        <Combobox
          items={teachers!}
          onValueChange={(value) => {
            const id = teachers?.find(
              (t) => t?.user?.profile?.lastname === value,
            )?.id;
            if (id) setFilters({ ...filters, teacherId: id });
          }}
          itemToStringValue={(itemValue: any) =>
            itemValue?.user?.profile?.lastname
          }
        >
          <ComboboxInput
            className="max-w-50"
            placeholder="Selectionner un professeur"
            showClear
          />
          <ComboboxContent>
            <ComboboxEmpty>Aucun résultat trouvé.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem
                  className="text-xs font-poppins"
                  key={item?.id}
                  value={item?.user?.profile?.lastname}
                >
                  {item?.user?.profile?.lastname}{' '}
                  {item?.user?.profile?.firstname}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          Classe
        </Label>
        <Combobox
          items={classes!}
          onValueChange={(value) => {
            const id = classes?.find((c) => c?.name === value)?.id;
            if (id) setFilters({ ...filters, classId: id });
          }}
          itemToStringValue={(itemValue: any) => itemValue?.name}
        >
          <ComboboxInput
            className="max-w-50"
            placeholder="Selectionner une classe"
            showClear
          />
          <ComboboxContent>
            <ComboboxEmpty>Aucun résultat trouvé.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item?.id} value={item?.name}>
                  {item?.name}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFilters({})}
          className="h-8 px-2 text-destructive hover:text-destructive/80 bg-destructive/10 hover:bg-destructive/20 cursor-pointer"
        >
          <X className="h-4 w-4 mr-1 text-destructive" />
          Effacer
        </Button>
      )}
    </div>
  );
}
