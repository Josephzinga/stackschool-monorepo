"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.poppins = exports.jost = exports.sans = exports.inter = void 0;
const local_1 = __importDefault(require("next/font/local"));
exports.inter = (0, local_1.default)({
    src: '../fonts/Inter/Inter-VariableFont_opsz,wght.ttf',
    variable: '--font-inter',
    display: 'swap',
});
exports.sans = (0, local_1.default)({
    src: '../fonts/GoogleSans-VariableFont_GRAD,opsz,wght.ttf',
    variable: '--font-sans',
    display: 'swap',
});
exports.jost = (0, local_1.default)({
    src: '../fonts/Jost/Jost-VariableFont_wght.ttf',
    variable: '--font-jost',
    display: 'swap',
});
exports.poppins = (0, local_1.default)({
    src: [
        {
            path: '../fonts/Poppins/Poppins-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../fonts/Poppins/Poppins-SemiBold.ttf',
            weight: '600',
            style: 'normal',
        },
        {
            path: '../fonts/Poppins/Poppins-Black.ttf',
            weight: '700',
            style: 'normal',
        },
    ],
    variable: '--font-poppins',
    display: 'swap',
});
//# sourceMappingURL=fonts.js.map