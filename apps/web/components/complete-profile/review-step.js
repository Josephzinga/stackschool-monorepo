"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReviewStep;
const ui_1 = require("@stackschool/ui");
const button_1 = require("@/components/ui/button");
const submit_button_1 = require("@/components/submit-button");
const avatar_1 = require("@/components/ui/avatar");
const badge_1 = require("@/components/ui/badge");
const separator_1 = require("@/components/ui/separator");
const lucide_react_1 = require("lucide-react");
const navigation_1 = require("next/navigation");
const react_1 = require("@gsap/react");
const gsap_1 = __importDefault(require("gsap"));
const sonner_1 = require("sonner");
function TeacherReview({ data }) {
    return (<div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 text-sm ">
        <div>
          <p className="text-muted-foreground flex items-center gap-1">
            <lucide_react_1.GraduationCap className="h-3 w-3"/> Diplôme
          </p>
          <p className="font-medium">{data.diploma}</p>
        </div>
        {data.department && (<div>
            <p className="text-muted-foreground flex items-center gap-1">
              <lucide_react_1.BookOpen className="h-3 w-3"/> Département
            </p>
            <p className="font-medium">{data.department}</p>
          </div>)}
      </div>
      <separator_1.Separator />
      <div className="space-y-3">
        <p className="font-medium text-sm">
          Classes assignées ({data.assignments?.length || 0})
        </p>
        <div className="grid gap-2">
          {data.assignments?.map((assign, i) => (<div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-md flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">{assign.className}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {assign.subjectNames?.map((sub) => (<badge_1.Badge variant="outline" className="border-chart-5 border" key={sub}>
                      {sub}
                    </badge_1.Badge>))}
                </div>
              </div>
              {assign.isMainTeacher && (<badge_1.Badge variant="secondary" className="text-xs">
                  Titulaire
                </badge_1.Badge>)}
            </div>))}
        </div>
      </div>
    </div>);
}
function ParentReview({ data }) {
    return (<div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 text-sm">
        {data.profession && (<div>
            <p className="text-muted-foreground flex items-center gap-1">
              <lucide_react_1.Briefcase className="h-3 w-3"/> Profession
            </p>
            <p className="font-medium">{data.profession}</p>
          </div>)}
        {data.address && (<div>
            <p className="text-muted-foreground flex items-center gap-1">
              <lucide_react_1.MapPin className="h-3 w-3"/> Adresse
            </p>
            <p className="font-medium">{data.address}</p>
          </div>)}
        <div>
          <p className="text-muted-foreground flex items-center gap-1">
            {data.contactPreference === 'EMAIL' ? (<lucide_react_1.Mail className="h-3 w-3"/>) : (<lucide_react_1.Phone className="h-3 w-3"/>)}
            Contact préféré
          </p>
          <p className="font-medium capitalize">
            {data.contactPreference?.toLowerCase()}
          </p>
        </div>
      </div>
      <separator_1.Separator />
      <div className="space-y-3">
        <p className="font-medium text-sm flex items-center gap-2">
          <lucide_react_1.Users className="h-4 w-4"/>
          Enfants liés ({data.children?.length || 0})
        </p>
        <div className="grid gap-2">
          {data.children?.map((child, i) => (<div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-md flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                C
              </div>
              <div>
                <p className="font-medium text-sm">
                  Enfant {i + 1} {child.firstname}
                </p>
                <p className="text-xs text-muted-foreground">
                  Relation :{' '}
                  {child.relation === 'FATHER'
                ? 'Père'
                : child.relation === 'MOTHER'
                    ? 'Mère'
                    : 'Tuteur'}
                </p>
              </div>
            </div>))}
        </div>
      </div>
    </div>);
}
function StudentReview({ data }) {
    return (<div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Matricule</p>
          <badge_1.Badge variant="secondary">{data.matricule}</badge_1.Badge>
        </div>
        <div>
          <p className="text-muted-foreground">Année d'inscription</p>
          <p className="font-medium">{data.enrollmentYear}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Date de naissance</p>
          <p className="font-medium">
            {new Date(data.birthDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Lieu de naissance</p>
          <p className="font-medium">{data.birthPlace}</p>
        </div>
      </div>
      <separator_1.Separator />
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Père</p>
          <p className="font-medium">{data.fatherName || '-'}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Mère</p>
          <p className="font-medium">{data.motherName || '-'}</p>
        </div>
      </div>
    </div>);
}
function ReviewStep() {
    const { profile, school, role, setCurrentStep } = (0, ui_1.useCompleteProfileStore)();
    const router = (0, navigation_1.useRouter)();
    const { mutateAsync, isPending, error } = (0, ui_1.useConfirmCompleteProfileMutation)({
        onSuccess: (data, context) => {
            if (!data.confirmCompleteProfile)
                return;
            if (data.confirmCompleteProfile.ok) {
                sonner_1.toast.success(data.confirmCompleteProfile.message);
                setTimeout(() => router.push('/onboard'));
            }
        },
        onError: (error) => {
            sonner_1.toast.error(error.message);
        },
    });
    const handleSubmit = async () => {
        await mutateAsync({});
    };
    if (!profile || !school || !role)
        return null;
    (0, react_1.useGSAP)(() => {
        gsap_1.default.fromTo('.review-card', {
            opacity: 0,
            duration: 0.2,
            x: 50,
            stagger: 0.2,
            ease: 'power2.out',
            yoyo: true,
        }, {
            opacity: 1,
            duration: 0.4,
            x: 1,
            stagger: 0.2,
        });
    });
    const roleSpecificData = role.role === 'TEACHER'
        ? role.teacher
        : role.role === 'PARENT'
            ? role.parent
            : role.role === 'STUDENT'
                ? role.student
                : null;
    return (<div className="space-y-6 max-w-3xl mx-auto w-full">
      <div className="text-center space-y-2 animate-in fade-in-50 duration-500">
        <lucide_react_1.PartyPopper className="h-12 w-12 text-primary mx-auto"/>
        <h2 className="text-3xl font-bold font-inter">Presque Fini !</h2>
        <p className="text-muted-foreground">
          Vérifiez vos informations une dernière fois.
        </p>
      </div>

      
      <div className="review-card overflow-hidden inset-shadow-chart-1 inset-shadow-sm rounded-lg p-2 border-l-4 border-l-chart-1">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <avatar_1.Avatar className="w-14 h-14">
              <avatar_1.AvatarImage src={school.type === 'join'
            ? `/images/${school.schoolSelected.logo}`
            : undefined}/>
              <avatar_1.AvatarFallback className="border border-chart-1">
                <lucide_react_1.School className="text-chart-1 h-9 w-9"/>
              </avatar_1.AvatarFallback>
            </avatar_1.Avatar>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">École rejointe</p>
              <h3 className="font-semibold font-poppins text-lg">
                {school.type === 'join'
            ? school.schoolSelected.name
            : school.type === 'invite'
                ? school.invitationCode
                : ''}
              </h3>
              <p className="text-xs text-muted-foreground">
                {school.type === 'join' && school?.schoolSelected?.address}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <badge_1.Badge variant="outline">Étape 1</badge_1.Badge>
            <button_1.Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
              <lucide_react_1.Edit2 className="h-4 w-4 mr-1"/> Modifier
            </button_1.Button>
          </div>
        </div>
      </div>

      
      <div className="review-card overflow-hidden inset-shadow-chart-4 inset-shadow-sm rounded-lg px-3 py-2  border-l-4 border-l-chart-4 ">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <avatar_1.Avatar className="h-14 w-14">
              <avatar_1.AvatarImage src={`${profile.photo}`}/>
              <avatar_1.AvatarFallback className="border-chart-4 border">
                <lucide_react_1.User className="h-9 w-9 text-chart-4"/>
              </avatar_1.AvatarFallback>
            </avatar_1.Avatar>

            <div>
              <p>Informations personnelles</p>
              <p className="font-bold text-xl">
                {profile.firstname} {profile.lastname}
              </p>
              <p className="text-muted-foreground">
                {profile?.email} {profile?.phoneNumber}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <badge_1.Badge variant="outline">Étape 2</badge_1.Badge>
            <button_1.Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>
              <lucide_react_1.Edit2 className="h-4 w-4 mr-1"/> Modifier
            </button_1.Button>
          </div>
        </div>
      </div>

      
      <div className="review-card overflow-hidden inset-shadow-chart-5 inset-shadow-sm rounded-lg px-3 py-3  border-l-4 border-l-chart-5 ">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <lucide_react_1.Check className="h-5 w-5 text-primary"/>
            Rôle : {ui_1.allRoles.filter((r) => r.value === role?.role)[0].label}
          </h3>
          <button_1.Button variant="ghost" size="sm" onClick={() => setCurrentStep(3)}>
            <lucide_react_1.Edit2 className="h-4 w-4 mr-1"/> Modifier
          </button_1.Button>
        </div>

        {role.role === 'TEACHER' && role.teacher && (<TeacherReview data={role.teacher}/>)}
        {role.role === 'PARENT' && role.parent && (<ParentReview data={role.parent}/>)}
        {role.role === 'STUDENT' && role.student && (<StudentReview data={role.student}/>)}
      </div>

      <div className="flex gap-4 pt-4 animate-in fade-in-50 duration-500 delay-500">
        <button_1.Button variant="outline" onClick={() => setCurrentStep(3)} disabled={isPending}>
          ← Retour
        </button_1.Button>
        <submit_button_1.SubmitButton isSubmitting={isPending} onClick={handleSubmit} className="flex-1">
          <lucide_react_1.Check className="mr-2 h-4 w-4"/>
          Valider et Terminer
        </submit_button_1.SubmitButton>
      </div>
    </div>);
}
//# sourceMappingURL=review-step.js.map