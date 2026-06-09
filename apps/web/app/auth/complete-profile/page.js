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
exports.default = CompleteProfile;
const schoolStep_1 = __importDefault(require("../../../components/complete-profile/schoolStep"));
const Container_1 = require("@/components/Container");
const ui_1 = require("@stackschool/ui");
const protected_route_1 = __importDefault(require("@/components/providers/protected-route"));
const Stepper_1 = __importDefault(require("@/components/Stepper"));
const RoleStep_1 = __importDefault(require("@/components/complete-profile/RoleStep"));
const React = __importStar(require("react"));
const react_1 = require("react");
const review_step_1 = __importDefault(require("@/components/complete-profile/review-step"));
const card_1 = require("@/components/ui/card");
const profile_step_1 = require("@/components/complete-profile/profile-step");
const sonner_1 = require("sonner");
function CompleteProfile() {
    const { isAuthenticated } = (0, ui_1.useUserStore)();
    const { currentStep, error, setCurrentStep, loadFromRedis, setError } = (0, ui_1.useCompleteProfileStore)();
    const steps = ['école', 'Profile', 'Rôle'];
    const totalSteps = steps.length;
    (0, react_1.useEffect)(() => {
        loadFromRedis();
    }, []);
    React.useEffect(() => {
        if (error) {
            sonner_1.toast.error(error);
            setError(null);
        }
    }, [error, setError, currentStep]);
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <schoolStep_1.default />;
            case 2:
                return <profile_step_1.ProfileStep />;
            case 3:
                return <RoleStep_1.default />;
            case 4:
                return <review_step_1.default />;
        }
    };
    return (<protected_route_1.default>
      <Container_1.Container className="flex justify-center items-center">
        <div>
          <div className="w-full flex flex-col justfy-center items-center ">
            <Stepper_1.default className="w-full h-15" setCurrentStep={setCurrentStep} currentStep={currentStep} steps={steps}/>
          </div>

          
          <div className="w-full flex justify-center py-8 md:py-12 overflow-y">
            <card_1.Card className="w-full p-6 md:w-md lg:w-lg min-h-150 ">
              {renderStepContent()}
            </card_1.Card>
          </div>
        </div>
      </Container_1.Container>
    </protected_route_1.default>);
}
{
}
//# sourceMappingURL=page.js.map