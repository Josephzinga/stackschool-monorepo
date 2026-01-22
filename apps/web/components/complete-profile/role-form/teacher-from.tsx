import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useMemo, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import {
  ClassWithSubjects,
  TeacherFormData,
  teacherSchema,
} from '@stackschool/shared';
import {
  useCompleteProfileStore,
  useFieldArray,
  useForm,
  useGetClassSubjectsQuery,
  zodResolver,
} from '@stackschool/ui';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, UserPlus, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SubmitButton } from '@/components/submit-button';
import { toast } from 'sonner';
import { SearchInput } from '@/components/search-input';
import { SearchResultsList } from '@/components/search-results-list';

export function TeacherForm({ onBack }: { onBack: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(400, searchQuery);
  const { school, setRoleData, setCurrentStep, role } =
    useCompleteProfileStore();
  const schoolId = school?.type === 'join' ? school.schoolSelected.id : null;

  // État pour la modale
  const [selectedClass, setSelectedClass] = useState<ClassWithSubjects | null>(
    null,
  );
  const [tempIsMain, setTempIsMain] = useState(false);
  const [tempSubjects, setTempSubjects] = useState<string[]>([]);

  const teacherData = role?.role === 'TEACHER' ? role.teacher : null;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      assignments: teacherData?.assignments || [],
      department: teacherData?.department || '',
      diploma: teacherData?.diploma || '',
    },
  });

  const { data, isLoading } = useGetClassSubjectsQuery(
    {
      input: {
        searchTerm: debouncedSearch,
        schoolId: schoolId as string,
      },
    },
    {
      enabled: !!schoolId && debouncedSearch?.length! >= 2,
    },
  );

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'assignments',
  });

  const openConfiguration = (cls: ClassWithSubjects) => {
    setSelectedClass(cls);
    setTempIsMain(false);
    setTempSubjects([]);
  };

  const confirmAddAssignment = () => {
    if (!selectedClass) return;
    if (tempSubjects.length === 0) {
      toast.error('Veuillez sélectionner au moins une matière.');
      return;
    }

    const subjectNames = selectedClass.subjects
      .filter((s) => tempSubjects.includes(s.id))
      .map((s) => s.name);

    append({
      classId: selectedClass.id,
      className: selectedClass.name,
      isMainTeacher: tempIsMain,
      subjectIds: tempSubjects,
      subjectNames,
    });
    setSelectedClass(null);
    setSearchQuery('');
  };

  const toggleSubject = (subjectId: string) => {
    setTempSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId],
    );
  };

  const filteredResults = useMemo(() => {
    if (!data?.getClassSubjects) return [];
    return data.getClassSubjects.filter(
      (cls) => !fields?.some((assignment) => assignment.classId === cls?.id),
    );
  }, [data?.getClassSubjects, fields]);

  const onSubmit = async (data: TeacherFormData) => {
    try {
      setRoleData({ role: 'TEACHER', teacher: data });
      setCurrentStep(4);
      toast.success('Informations enregistrées !');
    } catch (e) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field>
          <FieldLabel>Diplôme / Qualification</FieldLabel>
          <Input
            {...register('diploma')}
            placeholder="Ex: CAP, Master, Doctorat..."
            icon={GraduationCap}
            aria-invalid={!!errors.diploma}
          />
          <FieldError>{errors.diploma?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel>Département (Optionnel)</FieldLabel>
          <Input
            {...register('department')}
            placeholder="Ex: Sciences, Lettres..."
            icon={BookOpen}
            aria-invalid={!!errors.department}
          />
          <FieldError>{errors.department?.message}</FieldError>
        </Field>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Vos Classes</h3>
          <p className="text-sm text-muted-foreground">
            Recherchez et ajoutez les classes dans lesquelles vous enseignez.
          </p>
        </div>

        {/* Recherche */}
        <div className="space-y-4 relative">
          <SearchInput
            onClear={() => setSearchQuery('')}
            isLoading={isLoading}
            placeholder="Rechercher une classe (ex: 6ème A)..."
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />

          {/* Liste des résultats avec animation */}
          {searchQuery.length >= 2 && (
            <SearchResultsList
              items={filteredResults}
              onSelect={openConfiguration}
              renderItem={(item) => (
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm ">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.level} {item.section ? `- ${item.section}` : ''}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <UserPlus className="h-4 w-4 text-primary" />
                  </Button>
                </div>
              )}
            />
          )}
        </div>

        {/* Liste des classes sélectionnées */}
        <div className="grid gap-3">
          {fields?.map((assignment, index) => (
            <Card
              key={assignment.classId}
              className="py-2 px-4 flex flex-col gap-2 relative bg-slate-100 dark:bg-slate-800"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    {assignment.className}
                    {assignment.isMainTeacher && (
                      <Badge variant="secondary" className="text-xs font-inter">
                        Titulaire
                      </Badge>
                    )}
                  </h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {assignment.subjectNames!.map((name) => (
                      <Badge
                        key={name}
                        variant="outline"
                        className="text-xs font-normal"
                      >
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground hover:text-destructive h-full"
                  onClick={() => remove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}

          {fields.length === 0 && (
            <div className="text-center p-8 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
              Aucune classe assignée. Utilisez la recherche pour commencer.
            </div>
          )}

          <FieldError>{errors.assignments?.message}</FieldError>
        </div>
      </div>

      <div className="w-full flex gap-4">
        <Button onClick={onBack} variant="outline">
          ← Retour
        </Button>
        <SubmitButton isSubmitting={isSubmitting} className="w-3/4">
          Enregistrer mes informations
        </SubmitButton>
      </div>

      {/* Modale de configuration */}
      <Dialog
        open={!!selectedClass}
        onOpenChange={(open) => !open && setSelectedClass(null)}
      >
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader className="font-poppins">
            <DialogTitle>Configurer {selectedClass?.name}</DialogTitle>
            <DialogDescription>
              Quelles matières enseignez-vous dans cette classe ?
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-2 border p-3 rounded-md">
              <Checkbox
                id="mainTeacher"
                checked={tempIsMain}
                onCheckedChange={(c) => setTempIsMain(!!c)}
              />
              <Label htmlFor="mainTeacher" className="cursor-pointer">
                Je suis le professeur titulaire (principal)
              </Label>
            </div>

            <Field>
              <FieldLabel>Matières enseignées</FieldLabel>
              <div className="border rounded-md p-2 max-h-48 overflow-y-auto space-y-2">
                {selectedClass?.subjects?.map((subject, index) => (
                  <div key={subject.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={tempSubjects.includes(subject.id)}
                      onCheckedChange={() => toggleSubject(subject.id)}
                    />

                    <FieldLabel
                      htmlFor={`subj-${subject.id}`}
                      className="cursor-pointer text-sm font-normal w-full "
                    >
                      {subject.name}
                    </FieldLabel>
                  </div>
                ))}
                {(!selectedClass?.subjects ||
                  selectedClass.subjects.length === 0) && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    Aucune matière configurée pour cette classe.
                  </p>
                )}
              </div>
            </Field>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedClass(null)}>
              Annuler
            </Button>
            <Button
              onClick={confirmAddAssignment}
              disabled={tempSubjects.length === 0}
              className="font-poppins font-medium"
            >
              Ajouter la classe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
