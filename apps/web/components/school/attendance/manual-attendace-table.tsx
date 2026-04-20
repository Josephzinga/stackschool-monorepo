'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface Person {
  id: string;
  name: string;
  role: string;
  class?: string;
  attended?: boolean;
  status?: string;
}

export function ManualAttendanceTable({
  date,
  roleFilter,
  classFilter,
}: {
  date: Date;
  roleFilter: string;
  classFilter?: string;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<'PRESENT' | 'ABSENT' | 'LATE'>(
    'PRESENT',
  );

  const members = [];

  const markManual = useMutation({
    mutationFn: (variables: { userIds: string[]; status: string }) => {
      console.log('variables', variables);
    },

    onSuccess: () => {
      toast.error('Pointage enregistré');
      setSelectedIds([]);
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(
        members?.filter((m) => !m.attended).map((m) => m.id) || [],
      );
    } else {
      setSelectedIds([]);
    }
  };

  const handleSubmit = () => {
    if (selectedIds.length === 0) return;
    markManual.mutate({ userIds: selectedIds, status: bulkStatus });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Select
            value={bulkStatus}
            onValueChange={(val) => setBulkStatus(val as any)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PRESENT">Présent</SelectItem>
              <SelectItem value="ABSENT">Absent</SelectItem>
              <SelectItem value="LATE">Retard</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSubmit} disabled={selectedIds.length === 0}>
            Marquer {selectedIds.length} personne(s)
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedIds.length > 0 &&
                    selectedIds.length ===
                      members?.filter((m) => !m.attended).length
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Classe</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members?.map((person) => (
              <TableRow key={person.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(person.id)}
                    onCheckedChange={(checked) => {
                      if (checked)
                        setSelectedIds((prev) => [...prev, person.id]);
                      else
                        setSelectedIds((prev) =>
                          prev.filter((id) => id !== person.id),
                        );
                    }}
                    disabled={person.attended}
                  />
                </TableCell>
                <TableCell>{person.name}</TableCell>
                <TableCell>{person.role}</TableCell>
                <TableCell>{person.class || '-'}</TableCell>
                <TableCell>
                  {person.attended ? (
                    <Badge variant="outline">Présent</Badge>
                  ) : (
                    <span className="text-muted-foreground">Non pointé</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
