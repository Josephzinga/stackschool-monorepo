'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSubjectTable = void 0;
exports.SubjectTableProvider = SubjectTableProvider;
const react_1 = require("react");
const TableContext = (0, react_1.createContext)(undefined);
function SubjectTableProvider({ children }) {
    const [pagination, setPagination] = (0, react_1.useState)({
        pageIndex: 0,
        pageSize: 10,
    });
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [filters, setFilters] = (0, react_1.useState)({});
    const [rowSelection, setRowSelection] = (0, react_1.useState)({});
    const [columnVisibility, setColumnVisibility] = (0, react_1.useState)({
        info: true,
        select: true,
        phoneNumber: true,
        classes: true,
        speciality: true,
    });
    const value = {
        pagination,
        setPagination,
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        rowSelection,
        setRowSelection,
        columnVisibility,
        setColumnVisibility,
    };
    return (<TableContext.Provider value={value}>{children}</TableContext.Provider>);
}
const useSubjectTable = () => {
    const context = (0, react_1.useContext)(TableContext);
    if (context === undefined) {
        throw new Error('useTable must be used within a SubjectTableProvider');
    }
    return context;
};
exports.useSubjectTable = useSubjectTable;
//# sourceMappingURL=table-provider.js.map