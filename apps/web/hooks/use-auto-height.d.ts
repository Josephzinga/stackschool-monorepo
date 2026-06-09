import * as React from 'react';
type AutoHeightOptions = {
    includeParentBox?: boolean;
    includeSelfBox?: boolean;
};
export declare function useAutoHeight<T extends HTMLElement = HTMLDivElement>(deps?: React.DependencyList, options?: AutoHeightOptions): {
    readonly ref: React.RefObject<T | null>;
    readonly height: number;
};
export {};
//# sourceMappingURL=use-auto-height.d.ts.map