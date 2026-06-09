import { PersistedClient } from '@tanstack/react-query-persist-client';
export declare function createIDBPersister(idbValidKey?: IDBValidKey): {
    persistClient: (client: PersistedClient) => Promise<void>;
    restoreClient: () => Promise<PersistedClient | undefined>;
    removeClient: () => Promise<void>;
};
//# sourceMappingURL=idb-keyval-setup.d.ts.map