import FullCalendar from '@fullcalendar/react';
import { EventResizeDoneArg } from '@fullcalendar/interaction';
import React from 'react';
import { CustomContentGenerator, DateSelectArg, DatesSetArg, EventClickArg, EventContentArg, EventDropArg, EventSourceInput } from '@fullcalendar/core';
import '@/app/styles/schedule-grid.css';
import { ResourceLabelContentArg, ResourceSourceInput } from '@fullcalendar/resource';
import { ViewType } from '@/types/lessons-types';
import { VerboseFormattingArg } from '@fullcalendar/core/internal';
export interface TimeGridHandle {
    getApi: () => any;
    prev: () => void;
    next: () => void;
    today: () => void;
    changeView: (view: ViewType) => void;
    getCurrentView: () => ViewType;
}
interface TimeGridProps {
    events?: EventSourceInput;
    renderEventContent: CustomContentGenerator<EventContentArg>;
    onDatesSet?: (arg: DatesSetArg) => void;
    onEventClick?: (arg: EventClickArg) => void;
    showNavigation?: boolean;
    showViewButtons?: boolean;
    hideResourceViewButtons?: boolean;
    selectable: boolean;
    editable: boolean;
    disabledTimeGrid?: boolean;
    onEventDrop?: (info: EventDropArg) => void;
    onEventSelect?: (info: DateSelectArg) => void;
    initialView?: ViewType;
    resources?: ResourceSourceInput;
    resourceHeaderContent?: string;
    renderResourceContent?: CustomContentGenerator<ResourceLabelContentArg>;
    slotLabelFormat?: (args: VerboseFormattingArg) => any;
    onEventResize?: (arg: EventResizeDoneArg) => void;
    onEventDragStart?: () => void;
    onEventDragStop?: () => void;
    onViewChange?: (view: ViewType) => void;
    onResourceClick?: (resourceId: string) => void;
    onCalendarMount?: (calendar: FullCalendar) => void;
    hasFilter?: boolean;
}
declare const TimeGrid: React.ForwardRefExoticComponent<TimeGridProps & React.RefAttributes<any>>;
export default TimeGrid;
export declare const renderEventContent: (eventInfo: any) => React.JSX.Element;
//# sourceMappingURL=time-grid.d.ts.map