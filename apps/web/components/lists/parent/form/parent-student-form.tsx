import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import {
  CreateParentSchema,
  ParentStudentSchema,
  RelationTypeEnum,
  relationTypeOptions,
  UpdateParentSchema,
} from '@stackschool/contracts';
import { SearchStudentQuery, useSearchStudentQuery } from '@stackschool/ui';
import { useMemo, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { AppAlertDialog } from '@/components/app-alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus, X } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';

export type SearchStudent = NonNullable<
  NonNullable<SearchStudentQuery['searchStudent']>[number]
>;

export interface ParentStudentFormProps {
  mode?: 'PARENT' | 'STUDENT';
}

export interface ParentStudentFormSchema {
  children: ParentStudentSchema[];
}

interface PendingRemoval {
  index: number;
  studentId?: string;
  studentName: string;
}

export function ParentStudentForm({ mode = 'PARENT' }: ParentStudentFormProps) {
  const isStudentMode = mode === 'STUDENT';

  const { control } = useFormContext<UpdateParentSchema>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'children',
    keyName: '_key',
  });
  const [searchTerm, setSearchTerm] = useQueryState(
    'searchStudent',
    parseAsString.withDefault(''),
  );
  const [open, setOpen] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState<PendingRemoval | null>(
    null,
  );
  const [selectedStudents, setSelectedStudents] = useState<SearchStudent[]>([]);
  const debouncedSearch = useDebounce(searchTerm, 400) ?? '';
  const { data, isPending, isFetching } = useSearchStudentQuery(
    {
      input: {
        searchTerm: (debouncedSearch ?? '').trim(),
        limit: 10,
      },
    },
    { enabled: debouncedSearch?.length > 1 },
  );
  const filteredStudents = useMemo(
    () =>
      data?.searchStudent?.reduce<SearchStudent[]>((students, student) => {
        if (
          student &&
          !fields.some((field) => field.studentId === student.id)
        ) {
          students.push(student);
        }
        return students;
      }, []),
    [data?.searchStudent, fields],
  );
  const isSearching = isPending || isFetching;
  const hasSearchTerm = (debouncedSearch ?? '').trim().length > 0;
  const subject = mode === 'PARENT' ? 'élève' : 'parent';

  const handleItemClick = (student: SearchStudent) => {
    append({
      studentId: student.id,
      relationType:
        RelationTypeEnum.FATHER as CreateParentSchema['children'][number]['relationType'],
    });
    setSelectedStudents((current) => [...current, student]);
    setSearchTerm('');
    setOpen(false);
  };

  const handleRemoveStudent = (index: number) => {
    const studentId = fields[index]?.studentId;
    remove(index);
    setSelectedStudents((current) =>
      current.filter((student) => student.id !== studentId),
    );
  };

  const requestRemoveStudent = (index: number) => {
    const field = fields[index];
    if (!field?.parentId) {
      handleRemoveStudent(index);
      return;
    }

    const student = selectedStudents.find(
      (item) => item.id === field.studentId,
    );
    const studentName =
      [
        student?.schoolProfile?.firstName || field.firstName,
        student?.schoolProfile?.lastName || field.lastName,
      ]
        .filter(Boolean)
        .join(' ') || 'cet élève';

    setPendingRemoval({
      index,
      studentId: field.studentId,
      studentName,
    });
  };

  const confirmRemoveStudent = () => {
    if (!pendingRemoval) return;

    const currentIndex = fields.findIndex(
      (field) => field.studentId === pendingRemoval.studentId,
    );
    if (currentIndex >= 0) {
      handleRemoveStudent(currentIndex);
    }
    setPendingRemoval(null);
  };

  return (
    <div className="flex flex-col gap-2">
      {fields.length > 0 && (
        <div className="flex flex-col gap-2">
          <FieldLabel>Élèves assignés</FieldLabel>
          {fields.map((field, index) => {
            const student = selectedStudents.find(
              (item) => item.id === field.studentId,
            );
            return (
              <div
                className="flex items-center dark:bg-gray-950/70 bg-gray-300/80 gap-2 rounded-md border p-2"
                key={field._key}
              >
                <Avatar className="size-8">
                  <AvatarImage
                    src={
                      student?.schoolProfile?.avatarUrl ||
                      field?.avatarUrl ||
                      undefined
                    }
                  />
                  <AvatarFallback>
                    {student?.schoolProfile?.firstName?.[0] ||
                      field?.firstName?.[0]}
                    {student?.schoolProfile?.lastName?.[0] ||
                      field?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {student?.schoolProfile?.firstName || field?.firstName}{' '}
                    {student?.schoolProfile?.lastName || field?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {student?.schoolClass?.name || field.class?.name}
                  </p>
                </div>
                <Controller
                  control={control}
                  name={`children.${index}.relationType`}
                  render={({ field: relationField }) => (
                    <Select
                      items={relationTypeOptions}
                      value={relationField.value}
                      onValueChange={relationField.onChange}
                    >
                      <SelectTrigger className="max-w-30!">
                        <SelectValue placeholder="Relation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Relation</SelectLabel>
                          {relationTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-label={`Retirer le ${subject}`}
                  onClick={() => requestRemoveStudent(index)}
                >
                  <X />
                </Button>
              </div>
            );
          })}
        </div>
      )}
      <Button
        onClick={() => setOpen(!open)}
        type="button"
        variant="outline"
        className="border-dashed! cursor-pointer"
      >
        Ajouter un élève
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-105! dark:bg-gray-950/70 bg-gray-300/80 rounded-4xl backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>Ajouter des élèves</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Input
              value={searchTerm}
              placeholder="Rechercher un élève..."
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            {isSearching && hasSearchTerm && (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Recherche en cours...
              </div>
            )}
            {!isSearching &&
              filteredStudents &&
              filteredStudents.length > 0 && (
                <ScrollArea className="scroll-fade max-h-100! overflow-y-auto">
                  {filteredStudents.map((student) => (
                    <Item
                      variant="outline"
                      className="mt-1 py-1.5 group hover:border hover:border-primary hover:bg-primary/10"
                      key={student.id}
                    >
                      <ItemMedia>
                        <Avatar className="size-10">
                          <AvatarImage
                            src={student.schoolProfile?.avatarUrl ?? undefined}
                          />
                          <AvatarFallback>
                            {student.schoolProfile?.firstName?.[0]}
                            {student.schoolProfile?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      </ItemMedia>
                      <ItemContent className="flex-row! items-center justify-between">
                        <ItemTitle>
                          {student.schoolProfile?.firstName}{' '}
                          <span>{student.schoolProfile?.lastName}</span>
                        </ItemTitle>
                        <ItemDescription className="text-xs!">
                          Classe: {student.schoolClass?.name}
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="secondary"
                          className="rounded-full cursor-pointer"
                          aria-label={`Ajouter le ${subject}`}
                          onClick={() => handleItemClick(student)}
                        >
                          <Plus />
                        </Button>
                      </ItemActions>
                    </Item>
                  ))}
                </ScrollArea>
              )}
            {!isSearching &&
              (!filteredStudents || filteredStudents.length === 0) && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  {hasSearchTerm
                    ? 'Aucun élève trouvé.'
                    : "Saisissez le nom d'un élève pour commencer la recherche."}
                </div>
              )}
          </div>
        </DialogContent>
      </Dialog>
      <AppAlertDialog
        open={pendingRemoval !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setPendingRemoval(null);
        }}
        title={`Supprimer ${pendingRemoval?.studentName ?? 'cet élève'} ?`}
        description="Cette action supprimera la relation entre ce parent et cet élève lorsque vous confirmerez le formulaire."
        onConfirm={confirmRemoveStudent}
        confirmLabel="Supprimer la relation"
      />
    </div>
  );
}
