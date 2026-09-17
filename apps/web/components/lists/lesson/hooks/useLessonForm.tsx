import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, getDay } from 'date-fns';
import {
  CreateLessonSchema,
  Day,
  dayMapping,
  UpdateLessonSchema,
} from '@stackschool/contracts';
import {
  GroupType,
  LessonStatus,
  useGetClassSubjectsOptionQuery,
} from '@stackschool/ui';
import { useLessonStore } from '@/store/lesson-store';
import { useLessonMutations } from './useLessonMutations';

export interface SubjectData {
  id: string;
  code: string;
  name: string;
}
export interface ClassSubjectData {
  group: {
    id: string;
    name: string;
    type: GroupType;
    classes: {
      id: string;
      name: string;
      level: string;
    }[];
  } | null;
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  subject: SubjectData | null;
}

export function useLessonForm(onSuccess?: () => Promise<void>) {
  const { resourceMode, selectedLessonData, resource } = useLessonStore();
  const isClassMode = resourceMode === 'CLASS';
  const isUpdate = selectedLessonData?.mode === 'UPDATE';

  const { handleDelete, handleSubmitForm, handleUpdateStatus } =
    useLessonMutations();

  const eventData = isUpdate ? selectedLessonData?.data : null;
  const selectionData = !isUpdate ? selectedLessonData?.data : null;
  const subject = eventData?._def?.extendedProps?.subject as SubjectData;
  const teacher = eventData?._def?.extendedProps
    ?.teacher as ClassSubjectData['teacher'];
  const lessonId = eventData?._def?.extendedProps?.lessonId as string;
  const lessonStatus = eventData?._def?.extendedProps?.status as LessonStatus;

  const resourceTitle = isUpdate
    ? resourceMode === 'CLASS'
      ? eventData?.extendedProps?.groupName
      : `${teacher?.firstName} ${teacher?.lastName}`
    : selectionData?.resource?.title || resource.title;

  const start = eventData ? eventData.start : selectionData?.start;
  const end = eventData ? eventData.end : selectionData?.end;

  const activeResourceId = isUpdate
    ? eventData?._def.resourceIds?.[0]
    : selectionData?.resource?._resource?.id || resource.id;
  console.log('ActiveResourceId: ', activeResourceId, 'Resource: ', resource);

  const { data, isError, isPending } = useGetClassSubjectsOptionQuery(
    {
      input: {
        groupId: isClassMode ? activeResourceId : undefined,
        teacherId: !isClassMode ? activeResourceId : undefined,
      },
    },
    { enabled: !!activeResourceId },
  );

  const classSubjectData = useMemo(
    () =>
      (data?.getClassSubjects?.map((item) => ({
        teacher: item.assignment?.teacher
          ? {
              id: item.assignment?.teacher.id,
              firstName: item.assignment.teacher.schoolProfile?.firstName ?? '',
              lastName: item.assignment.teacher.schoolProfile?.lastName ?? '',
            }
          : null,
        subject: item.subject ?? null,
        group: item.group
          ? {
              ...item.group,
              type: item.group.type!,
              classes: item.group.classes ?? [],
            }
          : null,
      })) || []) satisfies ClassSubjectData[],
    [data, isError, isPending],
  );

  const buildDefaultValues = useCallback(
    () => ({
      id: lessonId || '',
      startTime: start ? format(start, 'HH:mm') : '',
      endTime: end ? format(end, 'HH:mm') : '',
      mode: resourceMode,
      day: start
        ? (Object.keys(dayMapping).find(
            (key) => dayMapping[key as Day] === getDay(start),
          ) as CreateLessonSchema['day'])
        : undefined,
      subjectId: subject?.id || '',
      teacherId: teacher?.id || '',
      groupId: eventData?.extendedProps?.group?.id || activeResourceId,
    }),
    [
      lessonId,
      start,
      end,
      resourceMode,
      subject?.id,
      teacher?.id,
      eventData,
      activeResourceId,
    ],
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    reset,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<CreateLessonSchema | UpdateLessonSchema>({
    resolver: zodResolver(isUpdate ? UpdateLessonSchema : CreateLessonSchema),
    defaultValues: buildDefaultValues(),
    mode: 'onChange',
  });
  console.log('GroupId: ', watch('groupId'));
  useEffect(() => {
    reset(buildDefaultValues());
  }, [lessonId, selectionData?.start, selectionData?.end, activeResourceId]);

  useEffect(() => {
    if (isError) {
      setError('subjectId', { message: 'Erreur de chargement des matières.' });
      setError('teacherId', {
        message: 'Erreur de chargement des enseignants.',
      });
    } else {
      clearErrors('subjectId');
      clearErrors('teacherId');
    }
  }, [isError, setError, clearErrors]);

  const selectedSubjectId = watch('subjectId');
  const selectedSecondaryId = watch(isClassMode ? 'teacherId' : 'groupId');

  const filteredSubjects = useMemo(() => {
    const all = classSubjectData || [];
    if (!selectedSecondaryId || selectedSecondaryId === '') return all;
    return all.filter((ass) =>
      resourceMode === 'CLASS'
        ? ass.teacher?.id === selectedSecondaryId
        : ass?.group?.id === selectedSecondaryId,
    );
  }, [classSubjectData, selectedSecondaryId, resourceMode]);

  const uniqueSubjects = useMemo(
    () =>
      Array.from(
        new Map(
          filteredSubjects?.map((item) => [item?.subject?.id, item?.subject!]),
        ).values(),
      ),
    [filteredSubjects],
  );

  const filteredSecondary = useMemo(() => {
    const all = classSubjectData || [];
    if (!selectedSubjectId || selectedSubjectId === '') return all;
    return all.filter((ass) => ass?.subject?.id === selectedSubjectId);
  }, [classSubjectData, selectedSubjectId]);

  const uniqueSecondary = useMemo(() => {
    const map = new Map<string, ClassSubjectData>();

    if (filteredSecondary.length === 0) return [];

    for (const item of filteredSecondary) {
      if (isClassMode) {
        if (!item.teacher) continue;
        if (map.has(item.teacher.id)) {
        } else {
          map.set(item.teacher.id, item);
        }
      } else {
        if (!item.group) continue;
        if (map.has(item.group.id)) {
        } else {
          map.set(item.group.id, item);
        }
      }
    }
    return Array.from(map.values());
  }, [filteredSecondary, isClassMode]);

  const handleSubjectChange = useCallback(
    (val: string, onChange: any) => {
      onChange(val);
      const matches =
        classSubjectData?.filter((cs) => cs?.subject?.id === val) || [];

      if (matches.length === 1) {
        const targetId =
          resourceMode === 'CLASS'
            ? matches?.[0]?.teacher?.id
            : matches[0]?.group?.id;
        setValue(resourceMode === 'CLASS' ? 'teacherId' : 'groupId', targetId);
      }
    },
    [classSubjectData, resourceMode, setValue],
  );

  const handleSecondaryChange = useCallback(
    (val: string, onChange: any) => {
      onChange(val);
      const matches =
        classSubjectData?.filter((cs) =>
          isClassMode ? cs?.teacher?.id === val : cs?.group?.id === val,
        ) || [];
      if (matches.length === 1 && matches?.[0]?.subject) {
        setValue('subjectId', matches[0].subject.id);
      }
    },
    [classSubjectData, isClassMode, setValue],
  );

  const onSubmit = async (
    formData: CreateLessonSchema | UpdateLessonSchema,
  ) => {
    const payload = isUpdate
      ? (Object.keys(dirtyFields).reduce((acc, key) => {
          Object.assign(acc, { [key]: (formData as any)[key] });
          return acc;
        }, {} as Partial<CreateLessonSchema>) as CreateLessonSchema)
      : (formData as CreateLessonSchema);

    await handleSubmitForm(payload, lessonId, isUpdate);
    await onSuccess?.();
  };

  return {
    // identity / mode
    isClassMode,
    isUpdate,
    resourceTitle,
    lessonId,
    lessonStatus,
    // query state
    isError,
    isPending,
    // form plumbing
    register,
    control,
    handleSubmit,
    setValue,
    errors,
    isDirty,
    onSubmit,
    // derived option lists
    uniqueSubjects,
    uniqueSecondary,
    selectedSubjectId,
    handleSubjectChange,
    handleSecondaryChange,
    // actions
    handleDelete,
    handleUpdateStatus,
  };
}
