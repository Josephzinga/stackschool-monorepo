'use client';

import { ClassCombobox } from '@/components/school/attendance/class-combobox';
import { ScannerDialog } from '@/components/school/attendance/QR-scan';
import React from 'react';
import { CalendarIcon, LucideQrCode } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/animate-ui/components/radix/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ModeButtonGroup } from '@/components/school/attendance/mode-group-button';
import { useAttendanceEvent } from '@/components/school/attendance/hooks/useAttendanceEvent';
import { useAttendanceData } from '@/components/school/attendance/hooks/useAttendanceData';
import { useAttendanceStore } from '@/store/attendance';
import { QRCodeDialog } from '@/components/school/attendance/employee-QR-generator';
import { Input } from '@/components/ui/input';

export function TableHeader() {
  const {
    mode,
    handleSwitchMode,
    isScannerOpen,
    isScanning,
    closeScanner,
    openScanner,
    handleSelectClass,
    qrDialogUser,
    closeQrDialog,
    selectedClass,
    search,
    setSearch,
  } = useAttendanceEvent();

  const { classes } = useAttendanceData();
  const { date, setDate } = useAttendanceStore();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const handleBadgeScan = () => {};
  return (
    <header className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des présences
          </h1>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="cursor-pointer mt-2">
                <CalendarIcon className="h-4 w-4" />
                {date.toLocaleDateString('fr-Fr', options as any)}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={date ? new Date(date) : undefined}
                captionLayout="label"
                weekStartsOn={1}
                startMonth={new Date(1990, 0)}
                onSelect={(date) => {
                  if (date) setDate(date);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <ModeButtonGroup activeMode={mode} onModeChange={handleSwitchMode} />
      </div>
      <div className="flex items-center justify-between">
        {mode === 'STUDENT' ? (
          <ClassCombobox
            classes={classes}
            selectedClass={selectedClass}
            onSelect={handleSelectClass}
          />
        ) : (
          <div>
            <Input
              placeholder={
                mode === 'TEACHER'
                  ? 'Rechercher un Enseignant...'
                  : 'Rechercher un Personnel'
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
        <div>
          <Button className="px-4 cursor-pointer" variant="ghost">
            <LucideQrCode />
          </Button>
        </div>
      </div>

      {mode === 'STUDENT' && isScannerOpen && (
        <ScannerDialog
          open={isScannerOpen}
          onOpenChange={(open) => (open ? openScanner() : closeScanner())}
          onScan={handleBadgeScan}
          isLoading={isScanning}
        />
      )}
      <QRCodeDialog user={qrDialogUser} onClose={closeQrDialog} />
    </header>
  );
}
