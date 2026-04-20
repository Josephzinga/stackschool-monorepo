import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Controller,
  useCompleteProfileStore,
  useForm,
  useGetClassesOptionsQuery,
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
  generateStudentMatricule,
  parseAxiosError,
  StudentFormData,
  studentFormSchema,
} from '@stackschool/shared';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { SubmitButton } from '@/components/submit-button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/animate-ui/components/radix/popover';
import { toast } from 'sonner';

export default function StudentForm({ onBack }: { onBack: () => void }) {
  const { setRoleData, school, role, setCurrentStep, profile } =
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
      birthDate: studentData?.birthDate,
      birthPlace: studentData?.birthPlace || '',
      fatherName: studentData?.fatherName || '',
      motherName: studentData?.motherName || '',
      nationality: studentData?.nationality || 'Malienne',
      matricule:
        studentData?.matricule ||
        generateStudentMatricule(profile?.firstname!, profile?.lastname!),
      classId: studentData?.classId || '',
      enrollmentYear: studentData?.enrollmentYear || '',
    },
  });

  const [open, setOpen] = useState(false);

  const currentYear = new Date().getFullYear();
  const academicYears = Array.from(
    { length: currentYear - 2010 + 1 },
    (_, i) => `${currentYear - i - 1}-${currentYear - i}`,
  );

  const schoolId = school?.type === 'join' ? school.schoolSelected.id : null;

  const { data, error, isError } = useGetClassesOptionsQuery(
    {
      input: {
        limit: 100,
      },
    },
    {
      enabled: !!schoolId,
    },
  );

  if (isError) {
    const { message } = parseAxiosError(error);
    toast.error(message || 'Echec de chargement de classes');
  }

  const onSubmit = async (data: StudentFormData) => {
    setRoleData({ role: 'STUDENT', student: data });
    setCurrentStep(4);
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
          <Controller
            control={control}
            name="enrollmentYear"
            render={({ field }) => (
              <Select
                onValueChange={(year) => field.onChange(year)}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la date" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="birthDate">Date de naissance</FieldLabel>
        <Controller
          name="birthDate"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-full justify-between font-normal"
                >
                  {value
                    ? new Date(value).toLocaleDateString()
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
                  selected={value}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    onChange(date);
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          )}
        />
        <FieldError errors={[{ message: errors.birthDate?.message }]} />
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
        <FieldLabel htmlFor="classId">Classe</FieldLabel>
        <Controller
          control={control}
          name="classId"
          render={({ field: { onChange, value } }) => (
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger aria-invalid={!!errors.classId}>
                <SelectValue placeholder="Sélectionnez votre classe" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                {data?.getClassAndSubjects?.map((classe) => (
                  <SelectItem key={classe?.id} value={classe?.id as string}>
                    <p className="font-semibold ">{classe?.name}</p>
                    <p>{classe?.section}</p>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError errors={[{ message: errors.classId?.message }]} />
      </Field>

      <div className="w-full flex gap-4">
        <Button type="button" onClick={onBack} variant="outline">
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
