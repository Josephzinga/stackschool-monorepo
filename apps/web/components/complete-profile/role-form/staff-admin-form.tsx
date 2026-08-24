import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useCompleteProfileStore, zodResolver} from '@stackschool/ui';
import {Briefcase, Calendar as CalendarIcon} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {StaffFormDataType, StaffFormSchema} from '@stackschool/contracts';
import {Input} from '@/components/ui/input';
import {Field, FieldError, FieldLabel} from '@/components/ui/field';
import {Calendar} from '@/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger,} from '@/components/ui/popover';
import {SubmitButton} from '@/components/submit-button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface Props {
  role: 'ADMIN' | 'STAFF';
  onSubmit: (data: StaffFormDataType) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function StaffAdminForm({
  role,
  onSubmit,
  onBack,
  isLoading,
}: Props) {
  const { role: roleData } = useCompleteProfileStore();
  const isAdmin = role === 'ADMIN';
  const [open, setOpen] = React.useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
      register,
  } = useForm<StaffFormDataType>({
    resolver: zodResolver(StaffFormSchema),
    defaultValues: {
      position: isAdmin
        ? 'SUPERVISOR'
        : 'OTHER',
      department: isAdmin
        ? 'Direction'
        : roleData?.role === 'STAFF'
          ? roleData.staff.department
          : '',
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (err) => {console.log("Erreur : ", err)})}
      className="space-y-4 animate-in fade-in duration-500"
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Champ Poste / Position */}
        <Field>
          <FieldLabel className="text-sm font-medium flex items-center gap-2">
            Poste occupé
          </FieldLabel>
          <Controller
            control={control}
            name="position"
            render={({ field: { value, onChange } }) => (
                <Select onValueChange={onChange} value={value}>
                  <SelectTrigger
                      aria-invalid={!!errors.position}
                      className="w-full"
                      id="position"
                      size="sm"
                  >
                    <SelectValue placeholder="Sélectionnez votre genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Poste</SelectLabel>
                      <SelectItem value="SUPERVISOR">Directeur</SelectItem>
                      <SelectItem value="GUARDIAN">Gardien</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
            )}
          />
          {errors.position && (
            <FieldError>{errors.position.message}</FieldError>
          )}
        </Field>

        {/* Champ Département */}
        <Field>
          <FieldLabel>Département</FieldLabel>
          <Input
              {...register('department')}
              aria-invalid={!!errors.department}
              icon={Briefcase}
              placeholder="Ex: Finance, Ressources Humaines..."
              className={isAdmin ? 'bg-muted' : ''}
              disabled={isAdmin}
          />
          {errors.department && (
            <FieldError>{errors.department.message}</FieldError>
          )}
        </Field>

        {/* Date d'embauche (Standard HTML Date pour la simplicité) */}
        <Field>
          <FieldLabel className="text-sm font-medium flex items-center gap-2">
            Date d'entrée en fonction
          </FieldLabel>
          <Controller
            control={control}
            name="hireDate"
            render={({ field: { value, onChange } }) => (
              <Popover onOpenChange={setOpen} open={open}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-full justify-between font-normal"
                  >
                    {value ? value.toLocaleDateString() : 'Sélectionné la date'}
                    <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={value}
                    onSelect={(date) => {
                      onChange(date);
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </Field>
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            Retour
          </Button>
          <SubmitButton isSubmitting={isLoading}>
            {isLoading ? 'Enregistrement...' : 'Terminer mon profil'}
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
