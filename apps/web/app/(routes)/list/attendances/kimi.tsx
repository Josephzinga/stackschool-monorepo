// app/attendance/page.tsx
'use client';

import { useAttendanceStore } from '@/store/attendance';
import { useAttendanceEvent } from '@/components/school/attendance/hooks/useAttendanceEvent';
import { useAttendanceData } from '@/components/school/attendance/hooks/useAttendanceData';
import { AttendanceTable } from '@/components/school/attendance/table/manual-attendace-table';
import { QRCodeDialog } from '@/components/school/attendance/employee-QR-generator';
import { AttendanceRow } from '@/types/attendance';
import { Calendar, QrCode } from 'lucide-react';
import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AttendanceStatus } from '@stackschool/ui';

// Cellules de table externalisées
function ProfileCell({
  profile,
}: {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
}) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9">
        <AvatarImage
          src={profile.avatar}
          alt={`${profile.firstName} ${profile.lastName}`}
        />
        <AvatarFallback className="bg-primary/10 text-primary">
          {profile.firstName[0]}
          {profile.lastName[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-medium text-sm">
          {profile.firstName} {profile.lastName}
        </span>
        <span className="text-muted-foreground text-xs">{profile.email}</span>
      </div>
    </div>
  );
}

function StatusRadioGroup({
  value,
  onChange,
}: {
  value: AttendanceStatus;
  onChange: (status: AttendanceStatus) => void;
}) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(v) => onChange(v as AttendanceStatus)}
      className="flex items-center gap-4"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="PRESENT" id={`present-${value}`} />
        <Label
          htmlFor={`present-${value}`}
          className="text-green-600 font-medium cursor-pointer text-sm"
        >
          Présent
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="ABSENT" id={`absent-${value}`} />
        <Label
          htmlFor={`absent-${value}`}
          className="text-red-600 font-medium cursor-pointer text-sm"
        >
          Absent
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="LATE" id={`late-${value}`} />
        <Label
          htmlFor={`late-${value}`}
          className="text-amber-600 font-medium cursor-pointer text-sm"
        >
          Retard
        </Label>
      </div>
    </RadioGroup>
  );
}

export default function AttendancePage() {
  const { mode, date } = useAttendanceStore();
  const {
    switchMode,
    selectClass,
    openScanner,
    closeScanner,
    openQrDialog,
    closeQrDialog,
    handleStatusChange,
    handleBadgeScan,
    isScannerOpen,
    qrDialogUser,
    isMarking,
    isScanning,
    selectedClass,
  } = useAttendanceEvent();

  const {
    rows,
    columns: baseColumns,
    classes,
    isLoading,
  } = useAttendanceData();

  // Construction finale des colonnes avec les handlers d'événements
  const columns = useMemo<ColumnDef<AttendanceRow>[]>(() => {
    return baseColumns.map((col) => {
      // Injecter le handler de changement de statut dans la colonne status
      if (col?.accesorKey === 'status') {
        return {
          ...col,
          cell: ({ row }) => (
            <StatusRadioGroup
              value={row.original.status}
              onChange={(status) =>
                handleStatusChange(
                  row.original.id,
                  row.original.userType,
                  status,
                )
              }
            />
          ),
        };
      }

      // Injecter le handler QR pour Teacher et Staff
      if (col.id === 'qr') {
        return {
          ...col,
          cell: ({ row }) => (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() =>
                openQrDialog(
                  row.original.id,
                  `${row.original.profile.firstName} ${row.original.profile.lastName}`,
                  row.original.userType,
                )
              }
            >
              <QrCode className="h-4 w-4 text-muted-foreground hover:text-primary" />
            </Button>
          ),
        };
      }

      return col;
    });
  }, [baseColumns, handleStatusChange, openQrDialog]);

  const today = new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des présences
        </h1>
        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <p>{today}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Navigation par ButtonGroup */}

        {/* Barre d'outils contextuelle */}

        {/* Table générique */}
        <AttendanceTable
          columns={columns}
          data={rows}
          isLoading={isLoading || isMarking}
        />
      </div>

      <QRCodeDialog user={qrDialogUser} onClose={closeQrDialog} />
    </div>
  );
}
