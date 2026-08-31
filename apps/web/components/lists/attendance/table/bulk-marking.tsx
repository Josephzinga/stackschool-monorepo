'use client';

import { StatusBadgeGroup } from '@/components/lists/attendance/status-radio-group';
import { useAttendanceUiState } from '@/components/lists/attendance/hooks/useAttendanceUiState';
import { useAttendanceStore } from '@/store/attendance';
import { AttendanceStatusEnum } from '@stackschool/shared';
import { X, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BulkMarking() {
  const { rowSelection, setRowSelection } = useAttendanceUiState();
  const bulkMarkCallback = useAttendanceStore((state) => state.bulkMarkCallback);

  const selectedCount = Object.values(rowSelection).filter(Boolean).length;

  const handleMark = (status: AttendanceStatusEnum) => {
    if (bulkMarkCallback) {
      bulkMarkCallback(status);
    }
  };

  const handleClearSelection = () => {
    setRowSelection({});
  };

  return (
    <div className="relative rounded-xl border border-primary/20 bg-primary/5 p-3 shadow-md backdrop-blur-sm flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between transition-all duration-300 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <CheckSquare className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm sm:text-base">Actions groupées</h3>
          <p className="text-xs text-muted-foreground">
            {selectedCount} {selectedCount > 1 ? 'éléments sélectionnés' : 'élément sélectionné'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs sm:text-sm font-medium text-muted-foreground">
          Marquer comme :
        </span>
        <StatusBadgeGroup value={null} onChange={handleMark} size="sm" />

        <div className="h-6 w-px bg-border hidden sm:block" />

        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearSelection}
          className="gap-2 text-muted-foreground hover:text-foreground h-8 text-xs sm:text-sm"
        >
          <X className="h-4 w-4" />
          Annuler
        </Button>
      </div>
    </div>
  );
}
