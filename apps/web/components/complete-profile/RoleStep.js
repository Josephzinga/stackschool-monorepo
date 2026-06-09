"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RoleStep;
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const react_1 = require("react");
const student_form_1 = __importDefault(require("@/components/complete-profile/role-form/student-form"));
const ui_1 = require("@stackschool/ui");
const parent_form_1 = require("@/components/complete-profile/role-form/parent-form");
const sonner_1 = require("sonner");
const teacher_form_1 = require("./role-form/teacher-form");
const utils_1 = require("@/lib/utils");
const staff_admin_form_1 = __importDefault(require("@/components/complete-profile/role-form/staff-admin-form"));
const navigation_1 = require("next/navigation");
function RoleStep() {
    const { school, setCurrentStep, setRoleData } = (0, ui_1.useCompleteProfileStore)();
    const [selectedRole, setSelectedRole] = (0, react_1.useState)();
    const router = (0, navigation_1.useRouter)();
    const isSchoolCreator = school?.type === 'create';
    const filteredRoles = ui_1.allRoles.filter((r) => isSchoolCreator ? r.value === 'ADMIN' : r.value !== 'ADMIN');
    (0, react_1.useEffect)(() => {
        if (isSchoolCreator && !selectedRole) {
            setSelectedRole('ADMIN');
        }
    }, [isSchoolCreator]);
    const handleRoleSelect = (role) => {
        if (isSchoolCreator && role !== 'ADMIN') {
            sonner_1.toast.warning("En tant que créateur de l'école, vous devez être Administrateur.");
            return;
        }
        setSelectedRole(role);
    };
    const renderedRoleFrom = () => {
        switch (selectedRole) {
            case 'STUDENT':
                return <student_form_1.default onBack={() => setSelectedRole(undefined)}/>;
            case 'TEACHER':
                return <teacher_form_1.TeacherForm onBack={() => setSelectedRole(undefined)}/>;
            case 'PARENT':
                return <parent_form_1.ParentForm onBack={() => setSelectedRole(undefined)}/>;
            case 'STAFF':
                return (<staff_admin_form_1.default role="STAFF" onSubmit={(data) => {
                        setRoleData({ role: 'STAFF', staff: data });
                        setCurrentStep(4);
                    }} onBack={() => setSelectedRole(undefined)}/>);
            case 'ADMIN':
                return (<staff_admin_form_1.default onSubmit={(data) => {
                        setRoleData({ role: 'ADMIN', admin: data });
                        setCurrentStep(4);
                    }} role="ADMIN" onBack={() => setSelectedRole(undefined)}/>);
        }
    };
    if (!selectedRole) {
        return (<div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold font-sans">Votre Rôle</h2>
          {isSchoolCreator
                ? 'Configuration de votre compte administrateur'
                : 'Comment allez-vous utiliser la plateforme ?'}
          {isSchoolCreator && (<p className="text-amber-600 text-sm mt-2 font-jost font-medium">
              Note : Vous avez créé une école, le rôle Administrateur est
              requis.
            </p>)}
        </div>

        <div className={(0, utils_1.cn)('grid gap-4', isSchoolCreator ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2')}>
          {filteredRoles.map((role) => (<card_1.Card key={role.value} className="p-6 transition-all border-border cursor-pointer hover:border-primary hover:shadow-md" onClick={() => handleRoleSelect(role.value)}>
              <div className="flex items-center space-x-4">
                <span className="text-2xl">{role.icon}</span>
                <div>
                  <h3 className="font-semibold font-inter text-lg">
                    {role.label}
                  </h3>
                  <p className="text-sm text-gray-600 font-jost">
                    {role.description}
                  </p>
                </div>
              </div>
            </card_1.Card>))}
        </div>

        <button_1.Button variant="outline" className="w-full" onClick={() => setCurrentStep(2)}>
          ← Retour
        </button_1.Button>
      </div>);
    }
    return (<div className="space-y-6 h-full">
      <div className="flex items-center space-x-4 font-poppins">
        <button_1.Button variant="outline" onClick={() => setSelectedRole(undefined)}>
          ←
        </button_1.Button>
        <div className="flex justify-cent flex-col items-center">
          <h2 className="text-2xl font-semibold">
            Informations{' '}
            {filteredRoles.find((r) => r.value === selectedRole)?.label}
          </h2>
          <p className="text-gray-600">
            Complétez vos informations spécifiques
          </p>
        </div>
      </div>

      {renderedRoleFrom()}
    </div>);
}
//# sourceMappingURL=RoleStep.js.map