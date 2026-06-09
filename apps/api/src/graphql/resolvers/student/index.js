"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentResolvers = void 0;
const student_mutation_resolver_1 = require("./student-mutation.resolver");
const student_query_resolver_1 = require("./student-query.resolver");
const student_resolver_1 = require("./student.resolver");
exports.studentResolvers = {
    ...student_mutation_resolver_1.studentMutationResolver,
    ...student_resolver_1.studentResolver,
    ...student_query_resolver_1.studentQueryResolver,
};
//# sourceMappingURL=index.js.map