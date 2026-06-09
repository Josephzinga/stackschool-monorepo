'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDebounce = void 0;
const react_1 = require("react");
const useDebounce = (value, delay = 300) => {
    const [debounced, setDebounced] = (0, react_1.useState)(value);
    (0, react_1.useEffect)(() => {
        const handler = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debounced?.trim() === '' && debounced?.length > 1 ? null : debounced;
};
exports.useDebounce = useDebounce;
//# sourceMappingURL=useDebounce.js.map