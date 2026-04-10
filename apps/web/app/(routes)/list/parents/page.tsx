'use client';

import { ParentView } from '@/app/(routes)/list/parents/parent-view';
import { TableProvider } from '@/components/school/parent/table/table-provider';

export default function ParentsPage() {
  return (
    <TableProvider>
      <ParentView />
    </TableProvider>
  );
}
