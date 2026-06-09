"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classResolvers = void 0;
const class_resolver_1 = require("./class.resolver");
const class_mutation_resolver_1 = require("./class-mutation.resolver");
const class_query_resolver_1 = require("./class-query.resolver");
exports.classResolvers = {
    ...class_resolver_1.classResolver,
    ...class_mutation_resolver_1.classMutationResolver,
    ...class_query_resolver_1.classQueryResolver,
};
//# sourceMappingURL=index.js.map