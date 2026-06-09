import * as React from 'react';
type ThemeSelection = 'light' | 'dark' | 'system';
type Resolved = 'light' | 'dark';
type Direction = 'btt' | 'ttb' | 'ltr' | 'rtl';
type ChildrenRender = React.ReactNode | ((state: {
    resolved: Resolved;
    effective: ThemeSelection;
    toggleTheme: (theme: ThemeSelection) => void;
}) => React.ReactNode);
type ThemeTogglerProps = {
    theme: ThemeSelection;
    resolvedTheme: Resolved;
    setTheme: (theme: ThemeSelection) => void;
    direction?: Direction;
    onImmediateChange?: (theme: ThemeSelection) => void;
    children?: ChildrenRender;
};
declare function ThemeToggler({ theme, resolvedTheme, setTheme, onImmediateChange, direction, children, ...props }: ThemeTogglerProps): React.JSX.Element;
export { ThemeToggler, type ThemeTogglerProps, type ThemeSelection, type Resolved, type Direction, };
//# sourceMappingURL=theme-toggler.d.ts.map