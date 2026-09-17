import React from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { GridForm } from '@/components/lists/grid-form';
import {
  CreateLessonSchema,
  dayConstants,
  UpdateLessonSchema,
} from '@stackschool/contracts';
import { TimeInput } from '@/components/time-input';
import {
  ClassSubjectData,
  SubjectData,
} from '@/components/lists/lesson/hooks/useLessonForm';

// Radix Select rejects an empty-string value on SelectItem — the original
// code used value="" for the "no options" placeholder rows, which throws at
// render time. Using a sentinel instead and disabling the item avoids that.
const EMPTY_OPTION_VALUE = '__none__';

interface LessonFormFieldsProps {
  control: Control<CreateLessonSchema | UpdateLessonSchema>;
  register: UseFormRegister<CreateLessonSchema | UpdateLessonSchema>;
  errors: FieldErrors<CreateLessonSchema>;
  setValue: UseFormSetValue<CreateLessonSchema | UpdateLessonSchema>;
  isClassMode: boolean;
  uniqueSubjects: SubjectData[];
  uniqueSecondary: ClassSubjectData[];
  selectedSubjectId: string | undefined;
  handleSubjectChange: (val: string, onChange: any) => void;
  handleSecondaryChange: (val: string, onChange: any) => void;
}

export function LessonFormFields({
  control,
  register,
  errors,
  setValue,
  isClassMode,
  uniqueSubjects,
  uniqueSecondary,
  selectedSubjectId,
  handleSubjectChange,
  handleSecondaryChange,
}: LessonFormFieldsProps) {
  return (
    <div className="space-y-2">
      <GridForm className="w-full">
        <Field>
          <FieldLabel>Matière</FieldLabel>
          <Controller
            control={control}
            name="subjectId"
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(val) => {
                  if (val) handleSubjectChange(val, field.onChange);
                }}
                itemToStringLabel={(itemValue) => {
                  const item = uniqueSubjects.find(
                    (sub) => sub.id === itemValue,
                  );
                  return `${item?.name}`;
                }}
              >
                <SelectTrigger aria-invalid={!!errors?.subjectId}>
                  <SelectValue placeholder="Sélectionné une matière" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Matière</SelectLabel>
                    {selectedSubjectId && selectedSubjectId !== '' && (
                      <>
                        <Button
                          variant="ghost"
                          onClick={() => setValue('groupId', '')}
                        >
                          Toute les matières
                        </Button>
                        <SelectSeparator />
                      </>
                    )}
                    {uniqueSubjects.length > 0 ? (
                      uniqueSubjects.map((sub) => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.name}{' '}
                          <span className="text-secondary">{sub.code}</span>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem
                        value={EMPTY_OPTION_VALUE}
                        disabled
                        className="text-gray-600"
                      >
                        Aucune matière assigné
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <FieldError>{errors?.subjectId?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>{isClassMode ? 'Enseignant' : 'Classe'}</FieldLabel>
          <Controller
            control={control}
            name={isClassMode ? 'teacherId' : 'groupId'}
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(val) =>
                  handleSecondaryChange(val ?? '', field.onChange)
                }
                itemToStringLabel={(itemValue) => {
                  if (itemValue) {
                    const item = isClassMode
                      ? uniqueSecondary.find(
                          (sec) => sec.teacher?.id === itemValue,
                        )
                      : uniqueSecondary.find(
                          (sec) => sec.group?.id === itemValue,
                        );
                    return isClassMode
                      ? `${item?.teacher?.firstName} ${item?.teacher?.lastName}`
                      : item?.group?.name!;
                  }
                  return isClassMode
                    ? 'Sélectionner un enseignant'
                    : 'Sélectionner une classe';
                }}
              >
                <SelectTrigger
                  aria-invalid={
                    isClassMode ? !!errors.teacherId : !!errors.groupId
                  }
                >
                  <SelectValue
                    placeholder={
                      isClassMode
                        ? 'Sélectionner un enseignant'
                        : 'Sélectionner une classe'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {isClassMode ? 'Enseignants' : 'Classes'}
                    </SelectLabel>
                    {selectedSubjectId && selectedSubjectId !== '' && (
                      <>
                        <Button
                          onClick={() => setValue('subjectId', '')}
                          variant="ghost"
                        >
                          {isClassMode
                            ? 'Tous les enseignants'
                            : 'Toutes les classes'}
                        </Button>
                        <SelectSeparator />
                      </>
                    )}
                    {uniqueSecondary.length > 0 ? (
                      uniqueSecondary.map((cs) => (
                        <SelectItem
                          key={isClassMode ? cs?.teacher?.id : cs?.group?.id}
                          value={
                            (isClassMode ? cs?.teacher?.id : cs?.group?.id)!
                          }
                        >
                          {isClassMode
                            ? `${cs?.teacher?.firstName} ${cs?.teacher?.lastName}`
                            : cs?.group?.type === 'SOLO'
                              ? cs?.group?.classes?.[0]?.name
                              : cs?.group?.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value={EMPTY_OPTION_VALUE} disabled>
                        {!isClassMode
                          ? 'Aucune classe assignée'
                          : 'Aucun enseignant assigné'}
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {uniqueSecondary.length === 0 && (
            <Button className="py-0" variant="link" type="button">
              {isClassMode ? 'Assigner un enseignant' : ''}
            </Button>
          )}
          <FieldError>
            {isClassMode ? errors?.teacherId?.message : errors.groupId?.message}
          </FieldError>
        </Field>
      </GridForm>

      <Field>
        <FieldLabel>Jour</FieldLabel>
        <Controller
          control={control}
          name="day"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Jour" />
              </SelectTrigger>
              <SelectContent>
                {dayConstants.map((day) => (
                  <SelectItem key={day.value} value={day.value}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError>{errors.day?.message}</FieldError>
      </Field>

      <GridForm>
        <Field>
          <FieldLabel>Début</FieldLabel>
          <TimeInput
            {...register('startTime')}
            aria-invalid={!!errors?.startTime}
          />
          <FieldError>{errors.startTime?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel>Fin</FieldLabel>
          <TimeInput
            {...register('endTime')}
            aria-invalid={!!errors?.endTime}
          />
          <FieldError>{errors.endTime?.message}</FieldError>
        </Field>
      </GridForm>
    </div>
  );
}
