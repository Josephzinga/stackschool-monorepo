"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classSubjectResolvers = void 0;
const classSubject_mutation_resolver_1 = require("./classSubject-mutation.resolver");
const classSubject_resolver_1 = require("./classSubject.resolver");
exports.classSubjectResolvers = {
    ...classSubject_mutation_resolver_1.classSubjectMutationResolver,
    ...classSubject_resolver_1.classSubjectResolver,
};
//# sourceMappingURL=index.js.map