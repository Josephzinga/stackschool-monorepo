'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLessonEvents = void 0;
const react_1 = require("react");
const lesson_store_1 = require("@/store/lesson-store");
const ui_1 = require("@stackschool/ui");
const date_fns_1 = require("date-fns");
const shared_1 = require("@stackschool/shared");
const sonner_1 = require("sonner");
const lesson_calendar_1 = require("@/lib/lesson-calendar");
const useLessonCalendar_1 = require("@/components/school/lesson/hooks/useLessonCalendar");
const useLessonEvents = () => {
    const calendarRef = (0, react_1.useRef)(null);
    const { setTargetEventDrop, setAlertOpen, setLessonDialogOpen, setSelectedLessonData, resource, setResource, selectedFilter, } = (0, lesson_store_1.useLessonStore)();
    const { events, resources } = (0, useLessonCalendar_1.useLessonCalendar)();
    const updateMutate = (0, ui_1.useUpdateLessonMutation)();
    const createMutate = (0, ui_1.useCreateLessonMutation)();
    const handleCalendarMount = (0, react_1.useCallback)((calendar) => {
        calendarRef.current = calendar;
    }, []);
    const checkConflicts = (0, react_1.useCallback)((eventId, newStart, newEnd, resourceId) => {
        const newEvent = {
            id: eventId,
            resourceId: resourceId,
            daysOfWeek: [(0, date_fns_1.getDay)(newStart)],
            startTime: (0, date_fns_1.format)(newStart, 'HH:mm'),
            endTime: (0, date_fns_1.format)(newEnd, 'HH:mm'),
        };
        const relevantEvents = events.filter((event) => event.resourceId === resourceId);
        return (0, lesson_calendar_1.checkEventConflicts)(newEvent, relevantEvents, eventId, newStart);
    }, [events]);
    const handleEventClick = (0, react_1.useCallback)((args) => {
        setSelectedLessonData({ mode: 'UPDATE', args });
        setLessonDialogOpen(true);
    }, [setSelectedLessonData, setLessonDialogOpen]);
    const handleEventSelect = (0, react_1.useCallback)((args) => {
        if (args.resource && !args.resource.id) {
            sonner_1.toast.error('Veuillez sélectionner une ressource');
            return;
        }
        if (!args.resource &&
            resources &&
            resources[0]?.id === selectedFilter?.id) {
            setResource({ id: selectedFilter?.id, title: resources[0].title });
        }
        setSelectedLessonData({ mode: 'CREATE', args });
        setLessonDialogOpen(true);
    }, [
        setSelectedLessonData,
        setLessonDialogOpen,
        selectedFilter,
        setResource,
        resources,
    ]);
    const handleEventDrop = (0, react_1.useCallback)((info) => {
        const { event, oldEvent, revert } = info;
        const newStart = event.start;
        const newEnd = event.end;
        if (!newStart || !newEnd)
            return;
        const resourceId = event.getResources()?.[0]?.id || resource.id;
        const subjectId = event.extendedProps?.subject?.id;
        const hasConflict = checkConflicts(event.id, newStart, newEnd, info?.event?.getResources()?.[0]?.id);
        if (hasConflict) {
            revert();
            sonner_1.toast.error('Ce créneau est déjà occupé par un autre cours', {
                toasterId: 'dashboard',
            });
            return;
        }
        const newDay = Object.keys(shared_1.dayMapping).find((key) => shared_1.dayMapping[key] === (0, date_fns_1.getDay)(newStart));
        const oldDay = Object.keys(shared_1.dayMapping).find((key) => shared_1.dayMapping[key] === (0, date_fns_1.getDay)(oldEvent.start));
        setTargetEventDrop({
            id: event.id,
            start: (0, date_fns_1.format)(newStart, 'HH:mm'),
            end: (0, date_fns_1.format)(newEnd, 'HH:mm'),
            day: newDay,
            resourceId,
            subjectId,
            originalStart: (0, date_fns_1.format)(oldEvent.start, 'HH:mm'),
            originalEnd: (0, date_fns_1.format)(oldEvent.end, 'HH:mm'),
            originalDay: oldDay,
            revertFunc: () => revert(),
        });
        setAlertOpen(true);
    }, [checkConflicts, setTargetEventDrop, setAlertOpen]);
    const handleEventResize = (0, react_1.useCallback)((info) => {
        const { event, oldEvent, revert } = info;
        const newStart = event.start;
        const newEnd = event.end;
        if (!newStart || !newEnd)
            return;
        const duration = (newEnd.getTime() - newStart.getTime()) / (1000 * 60);
        if (duration < 30) {
            revert();
            sonner_1.toast.error("La durée minimum d'un cours est de 30 minutes");
            return;
        }
        const resourceId = event.getResources()?.[0]?.id;
        const subjectId = event.extendedProps?.subject?.id;
        const hasConflict = checkConflicts(event.id, newStart, newEnd, resourceId);
        if (hasConflict) {
            revert();
            sonner_1.toast.error('Ce créneau est déjà occupé par un autre cours', {
                toasterId: 'dashboard',
            });
            return;
        }
        const newDay = Object.keys(shared_1.dayMapping).find((key) => shared_1.dayMapping[key] === (0, date_fns_1.getDay)(newStart));
        setTargetEventDrop({
            id: event.id,
            start: (0, date_fns_1.format)(newStart, 'HH:mm'),
            end: (0, date_fns_1.format)(newEnd, 'HH:mm'),
            day: newDay,
            resourceId,
            subjectId,
            originalStart: (0, date_fns_1.format)(oldEvent.start, 'HH:mm'),
            originalEnd: (0, date_fns_1.format)(oldEvent.end, 'HH:mm'),
            originalDay: Object.keys(shared_1.dayMapping).find((key) => shared_1.dayMapping[key] === (0, date_fns_1.getDay)(oldEvent.start)),
            revertFunc: () => revert(),
        });
        setAlertOpen(true);
    }, [checkConflicts, setTargetEventDrop, setAlertOpen]);
    return {
        calendarRef,
        handleCalendarMount,
        handleEventClick,
        handleEventSelect,
        handleEventDrop,
        handleEventResize,
        updateMutate,
        createMutate,
    };
};
exports.useLessonEvents = useLessonEvents;
//# sourceMappingURL=useLessonEvents.js.map