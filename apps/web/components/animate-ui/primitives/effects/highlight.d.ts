import * as React from 'react';
import { type Transition } from 'motion/react';
type HighlightMode = 'children' | 'parent';
type Bounds = {
    top: number;
    left: number;
    width: number;
    height: number;
};
type HighlightContextType<T extends string> = {
    as?: keyof HTMLElementTagNameMap;
    mode: HighlightMode;
    activeValue: T | null;
    setActiveValue: (value: T | null) => void;
    setBounds: (bounds: DOMRect) => void;
    clearBounds: () => void;
    id: string;
    hover: boolean;
    click: boolean;
    className?: string;
    style?: React.CSSProperties;
    activeClassName?: string;
    setActiveClassName: (className: string) => void;
    transition?: Transition;
    disabled?: boolean;
    enabled?: boolean;
    exitDelay?: number;
    forceUpdateBounds?: boolean;
};
declare function useHighlight<T extends string>(): HighlightContextType<T>;
type BaseHighlightProps<T extends React.ElementType = 'div'> = {
    as?: T;
    ref?: React.Ref<HTMLDivElement>;
    mode?: HighlightMode;
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (value: string | null) => void;
    className?: string;
    style?: React.CSSProperties;
    transition?: Transition;
    hover?: boolean;
    click?: boolean;
    disabled?: boolean;
    enabled?: boolean;
    exitDelay?: number;
};
type ParentModeHighlightProps = {
    boundsOffset?: Partial<Bounds>;
    containerClassName?: string;
    forceUpdateBounds?: boolean;
};
type ControlledParentModeHighlightProps<T extends React.ElementType = 'div'> = BaseHighlightProps<T> & ParentModeHighlightProps & {
    mode: 'parent';
    controlledItems: true;
    children: React.ReactNode;
};
type ControlledChildrenModeHighlightProps<T extends React.ElementType = 'div'> = BaseHighlightProps<T> & {
    mode?: 'children' | undefined;
    controlledItems: true;
    children: React.ReactNode;
};
type UncontrolledParentModeHighlightProps<T extends React.ElementType = 'div'> = BaseHighlightProps<T> & ParentModeHighlightProps & {
    mode: 'parent';
    controlledItems?: false;
    itemsClassName?: string;
    children: React.ReactElement | React.ReactElement[];
};
type UncontrolledChildrenModeHighlightProps<T extends React.ElementType = 'div'> = BaseHighlightProps<T> & {
    mode?: 'children';
    controlledItems?: false;
    itemsClassName?: string;
    children: React.ReactElement | React.ReactElement[];
};
type HighlightProps<T extends React.ElementType = 'div'> = ControlledParentModeHighlightProps<T> | ControlledChildrenModeHighlightProps<T> | UncontrolledParentModeHighlightProps<T> | UncontrolledChildrenModeHighlightProps<T>;
declare function Highlight<T extends React.ElementType = 'div'>({ ref, ...props }: HighlightProps<T>): React.JSX.Element;
type HighlightItemProps<T extends React.ElementType = 'div'> = React.ComponentProps<T> & {
    as?: T;
    children: React.ReactElement;
    id?: string;
    value?: string;
    className?: string;
    style?: React.CSSProperties;
    transition?: Transition;
    activeClassName?: string;
    disabled?: boolean;
    exitDelay?: number;
    asChild?: boolean;
    forceUpdateBounds?: boolean;
};
declare function HighlightItem<T extends React.ElementType>({ ref, as, children, id, value, className, style, transition, disabled, activeClassName, exitDelay, asChild, forceUpdateBounds, ...props }: HighlightItemProps<T>): any;
export { Highlight, HighlightItem, useHighlight, type HighlightProps, type HighlightItemProps, };
//# sourceMappingURL=highlight.d.ts.map