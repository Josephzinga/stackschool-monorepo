import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, User, UserPlus, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import {
  api,
  ParentFormData,
  parentFormSchema,
  parseAxiosError,
  RelationType,
  SEARCH_STUDENT_GQL,
  StudentResult,
} from '@stackschool/shared';
import { toast } from 'sonner';
import {
  Controller,
  relationItems,
  useCompleteProfileStore,
  useFieldArray,
} from '@stackschool/ui';
import { SubmitButton } from '@/components/submit-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Badge } from '@/components/ui/badge';
import { SearchResultsList } from '@/components/search-results-list';
import { SearchInput } from '@/components/search-input';

export function ParentForm({ onBack }: { onBack: () => void }) {
  const { setRoleData, school, setCurrentStep, role } =
    useCompleteProfileStore();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(500, searchQuery);
  const parentData = role?.role === 'PARENT' ? role.parent : null;
  const [childrenDetails, setChildrenDetails] = useState<
    Record<string, StudentResult>
  >({});

  const [childToConfigure, setChildToConfigure] =
    useState<StudentResult | null>(null);
  const [tempRelation, setTempRelation] = useState<RelationType>('FATHER');
  console.log('parentData', parentData);
  const {
    handleSubmit,
    register,
    control,
    formState: { isSubmitting, errors },
  } = useForm<ParentFormData>({
    resolver: zodResolver(parentFormSchema),
    defaultValues: {
      children: parentData?.children || [],
      contactPreference: parentData?.contactPreference || 'PHONE',
      profession: parentData?.profession || '',
      address: parentData?.address || '',
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
    const { message } = parseAxiosError(error);
    if (!data) {
      return [];
    }
    if (!isLoading && error) {
      toast.error(message || 'Erreur reseaux');
      return [];
    }
    return data.filter((s) => !fields?.some((child) => child.id === s.id));
  }, [data, fields]);

  const openConfiguration = (student: StudentResult) => {
    setChildToConfigure(student);
  };

  const confirmAddChild = () => {
    if (!childToConfigure) return;
    append({
      id: childToConfigure.id,
      relation: tempRelation,
      firstname: childToConfigure.firstname,
      lastname: childToConfigure.lastname,
      photo: childToConfigure.photo,
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
      setCurrentStep(4);
      toast.success('Enfants enregistrés avec succès !');
    } catch (e) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  return (
    <div className="space-y-4 h-full">
      <div className="space-y-2 font-poppins">
        <h3 className="text-lg font-medium font-inter">Ajouter vos enfants</h3>
        <p className="text-sm text-muted-foreground font-inter">
          Recherchez vos enfants par leur nom ou matricule pour les lier à votre
          compte.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="profession">Profession</FieldLabel>
          <Input
            id="profession"
            {...register('profession')}
            aria-invalid={!!errors.profession}
          />
          <FieldError errors={[{ message: errors.profession?.message }]} />
        </Field>
        <Field>
          <FieldLabel>Address</FieldLabel>
          <Input
            id="address"
            autoComplete="address-level1"
            {...register('address')}
            aria-invalid={!!errors.address}
          />
          <FieldError>{errors.address?.message}</FieldError>
        </Field>
      </div>
      {/* methode de contact */}
      <Field className=" font-inter">
        <FieldLabel className="font-inter" htmlFor="contactPreference">
          Préférence de contact
        </FieldLabel>
        <Controller
          name="contactPreference"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Select
              value={value}
              name="contactPreference"
              onValueChange={onChange}
            >
              <SelectTrigger name="contactPreference" className="w-full h-15">
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
      <div className="relative space-y-3">
        <SearchInput
          isLoading={isLoading}
          onClear={() => setSearchQuery('')}
          placeholder="Rechercher par nom ou matricule..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Résultats de recherche */}
        {searchQuery.length >= 2 && (
          <SearchResultsList
            items={filteredResults}
            onSelect={openConfiguration}
            renderItem={(student) => (
              <div className="p-3 flex items-center justify-between">
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
            )}
          />
        )}
      </div>
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
              return (
                <div
                  key={field.id}
                  className=" flex justify-center border-border border rounded-md py-2 bg-slate-50 dark:bg-slate-800/50"
                >
                  <div className="w-full flex px-3 justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/images/${field.photo}`} />
                        <AvatarFallback className=" bg-primary/10 text-primary font-bold text-sm font-jost ">
                          {field.firstname}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-medium text-sm font-inter">
                        {field.firstname} {field.lastname}
                      </p>
                    </div>

                    <div className="flex items-center  gap-5 text-xs text-muted-foreground">
                      <Badge variant="outline">
                        {relationSelected(field.relation)}
                      </Badge>
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
