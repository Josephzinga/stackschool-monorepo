'use client';
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
exports.ParentDialog = ParentDialog;
const dialog_1 = require("@/components/ui/dialog");
const React = __importStar(require("react"));
function ParentDialog({ open, setOpen, initialValues }) {
    return (<dialog_1.Dialog open={open} onOpenChange={setOpen}>
      <dialog_1.DialogContent className="sm:max-w-2xl">
        <dialog_1.DialogHeader>
          <dialog_1.DialogTitle>
            {initialValues ? 'Modifier le parent' : 'Ajouter un parent'}
          </dialog_1.DialogTitle>
          <dialog_1.DialogDescription>
            Remplissez les informations du parent. Vous pourrez lier des élèves après la création.
          </dialog_1.DialogDescription>
        </dialog_1.DialogHeader>
        
        <div className="py-4">
          
          <p className="text-center text-muted-foreground py-8">Formulaire parent en cours de développement</p>
        </div>
      </dialog_1.DialogContent>
    </dialog_1.Dialog>);
}
//# sourceMappingURL=parent-dialog.js.map