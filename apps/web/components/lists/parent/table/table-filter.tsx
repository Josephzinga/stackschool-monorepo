import { TableFilterContainer } from '@/components/lists/table-filter-container';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
  ParentFiltersState,
  useParentTable,
} from '@/components/lists/parent/table/table-provider';
import { Label } from '@/components/ui/label';
import { useGetStudentOptionsQuery } from '@stackschool/ui';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const TableFilter = () => {
  const { filters, setFilters, clearFilters } = useParentTable();
  const hasActiveFilters = Object.values(filters).some((key) => !!key);

  const updateFilter = (key: keyof ParentFiltersState, val: string) => {
    setFilters({ [key]: val });
  };

  const { data, isPending } = useGetStudentOptionsQuery({
    input: {
      limit: 10,
    },
  });

  const students = data?.getSchoolStudents.data ?? [];
  return (
    <TableFilterContainer>
      <div className="flex flex-wrap items-end gap-2 lg:gap-4 py-2 px-4">
        <div className="flex flex-col gap-1.5">
          <Label>Élève</Label>
          <Combobox
            items={students}
            onValueChange={(value) =>
              !!value && updateFilter('studentId', value?.id)
            }
            itemToStringLabel={(itemValue: (typeof students)[number]) =>
              `${itemValue?.schoolProfile?.firstName} ${itemValue?.schoolProfile?.lastName}`
            }
          >
            <ComboboxInput
              placeholder="Rechercher un élève"
              className="rounded-xl h-8"
            />
            <ComboboxContent>
              <ComboboxEmpty>Aucun élève trouvé.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem
                    key={item.id}
                    value={item}
                    className="flex gap-2"
                  >
                    <Avatar>
                      <AvatarImage src={item?.avatarUrl ?? undefined} />
                      <AvatarFallback>
                        {item?.schoolProfile?.firstName?.[0]}
                        {item?.schoolProfile?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {item?.schoolProfile?.firstName}{' '}
                      {item?.schoolProfile?.lastName}
                    </span>
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
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
};
