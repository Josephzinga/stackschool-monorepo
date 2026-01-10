import {useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Check, Search, User, UserPlus, X} from 'lucide-react';
import {useDebounce} from '@/hooks/useDebounce';
import {useQuery} from '@tanstack/react-query';
import {$Enums, api, ParentFormData, parentFormSchema, parseAxiosError, SEARCH_STUDENT_GQL,} from '@stackschool/shared';
import {toast} from 'sonner';
import {Controller, relationItems, useCompleteProfileStore, useFieldArray,} from '@stackschool/ui';
import {SubmitButton} from '@/components/submit-button';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Field, FieldError, FieldLabel} from '@/components/ui/field';
import {Spinner} from '@/components/ui/spinner';

type RelationType = $Enums.RelationType;

interface StudentResult {
  id: string;
  matricule: string;
  firstname: string;
  lastname: string;
  photo?: string;
  className?: string;
  relation: RelationType;
}

export function ParentForm({ onBack }: { onBack: () => void }) {
  const { setRoleData, school } = useCompleteProfileStore();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(500, searchQuery);
  const [childrenDetails, setChildrenDetails] = useState<
    Record<string, StudentResult>
  >({});

  // État pour la modale de configuration de l'enfant
  const [childToConfigure, setChildToConfigure] =
    useState<StudentResult | null>(null);
  const [tempRelation, setTempRelation] = useState<RelationType>('FATHER');

  const {
    handleSubmit,
    register,
    control,
    formState: { isSubmitting, errors },
  } = useForm<ParentFormData>({
    resolver: zodResolver(parentFormSchema),
    defaultValues: {
      children: [],
      contactPreference: 'PHONE',
      profession: '',
    },
    mode: 'onBlur',
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'children',
  });

  const schoolId = school?.type === 'join' ? school.schoolSelected.id : null;
  if (!schoolId) return;

  const { data, isLoading, error } = useQuery({
    queryKey: ['student', schoolId, debouncedQuery],
    queryFn: async () => {
      if (searchQuery.length < 2) return [];
      const res = await api.post('/graphql', {
        query: SEARCH_STUDENT_GQL,
        variables: {
          input: {
            schoolId,
            searchTerm: debouncedQuery,
          },
        },
      });

      return res.data.data.searchStudent as StudentResult[];
    },
  });

  const filteredResults = useMemo(() => {
    const { message, status } = parseAxiosError(error);
    if (!data) {
      return [];
    }
    if (!isLoading && error) {
      toast.error(message || 'Erreur reseaux');
      return [];
    }
    return data.filter(
      (s) => !fields?.some((child) => child.studentId === s.id),
    );
  }, [data, fields, error]);

  const openConfiguration = (student: StudentResult) => {
    setChildToConfigure(student);
  };

  const confirmAddChild = () => {
    if (!childToConfigure) return;
    append({
      studentId: childToConfigure.id,
      relation: tempRelation,
    });

    setChildrenDetails((prev) => ({
      ...prev,
      [childToConfigure.id]: { ...childToConfigure, relation: tempRelation },
    }));

    setChildToConfigure(null);
    setSearchQuery('');
    toast.success(`${childToConfigure?.firstname} ajouté !`);
  };

  const relationSelected = (childRelation: RelationType) => {
    const relation = relationItems.filter((r) => r.value === childRelation);
    return relation.length > 0 ? relation[0].label : '';
  };

  const onSubmit = async (data: ParentFormData) => {
    try {
      setRoleData({ role: 'PARENT', parent: data });
      toast.success('Enfants enregistrés avec succès !');
    } catch (e) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };
  return (
    <div className="space-y-5 h-full">
      <div className="space-y-2 font-poppins">
        <h3 className="text-lg font-medium font-inter">Ajouter vos enfants</h3>
        <p className="text-sm text-muted-foreground font-inter">
          Recherchez vos enfants par leur nom ou matricule pour les lier à votre
          compte.
        </p>
      </div>

      <Field>
        <FieldLabel>Profession</FieldLabel>
        <Input {...register('profession')} aria-invalid={!!errors.profession} />
        <FieldError errors={[{ message: errors.profession?.message }]} />
      </Field>

      {/* methode de contact */}
      <Field className=" font-inter">
        <FieldLabel className="font-inter">Préférence de contact</FieldLabel>
        <Controller
          name="contactPreference"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Select value={value} onValueChange={onChange} defaultValue={''}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="WhatsApp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PHONE">Appel Téléphonique</SelectItem>
                <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                <SelectItem value="EMAIL">Email</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </Field>
      {/* Zone de recherche */}
      <div className="relative">
        <Input
          placeholder="Rechercher par nom ou matricule..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={Search}
          className="pl-10"
        />
        {isLoading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2">
            <Spinner className="text-primary" />
          </span>
        )}
      </div>

      {/* Résultats de recherche */}
      {filteredResults?.length >= 0 && (
        <div className="border rounded-md divide-y bg-white dark:bg-slate-900 shadow-sm max-h-60 overflow-y-auto">
          {filteredResults?.map((student: StudentResult) => (
            <div
              key={student.id}
              className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              onClick={() => openConfiguration(student)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`/images/${student.photo}`} />
                  <AvatarFallback>
                    {student.firstname[0]}
                    {student.lastname[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">
                    {student.firstname} {student.lastname}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Matricule: {student.matricule}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <UserPlus className="h-4 w-4 text-primary" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Liste des enfants sélectionnés */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <User className="h-4 w-4" />
          Enfants sélectionnés ({fields?.length})
        </h4>
        {fields?.length === 0 ? (
          <div className="text-center p-6 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
            Aucun enfant sélectionné. Utilisez la recherche ci-dessus.
          </div>
        ) : (
          <>
            {fields?.map((field, index) => {
              const { firstname, lastname, id, photo, relation } =
                childrenDetails[field.studentId];

              return (
                <>
                  {' '}
                  <div
                    key={id}
                    className=" flex justify-center border-border border rounded-md py-2 bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="w-full flex px-3 justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/images/${photo}`} />
                          <AvatarFallback className=" bg-primary/10 text-primary font-bold text-sm font-jost ">
                            {firstname[0]}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-medium text-sm font-inter">
                          {firstname} {lastname}
                        </p>
                      </div>

                      <div className="flex items-center  gap-5 text-xs text-muted-foreground">
                        <span className="bg-white dark:bg-slate-900 px-3 py-1 rounded border">
                          {relationSelected(relation)}
                        </span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 mr-4 text-muted-foreground hover:text-destructive"
                      onClick={() => remove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              );
            })}
          </>
        )}

        <FieldError errors={[{ message: errors.children?.message }]} />
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4 items-end">
        <Button variant="outline" onClick={onBack} type="button">
          ← Retour
        </Button>
        <SubmitButton
          isSubmitting={isSubmitting}
          onClick={handleSubmit(onSubmit)}
          className="flex-1"
          disabled={fields.length === 0}
        >
          <Check className="mr-2 h-4 w-4" />
          Confirmer la sélection
        </SubmitButton>
      </div>

      {/* Modale de configuration */}
      <Dialog
        open={!!childToConfigure}
        onOpenChange={(open) => !open && setChildToConfigure(null)}
      >
        <DialogContent className="w-90">
          <DialogHeader className="flex items-center justify-between font-poppins">
            <DialogTitle>Configurer le lien</DialogTitle>
            <DialogDescription>
              Précisez votre relation avec{' '}
              <span className="font-semibold">
                {childToConfigure?.firstname}.
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Field>
              <FieldLabel htmlFor="relation">Votre relation</FieldLabel>
              <Select
                name="relation"
                value={tempRelation}
                onValueChange={setTempRelation as (value: string) => void}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {relationItems.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setChildToConfigure(null)}>
              Annuler
            </Button>
            <Button onClick={confirmAddChild}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
