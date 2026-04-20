// features/attendance/components/EmployeeQRGenerator.tsx
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

export function EmployeeQRGenerator() {
  const [targetRole, setTargetRole] = useState<'TEACHER' | 'STAFF'>('TEACHER');
  const [session, setSession] = useState<{
    qrCodeDataUrl: string;
    secretCode: string;
    expiresAt: string;
  } | null>(null);

  const generateSession = useMutation({
    mutationFn: (variables: { targetRole: string; durationMinutes: number }) =>
      generateAttendanceSession(variables),
    onSuccess: (data) => {
      toast.success('QR code généré');
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  const handleGenerate = () => {
    generateSession.mutate({ targetRole, durationMinutes: 10 });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Générer un QR code (employés)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium">Cible</label>
            <Select
              value={targetRole}
              onValueChange={(val) => setTargetRole(val as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TEACHER">Enseignants</SelectItem>
                <SelectItem value="STAFF">Personnel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleGenerate} disabled={generateSession.isPending}>
            Générer
          </Button>
        </div>

        {session && (
          <div className="border rounded-lg p-4 space-y-3 text-center">
            <div className="flex justify-center">
              <QRCodeSVG value={session.qrCodeDataUrl} size={180} />
            </div>
            <p>
              Code secret : <strong>{session.secretCode}</strong>
            </p>
            <p className="text-xs text-muted-foreground">
              Expire le {new Date(session.expiresAt).toLocaleTimeString()}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSession(null)}
            >
              Cacher
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
function generateAttendanceSession(variables: {
  targetRole: string;
  durationMinutes: number;
}): Promise<unknown> {
  throw new Error('Function not implemented.');
}
