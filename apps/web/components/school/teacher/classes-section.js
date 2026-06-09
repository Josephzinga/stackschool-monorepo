"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("@/components/ui/card");
const client_1 = require("next/client");
const lucide_react_1 = require("lucide-react");
function ClassesSection({ classSubject, }) {
    return (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {classSubject?.map((cls) => {
            const studentCount = (cls?.classe?._count?.students?.female || 0) +
                (cls?.classe?._count?.students?.male || 0);
            return (<card_1.Card key={cls?.id} className="hover:border-primary/50 font-inter transition-colors cursor-pointer group" onClick={() => client_1.router.push(`/list/classes/${cls?.id}`)}>
            <card_1.CardHeader className="pb-2">
              <card_1.CardTitle className="text-base group-hover:text-primary transition-colors">
                {cls?.classe?.name}
              </card_1.CardTitle>
              <p className="text-sm font-medium text-muted-foreground">
                {cls?.subject?.name}
              </p>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-sm font-medium">{studentCount} élèves</div>
            </card_1.CardContent>
          </card_1.Card>);
        })}
      {(!classSubject || classSubject.length === 0) && (<div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
          <lucide_react_1.Briefcase className="h-8 w-8 mb-2 opacity-20"/>
          <p>Aucune classe assignée.</p>
        </div>)}
    </div>);
}
exports.default = ClassesSection;
//# sourceMappingURL=classes-section.js.map