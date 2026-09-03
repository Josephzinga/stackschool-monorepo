'use client';
import { GridForm } from '@/components/lists/grid-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreateStudentSchema } from '@stackschool/contracts';
import { useGetClassesOptionsQuery } from '@stackschool/ui';
import React, { useEffect, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';

export function SchoolSection({ mode }: { mode: 'QUICK_ADD' | 'FULL_EDIT' }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<CreateStudentSchema>();
  const currentYear = new Date().getFullYear();
  const academicYears = Array.from(
    { length: currentYear - 2010 + 1 },
    (_, i) => `${currentYear - i - 1}-${currentYear - i}`,
  );
  const {
    data: classesData,
    isError: isGetClassesError,
    error: getClassesError,
  } = useGetClassesOptionsQuery({
    input: {
      limit: 100,
    },
  });

  useEffect(() => {
    if (isGetClassesError) {
      setError('classId', {
        message: 'Erreur lors de la récupération des classes',
      });
    } else {
      clearErrors('classId');
    }
  }, [isGetClassesError, getClassesError, setError]);
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Scolarité
      </h3>
      <GridForm>
        <Field>
          <FieldLabel htmlFor="matricule">Matricule</FieldLabel>
          <Input
            {...register('matricule')}
            aria-invalid={!!errors.matricule}
            placeholder="STU-..."
            id="matricule"
          />
          <FieldError>{errors.matricule?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel>Classe</FieldLabel>
          <Controller
            control={control}
            name="classId"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="h-8!">
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectGroup>
                    {classesData?.getSchoolClasses.data?.map((cls) => (
                      <SelectItem
                        className="font-poppins text-xs"
                        key={cls?.id}
                        value={cls?.id!}
                      >
                        {cls?.name}{' '}
                        <span className="text-primary">{cls?.level}</span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <FieldError>{errors.classId?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel>Année d'inscription</FieldLabel>
          <Controller
            control={control}
            name="enrollmentYear"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="h-10!">
                  <SelectValue placeholder="Sélectionner l'année" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
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
        {mode === 'FULL_EDIT' && (
          <>
            <Field>
              <FieldLabel>Moyen de transport</FieldLabel>
              <Controller
                control={control}
                name="transportMode"
                render={({ field: { onChange, value } }) => (
                  <Select onValueChange={onChange} value={value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Moto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BUS">Bus scolaire</SelectItem>
                      <SelectItem value="MOTO">Moto personnel</SelectItem>
                      <SelectItem value="TAXI">Taxi</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field>
              <FieldLabel>Date d'inscription</FieldLabel>
              <Controller
                control={control}
                name="enrollmentDate"
                render={({ field: { onChange, value } }) => (
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger
                      render={
                        <Button
                          variant="outline"
                          id="date"
                          className="w-full justify-between font-normal h-10"
                          aria-invalid={!!errors.birthDate}
                        >
                          {value
                            ? new Date(value).toLocaleDateString()
                            : 'Sélectionner la date'}
                          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      }
                    ></PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 bg-accent"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={value ? new Date(value) : undefined}
                        captionLayout="dropdown"
                        startMonth={new Date(1990, 0)}
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
            <Field>
              <FieldLabel>École de provenance</FieldLabel>
              <Input
                {...register('previousSchool')}
                placeholder="Nom de l'ècole"
                aria-invalid={!!errors.previousSchool?.message}
              />
            </Field>
          </>
        )}
      </GridForm>
    </div>
  );
}
