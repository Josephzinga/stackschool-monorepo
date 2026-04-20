'use client';

import React, { useState } from 'react';
import { GroupDataTable } from '@/components/school/group/data-table';
import { columns } from '@/components/school/group/columns';
import DataHeaderInput from '@/components/school/data-filters';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function GroupsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col h-full p-3 md:p-6 z-10 gap-3">
      <div className="flex justify-between ">
        <DataHeaderInput
          hasActiveFilters={false}
          showFilters={false}
          search={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <Button className="border-dashed!" onClick={() => setOpen(true)}>
          Creé un groupe d'élèves
        </Button>
      </div>
      <GroupDataTable data={[]} isLoading={false} columns={columns} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
