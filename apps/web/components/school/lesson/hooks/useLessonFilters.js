'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLessonFilters = void 0;
const react_1 = require("react");
const lesson_store_1 = require("@/store/lesson-store");
const ui_1 = require("@stackschool/ui");
const useLessonFilters = () => {
    const { resourceMode, selectedFilter, advancedFilters, setSelectedFilter, setAdvancedFilter, clearAdvancedFilters, } = (0, lesson_store_1.useLessonStore)();
    const { data: teachers } = (0, ui_1.useGetTeacherOptionsQuery)({
        input: {
            limit: 100,
        },
    }, {
        enabled: resourceMode === 'TEACHER',
    });
    const { data: classes } = (0, ui_1.useGetClassesOptionsQuery)({
        input: {
            limit: 100,
        },
    });
    const teacherData = teachers?.getSchoolTeachers.data;
    const classData = classes?.getSchoolClasses.data?.map((c) => ({
        id: c?.group?.id,
        name: c?.group?.type === 'SOLO' ? c?.name : c.group?.name,
        level: c.level,
        section: c.section,
    }));
    const uniqueLevels = (0, react_1.useMemo)(() => {
        if (!classData)
            return [];
        const levels = new Set();
        classData.forEach((c) => {
            if (c?.level)
                levels.add(c?.level);
        });
        return Array.from(levels);
    }, [classData]);
    const uniqueSections = (0, react_1.useMemo)(() => {
        if (!classData)
            return [];
        const sections = new Set();
        classData.forEach((c) => {
            if (c?.section)
                sections.add(c.section);
        });
        return Array.from(sections);
    }, [classData]);
    const uniqueDepartments = (0, react_1.useMemo)(() => {
        if (!teacherData)
            return [];
        const depts = new Set();
        teacherData.forEach((t) => {
            if (t?.department)
                depts.add(t.department);
        });
        return Array.from(depts);
    }, [teacherData]);
    const hasActiveAdvancedFilters = (0, react_1.useMemo)(() => {
        if (resourceMode === 'CLASS') {
            return !!(advancedFilters.level || advancedFilters.section);
        }
        return !!advancedFilters.department;
    }, [resourceMode, advancedFilters]);
    return {
        resourceMode,
        selectedFilter,
        advancedFilters,
        teacherData,
        classData,
        uniqueLevels,
        uniqueSections,
        uniqueDepartments,
        hasActiveAdvancedFilters,
        setSelectedFilter,
        setAdvancedFilter,
        clearAdvancedFilters,
    };
};
exports.useLessonFilters = useLessonFilters;
//# sourceMappingURL=useLessonFilters.js.map