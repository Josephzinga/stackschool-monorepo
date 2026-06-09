'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminDashboard;
const section_cards_1 = require("@/components/section-cards");
const attendance_chart_1 = __importDefault(require("@/components/attendance-chart"));
const ui_1 = require("@stackschool/ui");
const spinner_1 = require("@/components/ui/spinner");
const student_gender_chart_1 = require("@/components/student-gender-chart");
const chart_area_interactive_1 = require("@/components/chart-area-interactive");
const event_section_1 = __importDefault(require("@/components/event-section"));
function AdminDashboard() {
    const { currentSchool } = (0, ui_1.useUserStore)();
    const schoolId = currentSchool?.id;
    const { data, isLoading, error } = (0, ui_1.useGetAdminDashboardStatsQuery)({ schoolId: schoolId }, { enabled: !!schoolId });
    if (isLoading) {
        return (<div className="flex h-full w-full items-center justify-center">
        <spinner_1.Spinner className="h-8 w-8 text-primary"/>
      </div>);
    }
    if (error) {
        return (<div className="p-6 text-red-500">
        Erreur de chargement des statistiques.
      </div>);
    }
    const stats = data?.school?.stats;
    return (<div className="flex h-screnn flex-col lg:flex-row">
      <div className="flex flex-col w-full lg:w-[65%] xl:w-[70%] overflow-y-auto">
        <div className="flex flex-col gap-4 p-4 md:p-5">
          <section_cards_1.SectionCards stats={stats}/>

          <div className="grid grid-cols-1 md:grid-cols-[1.7fr_1.3fr] w-full gap-4">
            <div className="w-full h-100 min-w-80">
              <attendance_chart_1.default data={stats?.attendance?.history}/>
            </div>
            <div className="w-full h-100 min-w-60">
              {stats?.studentGender && (<student_gender_chart_1.ChartRadialGender stats={stats.studentGender} attendance={stats.attendance}/>)}
            </div>
          </div>

          <chart_area_interactive_1.ChartAreaInteractive />
        </div>
      </div>

      <event_section_1.default />
    </div>);
}
//# sourceMappingURL=page.js.map