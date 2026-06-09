"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const table_header_1 = require("@/components/school/attendance/table/table-header");
const page1_1 = require("@/app/(routes)/list/attendances/page1");
function Page() {
    return (<div className="h-full w-full flex justify-center py-4 px-4 md:px-6">
      <div className="flex flex-col gap-4 w-full max-w-7xl">
        <table_header_1.TableHeader />
        <page1_1.AttendanceDashboard />
      </div>
    </div>);
}
exports.default = Page;
//# sourceMappingURL=page.js.map