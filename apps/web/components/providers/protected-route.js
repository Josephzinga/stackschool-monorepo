'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProtectedRoute;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const ui_1 = require("@stackschool/ui");
const spinner_1 = require("@/components/ui/spinner");
const shared_1 = require("@stackschool/shared");
function ProtectedRoute({ children, }) {
    const router = (0, navigation_1.useRouter)();
    const pathname = (0, navigation_1.usePathname)();
    const { setUser, currentSchool, user, setCurrentSchool } = (0, ui_1.useUserStore)();
    const { data, isLoading, error } = (0, ui_1.useGetMeQuery)({}, { retry: false });
    let currentUser = '';
    (0, react_1.useEffect)(() => {
        if (!isLoading && (!data?.me || error)) {
            if (!pathname.startsWith('/auth')) {
                router.replace('/auth/login');
            }
            return;
        }
        if (data?.me?.memberships && currentSchool) {
            for (const member of data?.me?.memberships) {
                if (member?.school?.id === currentSchool?.id) {
                    setCurrentSchool(member?.school);
                    shared_1.api.defaults.headers.common['x-school-id'] = member?.school.id;
                }
                else {
                    setCurrentSchool(data?.me?.memberships[0]?.school);
                }
            }
        }
        if (data?.me) {
            setUser(data.me);
            const isProfileComplete = data.me.profileCompleted && data.me.hasMembership;
            const isOnCompleteProfile = pathname === '/auth/complete-profile';
            const isOnAuthPage = pathname.startsWith('/auth') && !isOnCompleteProfile;
            const isOnSelectSchool = pathname === '/dashboard/select-school';
            if (!isProfileComplete && !isOnCompleteProfile && !isOnAuthPage) {
                router.replace('/auth/complete-profile');
                return;
            }
            console.log('data', data.me.memberships);
            if (isProfileComplete) {
                if (isOnCompleteProfile || isOnAuthPage) {
                    router.replace(`/dashboard/admin`);
                    return;
                }
                const memberships = data.me.memberships || [];
                if (!currentSchool && !isOnSelectSchool) {
                    if (memberships.length === 1) {
                        setCurrentSchool(memberships[0]?.school);
                    }
                    else if (memberships.length > 1) {
                        router.replace('/school/select-school');
                        return;
                    }
                    else {
                        router.replace('/auth/complete-profile');
                        return;
                    }
                }
            }
        }
    }, [
        isLoading,
        router,
        data,
        error,
        pathname,
        setUser,
        currentSchool,
        setCurrentSchool,
    ]);
    if (isLoading) {
        return (<div className="h-screen w-full flex items-center justify-center bg-background">
        <spinner_1.Spinner className="h-8 w-8 text-primary"/>
      </div>);
    }
    return <>{children}</>;
}
//# sourceMappingURL=protected-route.js.map