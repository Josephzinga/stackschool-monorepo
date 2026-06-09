'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthFinish;
const Container_1 = require("@/components/Container");
const spinner_1 = require("@/components/ui/spinner");
const shared_1 = require("@stackschool/shared");
const lucide_react_1 = require("lucide-react");
const navigation_1 = require("next/navigation");
const react_1 = require("react");
function AuthFinish() {
    const router = (0, navigation_1.useRouter)();
    const [status, setStatus] = (0, react_1.useState)('loading');
    const [msg, setMsg] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        const checkAuth = async () => {
            try {
                const data = await shared_1.authServices.getMe();
                if (data?.user) {
                    const profile = data.user?.profile;
                    if (!profile || profile.firstname === '' || profile.lastname === '') {
                        setStatus('need_onboar');
                        router.replace(`/auth/complete-profile`);
                        return;
                    }
                    setStatus('ok');
                    router.replace('/dashboard');
                    return;
                }
                const refreshData = await shared_1.authServices.refresh();
                if (refreshData.ok) {
                    const data2 = await shared_1.authServices.getMe();
                    if (data2?.user) {
                        if (!data2?.user.profile || !data2.user?.profile.fistname) {
                            router.replace(`/auth/complete-profile?`);
                            return;
                        }
                        router.replace('/dashboard');
                        return;
                    }
                }
                setStatus('error');
                setMsg('Impossible de valider la connexion. Réessaie ou contacte le support.');
            }
            catch (error) {
                setStatus('error');
                setMsg('Erreur réseaux');
                console.log('Erreur refresh user:', error);
            }
        };
        checkAuth();
    }, [router]);
    return (<Container_1.Container>
      <div className="flex flex-col items-center gap-4 bg-gray-700/60 relative h-45  rounded-2xl">
        {status === 'loading' && (<>
            <spinner_1.Spinner className="absolut w-10 md:w-15 h-10 md:h-15 left-1/2 mt-4"/>
            <span className="text-xl animate-pulse font-medium px-3">
              Verification de la connexion via …
            </span>
          </>)}
        {status === 'error' && (<>
            <lucide_react_1.LucideOctagonX className="w-10 md:w-15 h-10 md:h-15 text-red-500"/>
            <span>{msg}</span>
          </>)}
      </div>
    </Container_1.Container>);
}
//# sourceMappingURL=page.js.map