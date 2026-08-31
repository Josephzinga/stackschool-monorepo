// components/QRCodeDialog.tsx
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AttendanceMode } from '@/types/attendance';

interface QRCodeDialogProps {
  user: { id: string; name: string; type: AttendanceMode } | null;
  onClose: () => void;
}

export function QRCodeDialog({ user, onClose }: QRCodeDialogProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const generateQR = async () => {
    if (!user) return;
    setGenerating(true);

    // Simulation - remplacer par mutation GraphQL
    setTimeout(() => {
      setQrCode(
        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ATTENDANCE_${user.type}_${user.id}_${Date.now()}`,
      );
      setGenerating(false);
    }, 800);
  };

  return (
    <Dialog open={!!user} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code de présence</DialogTitle>
          <DialogDescription>
            {user?.name} - Scanner ce code depuis votre téléphone
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          {qrCode ? (
            <div className="space-y-4 w-full">
              <div className="flex justify-center">
                <img
                  src={qrCode}
                  alt="QR Code"
                  className="rounded-lg border p-2"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Ce QR code expire dans 5 minutes
              </p>
              <Button onClick={generateQR} variant="outline" className="w-full">
                Régénérer
              </Button>
            </div>
          ) : (
            <Button
              onClick={generateQR}
              disabled={generating}
              className="w-full"
            >
              {generating ? 'Génération...' : 'Générer le QR Code'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
