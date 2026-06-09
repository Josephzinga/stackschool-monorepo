"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StudentDashboard;
const section_cards_1 = require("@/components/section-cards");
const chart_area_interactive_1 = require("@/components/chart-area-interactive");
const data_table_1 = require("@/components/data-table");
const data_json_1 = __importDefault(require("../data.json"));
function StudentDashboard() {
    return (<div>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <section_cards_1.SectionCards />
            <div className="px-4 lg:px-6">
              <chart_area_interactive_1.ChartAreaInteractive />
            </div>
            <data_table_1.DataTable data={data_json_1.default}/>
          </div>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map