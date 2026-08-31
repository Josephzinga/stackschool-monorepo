import { Button } from '@/components/ui/button';
import { Trash2, X } from 'lucide-react';
import * as React from 'react';
import { RowSelectionState, Updater } from '@tanstack/react-table';

export function DeleteSelectedCount({
  selectedCount,
  onClose,
  onDelete,
}: {
  selectedCount: number;
  onClose: (v: Updater<RowSelectionState>) => void;
  onDelete: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2 bg-destructive/15 px-3 py-2 rounded-md border border-red-300">
      <span className="text-sm font-jost font-medium">
        {selectedCount} sélectionné(s)
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 text-destructive hover:text-destructive/70"
        onClick={() => onClose({})}
      >
        <X className="h-4 w-4" />
      </Button>
      <div className="h-4 w-px bg-red-200 mx-1" />
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-destructive text-xs font-medium cursor-pointer hover:text-destructive/70"
        onClick={() => onDelete(true)}
      >
        <Trash2 className="h-3 w-3 mr-1" />
        Supprimer
      </Button>
    </div>
  );
}
