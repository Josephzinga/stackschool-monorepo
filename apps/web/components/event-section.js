'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EventSection;
const bg_calendar_1 = __importDefault(require("@/components/bg-calendar"));
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const icon_1 = require("@/components/animate-ui/icons/icon");
const lucide_react_1 = require("lucide-react");
const lecture_card_1 = require("@/components/lecture-card");
const socket_context_1 = require("@/lib/socket-context");
function EventSection() {
    const io = (0, socket_context_1.useSocket)();
    io?.emit('join_admin');
    return (<card_1.Card className="h-screen! lg:flex md:max-w-120 px-2 w-full xl:w-[30%]  mt-4 border">
      <div className="flex justify-center w-full items-center h-100 text-center text-lg">
        <bg_calendar_1.default />
      </div>
      <div className="w-full flex flex-col gap-4">
        <div className="flex justify-between ">
          <h3>Today's Lecture</h3>
          <button_1.Button variant="ghost">
            <icon_1.IconWrapper icon={lucide_react_1.MoreHorizontal}/>
          </button_1.Button>
        </div>
        <lecture_card_1.LectureCard classe="11ème" title="Ensemble N des entiers naturel" chapter={'1'} time="8:30 - 9:10" teacher={{
            name: 'joseph zinga',
        }} subject="Mathématique" status={'SCHEDULED'}/>
      </div>
    </card_1.Card>);
}
//# sourceMappingURL=event-section.js.map