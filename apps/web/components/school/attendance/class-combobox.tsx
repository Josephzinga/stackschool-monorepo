'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ClassOption } from '@/types/attendance';

interface ClassComboboxProps {
  classes: ClassOption[];
  selectedClass: string | null;
  onSelect: (classId: string | null) => void;
}

export function ClassCombobox({
  classes,
  selectedClass,
  onSelect,
}: ClassComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[280px] justify-between"
        >
          {selectedClass
            ? classes.find((c) => c.id === selectedClass)?.name
            : 'Toutes les classes'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher une classe..." />
          <CommandList>
            <CommandEmpty>Aucune classe trouvée.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  onSelect(null);
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    !selectedClass ? 'opacity-100' : 'opacity-0',
                  )}
                />
                Toutes les classes
              </CommandItem>
              {classes.map((cls) => (
                <CommandItem
                  key={cls.id}
                  onSelect={() => {
                    onSelect(cls.id);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedClass === cls.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {cls.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
