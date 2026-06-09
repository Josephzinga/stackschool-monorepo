import * as React from 'react';
declare function getStrictContext<T>(name?: string): readonly [
    ({ value, children, }: {
        value: T;
        children?: React.ReactNode;
    }) => React.JSX.Element,
    () => T
];
export { getStrictContext };
//# sourceMappingURL=get-strict-context.d.ts.map