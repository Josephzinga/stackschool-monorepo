"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitButton = void 0;
const button_1 = require("@/components/ui/button");
const spinner_1 = require("@/components/ui/spinner");
const utils_1 = require("@/lib/utils");
const SubmitButton = ({ isSubmitting, children, className, disabled, onClick, ...props }) => (<button_1.Button {...props} onClick={onClick} type="submit" disabled={isSubmitting || disabled} className={(0, utils_1.cn)('font-poppins font-semibold', (isSubmitting || disabled) && 'opacity-50 cursor-not-allowed', className)}>
    {isSubmitting ? (<>
        {' '}
        <spinner_1.Spinner /> {children}
      </>) : (children)}
  </button_1.Button>);
exports.SubmitButton = SubmitButton;
//# sourceMappingURL=submit-button.js.map