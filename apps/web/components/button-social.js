"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonSocial = void 0;
const button_1 = require("./ui/button");
const utils_1 = require("@/lib/utils");
const ButtonSocial = ({ provider, icon, className, }) => {
    return (<button_1.Button variant="outline" type="button" className={(0, utils_1.cn)('w-full h-10 font-inter font-semibold', className)}>
      <a href={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/${provider}`} className="flex gap-3 w-full h-full justify-center items-center">
        {icon}
        Connectez vous avec{' '}
        {provider.charAt(0).toUpperCase() + provider.slice(1)}
      </a>
    </button_1.Button>);
};
exports.ButtonSocial = ButtonSocial;
//# sourceMappingURL=button-social.js.map