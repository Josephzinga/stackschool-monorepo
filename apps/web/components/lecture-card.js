"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LectureCard = LectureCard;
const lucide_react_1 = require("lucide-react");
function LectureCard({ classe, time, title, subject, chapter, teacher, room, status, realStartTime, }) {
    const isLive = status === 'STARTED';
    return (<div className={`bg-background space-y-2 rounded-lg px-4 py-2 border-l-4 transition-all ${isLive
            ? 'border-green-500 shadow-md ring-1 ring-green-500/20'
            : 'border-slate-200'}`}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-secondary px-2 py-0.5 rounded text-secondary-foreground">
              {classe}
            </span>
            <p className="font-poppins font-semibold text-lg">{subject}</p>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <lucide_react_1.LucideMapPin size={14}/>
            <span>{room || 'Salle non définie'}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="font-medium text-sm flex items-center gap-1">
            <lucide_react_1.LucideClock size={14}/> {time}
          </div>
          {isLive && (<span className="flex items-center gap-1 text-[10px] font-bold text-green-600 animate-pulse">
              • EN COURS {realStartTime && `(depuis ${realStartTime})`}
            </span>)}
        </div>
      </div>

      
      <div className="flex items-center gap-1 text-sm bg-muted/30 rounded">
        <lucide_react_1.LucideCircleCheck className={isLive ? 'text-green-500' : 'text-muted-foreground'} size={18}/>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-muted-foreground leading-none">
            Chapitre {chapter}
          </span>
          <p className="font-medium truncate max-w-[200px]">{title}</p>
        </div>
      </div>

      
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            {teacher?.photo ? (<img src={teacher.photo} alt={teacher.name} className="h-8 w-8 rounded-full object-cover"/>) : (<lucide_react_1.LucideUser size={16} className="text-primary"/>)}
          </div>
          <span className="text-sm font-medium">{teacher?.name}</span>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=lecture-card.js.map