"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CalendarDisplay;
const react_1 = __importDefault(require("@fullcalendar/react"));
const daygrid_1 = __importDefault(require("@fullcalendar/daygrid"));
const interaction_1 = __importDefault(require("@fullcalendar/interaction"));
require("../app/styles/calendar.css");
function CalendarDisplay() {
    return (<react_1.default plugins={[daygrid_1.default, interaction_1.default]} initialView="dayGridMonth" locale="fr" firstDay={1} height="400px" dayHeaderClassNames="bg-gray-200" viewClassNames="font-poppins" allDayClassNames={'bg-green-500'} headerToolbar={{
            left: 'prev',
            center: 'title',
            right: 'next',
        }}/>);
}
//# sourceMappingURL=bg-calendar.js.map