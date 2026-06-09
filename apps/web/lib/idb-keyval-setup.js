"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIDBPersister = createIDBPersister;
const idb_keyval_1 = require("idb-keyval");
function createIDBPersister(idbValidKey = 'reactQuery') {
    return {
        persistClient: async (client) => {
            await (0, idb_keyval_1.set)(idbValidKey, client);
        },
        restoreClient: async () => {
            return await (0, idb_keyval_1.get)(idbValidKey);
        },
        removeClient: async () => {
            await (0, idb_keyval_1.del)(idbValidKey);
        },
    };
}
//# sourceMappingURL=idb-keyval-setup.js.map