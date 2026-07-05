'use client';

import { AppCombobox } from '@/components/school/attendance/app-combobox';
import { ScannerDialog } from '@/components/school/attendance/QR-scan';
import { CalendarIcon, LucideQrCode, QrCode, Save, Search } from 'lucide-react';
import { fr } from 'react-day-picker/locale';
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
import { useAttendanceUiState } from '@/components/school/attendance/hooks/useAttendanceUiState';
import { QRCodeDialog } from '@/components/school/attendance/employee-QR-generator';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { useDashboard } from '@/components/providers/dashboard-provider';
import { useWindowSize } from 'react-use';
import { cn } from '@/lib/utils';

import { BulkMarking } from '@/components/school/attendance/table/bulk-marking';

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
  } = useAttendanceUiState();
  const { me } = useDashboard();

  const { width } = useWindowSize();
  const isMobile = width < 600;
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const mobileOption = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  const handleBadgeScan = () => {};

  const selectedCount = Object.values(rowSelection).filter(Boolean).length;
  const formattedDate = date.toLocaleDateString(
    'fr-Fr',
    isMobile ? mobileOption : (options as any),
  );
  return (
    <header className="w-full space-y-4">
      {/* Ligne 1 : Titre + DatePicker */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Gestion des présences
          </h1>
          <div className="h-6 w-px bg-border hidden sm:block" />
          <span className="text-sm text-muted-foreground hidden sm:block">
            {mode === 'STUDENT' ? 'Élèves' : mode === 'TEACHER' ? 'Enseignants' : 'Personnel'}
          </span>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 border-dashed hover:border-primary/50 transition-colors"
            >
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span className="capitalize">{formattedDate}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
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

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <Label
            htmlFor="auto-save"
            className="text-sm text-muted-foreground cursor-pointer select-none transition-colors hover:text-foreground"
          >
            {isAutoSave ? 'Auto-sauvegarde' : 'Sauvegarde manuelle'}
          </Label>
          <Switch
            id="auto-save"
            checked={isAutoSave}
            onCheckedChange={setIsAutoSave}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>

      {/* Ligne 3 : Filtres + Actions (QR + Submit) ou Barre de marquage groupé */}
      {selectedCount > 0 ? (
        <BulkMarking />
      ) : (
        <div className="relative rounded-xl border bg-card/50 p-3 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Filtres */}
            <div className="flex-1">
              {mode === 'STUDENT' ? (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <AppCombobox
                    data={classes}
                    selectedData={selectedClass}
                    onSelect={handleSelectClass}
                    label="Rechercher une classe..."
                    defaultValue="Toutes les classes"
                  />
                  {selectedClass && (
                    <AppCombobox
                      data={subjectsData || []}
                      selectedData={selectedSubject}
                      onSelect={handleSelectSubject}
                      label="Rechercher une matière..."
                      defaultValue="Toutes les matières"
                    />
                  )}
                </div>
              ) : (
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={
                      mode === 'TEACHER'
                        ? 'Rechercher un enseignant...'
                        : 'Rechercher un membre du personnel...'
                    }
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex w-full items-center justify-end gap-2 self-end md:self-auto">
              <Button
                variant="secondary"
                size={isMobile ? 'sm' : 'default'}
                onClick={openScanner}
                className="gap-2 transition-all hover:bg-secondary/80 active:scale-95"
              >
                <QrCode className="h-4 w-4" />
                <span className=" sm:inline">Générer QR</span>
              </Button>

              <Button
                type="submit"
                form="attendance-form"
                size={isMobile ? 'sm' : 'default'}
                disabled={isAutoSave}
                className={cn(
                  'gap-2 transition-all',
                  !isAutoSave && 'shadow-md shadow-primary/20',
                )}
              >
                <Save className="h-4 w-4" />
                <span className="">{'Enregistrer'}</span>
              </Button>
            </div>
          </div>

          {/* Petit indicateur de statut (optionnel) */}
          {isAutoSave && (
            <div className="mt-2 text-xs text-muted-foreground/70 flex items-center gap-1 border-t border-border/50 pt-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              Sauvegarde automatique activée
            </div>
          )}
        </div>
      )}

      {/* Scanner Dialog */}
      {mode === 'STUDENT' && isScannerOpen && (
        <ScannerDialog
          open={isScannerOpen}
          onOpenChange={(open) => (open ? openScanner() : closeScanner())}
          onScan={handleBadgeScan}
          isLoading={isScanning}
        />
      )}

      {/* QR Code Dialog */}
      <QRCodeDialog user={qrDialogUser} onClose={closeQrDialog} />
    </header>
  );
}
