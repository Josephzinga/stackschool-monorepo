"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const table_provider_1 = require("@/components/school/subject/table/table-provider");
const subject_view_1 = require("@/app/(routes)/list/subjects/subject-view");
function SubjectsPage() {
    return (<table_provider_1.SubjectTableProvider>
      <subject_view_1.SubjectView />
    </table_provider_1.SubjectTableProvider>);
}
exports.default = SubjectsPage;
//# sourceMappingURL=page.js.map