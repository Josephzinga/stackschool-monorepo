import { AttendanceRow } from '@/types/attendance';
import { Row, Table } from '@tanstack/react-table';
import { Controller } from 'react-hook-form';
import { StatusBadgeGroup } from '@/components/school/attendance/status-radio-group';
import { toast } from 'sonner';

export function AttendanceCell({
  row,
  table,
}: {
  row: Row<AttendanceRow>;
  table: Table<AttendanceRow>;
}) {
  const index = row.index;
  const { control, trigger, onCellChange, canMark } = table.options.meta!;
  return (
    <Controller
      control={control}
      name={`attendances.${index}.status`}
      render={({ field }) => (
        <StatusBadgeGroup
          value={field.value}
          onChange={async (newValue) => {
            if (!canMark) {
              return toast.warning(
                'Veullez selectionner une classe et la matière enseigné',
              );
            }
            field.onChange(newValue);
            const isValid = await trigger?.(`attendances.${index}.status`);
            if (isValid) {
              onCellChange?.(index, row.original, newValue);
            }
          }}
        />
      )}
    />
  );
}
