"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMode = exports.TransportMode = exports.SubjectSortField = exports.SubjectCategory = exports.StudentStatus = exports.StudentSortField = exports.SortOrder = exports.SchoolRole = exports.ResourceMode = exports.RelationType = exports.LessonStatus = exports.GroupType = exports.Gender = exports.DisciplinaryType = exports.Day = exports.ContactPreference = exports.AttendanceStatus = exports.AssessmentType = exports.AssessmentStatus = void 0;
const generated_1 = require("@stackschool/db/src/prisma/client/generated");
Object.defineProperty(exports, "StudentStatus", { enumerable: true, get: function () { return generated_1.StudentStatus; } });
const generated_2 = require("@stackschool/db/src/prisma/client/generated");
Object.defineProperty(exports, "Gender", { enumerable: true, get: function () { return generated_2.Gender; } });
const generated_3 = require("@stackschool/db/src/prisma/client/generated");
Object.defineProperty(exports, "Day", { enumerable: true, get: function () { return generated_3.Day; } });
const generated_4 = require("@stackschool/db/src/prisma/client/generated");
Object.defineProperty(exports, "LessonStatus", { enumerable: true, get: function () { return generated_4.LessonStatus; } });
const generated_5 = require("@stackschool/db/src/prisma/client/generated");
Object.defineProperty(exports, "TransportMode", { enumerable: true, get: function () { return generated_5.TransportMode; } });
const generated_6 = require("@stackschool/db/src/prisma/client/generated");
Object.defineProperty(exports, "SubjectCategory", { enumerable: true, get: function () { return generated_6.SubjectCategory; } });
const generated_7 = require("@stackschool/db/src/prisma/client/generated");
Object.defineProperty(exports, "RelationType", { enumerable: true, get: function () { return generated_7.RelationType; } });
const generated_8 = require("@stackschool/db/src/prisma/client/generated");
Object.defineProperty(exports, "GroupType", { enumerable: true, get: function () { return generated_8.GroupType; } });
var AssessmentStatus;
(function (AssessmentStatus) {
    AssessmentStatus["Closed"] = "CLOSED";
    AssessmentStatus["Draft"] = "DRAFT";
    AssessmentStatus["Published"] = "PUBLISHED";
})(AssessmentStatus || (exports.AssessmentStatus = AssessmentStatus = {}));
var AssessmentType;
(function (AssessmentType) {
    AssessmentType["Assignment"] = "ASSIGNMENT";
    AssessmentType["Exam"] = "EXAM";
    AssessmentType["Oral"] = "ORAL";
    AssessmentType["Practical"] = "PRACTICAL";
    AssessmentType["Quiz"] = "QUIZ";
    AssessmentType["Test"] = "TEST";
})(AssessmentType || (exports.AssessmentType = AssessmentType = {}));
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["Absent"] = "ABSENT";
    AttendanceStatus["Excused"] = "EXCUSED";
    AttendanceStatus["Late"] = "LATE";
    AttendanceStatus["Present"] = "PRESENT";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
var ContactPreference;
(function (ContactPreference) {
    ContactPreference["Email"] = "EMAIL";
    ContactPreference["Phone"] = "PHONE";
    ContactPreference["Whatsapp"] = "WHATSAPP";
})(ContactPreference || (exports.ContactPreference = ContactPreference = {}));
var DisciplinaryType;
(function (DisciplinaryType) {
    DisciplinaryType["Expulsion"] = "EXPULSION";
    DisciplinaryType["Suspension"] = "SUSPENSION";
    DisciplinaryType["Warning"] = "WARNING";
})(DisciplinaryType || (exports.DisciplinaryType = DisciplinaryType = {}));
var ResourceMode;
(function (ResourceMode) {
    ResourceMode["Class"] = "CLASS";
    ResourceMode["Teacher"] = "TEACHER";
})(ResourceMode || (exports.ResourceMode = ResourceMode = {}));
var SchoolRole;
(function (SchoolRole) {
    SchoolRole["Admin"] = "ADMIN";
    SchoolRole["Parent"] = "PARENT";
    SchoolRole["Staff"] = "STAFF";
    SchoolRole["Student"] = "STUDENT";
    SchoolRole["Teacher"] = "TEACHER";
})(SchoolRole || (exports.SchoolRole = SchoolRole = {}));
var SortOrder;
(function (SortOrder) {
    SortOrder["Asc"] = "ASC";
    SortOrder["Desc"] = "DESC";
})(SortOrder || (exports.SortOrder = SortOrder = {}));
var StudentSortField;
(function (StudentSortField) {
    StudentSortField["EnrolementYear"] = "enrolementYear";
    StudentSortField["Firstname"] = "firstname";
    StudentSortField["Lastname"] = "lastname";
})(StudentSortField || (exports.StudentSortField = StudentSortField = {}));
var SubjectSortField;
(function (SubjectSortField) {
    SubjectSortField["Coefficient"] = "coefficient";
    SubjectSortField["Name"] = "name";
    SubjectSortField["Ponderation"] = "ponderation";
})(SubjectSortField || (exports.SubjectSortField = SubjectSortField = {}));
var UpdateMode;
(function (UpdateMode) {
    UpdateMode["Connect"] = "CONNECT";
    UpdateMode["Create"] = "CREATE";
})(UpdateMode || (exports.UpdateMode = UpdateMode = {}));
//# sourceMappingURL=types.generated.js.map