'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScannerDialog = ScannerDialog;
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const dialog_1 = require("@/components/ui/dialog");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
function ScannerDialog({ open, onOpenChange, onScan, isLoading, }) {
    const [badgeId, setBadgeId] = (0, react_1.useState)('');
    const handleScan = () => {
        if (badgeId.trim()) {
            onScan(badgeId.trim());
            setBadgeId('');
        }
    };
    return (<dialog_1.Dialog open={open} onOpenChange={onOpenChange}>
      <dialog_1.DialogTrigger asChild>
        <button_1.Button variant="outline" className="gap-2">
          <lucide_react_1.ScanLine className="h-4 w-4"/>
          Scanner un badge
        </button_1.Button>
      </dialog_1.DialogTrigger>
      <dialog_1.DialogContent className="sm:max-w-md">
        <dialog_1.DialogHeader>
          <dialog_1.DialogTitle>Scanner un badge élève</dialog_1.DialogTitle>
          <dialog_1.DialogDescription>
            Saisissez l'ID du badge ou utilisez le lecteur de codes-barres
          </dialog_1.DialogDescription>
        </dialog_1.DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label_1.Label htmlFor="badgeId">ID du badge</label_1.Label>
            <input_1.Input id="badgeId" placeholder="Scannez ou saisissez l'ID..." value={badgeId} onChange={(e) => setBadgeId(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleScan()} autoFocus/>
          </div>
          <button_1.Button onClick={handleScan} disabled={isLoading} className="w-full">
            {isLoading ? 'Validation...' : 'Valider la présence'}
          </button_1.Button>
        </div>
      </dialog_1.DialogContent>
    </dialog_1.Dialog>);
}
//# sourceMappingURL=QR-scan.js.map