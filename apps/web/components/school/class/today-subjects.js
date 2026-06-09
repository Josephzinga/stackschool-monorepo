'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodaySubjects = TodaySubjects;
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
const ui_1 = require("@stackschool/ui");
function TodaySubjects({ classId }) {
    const { data } = (0, ui_1.useGetSchoolLessonsQuery)({
        filter: {
            classId,
            status: ui_1.LessonStatus.Ongoing,
            mode: ui_1.ResourceMode.Class,
        },
    });
    console.log('data', data);
    return (<div className="md:col-span-2">
      <card_1.Card className="h-full">
        <card_1.CardHeader>
          <card_1.CardTitle className="text-lg flex items-center gap-2">
            <lucide_react_1.CalendarDays className="h-5 w-5 text-lg font-poppins font-medium text-primary"/>
            Cours d'ajourd'hui
          </card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="space-y-4">
            
            <div className="flex items-center p-3 border rounded-lg bg-accent">
              <div className="w-20 font-mono text-sm font-medium">08:00</div>
              <div className="w-1 h-8 bg-primary/20 mx-4 rounded-full"></div>
              <div>
                <p className="font-medium">Mathématiques</p>
                <p className="text-sm text-muted-foreground">M. Dupont</p>
              </div>
            </div>
            <div className="flex items-center p-3 border rounded-lg bg-accent">
              <div className="w-20 font-mono text-sm font-medium">10:00</div>
              <div className="w-1 h-8 bg-primary/20 mx-4 rounded-full"></div>
              <div>
                <p className="font-medium">Français</p>
                <p className="text-sm text-muted-foreground">Mme Martin</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center pt-4">
              Voir l'emploi du temps complet pour plus de détails.
            </p>
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}
//# sourceMappingURL=today-subjects.js.map