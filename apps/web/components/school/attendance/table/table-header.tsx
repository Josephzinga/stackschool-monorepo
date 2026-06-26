'use client';

import { AppCombobox } from '@/components/school/attendance/app-combobox';
import { ScannerDialog } from '@/components/school/attendance/QR-scan';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { useDashboard } from '@/components/providers/dashboard-provider';

export function AttendanceTableHeader() {
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
    selectedSubject,
    handleSelectSubject,
  } = useAttendanceEvent();

  const { classes, subjectsData } = useAttendanceData();
  const {
    date,
    setDate,
    isAutoSave,
    setIsAutoSave,
    rowSelection,
    setRowSelection,
  } = useAttendanceStore();
  const { me } = useDashboard();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const handleBadgeScan = () => {};
  console.log('row selection', rowSelection);

  const selectedCount = Object.values(rowSelection).length;
  console.log('selectedCount', selectedCount);

  return (
    <header className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-4">
        {/* Header with title and date picker */}

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
                  if (date) setDate(new Date(format(date, 'yyyy-MM-dd')));
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        {/* Tabs button switch */}
        <div className="flex justify-between items-center">
          <ModeButtonGroup activeMode={mode} onModeChange={handleSwitchMode} />

          <div className="flex w-full justify-end-safe items-center gap-2 group">
            <Label
              htmlFor="switch"
              className="group-hover:text-secondary/70 text-secondary text-[1rem] cursor-grab font-meduim font-sans"
            >
              {!isAutoSave
                ? 'Enregistrement automatique'
                : 'Enregistrement manuel'}
            </Label>
            <Switch
              id="switch"
              size="md"
              checked={isAutoSave}
              onCheckedChange={setIsAutoSave}
            />
          </div>
        </div>
      </div>

      {/* Class combobox or search input and QR code button */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-accent rounded-md p-2">
        {mode === 'STUDENT' ? (
          <div className="flex flex-col w-full md:flex-row gap-2">
            <AppCombobox
              data={classes || []}
              selectedData={selectedClass}
              onSelect={handleSelectClass}
              label="Rechercher une classe..."
              defaultValue="Tous les classes"
            />
            {me?.schoolContext?.role === 'TEACHER' && (
              <AppCombobox
                data={subjectsData || []}
                label="Rechercher une matière..."
                defaultValue="Tous les matières"
                selectedData={selectedSubject}
                onSelect={handleSelectSubject}
              />
            )}
          </div>
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

        <div className="flex gap-2">
          <Button
            className="px-4 cursor-pointer hover:bg-accent-foreground/50 font-poppins font-semibold 
            hover:text-background text-xs  transition-colors duration-300"
            variant="secondary"
            onClick={() => openScanner()}
          >
            Générer QR Code
            <LucideQrCode />
          </Button>
          <Button
            type="submit"
            form="attendance-form"
            disabled={isAutoSave}
            className="hover:scale-102 active:scale-98 duration-100 transition-all"
          >
            Enregistrer
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
