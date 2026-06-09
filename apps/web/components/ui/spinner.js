"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spinner = Spinner;
exports.SpinnerCustom = SpinnerCustom;
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
function Spinner({ className, ...props }) {
    return (<lucide_react_1.LoaderIcon role="status" aria-label="Loading" className={(0, utils_1.cn)("size-4 animate-spin", className)} {...props}/>);
}
function SpinnerCustom() {
    return (<div className="flex items-center gap-4">
      <Spinner />
    </div>);
}
//# sourceMappingURL=spinner.js.map