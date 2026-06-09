'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = QueryProvider;
const ui_1 = require("@stackschool/ui");
const react_1 = require("react");
const react_query_devtools_1 = require("@tanstack/react-query-devtools");
function QueryProvider({ children, }) {
    const [queryClient] = (0, react_1.useState)(() => new ui_1.QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5,
                gcTime: 1000 * 60 * 60 * 24,
            },
        },
    }));
    return (<ui_1.QueryClientProvider client={queryClient}>
      {children}
      <react_query_devtools_1.ReactQueryDevtools position="left" buttonPosition="bottom-left" initialIsOpen={false}/>
    </ui_1.QueryClientProvider>);
}
//# sourceMappingURL=queryClientProvider.js.map