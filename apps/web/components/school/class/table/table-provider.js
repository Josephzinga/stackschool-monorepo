'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassTable = void 0;
exports.TableProvider = TableProvider;
const react_1 = require("react");
const react_use_1 = require("react-use");
const TableContext = (0, react_1.createContext)(undefined);
function TableProvider({ children }) {
    const [pagination, setPagination] = (0, react_1.useState)({
        pageIndex: 0,
        pageSize: 10,
    });
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [filters, setFilters] = (0, react_1.useState)({});
    const [rowSelection, setRowSelection] = (0, react_1.useState)({});
    const { width } = (0, react_use_1.useWindowSize)();
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
    (0, react_1.useEffect)(() => { }, []);
    return (<TableContext.Provider value={value}>{children}</TableContext.Provider>);
}
const useClassTable = () => {
    const context = (0, react_1.useContext)(TableContext);
    if (context === undefined) {
        throw new Error('useTable must be used within a TableProvider');
    }
    return context;
};
exports.useClassTable = useClassTable;
//# sourceMappingURL=table-provider.js.map