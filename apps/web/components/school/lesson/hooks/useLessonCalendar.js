'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLessonCalendar = void 0;
const react_1 = require("react");
const lesson_store_1 = require("@/store/lesson-store");
const ui_1 = require("@stackschool/ui");
const date_fns_1 = require("date-fns");
const shared_1 = require("@stackschool/shared");
const constant_1 = require("@/constant");
const useLessonCalendar = () => {
    const { resourceMode, selectedFilter, advancedFilters, setLoading, setError, pagination, setPagination, isClassOnly, } = (0, lesson_store_1.useLessonStore)();
    const { data, isPending, isError, error } = (0, ui_1.useGetSchoolLessonsQuery)({
        filter: {
            classId: isClassOnly && selectedFilter?.type === 'CLASS'
                ? selectedFilter?.id
                : undefined,
            teacherId: selectedFilter?.type === 'TEACHER' ? selectedFilter?.id : undefined,
            groupId: !isClassOnly && selectedFilter?.type === 'CLASS'
                ? selectedFilter?.id
                : undefined,
            level: advancedFilters.level || undefined,
            section: advancedFilters.section || undefined,
            department: advancedFilters.department || undefined,
            hasLessonOnly: true,
            limit: pagination?.limit,
            page: pagination?.page,
            mode: resourceMode,
        },
    }, {
        enabled: isClassOnly ? !!selectedFilter?.id : true,
    });
    (0, react_1.useEffect)(() => {
        if (!data?.getLessons?.meta)
            return;
        setPagination(data?.getLessons?.meta);
    }, [data?.getLessons]);
    (0, react_1.useEffect)(() => {
        setLoading(isPending);
    }, [isPending, setLoading]);
    (0, react_1.useEffect)(() => {
        if (isError) {
            setError(error || 'Erreur lors du chargements des leçons.');
        }
    }, [isError, error, setError]);
    const events = (0, react_1.useMemo)(() => {
        return (data?.getLessons?.data?.events?.map((e) => ({
            id: e.id,
            resourceId: e.resourceId,
            title: e?.title,
            startTime: (0, date_fns_1.format)(new Date(e.startTime), 'HH:mm'),
            endTime: (0, date_fns_1.format)(new Date(e.endTime), 'HH:mm'),
            daysOfWeek: [shared_1.dayMapping[e.day]],
            backgroundColor: constant_1.lessonStatusConfig[e.status ?? 'PLANNED'].color,
            extendedProps: {
                subject: e.subject,
                status: e.status,
                teacher: e.teacher,
                group: e?.group,
                mode: resourceMode,
                lessonId: e.id,
                groupName: e.group?.type === 'SOLO' ? e.group.classes[0]?.name : e.group?.name,
            },
        })) || []);
    }, [data]);
    const resources = (0, react_1.useMemo)(() => {
        if (!data?.getLessons?.data.resources)
            return null;
        return data?.getLessons?.data.resources.map((r) => ({
            id: r.id,
            title: r.title,
            extendedProps: {
                weeklyHours: r.weeklyHours,
            },
        }));
    }, [data?.getLessons?.data]);
    return {
        events,
        isLoading: isPending,
        isError,
        resources,
        error,
    };
};
exports.useLessonCalendar = useLessonCalendar;
//# sourceMappingURL=useLessonCalendar.js.map