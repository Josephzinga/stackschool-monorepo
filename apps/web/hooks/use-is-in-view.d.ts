import * as React from 'react';
import { type UseInViewOptions } from 'motion/react';
interface UseIsInViewOptions {
    inView?: boolean;
    inViewOnce?: boolean;
    inViewMargin?: UseInViewOptions['margin'];
}
declare function useIsInView<T extends HTMLElement = HTMLElement>(ref: React.Ref<T>, options?: UseIsInViewOptions): {
    ref: React.RefObject<T | null>;
    isInView: boolean;
};
export { useIsInView, type UseIsInViewOptions };
//# sourceMappingURL=use-is-in-view.d.ts.map