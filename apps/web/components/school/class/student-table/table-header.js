'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassStudentTableHeader = ClassStudentTableHeader;
const input_1 = require("@/components/ui/input");
const nuqs_1 = require("nuqs");
function ClassStudentTableHeader() {
    const [search, setSearch] = (0, nuqs_1.useQueryState)('search', nuqs_1.parseAsString.withDefault(''));
    return (<div className="w-full flex items-center mb-4">
      <input_1.Input className="max-w-80" value={search} placeholder="Rechercher un élève..." onChange={(e) => setSearch(e.target.value)}/>
    </div>);
}
//# sourceMappingURL=table-header.js.map