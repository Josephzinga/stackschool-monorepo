'use client';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useDebounce } from '@/hooks/useDebounce';
import {
  useGetClassesOptionsQuery,
  useGetSubjectsOptionsQuery,
} from '@stackschool/ui';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ButtonGroup } from '@/components/ui/button-group';
import { ChevronDown, Search, X } from 'lucide-react';
import { Button as AnimateButton } from '@/components/animate-ui/components/buttons/button';
import { CreateTeacherValues } from '@stackschool/shared';

interface ClassData {
  id: string;
  name: string;
  level?: string;
}
interface ClassSubjectCache {
  [classId: string]: {
    subjects: Array<{ id: string; name: string }>;
    fetchedAt: number;
  };
}

interface TeacherClassSubjectManagerProps {
  name: keyof CreateTeacherValues; // 'classSubjects'
  placeholder?: string;
}

export const TeacherClassSubjectManager = ({
  name,
  placeholder = 'Rechercher une classe...',
}: TeacherClassSubjectManagerProps) => {
  const { control } = useFormContext<CreateTeacherValues>();
  const { fields, append, update, remove } = useFieldArray({
    control,
    name,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [tempSubjectIds, setTempSubjectIds] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassData | undefined>();
  const [openCommand, setOpenCommand] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [subjectsCache, setSubjectsCache] = useState<ClassSubjectCache>({});

  const debounceSearch = useDebounce(searchTerm, 400);

  const { data: classesData, isPending: searchLoading } =
    useGetClassesOptionsQuery({
      input: {
        searchTerm: debounceSearch,
        limit: 10,
      },
    });

  const { data: subjectsData, isPending: subjectLoading } =
    useGetSubjectsOptionsQuery(
      {
        input: {
          classId: selectedClass?.id,
        },
      },
      {
        enabled: !!selectedClass?.id,
      },
    );

  useEffect(() => {
    if (selectedClass && subjectsData?.getSchoolSubjects?.data) {
      setSubjectsCache((prev) => ({
        ...prev,
        [selectedClass?.id!]: {
          subjects: subjectsData?.getSchoolSubjects?.data || [],
          fetchedAt: Date.now(),
        },
      }));
    }
  }, [selectedClass?.id, subjectsData]);

  const classes = classesData?.getSchoolClasses?.data;
  const subjects = subjectsData?.getSchoolSubjects?.data;

  // Classes non encore sélectionnées
  const filteredClasses = useMemo(() => {
    if (!classes) return [];
    const selectedIds = fields.map((f) => f.classId);
    return classes.filter((c) => !selectedIds.includes(c.id));
  }, [classes, fields]);

  useEffect(() => {
    if (selectedClass && openDialog) {
      const existing = fields.find((f) => f.classId === selectedClass.id);
      setTempSubjectIds(existing?.subjectIds || []);
    }
  }, [selectedClass, openDialog, fields]);

  const handleSelectItem = (cls: ClassData) => {
    setSelectedClass(cls);
    setOpenCommand(false);
    setOpenDialog(true);
    setSearchTerm('');
  };

  const handleSaveAssignments = () => {
    if (!selectedClass) return;

    if (tempSubjectIds.length === 0) {
      // Supprimer l'assignation si elle existe
      const index = fields.findIndex((f) => f.classId === selectedClass.id);
      if (index !== -1) {
        remove(index);
      }
    } else {
      const existingIndex = fields.findIndex(
        (f) => f.classId === selectedClass.id,
      );
      const newAssignment = {
        classId: selectedClass.id,
        subjectIds: tempSubjectIds,
      };
      if (existingIndex !== -1) {
        update(existingIndex, newAssignment);
      } else {
        append(newAssignment);
      }
    }

    // Réinitialiser
    setOpenDialog(false);
    setSelectedClass(undefined);
    setTempSubjectIds([]);
  };

  const handleEditAssignment = (classId: string) => {
    const classToEdit = classes?.find((c) => c.id === classId);
    if (classToEdit) {
      setSelectedClass(classToEdit);
      setOpenDialog(true);
    }
  };

  const getSubjectNames = (
    classId: string,
    subjectIds: string[],
  ): (string | undefined)[] => {
    // Essayer d'abord depuis les données actuelles
    if (selectedClass?.id === classId && subjects) {
      return subjectIds
        .map((id) => subjects.find((s) => s.id === id)?.name)
        .filter(Boolean);
    }

    // Sinon depuis le cache
    const cached = subjectsCache[classId];
    if (cached) {
      return subjectIds
        .map((id) => cached.subjects.find((s) => s.id === id)?.name)
        .filter(Boolean);
    }

    // Sinon retourner les IDs (fallback)
    return subjectIds;
  };

  return (
    <div className="space-y-4">
      {/* Bouton de recherche */}
      <div className="flex flex-wrap gap-2 items-center">
        <Button
          onClick={() => setOpenCommand(true)}
          variant="outline"
          type="button"
          className="border-dashed"
        >
          <Search className="h-4 w-4 mr-2" />
          Ajouter une classe
        </Button>
      </div>

      {/* Commande de recherche */}
      <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList className="max-h-60">
            {searchLoading && (
              <CommandEmpty>Recherche en cours...</CommandEmpty>
            )}
            {!searchLoading && searchTerm.length < 2 && (
              <CommandEmpty>Saisissez au moins 2 caractères</CommandEmpty>
            )}
            {!searchLoading &&
              filteredClasses.length === 0 &&
              searchTerm.length >= 2 && (
                <CommandEmpty>Aucune classe trouvée</CommandEmpty>
              )}
            <CommandGroup heading="Classes">
              {filteredClasses.map((cls) => (
                <CommandItem
                  key={cls.id}
                  onSelect={() => handleSelectItem(cls)}
                >
                  {cls.name}{' '}
                  <span className="text-muted-foreground ml-1">
                    ({cls.level})
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>

      {/* Liste des classes assignées */}
      {fields.length > 0 && (
        <div className="border rounded-md p-3 space-y-2">
          <p className="text-sm font-medium">Classes assignées :</p>
          <div className="space-y-2">
            {fields.map((field, idx) => {
              const classId = field.classId;
              const subjectIds = field.subjectIds;
              const className =
                classes?.find((c) => c.id === classId)?.name || classId;
              const subjectNames = getSubjectNames(classId, subjectIds);
              console.log('SubjectNames', subjectNames, subjectIds);
              return (
                <Collapsible key={field.id} className="bg-muted/30 rounded-md">
                  <div className="flex justify-between items-center p-2">
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center gap-2 cursor-pointer">
                        <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                        <span className="font-medium text-sm">{className}</span>
                        <Badge variant="outline" className="text-xs">
                          {subjectIds.length} matière
                          {subjectIds.length > 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </CollapsibleTrigger>
                    <ButtonGroup className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => handleEditAssignment(classId)}
                      >
                        Modifier
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive"
                        onClick={() => remove(idx)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </ButtonGroup>
                  </div>
                  <CollapsibleContent className="px-2 pb-2">
                    <div className="flex flex-wrap gap-1">
                      {subjectNames.length > 0 ? (
                        subjectNames.map((name) => (
                          <Badge
                            key={name}
                            variant="secondary"
                            className="text-xs"
                          >
                            {name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Aucune matière sélectionnée
                        </span>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </div>
      )}

      {/* Dialogue d'assignation des matières */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assigner des matières</DialogTitle>
            <DialogDescription>
              {selectedClass
                ? `Classe : ${selectedClass.name}`
                : 'Sélectionnez les matières enseignées dans cette classe.'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            {subjectLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : subjects?.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center">
                Aucune matière associée à cette classe.
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {subjects?.map((subject) => (
                  <div key={subject.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`subject-${subject.id}`}
                      checked={tempSubjectIds.includes(subject.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setTempSubjectIds((prev) => [...prev, subject.id]);
                        } else {
                          setTempSubjectIds((prev) =>
                            prev.filter((id) => id !== subject.id),
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor={`subject-${subject.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {subject.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Annuler
              </Button>
            </DialogClose>
            <AnimateButton
              hoverScale={1.02}
              tapScale={0.95}
              disabled={tempSubjectIds.length === 0}
              onClick={handleSaveAssignments}
              type="button"
            >
              Enregistrer
            </AnimateButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
