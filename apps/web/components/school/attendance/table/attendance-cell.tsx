import { AttendanceRow } from '@/types/attendance';
import { Row, Table } from '@tanstack/react-table';
import { Controller } from 'react-hook-form';
import { StatusBadgeGroup } from '@/components/school/attendance/status-radio-group';

export function AttendanceCell({
  row,
  table,
}: {
  row: Row<AttendanceRow>;
  table: Table<AttendanceRow>;
}) {
  const index = row.index;
  const { control, trigger, onCellChange } = table.options.meta!;
  return (
    <Controller
      control={control}
      name={`attendances.${index}.status`}
      render={({ field }) => (
        <StatusBadgeGroup
          value={field.value}
          onChange={async (newValue) => {
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
