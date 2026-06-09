"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = Card;
exports.CardContent = CardContent;
exports.CardDescription = CardDescription;
exports.CardFooter = CardFooter;
exports.CardHeader = CardHeader;
exports.CardTitle = CardTitle;
const text_1 = require("@/components/ui/text");
const utils_1 = require("@/lib/utils");
const react_native_1 = require("react-native");
const react_1 = __importDefault(require("react"));
function Card({ className, ...props }) {
    return (<text_1.TextClassContext.Provider value="text-card-foreground">
      <react_native_1.View className={(0, utils_1.cn)(' bg-car flex flex-col gap-6 rounded-xl border border-border py-6 shadow-sm shadow-black/5', className)} {...props}/>
    </text_1.TextClassContext.Provider>);
}
function CardHeader({ className, ...props }) {
    return <react_native_1.View className={(0, utils_1.cn)('flex flex-col gap-1.5 px-6', className)} {...props}/>;
}
function CardTitle({ className, ...props }) {
    return (<text_1.Text role="heading" aria-level={3} className={(0, utils_1.cn)('font-semibold leading-none', className)} {...props}/>);
}
function CardDescription({ className, ...props }) {
    return (<text_1.Text className={(0, utils_1.cn)('px-2 text-center font-inter-semibold text-sm text-muted-foreground', className)} {...props}/>);
}
function CardContent({ className, ...props }) {
    return <react_native_1.View className={(0, utils_1.cn)('px-6', className)} {...props}/>;
}
function CardFooter({ className, ...props }) {
    return <react_native_1.View className={(0, utils_1.cn)('flex flex-row items-center px-6', className)} {...props}/>;
}
//# sourceMappingURL=card.js.map