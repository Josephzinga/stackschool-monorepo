'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SchoolStep;
const card_1 = require("@/components/ui/card");
const tabs_1 = require("@/components/animate-ui/components/radix/tabs");
const tabs_2 = require("@/components/animate-ui/primitives/radix/tabs");
const react_1 = require("react");
const create_school_form_1 = require("@/components/complete-profile/school-form/create-school-form");
const invitation_form_1 = require("@/components/complete-profile/school-form/invitation-form");
const search_school_from_1 = require("@/components/complete-profile/school-form/search-school-from");
function SchoolStep() {
    const [mode, setMode] = (0, react_1.useState)('join');
    const constant = [
        { value: 'join', label: 'Rejoindre' },
        { value: 'create', label: 'Crée' },
        { value: 'invite', label: 'Invitation' },
    ];
    return (<div className="space-y-6 p-3 w-full h-full">
      <div className="text-center max-h-screen">
        <card_1.CardTitle className="text-2xl font-bold ">Votre École</card_1.CardTitle>
        <card_1.CardDescription className="">
          Rejoignez votre établissement scolaire
        </card_1.CardDescription>
      </div>

      <tabs_1.Tabs className="space-y-4" value={mode} onValueChange={(val) => setMode(val)}>
        <div className="w-full flex justify-center">
          <tabs_2.TabsHighlight className="w-full">
            <tabs_1.TabsList className="h-10 gap-4">
              {constant.map((item) => (<tabs_2.TabsHighlightItem key={item.value} value={item.value}>
                  <tabs_1.TabsTrigger className="font-poppins font-semibold h-8 w-23" value={item.value}>
                    {item.label}
                  </tabs_1.TabsTrigger>
                </tabs_2.TabsHighlightItem>))}
            </tabs_1.TabsList>
          </tabs_2.TabsHighlight>
        </div>

        <tabs_1.TabsContents>
          <tabs_1.TabsContent value="join">
            <search_school_from_1.SearchSchoolFrom />
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="create">
            <create_school_form_1.CreateSchoolForm />
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="invite">
            <invitation_form_1.InvitationForm />
          </tabs_1.TabsContent>
        </tabs_1.TabsContents>
      </tabs_1.Tabs>
    </div>);
}
//# sourceMappingURL=schoolStep.js.map