'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassCombobox = ClassCombobox;
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
const button_1 = require("@/components/ui/button");
const command_1 = require("@/components/ui/command");
const popover_1 = require("@/components/ui/popover");
function ClassCombobox({ classes, selectedClass, onSelect, }) {
    const [open, setOpen] = (0, react_1.useState)(false);
    return (<popover_1.Popover open={open} onOpenChange={setOpen}>
      <popover_1.PopoverTrigger asChild>
        <button_1.Button variant="outline" role="combobox" aria-expanded={open} className="w-[280px] justify-between">
          {selectedClass
            ? classes.find((c) => c.id === selectedClass)?.name
            : 'Toutes les classes'}
          <lucide_react_1.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
        </button_1.Button>
      </popover_1.PopoverTrigger>
      <popover_1.PopoverContent className="w-[280px] p-0">
        <command_1.Command>
          <command_1.CommandInput placeholder="Rechercher une classe..."/>
          <command_1.CommandList>
            <command_1.CommandEmpty>Aucune classe trouvée.</command_1.CommandEmpty>
            <command_1.CommandGroup>
              <command_1.CommandItem onSelect={() => {
            onSelect(null);
            setOpen(false);
        }} className="cursor-pointer">
                <lucide_react_1.Check className={(0, utils_1.cn)('mr-2 h-4 w-4', !selectedClass ? 'opacity-100' : 'opacity-0')}/>
                Toutes les classes
              </command_1.CommandItem>
              {classes.map((cls) => (<command_1.CommandItem key={cls.id} onSelect={() => {
                onSelect(cls.id);
                setOpen(false);
            }} className="cursor-pointer">
                  <lucide_react_1.Check className={(0, utils_1.cn)('mr-2 h-4 w-4', selectedClass === cls.id ? 'opacity-100' : 'opacity-0')}/>
                  {cls.name}
                </command_1.CommandItem>))}
            </command_1.CommandGroup>
          </command_1.CommandList>
        </command_1.Command>
      </popover_1.PopoverContent>
    </popover_1.Popover>);
}
//# sourceMappingURL=class-combobox.js.map