'use client';

import { Input } from '@/components/ui/input';
import { useTable } from './table-provider';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function DataTableHeader() {
  const { searchTerm, setSearchTerm } = useTable();

  return (
    <div className="flex items-center justify-between py-4">
      <div className="relative h-10">
        <Input
          placeholder="Rechercher un enseignant..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="max-w-sm h-full"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSearchTerm('')}
          className="absolute h-8 w-8 top-1/2 -translate-y-1/2 right-1"
        >
          <X />
        </Button>
      </div>
      <Button>Ajouter un Enseignant</Button>
    </div>
  );
}
