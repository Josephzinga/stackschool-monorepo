'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRCodeDialog = QRCodeDialog;
const react_1 = require("react");
const dialog_1 = require("@/components/ui/dialog");
const button_1 = require("@/components/ui/button");
function QRCodeDialog({ user, onClose }) {
    const [qrCode, setQrCode] = (0, react_1.useState)(null);
    const [generating, setGenerating] = (0, react_1.useState)(false);
    const generateQR = async () => {
        if (!user)
            return;
        setGenerating(true);
        setTimeout(() => {
            setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ATTENDANCE_${user.type}_${user.id}_${Date.now()}`);
            setGenerating(false);
        }, 800);
    };
    return (<dialog_1.Dialog open={!!user} onOpenChange={(open) => !open && onClose()}>
      <dialog_1.DialogContent className="sm:max-w-md">
        <dialog_1.DialogHeader>
          <dialog_1.DialogTitle>QR Code de présence</dialog_1.DialogTitle>
          <dialog_1.DialogDescription>
            {user?.name} - Scanner ce code depuis votre téléphone
          </dialog_1.DialogDescription>
        </dialog_1.DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          {qrCode ? (<div className="space-y-4 w-full">
              <div className="flex justify-center">
                <img src={qrCode} alt="QR Code" className="rounded-lg border p-2"/>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Ce QR code expire dans 5 minutes
              </p>
              <button_1.Button onClick={generateQR} variant="outline" className="w-full">
                Régénérer
              </button_1.Button>
            </div>) : (<button_1.Button onClick={generateQR} disabled={generating} className="w-full">
              {generating ? 'Génération...' : 'Générer le QR Code'}
            </button_1.Button>)}
        </div>
      </dialog_1.DialogContent>
    </dialog_1.Dialog>);
}
//# sourceMappingURL=employee-QR-generator.js.map