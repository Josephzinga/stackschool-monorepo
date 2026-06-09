'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SelectSchoolPage;
const ui_1 = require("@stackschool/ui");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const navigation_1 = require("next/navigation");
const lucide_react_1 = require("lucide-react");
const avatar_1 = require("@/components/ui/avatar");
function SelectSchoolPage() {
    const { user, setCurrentSchool } = (0, ui_1.useUserStore)();
    const router = (0, navigation_1.useRouter)();
    if (!user)
        return null;
    const handleSelect = (membership) => {
        setCurrentSchool(membership.school);
        router.push('/dashboard');
    };
    return (<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold font-inter">Choisir une école</h1>
          <p className="text-muted-foreground">
            Vous êtes membre de plusieurs établissements. Lequel souhaitez-vous
            accéder ?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.memberships?.map((membership) => (<card_1.Card key={membership.school.id} className="p-6 cursor-pointer hover:border-primary transition-all hover:shadow-md group" onClick={() => handleSelect(membership)}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <avatar_1.Avatar className="h-12 w-12 rounded-lg">
                    <avatar_1.AvatarImage src={`/images/${membership.school.logo}`}/>
                    <avatar_1.AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                      <lucide_react_1.School className="h-6 w-6"/>
                    </avatar_1.AvatarFallback>
                  </avatar_1.Avatar>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                      {membership.school.name}
                    </h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {membership.role.toLowerCase()}
                    </p>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                  <lucide_react_1.Check className="h-5 w-5"/>
                </div>
              </div>
            </card_1.Card>))}
        </div>

        <div className="text-center">
          <button_1.Button variant="link" className="text-lg" onClick={() => router.push('/auth/complete-profile')}>
            Rejoindre ou créer une autre école
          </button_1.Button>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map