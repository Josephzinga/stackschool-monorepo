"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CompleteProfileLayout;
const react_1 = __importDefault(require("react"));
const expo_router_1 = require("expo-router");
function CompleteProfileLayout() {
    return (<expo_router_1.Tabs>
      <expo_router_1.Tabs.Screen name="complete-profile" options={{ title: 'Complete profile' }}/>
    </expo_router_1.Tabs>);
}
//# sourceMappingURL=_layout.js.map