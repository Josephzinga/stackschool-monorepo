'use client';
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SuccessStep;
const react_1 = __importStar(require("react"));
const navigation_1 = require("next/navigation");
const react_use_1 = require("react-use");
const gsap_1 = __importDefault(require("gsap"));
const ui_1 = require("@stackschool/ui");
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
const button_1 = require("@/components/ui/button");
const react_confetti_1 = __importDefault(require("react-confetti"));
function SuccessStep() {
    const router = (0, navigation_1.useRouter)();
    const { school, clearAllData, profile } = (0, ui_1.useCompleteProfileStore)();
    const { width, height } = (0, react_use_1.useWindowSize)();
    const [showConfetti, setShowConfetti] = (0, react_1.useState)(false);
    const containerRef = (0, react_1.useRef)(null);
    const iconRef = (0, react_1.useRef)(null);
    const titleRef = (0, react_1.useRef)(null);
    const textRef = (0, react_1.useRef)(null);
    const buttonRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const tl = gsap_1.default.timeline({ defaults: { ease: 'power3.out' } });
        tl.set(containerRef.current, { visibility: 'visible' })
            .fromTo(iconRef.current, { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)' })
            .fromTo(titleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.8')
            .fromTo(textRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
            .call(() => setShowConfetti(true), undefined, '-=0.2')
            .fromTo(buttonRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5 }, '+=0.2');
        const timer = setTimeout(() => setShowConfetti(false), 7000);
        return () => clearTimeout(timer);
    }, []);
    const handleGoToDashboard = async () => {
        await clearAllData();
        router.push('/dashboard');
    };
    const firstName = profile?.firstname || 'Utilisateur';
    const schoolName = school?.schoolSelected?.name || 'votre établissement';
    return (<div className="h-screen w-full flex justify-center items-center bg-linear-to-tr from-blue-500 via-purple-500 to-purple-200">
      {showConfetti && (<react_confetti_1.default height={height} width={width} numberOfPieces={500} friction={1} gravity={0.4} colors={['red', 'green', 'blue', 'purple', 'yellow']}/>)}
      <div className="rounded-xl relative max-w-xl mx-auto text-center border-none shadow-none sm:border sm:shadow-sm overflow-hidden  z-10 bg-white/90 backdrop-blur-sm">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-blue-500 via-emerald-500 to-blue-500"/>

        <card_1.CardContent className="pt-12 pb-8 px-8 flex flex-col items-center">
          
          <div ref={iconRef} className="mb-8 relative">
            <div className="absolute inset-0 bg-green-100 rounded-full scale-150 blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-white p-4 rounded-full shadow-md z-10">
              <lucide_react_1.CheckCircle2 className="w-20 h-20 text-green-600" strokeWidth={1.5}/>
            </div>
          </div>

          
          <h2 ref={titleRef} className="text-4xl font-bold font-inter text-gray-900 mb-4 tracking-tight">
            Félicitations, {firstName} !
          </h2>
          <p ref={textRef} className="text-lg text-gray-600 font-poppins max-w-md mx-auto leading-relaxed">
            Votre profil est terminé. Bienvenue dans l'espace numérique de{' '}
            <span className="font-semibold text-blue-700">{schoolName}</span>.
          </p>
        </card_1.CardContent>

        <card_1.CardFooter ref={buttonRef} className="flex flex-col sm:flex-row justify-center gap-4 pb-10 px-8">
          <button_1.Button size="lg" onClick={handleGoToDashboard} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-lg h-14 px-8 gap-3 shadow-lg shadow-blue-600/20 transition-transform hover:scale-105 active:scale-95">
            <lucide_react_1.LayoutDashboard className="w-5 h-5"/>
            Accéder à mon Tableau de bord
            <lucide_react_1.ArrowRight className="w-5 h-5 ml-1 opacity-70"/>
          </button_1.Button>
        </card_1.CardFooter>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map