import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Briefcase, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StaffFormSchema, StaffFormValues } from '@stackschool/shared';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { SubmitButton } from '@/components/submit-button';
import { cn } from '@/lib/utils';
import { useCompleteProfileStore } from '@stackschool/ui';

interface Props {
  role: 'ADMIN' | 'STAFF';
  onSubmit: (data: StaffFormValues) => void;
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
  } = useForm<StaffFormValues>({
    resolver: zodResolver(StaffFormSchema),
    defaultValues: {
      position: isAdmin
        ? 'Administrateur'
        : roleData?.role === 'STAFF'
          ? roleData.staff.position
          : '',
      departement: isAdmin
        ? 'Direction'
        : roleData?.role === 'STAFF'
          ? roleData.staff.departement
          : '',
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
              <Input
                icon={Briefcase}
                value={value}
                onChange={onChange}
                placeholder="Ex: Comptable, Secrétaire, Surveillant..."
                disabled={isAdmin}
                className={cn(isAdmin && 'bg-muted')}
                aria-invalid={!!errors.position}
              />
            )}
          />
          {errors.position && (
            <FieldError>{errors.position.message}</FieldError>
          )}
        </Field>

        {/* Champ Département */}
        <Field>
          <FieldLabel>Département</FieldLabel>
          <Controller
            name="departement"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                aria-invalid={!!errors.departement}
                value={value}
                onChange={onChange}
                icon={Briefcase}
                placeholder="Ex: Finance, Ressources Humaines..."
                disabled={isAdmin}
                className={isAdmin ? 'bg-muted' : ''}
              />
            )}
          />
          {errors.departement && (
            <FieldError>{errors.departement.message}</FieldError>
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
                    onSelect={(date: any) => {
                      onChange(date);
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
