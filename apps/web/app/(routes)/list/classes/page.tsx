import { TableProvider } from '@/components/school/class/table/table-provider';
import { ClassView } from '@/app/(routes)/list/classes/class-view';

export default function Page() {
  return (
    <TableProvider>
      <ClassView />
    </TableProvider>
  );
}
