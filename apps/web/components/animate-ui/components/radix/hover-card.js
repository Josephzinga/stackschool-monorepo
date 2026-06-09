"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoverCard = HoverCard;
exports.HoverCardTrigger = HoverCardTrigger;
exports.HoverCardContent = HoverCardContent;
const React = __importStar(require("react"));
const hover_card_1 = require("@/components/animate-ui/primitives/radix/hover-card");
const utils_1 = require("@/lib/utils");
function HoverCard(props) {
    return <hover_card_1.HoverCard {...props}/>;
}
function HoverCardTrigger(props) {
    return <hover_card_1.HoverCardTrigger {...props}/>;
}
function HoverCardContent({ className, align = 'center', sideOffset = 4, ...props }) {
    return (<hover_card_1.HoverCardPortal>
      <hover_card_1.HoverCardContent align={align} sideOffset={sideOffset} className={(0, utils_1.cn)('bg-popover text-popover-foreground z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden', className)} {...props}/>
    </hover_card_1.HoverCardPortal>);
}
//# sourceMappingURL=hover-card.js.map