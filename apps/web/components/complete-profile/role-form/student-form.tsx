import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Controller,
  useCompleteProfileStore,
  useForm,
  zodResolver,
} from '@stackschool/ui';
import {
  Calendar as CalendarIcon,
  Flag,
  IdCard,
  MapPin,
  User,
} from 'lucide-react';
import { useState } from 'react';
import {
  api,
  Class,
  GET_CLASSES_GQL,
  StudentFormData,
  studentFormSchema,
} from '@stackschool/shared';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { SubmitButton } from '@/components/submit-button';
import { useQuery } from '@tanstack/react-query';

export default function StudentForm({ onBack }: { onBack: () => void }) {
  const { setRoleData, school, role, setCurrentStep } =
    useCompleteProfileStore();
  const studentData = role?.role === 'STUDENT' ? role.student : null;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    mode: 'onBlur',
    defaultValues: {
      birthDate: studentData?.birthDate || undefined,
      birthPlace: studentData?.birthPlace || '',
      fatherName: studentData?.fatherName || '',
      motherName: studentData?.motherName || '',
      matricule: studentData?.matricule || '',
      classId: studentData?.classId,
      enrollmentYear: studentData?.enrollmentYear || '',
    },
  });

  const [open, setOpen] = useState(false);

  const currentYear = new Date().getFullYear();
  const academicYears = [
    `${currentYear}-${currentYear + 1}`,
    `${currentYear - 1}-${currentYear}`,
    `${currentYear - 2}-${currentYear - 1}`,
  ];

  const schoolId = school?.type === 'join' ? school.schoolSelected.id : null;

  const { data, error, isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const res = await api.post(`/graphql`, {
        query: GET_CLASSES_GQL,
        variables: {
          input: {
            schoolId,
            getOnly: true,
          },
        },
      });

      return res.data.data.getClassSubjects as Class[];
    },
  });

  const onSubmit = async (data: StudentFormData) => {
    setRoleData({ role: 'STUDENT', student: data });
    console.log('data', data);
    setCurrentStep(4);
    try {
    } catch (e) {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-poppins">
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="matricule">Matricule</FieldLabel>
          <Input
            id="matricule"
            icon={IdCard}
            {...register('matricule')}
            placeholder="2024-001"
            aria-invalid={!!errors.matricule}
          />
          <FieldError>{errors.matricule?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="enrollmentYear">Année d'inscription</FieldLabel>
          <Select {...register('enrollmentYear')}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez l'année" />
            </SelectTrigger>
            <SelectContent>
              {academicYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="birthDate">Date de naissance</FieldLabel>
        <Controller
          name="birthDate"
          control={control}
          render={({ field }) => (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-full justify-between font-normal"
                >
                  {field.value
                    ? field?.value.toString().split('00', length - 1)
                    : 'Sélectionné votre date'}
                  <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={field.value}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    field.onChange(date);
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          )}
        />
      </Field>

      {/* Spécificités maliennes */}
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="birthPlace">Lieu de naissance</FieldLabel>
          <Input
            id="birthPlace"
            icon={MapPin}
            {...register('birthPlace')}
            aria-invalid={!!errors.birthPlace}
            placeholder="Bamako, Kayes, etc."
          />
          <FieldError>{errors.birthPlace?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="nationality">Nationalité</FieldLabel>
          <Input
            id="nationality"
            icon={Flag}
            {...register('nationality')}
            defaultValue="Malienne"
            aria-invalid={!!errors.nationality}
          />
          <FieldError>{errors.nationality?.message}</FieldError>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="fatherName">Nom du père</FieldLabel>
          <Input
            id="fatherName"
            icon={User}
            {...register('fatherName')}
            aria-invalid={!!errors.fatherName}
          />
          <FieldError>{errors.fatherName?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="motherName">Nom de la mère</FieldLabel>
          <Input
            id="motherName"
            icon={User}
            required
            {...register('motherName')}
            aria-invalid={!!errors.motherName}
          />
          <FieldError>{errors.motherName?.message}</FieldError>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="classId">Classe (optionnel)</FieldLabel>
        <Select {...register('classId')}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez votre classe" />
          </SelectTrigger>
          <SelectContent>
            {data?.map((classe: Class) => (
              <SelectItem key={classe.id} value={classe.id}>
                <p className="font-semibold ">{classe.name}</p>
                <p>{classe.section}</p>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <div className="w-full flex gap-4">
        <Button onClick={onBack} variant="outline">
          ← Retour
        </Button>
        <SubmitButton isSubmitting={isSubmitting} className="w-3/4">
          {isSubmitting
            ? 'Finalisation en cours...'
            : "  Finaliser l'inscription"}
        </SubmitButton>
      </div>
    </form>
  );
}
