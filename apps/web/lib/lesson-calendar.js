"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEventConflicts = exports.doRangesOverlap = exports.getEventDateTimeRange = void 0;
const date_fns_1 = require("date-fns");
const shared_1 = require("@stackschool/shared");
const getEventDateTimeRange = (event, referenceDate = shared_1.REFERENCE_DATE) => {
    const eventDayOfWeek = event.daysOfWeek?.[0] ?? (0, date_fns_1.getDay)(referenceDate);
    const currentDayOfWeek = (0, date_fns_1.getDay)(referenceDate);
    let daysToAdd = eventDayOfWeek - currentDayOfWeek;
    if (daysToAdd < 0)
        daysToAdd += 6;
    const startDate = new Date(referenceDate);
    startDate.setDate(referenceDate.getDate() + daysToAdd);
    const [startHours, startMinutes] = event.startTime?.split(':') || [
        '00',
        '00',
    ];
    startDate.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);
    const endDate = new Date(startDate);
    const [endHours, endMinutes] = event.endTime?.split(':') || ['00', '00'];
    endDate.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);
    return { startDate, endDate };
};
exports.getEventDateTimeRange = getEventDateTimeRange;
const doRangesOverlap = (start1, end1, start2, end2) => {
    return start1 < end2 && end1 > start2;
};
exports.doRangesOverlap = doRangesOverlap;
const checkEventConflicts = (newEvent, existingEvents, excludeEventId, specificDate) => {
    const referenceDate = specificDate || shared_1.REFERENCE_DATE;
    const newRange = (0, exports.getEventDateTimeRange)(newEvent, referenceDate);
    for (const existingEvent of existingEvents) {
        if (excludeEventId && existingEvent.id === excludeEventId)
            continue;
        const existingDayOfWeek = existingEvent.daysOfWeek?.[0];
        const newDayOfWeek = newEvent.daysOfWeek?.[0];
        if (existingDayOfWeek !== newDayOfWeek)
            continue;
        const existingRange = (0, exports.getEventDateTimeRange)(existingEvent, referenceDate);
        if ((0, exports.doRangesOverlap)(newRange.startDate, newRange.endDate, existingRange.startDate, existingRange.endDate)) {
            return true;
        }
    }
    return false;
};
exports.checkEventConflicts = checkEventConflicts;
//# sourceMappingURL=lesson-calendar.js.map