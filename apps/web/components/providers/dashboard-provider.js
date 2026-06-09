'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDashboard = void 0;
exports.DashboardProvider = DashboardProvider;
const react_1 = require("react");
const ui_1 = require("@stackschool/ui");
const shared_1 = require("@stackschool/shared");
const lucide_react_1 = require("lucide-react");
const navigation_1 = require("next/navigation");
const DashboardContext = (0, react_1.createContext)(undefined);
function DashboardProvider({ children }) {
    const { currentSchool } = (0, ui_1.useUserStore)();
    const router = (0, navigation_1.useRouter)();
    const pathname = (0, navigation_1.usePathname)();
    const schoolId = currentSchool?.id;
    const { data, isLoading, error } = (0, ui_1.useGetDashboardContextQuery)({ input: schoolId }, {
        enabled: !!schoolId,
        staleTime: 1000 * 60 * 5,
    });
    const contextData = data?.me?.schoolContext;
    const role = contextData?.role;
    (0, react_1.useEffect)(() => {
        if (isLoading || !role)
            return;
        const roleRoutes = {
            ADMIN: '/dashboard/admin',
            TEACHER: '/dashboard/teacher',
            STUDENT: '/dashboard/student',
            PARENT: '/dashboard/parents',
        };
        const allowedRoute = roleRoutes[role];
        if (pathname === '/dashboard') {
            router.replace(allowedRoute || '/');
            return;
        }
        if (pathname.startsWith('/dashboard/admin') && role !== 'ADMIN') {
            router.replace(allowedRoute || '/dashboard');
        }
        if (pathname.startsWith('/dashboard/teacher') && role !== 'TEACHER') {
            router.replace(allowedRoute || '/dashboard');
        }
    }, [role, pathname, isLoading, router]);
    if (isLoading) {
        return (<div className="h-screen w-full flex items-center bg-gray-50 dark:bg-gray-900 animate-pulse justify-center">
        <lucide_react_1.LoaderCircleIcon className="h-15 w-15 animate-spin text-primary"/>
      </div>);
    }
    if (error || !contextData) {
        const { message } = (0, shared_1.parseAxiosError)(error);
        console.log('Error', message);
        return <div>Erreur de chargement du contexte école.</div>;
    }
    const value = {
        me: {
            schoolContext: contextData,
        },
    };
    return (<DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>);
}
const useDashboard = () => {
    const context = (0, react_1.useContext)(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};
exports.useDashboard = useDashboard;
//# sourceMappingURL=dashboard-provider.js.map