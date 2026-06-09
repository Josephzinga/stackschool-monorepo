import * as React from 'react';
import { Combobox as ComboboxPrimitive } from '@base-ui/react';
declare const Combobox: typeof ComboboxPrimitive.Root;
declare function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props): React.JSX.Element;
declare function ComboboxTrigger({ className, children, ...props }: ComboboxPrimitive.Trigger.Props): React.JSX.Element;
declare function ComboboxInput({ className, children, disabled, showTrigger, showClear, onClear, ...props }: ComboboxPrimitive.Input.Props & {
    showTrigger?: boolean;
    showClear?: boolean;
    onClear?: () => void;
}): React.JSX.Element;
declare function ComboboxContent({ className, side, sideOffset, align, alignOffset, anchor, ...props }: ComboboxPrimitive.Popup.Props & Pick<ComboboxPrimitive.Positioner.Props, 'side' | 'align' | 'sideOffset' | 'alignOffset' | 'anchor'>): React.JSX.Element;
declare function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props): React.JSX.Element;
declare function ComboboxItem({ className, children, ...props }: ComboboxPrimitive.Item.Props): React.JSX.Element;
declare function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props): React.JSX.Element;
declare function ComboboxLabel({ className, ...props }: ComboboxPrimitive.GroupLabel.Props): React.JSX.Element;
declare function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props): React.JSX.Element;
declare function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props): React.JSX.Element;
declare function ComboboxSeparator({ className, ...props }: ComboboxPrimitive.Separator.Props): React.JSX.Element;
declare function ComboboxChips({ className, ...props }: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> & ComboboxPrimitive.Chips.Props): React.JSX.Element;
declare function ComboboxChip({ className, children, showRemove, ...props }: ComboboxPrimitive.Chip.Props & {
    showRemove?: boolean;
}): React.JSX.Element;
declare function ComboboxChipsInput({ className, children, ...props }: ComboboxPrimitive.Input.Props): React.JSX.Element;
declare function useComboboxAnchor(): React.RefObject<HTMLDivElement | null>;
export { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem, ComboboxGroup, ComboboxLabel, ComboboxCollection, ComboboxEmpty, ComboboxSeparator, ComboboxChips, ComboboxChip, ComboboxChipsInput, ComboboxTrigger, ComboboxValue, useComboboxAnchor, };
//# sourceMappingURL=combobox.d.ts.map