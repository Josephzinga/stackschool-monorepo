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
exports.AppAlertDialog = void 0;
const alert_dialog_1 = require("@/components/ui/alert-dialog");
const React = __importStar(require("react"));
const utils_1 = require("@/lib/utils");
const AppAlertDialog = ({ open, onOpenChange, title, description, onConfirm, onCancel, confirmLabel = 'Confirmer', cancelLabel = 'Annuler', isLoading = false, variant = 'destructive', descriptionClassName, }) => {
    console.log('AlertDailog');
    return (<alert_dialog_1.AlertDialog open={open} onOpenChange={onOpenChange}>
      <alert_dialog_1.AlertDialogContent className="w-[95%] sm:max-w-md mx-auto rounded-lg">
        <alert_dialog_1.AlertDialogHeader>
          <alert_dialog_1.AlertDialogTitle className="text-base sm:text-lg">
            {title}
          </alert_dialog_1.AlertDialogTitle>
          <alert_dialog_1.AlertDialogDescription className={(0, utils_1.cn)('text-sm sm:text-base', descriptionClassName)}>
            {description}
          </alert_dialog_1.AlertDialogDescription>
        </alert_dialog_1.AlertDialogHeader>
        <alert_dialog_1.AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <alert_dialog_1.AlertDialogCancel disabled={isLoading} onClick={onCancel} className="w-full sm:w-auto mt-2 sm:mt-0">
            {cancelLabel}
          </alert_dialog_1.AlertDialogCancel>
          <alert_dialog_1.AlertDialogAction onClick={(e) => {
            e.preventDefault();
            onConfirm();
        }} className={(0, utils_1.cn)('w-full sm:w-auto focus:ring-2 focus:ring-offset-2', variant === 'destructive'
            ? 'bg-red-600 hover:bg-red-700 focus:ring-red-600'
            : 'bg-primary hover:bg-primary/90 focus:ring-primary')} disabled={isLoading}>
            {isLoading ? (<span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"/>
                Traitement...
              </span>) : (confirmLabel)}
          </alert_dialog_1.AlertDialogAction>
        </alert_dialog_1.AlertDialogFooter>
      </alert_dialog_1.AlertDialogContent>
    </alert_dialog_1.AlertDialog>);
};
exports.AppAlertDialog = AppAlertDialog;
//# sourceMappingURL=app-alert-dialog.js.map