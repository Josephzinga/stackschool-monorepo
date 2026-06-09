"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeGridHeader = TimeGridHeader;
const button_1 = require("@/components/ui/button");
const button_group_1 = require("@/components/ui/button-group");
const lucide_react_1 = require("lucide-react");
const react_1 = __importDefault(require("react"));
const utils_1 = require("@/lib/utils");
function TimeGridHeader({ onPrev, onNext, onToday, currentView, isResourceView, onChangeView, currentDateTitle, showNavigation = true, showViewButtons = true, disableNonResourceViews = false, hideResourceViewButtons = false, }) {
    return (<div className="flex flex-col gap-2 p-2 border shadow-sm  bg-muted/80 rounded-md mb-2 md:flex-row md:items-center md:justify-between">
      
      {showNavigation && (<div className="flex items-center gap-1">
          <button_group_1.ButtonGroup>
            <button_1.Button variant="outline" size="sm" onClick={onPrev} className="h-8 w-8 p-0">
              <lucide_react_1.ChevronLeft className="h-4 w-4"/>
            </button_1.Button>
            <button_1.Button variant="outline" size="sm" onClick={onNext} className="h-8 w-8 p-0">
              <lucide_react_1.ChevronRight className="h-4 w-4"/>
            </button_1.Button>
          </button_group_1.ButtonGroup>
          <button_1.Button variant="outline" size="sm" onClick={onToday} className="h-8 px-2 text-xs">
            Aujourd'hui
          </button_1.Button>
        </div>)}
      
      {currentDateTitle && (<div className="text-sm font-medium text-center md:text-left">
          {currentDateTitle}
        </div>)}
      
      {showViewButtons && (<div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-end">
          <button_1.Button size="sm" variant={!isResourceView && currentView === 'timeGridDay'
                ? 'default'
                : 'outline'} onClick={() => onChangeView('timeGridDay')} disabled={disableNonResourceViews} className="h-8 px-2 text-xs">
            Jour
          </button_1.Button>

          <button_1.Button size="sm" variant={!isResourceView && currentView === 'timeGridWeek'
                ? 'default'
                : 'outline'} onClick={() => onChangeView('timeGridWeek')} className={(0, utils_1.cn)('h-8 px-2 text-xs')} disabled={disableNonResourceViews}>
            Semaine
          </button_1.Button>

          {!hideResourceViewButtons && (<>
              <button_1.Button size="sm" variant={isResourceView && currentView === 'resourceTimelineDay'
                    ? 'default'
                    : 'outline'} onClick={() => onChangeView('resourceTimelineDay')} className="h-8 px-2 text-xs">
                Timeline Jour
              </button_1.Button>
              <button_1.Button size="sm" variant={isResourceView && currentView === 'resourceTimelineWeek'
                    ? 'default'
                    : 'outline'} onClick={() => onChangeView('resourceTimelineWeek')} className="h-8 px-2 text-xs">
                Timeline Semaine
              </button_1.Button>
            </>)}
        </div>)}
    </div>);
}
//# sourceMappingURL=time-grid-header.js.map