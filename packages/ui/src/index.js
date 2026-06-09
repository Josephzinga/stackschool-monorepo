"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistQueryClientProvider = exports.useQueryClient = exports.useQuery = exports.QueryClient = exports.QueryClientProvider = exports.clsx = exports.zodResolver = void 0;
__exportStar(require("react-hook-form"), exports);
var zod_1 = require("@hookform/resolvers/zod");
Object.defineProperty(exports, "zodResolver", { enumerable: true, get: function () { return zod_1.zodResolver; } });
var clsx_1 = require("clsx");
Object.defineProperty(exports, "clsx", { enumerable: true, get: function () { return clsx_1.clsx; } });
__exportStar(require("./store/complete-profile-store"), exports);
__exportStar(require("./store/user-store"), exports);
__exportStar(require("./lib/get-safe-me"), exports);
__exportStar(require("./lib/relation-types"), exports);
__exportStar(require("./constant/role"), exports);
__exportStar(require("./constant/student-status"), exports);
var react_query_1 = require("@tanstack/react-query");
Object.defineProperty(exports, "QueryClientProvider", { enumerable: true, get: function () { return react_query_1.QueryClientProvider; } });
Object.defineProperty(exports, "QueryClient", { enumerable: true, get: function () { return react_query_1.QueryClient; } });
Object.defineProperty(exports, "useQuery", { enumerable: true, get: function () { return react_query_1.useQuery; } });
Object.defineProperty(exports, "useQueryClient", { enumerable: true, get: function () { return react_query_1.useQueryClient; } });
var react_query_persist_client_1 = require("@tanstack/react-query-persist-client");
Object.defineProperty(exports, "PersistQueryClientProvider", { enumerable: true, get: function () { return react_query_persist_client_1.PersistQueryClientProvider; } });
__exportStar(require("./generated/graphql"), exports);
//# sourceMappingURL=index.js.map