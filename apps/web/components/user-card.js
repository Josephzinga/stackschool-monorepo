"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserCard;
const card_1 = require("@/components/ui/card");
const icons_react_1 = require("@tabler/icons-react");
const badge_1 = require("@/components/ui/badge");
const utils_1 = require("@/lib/utils");
function UserCard({ title, description, badgeTitle, badgeClassName, className, info, DescriptionIcon, badgeIcon: BadgeIcon, }) {
    return (<card_1.Card className={(0, utils_1.cn)('shadow-[2px_4px_2px_0_rgba(0,0,0,0.1)]! bg-linear-to-t! gap-2! md:px-1 min-w-45 w-full flex-1 flex' +
            ' even:from-chart-2/70 even:bg-linear-to-tr! even:to-chart-5 odd:from-chart-5 odd:to-chart-2/70 py-2 px-1!' +
            ' font-poppins', className)}>
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center px-1">
          <card_1.CardDescription className="flex font-medium font-poppins items-center gap-1">
            {DescriptionIcon && <DescriptionIcon className="h-4 w-4"/>}
            {description}
          </card_1.CardDescription>
          <card_1.CardAction className="flex flex-wrap">
            <badge_1.Badge variant="outline" className={(0, utils_1.cn)('border-primary flex items-center gap-1', badgeClassName)}>
              {BadgeIcon ? (<BadgeIcon className="h-3 w-3"/>) : (<icons_react_1.IconTrendingUp className="h-3 w-3"/>)}
              <span className="text-xs">{badgeTitle}</span>
            </badge_1.Badge>
          </card_1.CardAction>
        </div>

        <div className="py-1">
          <p className="text-2xl text-center font-semibold">{title}</p>
        </div>
      </div>

      <div className="flex-col justify-center items-end gap-1.5 text-sm">
        <p className="text-muted-foreground text-center ">{info}</p>
      </div>
    </card_1.Card>);
}
//# sourceMappingURL=user-card.js.map