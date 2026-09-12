import { AppTableMeta } from '@/types/tanstack-table';
import { StaffData } from '@/components/lists/staff/table/columns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { IconDotsVertical } from '@tabler/icons-react';

interface StaffTableActionsProps {
  meta?: AppTableMeta<StaffData>;
  data: StaffData;
}
export const StaffTableActions = ({ meta, data }: StaffTableActionsProps) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted cursor-pointer text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical className="h-4 w-4" />
              <span className="sr-only">Ouvrir le menu</span>
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-50">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => meta?.openEdit?.(data)}>
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('Copy', data)}>
              Copier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => meta?.openDelete?.(data)}
            >
              Supprimer
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              Désactiver
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
