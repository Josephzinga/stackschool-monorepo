import { ViewType } from '@/types/lessons-types';
import React from 'react';
interface TimeGridHeaderProps {
    onPrev: () => void;
    onNext: () => void;
    onToday: () => void;
    currentView: ViewType;
    isResourceView: boolean;
    onChangeView: (view: ViewType) => void;
    currentDateTitle?: string;
    showNavigation?: boolean;
    showViewButtons?: boolean;
    disableNonResourceViews?: boolean;
    hideResourceViewButtons?: boolean;
}
export declare function TimeGridHeader({ onPrev, onNext, onToday, currentView, isResourceView, onChangeView, currentDateTitle, showNavigation, showViewButtons, disableNonResourceViews, hideResourceViewButtons, }: TimeGridHeaderProps): React.JSX.Element;
export {};
//# sourceMappingURL=time-grid-header.d.ts.map