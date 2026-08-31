'use client';

import { useState } from 'react';
import { ScanLine } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ScannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScan: (badgeId: string) => void;
  isLoading?: boolean;
}

export function ScannerDialog({
  open,
  onOpenChange,
  onScan,
  isLoading,
}: ScannerDialogProps) {
  const [badgeId, setBadgeId] = useState('');

  const handleScan = () => {
    if (badgeId.trim()) {
      onScan(badgeId.trim());
      setBadgeId('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ScanLine className="h-4 w-4" />
          Scanner un badge
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scanner un badge élève</DialogTitle>
          <DialogDescription>
            Saisissez l'ID du badge ou utilisez le lecteur de codes-barres
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="badgeId">ID du badge</Label>
            <Input
              id="badgeId"
              placeholder="Scannez ou saisissez l'ID..."
              value={badgeId}
              onChange={(e) => setBadgeId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              autoFocus
            />
          </div>
          <Button onClick={handleScan} disabled={isLoading} className="w-full">
            {isLoading ? 'Validation...' : 'Valider la présence'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
