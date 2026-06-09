"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetcher = void 0;
const shared_1 = require("@stackschool/shared");
const fetcher = (query, variables, options) => {
    return async () => {
        try {
            const res = await shared_1.api.post('/graphql', {
                query,
                variables,
                options,
            });
            const { data, errors } = res.data;
            if (errors && errors.length > 0) {
                const errorMessage = errors[0]?.message || 'Erreur GraphQL inconnue';
                const error = new Error(errorMessage);
                error.graphQLErrors = errors;
                throw error;
            }
            return data;
        }
        catch (error) {
            if (error.response) {
                const serverError = error.response.data?.errors?.[0]?.message || error.response.statusText;
                throw new Error(serverError);
            }
            throw error;
        }
    };
};
exports.fetcher = fetcher;
//# sourceMappingURL=graphql-fetcher.js.map