'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTable = void 0;
exports.TableProvider = TableProvider;
const react_1 = require("react");
const nuqs_1 = require("nuqs");
const TableContext = (0, react_1.createContext)(undefined);
function TableProvider({ children }) {
    const [pagination, setPagination] = (0, nuqs_1.useQueryStates)({
        pageIndex: nuqs_1.parseAsInteger.withDefault(0),
        pageSize: nuqs_1.parseAsInteger.withDefault(10),
    }, {
        history: 'push',
    });
    const [searchTerm, setSearchTerm] = (0, nuqs_1.useQueryState)('student_search', nuqs_1.parseAsString.withDefault(''));
    const [classId, setClassId] = (0, nuqs_1.useQueryState)('classId', { defaultValue: '' });
    const [level, setLevel] = (0, nuqs_1.useQueryState)('level', { defaultValue: '' });
    const [rowSelection, setRowSelection] = (0, react_1.useState)({});
    const [columnVisibility, setColumnVisibility] = (0, react_1.useState)({
        info: true,
        select: true,
        phoneNumber: true,
        classes: true,
        speciality: true,
    });
    const filters = {
        classId,
        level,
    };
    const setFilters = async (updates) => {
        if ('classId' in updates)
            await setClassId(updates.classId ?? null);
        if ('level' in updates)
            await setLevel(updates.level ?? null);
    };
    const clearFilters = async () => {
        await setClassId('');
        await setLevel('');
    };
    const value = {
        pagination,
        setPagination,
        searchTerm,
        setSearchTerm,
        filters,
        clearFilters,
        setFilters,
        rowSelection,
        setRowSelection,
        columnVisibility,
        setColumnVisibility,
    };
    return (<TableContext.Provider value={value}>{children}</TableContext.Provider>);
}
const useTable = () => {
    const context = (0, react_1.useContext)(TableContext);
    if (context === undefined) {
        throw new Error('useTable must be used within a TableProvider');
    }
    return context;
};
exports.useTable = useTable;
//# sourceMappingURL=table-provider.js.map