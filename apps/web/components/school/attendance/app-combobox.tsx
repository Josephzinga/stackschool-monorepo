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

interface AppComboboxProps {
  data: {
    id: string;
    name: string;
  }[];
  selectedData: string | null;
  onSelect: (value: string | null) => void;
  label?: string;
  defaultValue?: string;
}

export function AppCombobox({
  data,
  selectedData,
  onSelect,
  label,
  defaultValue,
}: AppComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full md:w-60  justify-between"
        >
          {selectedData
            ? data?.find((c) => c.id === selectedData)?.name
            : defaultValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full! md:w-60 p-0">
        <Command>
          <CommandInput placeholder={label} />
          <CommandList>
            <CommandEmpty>Aucune valeur trouvée.</CommandEmpty>
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
                    !selectedData ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {defaultValue || ' Toutes les classes'}
              </CommandItem>
              {data?.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => {
                    onSelect(item.id);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedData === item.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
