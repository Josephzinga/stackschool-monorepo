"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teacherResolvers = void 0;
const teacher_resolver_1 = require("./teacher.resolver");
const teacher_mutation_resolver_1 = require("./teacher-mutation.resolver");
const teacher_query_resolver_1 = require("./teacher-query.resolver");
exports.teacherResolvers = {
    ...teacher_resolver_1.teacherResolver,
    ...teacher_mutation_resolver_1.teacherMutationResolver,
    ...teacher_query_resolver_1.teacherQueryResolver,
};
//# sourceMappingURL=index.js.map