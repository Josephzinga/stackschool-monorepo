"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeGridContainer = void 0;
exports.RenderResourceContent = RenderResourceContent;
const popover_1 = require("@/components/ui/popover");
const lucide_react_1 = require("lucide-react");
const button_1 = require("@/components/ui/button");
const react_1 = require("motion/react");
function RenderResourceContent({ resource, onClick, }) {
    return (<popover_1.Popover>
      <div className="flex flex-col h-full py-1 px-2 group cursor-pointer hover:bg-accent/50 transition-colors">
        <button onClick={(e) => {
            e.stopPropagation();
            onClick(resource);
        }} className="font-semibold text-sm truncate">
          {resource.title}
        </button>
      </div>

      <div className="flex items-center group justify-between
        ">
        <popover_1.PopoverTrigger asChild>
          <button_1.Button variant="link" className="text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            Détails
          </button_1.Button>
        </popover_1.PopoverTrigger>
        <span className={`text-[10px] px-1 mt-1.5 rounded ${resource.totalHours > 8
            ? 'bg-red-100 text-red-700'
            : 'bg-green-100' + ' text-green-700'}`}>
          {resource.totalHours}h
        </span>
      </div>

      <popover_1.PopoverContent className="w-80 p-3">
        <div className="space-y-2">
          <h4 className="font-semibold">{resource.title}</h4>
          <div className="flex items-center gap-2 text-sm">
            <lucide_react_1.Clock className="h-3.5 w-3.5 text-muted-foreground"/>
            <span>{resource.totalHours} heures cette semaine</span>
          </div>
          {resource.lessons && resource.lessons.length > 0 && (<div className="mt-2 border-t pt-2">
              <p className="text-xs font-medium mb-1">Cours à venir :</p>
              <ul className="text-xs space-y-1">
                {resource.lessons.slice(0, 3).map((lesson, idx) => (<li key={idx} className="flex justify-between">
                    <span>
                      {lesson.day} {lesson.start}-{lesson.end}
                    </span>
                    <span className="font-medium">{lesson.subject}</span>
                    {lesson.room && (<span className="text-muted-foreground">
                        <lucide_react_1.MapPin className="inline h-3 w-3"/> {lesson.room}
                      </span>)}
                  </li>))}
              </ul>
            </div>)}
        </div>
      </popover_1.PopoverContent>
    </popover_1.Popover>);
}
const TimeGridContainer = ({ children, }) => (<react_1.motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{
        duration: 0.5,
        delay: 0.2,
        ease: 'linear',
    }}>
    {children}
  </react_1.motion.div>);
exports.TimeGridContainer = TimeGridContainer;
//# sourceMappingURL=render-resource-content.js.map