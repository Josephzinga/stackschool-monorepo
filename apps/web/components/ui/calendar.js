'use client';
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Calendar = Calendar;
exports.CalendarDayButton = CalendarDayButton;
const React = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const react_day_picker_1 = require("react-day-picker");
const locale_1 = require("react-day-picker/locale");
const utils_1 = require("@/lib/utils");
const button_1 = require("@/components/ui/button");
function Calendar({ className, classNames, showOutsideDays = true, captionLayout = 'label', buttonVariant = 'ghost', formatters, components, ...props }) {
    const defaultClassNames = (0, react_day_picker_1.getDefaultClassNames)();
    return (<react_day_picker_1.DayPicker locale={locale_1.fr} showOutsideDays={showOutsideDays} className={(0, utils_1.cn)('bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent', String.raw `rtl:**:[.rdp-button\_next>svg]:rotate-180`, String.raw `rtl:**:[.rdp-button\_previous>svg]:rotate-180`, className)} captionLayout={captionLayout} formatters={{
            formatMonthDropdown: (date) => date.toLocaleString('default', { month: 'short' }),
            ...formatters,
        }} classNames={{
            root: (0, utils_1.cn)('w-fit', defaultClassNames.root),
            months: (0, utils_1.cn)('flex gap-4 flex-col md:flex-row relative', defaultClassNames.months),
            month: (0, utils_1.cn)('flex flex-col w-full gap-4', defaultClassNames.month),
            nav: (0, utils_1.cn)('flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between', defaultClassNames.nav),
            button_previous: (0, utils_1.cn)((0, button_1.buttonVariants)({ variant: buttonVariant }), 'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none', defaultClassNames.button_previous),
            button_next: (0, utils_1.cn)((0, button_1.buttonVariants)({ variant: buttonVariant }), 'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none', defaultClassNames.button_next),
            month_caption: (0, utils_1.cn)('flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)', defaultClassNames.month_caption),
            dropdowns: (0, utils_1.cn)('w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5', defaultClassNames.dropdowns),
            dropdown_root: (0, utils_1.cn)('relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md', defaultClassNames.dropdown_root),
            dropdown: (0, utils_1.cn)('absolute bg-popover inset-0 opacity-0', defaultClassNames.dropdown),
            caption_label: (0, utils_1.cn)('select-none font-medium', captionLayout === 'label'
                ? 'text-sm'
                : 'rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5', defaultClassNames.caption_label),
            table: 'w-full border-collapse',
            weekdays: (0, utils_1.cn)('flex', defaultClassNames.weekdays),
            weekday: (0, utils_1.cn)('text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none', defaultClassNames.weekday),
            week: (0, utils_1.cn)('flex w-full mt-2', defaultClassNames.week),
            week_number_header: (0, utils_1.cn)('select-none w-(--cell-size)', defaultClassNames.week_number_header),
            week_number: (0, utils_1.cn)('text-[0.8rem] select-none text-muted-foreground', defaultClassNames.week_number),
            day: (0, utils_1.cn)('relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none', defaultClassNames.day),
            range_start: (0, utils_1.cn)('rounded-l-md bg-accent', defaultClassNames.range_start),
            range_middle: (0, utils_1.cn)('rounded-none', defaultClassNames.range_middle),
            range_end: (0, utils_1.cn)('rounded-r-md bg-accent', defaultClassNames.range_end),
            today: (0, utils_1.cn)('bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none', defaultClassNames.today),
            outside: (0, utils_1.cn)('text-muted-foreground aria-selected:text-muted-foreground', defaultClassNames.outside),
            disabled: (0, utils_1.cn)('text-muted-foreground opacity-50', defaultClassNames.disabled),
            hidden: (0, utils_1.cn)('invisible', defaultClassNames.hidden),
            ...classNames,
        }} components={{
            Root: ({ className, rootRef, ...props }) => {
                return (<div data-slot="calendar" ref={rootRef} className={(0, utils_1.cn)(className)} {...props}/>);
            },
            Chevron: ({ className, orientation, ...props }) => {
                if (orientation === 'left') {
                    return (<lucide_react_1.ChevronLeftIcon className={(0, utils_1.cn)('size-4', className)} {...props}/>);
                }
                if (orientation === 'right') {
                    return (<lucide_react_1.ChevronRightIcon className={(0, utils_1.cn)('size-4', className)} {...props}/>);
                }
                return (<lucide_react_1.ChevronDownIcon className={(0, utils_1.cn)('size-4', className)} {...props}/>);
            },
            DayButton: CalendarDayButton,
            WeekNumber: ({ children, ...props }) => {
                return (<td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>);
            },
            ...components,
        }} {...props}/>);
}
function CalendarDayButton({ className, day, modifiers, ...props }) {
    const defaultClassNames = (0, react_day_picker_1.getDefaultClassNames)();
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (modifiers.focused)
            ref.current?.focus();
    }, [modifiers.focused]);
    return (<button_1.Button ref={ref} variant="ghost" size="icon" data-day={day.date.toLocaleDateString()} data-selected-single={modifiers.selected &&
            !modifiers.range_start &&
            !modifiers.range_end &&
            !modifiers.range_middle} data-range-start={modifiers.range_start} data-range-end={modifiers.range_end} data-range-middle={modifiers.range_middle} className={(0, utils_1.cn)('data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70', defaultClassNames.day, className)} {...props}/>);
}
//# sourceMappingURL=calendar.js.map