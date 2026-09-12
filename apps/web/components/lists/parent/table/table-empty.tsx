'use client';

import { UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { useParentTable } from '@/components/lists/parent/table/table-provider';

export function ParentEmpty() {
  const { setDialogOpen } = useParentTable();
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UserIcon />
        </EmptyMedia>
        <EmptyTitle>Aucun parent trouvé.</EmptyTitle>
        <EmptyDescription>
          Vous n'avez pas encore créé un parent.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button className="cursor-pointer" onClick={() => setDialogOpen(true)}>
          Cree un parent
        </Button>
        <Button variant="outline">Importer les données</Button>
      </EmptyContent>
    </Empty>
  );
}
