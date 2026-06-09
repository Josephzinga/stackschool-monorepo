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
exports.schema = void 0;
exports.DataTable = DataTable;
const React = __importStar(require("react"));
const core_1 = require("@dnd-kit/core");
const modifiers_1 = require("@dnd-kit/modifiers");
const sortable_1 = require("@dnd-kit/sortable");
const utilities_1 = require("@dnd-kit/utilities");
const icons_react_1 = require("@tabler/icons-react");
const react_table_1 = require("@tanstack/react-table");
const recharts_1 = require("recharts");
const sonner_1 = require("sonner");
const zod_1 = require("zod");
const use_mobile_1 = require("@/hooks/use-mobile");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const chart_1 = require("@/components/ui/chart");
const checkbox_1 = require("@/components/ui/checkbox");
const drawer_1 = require("@/components/ui/drawer");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const select_1 = require("@/components/ui/select");
const separator_1 = require("@/components/ui/separator");
const table_1 = require("@/components/ui/table");
const tabs_1 = require("@/components/ui/tabs");
exports.schema = zod_1.z.object({
    id: zod_1.z.number(),
    header: zod_1.z.string(),
    type: zod_1.z.string(),
    status: zod_1.z.string(),
    target: zod_1.z.string(),
    limit: zod_1.z.string(),
    reviewer: zod_1.z.string(),
});
function DragHandle({ id }) {
    const { attributes, listeners } = (0, sortable_1.useSortable)({
        id,
    });
    return (<button_1.Button {...attributes} {...listeners} variant="ghost" size="icon" className="size-7 text-muted-foreground hover:bg-transparent">
      <icons_react_1.IconGripVertical className="size-3 text-muted-foreground"/>
      <span className="sr-only">Drag to reorder</span>
    </button_1.Button>);
}
const columns = [
    {
        id: 'drag',
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id}/>,
    },
    {
        id: 'select',
        header: ({ table }) => (<div className="flex items-center justify-center">
        <checkbox_1.Checkbox checked={table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && 'indeterminate')} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all"/>
      </div>),
        cell: ({ row }) => (<div className="flex items-center justify-center">
        <checkbox_1.Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row"/>
      </div>),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'header',
        header: 'Header',
        cell: ({ row }) => {
            return <TableCellViewer item={row.original}/>;
        },
        enableHiding: false,
    },
    {
        accessorKey: 'type',
        header: 'Section Type',
        cell: ({ row }) => (<div className="w-32">
        <badge_1.Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.type}
        </badge_1.Badge>
      </div>),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (<badge_1.Badge variant="outline" className="px-1.5 text-muted-foreground">
        {row.original.status === 'Done' ? (<icons_react_1.IconCircleCheckFilled className="fill-green-500 dark:fill-green-400"/>) : (<icons_react_1.IconLoader />)}
        {row.original.status}
      </badge_1.Badge>),
    },
    {
        accessorKey: 'target',
        header: () => <div className="w-full text-right">Target</div>,
        cell: ({ row }) => (<form onSubmit={(e) => {
                e.preventDefault();
                sonner_1.toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
                    loading: `Saving ${row.original.header}`,
                    success: 'Done',
                    error: 'Error',
                });
            }}>
        <label_1.Label htmlFor={`${row.original.id}-target`} className="sr-only">
          Target
        </label_1.Label>
        <input_1.Input className="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:hover:bg-input/30 dark:focus-visible:bg-input/30" defaultValue={row.original.target} id={`${row.original.id}-target`}/>
      </form>),
    },
    {
        accessorKey: 'limit',
        header: () => <div className="w-full text-right">Limit</div>,
        cell: ({ row }) => (<form onSubmit={(e) => {
                e.preventDefault();
                sonner_1.toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
                    loading: `Saving ${row.original.header}`,
                    success: 'Done',
                    error: 'Error',
                });
            }}>
        <label_1.Label htmlFor={`${row.original.id}-limit`} className="sr-only">
          Limit
        </label_1.Label>
        <input_1.Input className="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:hover:bg-input/30 dark:focus-visible:bg-input/30" defaultValue={row.original.limit} id={`${row.original.id}-limit`}/>
      </form>),
    },
    {
        accessorKey: 'reviewer',
        header: 'Reviewer',
        cell: ({ row }) => {
            const isAssigned = row.original.reviewer !== 'Assign reviewer';
            if (isAssigned) {
                return row.original.reviewer;
            }
            return (<>
          <label_1.Label htmlFor={`${row.original.id}-reviewer`} className="sr-only">
            Reviewer
          </label_1.Label>
          <select_1.Select>
            <select_1.SelectTrigger className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate" size="sm" id={`${row.original.id}-reviewer`}>
              <select_1.SelectValue placeholder="Assign reviewer"/>
            </select_1.SelectTrigger>
            <select_1.SelectContent align="end">
              <select_1.SelectItem value="Eddie Lake">Eddie Lake</select_1.SelectItem>
              <select_1.SelectItem value="Jamik Tashpulatov">
                Jamik Tashpulatov
              </select_1.SelectItem>
            </select_1.SelectContent>
          </select_1.Select>
        </>);
        },
    },
    {
        id: 'actions',
        cell: () => (<dropdown_menu_1.DropdownMenu>
        <dropdown_menu_1.DropdownMenuTrigger asChild>
          <button_1.Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted" size="icon">
            <icons_react_1.IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </button_1.Button>
        </dropdown_menu_1.DropdownMenuTrigger>
        <dropdown_menu_1.DropdownMenuContent align="end" className="w-32">
          <dropdown_menu_1.DropdownMenuItem>Edit</dropdown_menu_1.DropdownMenuItem>
          <dropdown_menu_1.DropdownMenuItem>Make a copy</dropdown_menu_1.DropdownMenuItem>
          <dropdown_menu_1.DropdownMenuItem>Favorite</dropdown_menu_1.DropdownMenuItem>
          <dropdown_menu_1.DropdownMenuSeparator />
          <dropdown_menu_1.DropdownMenuItem variant="destructive">Delete</dropdown_menu_1.DropdownMenuItem>
        </dropdown_menu_1.DropdownMenuContent>
      </dropdown_menu_1.DropdownMenu>),
    },
];
function DraggableRow({ row }) {
    const { transform, transition, setNodeRef, isDragging } = (0, sortable_1.useSortable)({
        id: row.original.id,
    });
    return (<table_1.TableRow data-state={row.getIsSelected() && 'selected'} data-dragging={isDragging} ref={setNodeRef} className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80" style={{
            transform: utilities_1.CSS.Transform.toString(transform),
            transition: transition,
        }}>
      {row.getVisibleCells().map((cell) => (<table_1.TableCell key={cell.id}>
          {(0, react_table_1.flexRender)(cell.column.columnDef.cell, cell.getContext())}
        </table_1.TableCell>))}
    </table_1.TableRow>);
}
function DataTable({ data: initialData, }) {
    const [data, setData] = React.useState(() => initialData);
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [sorting, setSorting] = React.useState([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const sortableId = React.useId();
    const sensors = (0, core_1.useSensors)((0, core_1.useSensor)(core_1.MouseSensor, {}), (0, core_1.useSensor)(core_1.TouchSensor, {}), (0, core_1.useSensor)(core_1.KeyboardSensor, {}));
    const dataIds = React.useMemo(() => data?.map(({ id }) => id) || [], [data]);
    const table = (0, react_table_1.useReactTable)({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: (0, react_table_1.getCoreRowModel)(),
        getFilteredRowModel: (0, react_table_1.getFilteredRowModel)(),
        getPaginationRowModel: (0, react_table_1.getPaginationRowModel)(),
        getSortedRowModel: (0, react_table_1.getSortedRowModel)(),
        getFacetedRowModel: (0, react_table_1.getFacetedRowModel)(),
        getFacetedUniqueValues: (0, react_table_1.getFacetedUniqueValues)(),
    });
    function handleDragEnd(event) {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            setData((data) => {
                const oldIndex = dataIds.indexOf(active.id);
                const newIndex = dataIds.indexOf(over.id);
                return (0, sortable_1.arrayMove)(data, oldIndex, newIndex);
            });
        }
    }
    return (<tabs_1.Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <label_1.Label htmlFor="view-selector" className="sr-only">
          View
        </label_1.Label>
        <select_1.Select defaultValue="outline">
          <select_1.SelectTrigger className="flex w-fit @4xl/main:hidden" size="sm" id="view-selector">
            <select_1.SelectValue placeholder="Select a view"/>
          </select_1.SelectTrigger>
          <select_1.SelectContent>
            <select_1.SelectItem value="outline">Outline</select_1.SelectItem>
            <select_1.SelectItem value="past-performance">Past Performance</select_1.SelectItem>
            <select_1.SelectItem value="key-personnel">Key Personnel</select_1.SelectItem>
            <select_1.SelectItem value="focus-documents">Focus Documents</select_1.SelectItem>
          </select_1.SelectContent>
        </select_1.Select>
        <tabs_1.TabsList className="hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex">
          <tabs_1.TabsTrigger value="outline">Outline</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="past-performance">
            Past Performance <badge_1.Badge variant="secondary">3</badge_1.Badge>
          </tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="key-personnel">
            Key Personnel <badge_1.Badge variant="secondary">2</badge_1.Badge>
          </tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="focus-documents">Focus Documents</tabs_1.TabsTrigger>
        </tabs_1.TabsList>
        <div className="flex items-center gap-2">
          <dropdown_menu_1.DropdownMenu>
            <dropdown_menu_1.DropdownMenuTrigger asChild>
              <button_1.Button variant="outline" size="sm">
                <icons_react_1.IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <icons_react_1.IconChevronDown />
              </button_1.Button>
            </dropdown_menu_1.DropdownMenuTrigger>
            <dropdown_menu_1.DropdownMenuContent align="end" className="w-56">
              {table
            .getAllColumns()
            .filter((column) => typeof column.accessorFn !== 'undefined' &&
            column.getCanHide())
            .map((column) => {
            return (<dropdown_menu_1.DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                      {column.id}
                    </dropdown_menu_1.DropdownMenuCheckboxItem>);
        })}
            </dropdown_menu_1.DropdownMenuContent>
          </dropdown_menu_1.DropdownMenu>
          <button_1.Button variant="outline" size="sm">
            <icons_react_1.IconPlus />
            <span className="hidden lg:inline">Add Section</span>
          </button_1.Button>
        </div>
      </div>
      <tabs_1.TabsContent value="outline" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <core_1.DndContext collisionDetection={core_1.closestCenter} modifiers={[modifiers_1.restrictToVerticalAxis]} onDragEnd={handleDragEnd} sensors={sensors} id={sortableId}>
            <table_1.Table>
              <table_1.TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (<table_1.TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                return (<table_1.TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                        ? null
                        : (0, react_table_1.flexRender)(header.column.columnDef.header, header.getContext())}
                        </table_1.TableHead>);
            })}
                  </table_1.TableRow>))}
              </table_1.TableHeader>
              <table_1.TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (<sortable_1.SortableContext items={dataIds} strategy={sortable_1.verticalListSortingStrategy}>
                    {table.getRowModel().rows.map((row) => (<DraggableRow key={row.id} row={row}/>))}
                  </sortable_1.SortableContext>) : (<table_1.TableRow>
                    <table_1.TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </table_1.TableCell>
                  </table_1.TableRow>)}
              </table_1.TableBody>
            </table_1.Table>
          </core_1.DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <label_1.Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </label_1.Label>
              <select_1.Select value={`${table.getState().pagination.pageSize}`} onValueChange={(value) => {
            table.setPageSize(Number(value));
        }}>
                <select_1.SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <select_1.SelectValue placeholder={table.getState().pagination.pageSize}/>
                </select_1.SelectTrigger>
                <select_1.SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (<select_1.SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </select_1.SelectItem>))}
                </select_1.SelectContent>
              </select_1.Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <button_1.Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                <span className="sr-only">Go to first page</span>
                <icons_react_1.IconChevronsLeft />
              </button_1.Button>
              <button_1.Button variant="outline" className="size-8" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <span className="sr-only">Go to previous page</span>
                <icons_react_1.IconChevronLeft />
              </button_1.Button>
              <button_1.Button variant="outline" className="size-8" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                <span className="sr-only">Go to next page</span>
                <icons_react_1.IconChevronRight />
              </button_1.Button>
              <button_1.Button variant="outline" className="hidden size-8 lg:flex" size="icon" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                <span className="sr-only">Go to last page</span>
                <icons_react_1.IconChevronsRight />
              </button_1.Button>
            </div>
          </div>
        </div>
      </tabs_1.TabsContent>
      <tabs_1.TabsContent value="past-performance" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </tabs_1.TabsContent>
      <tabs_1.TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </tabs_1.TabsContent>
      <tabs_1.TabsContent value="focus-documents" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </tabs_1.TabsContent>
    </tabs_1.Tabs>);
}
const chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
];
const chartConfig = {
    desktop: {
        label: 'Desktop',
        color: 'var(--primary)',
    },
    mobile: {
        label: 'Mobile',
        color: 'var(--primary)',
    },
};
function TableCellViewer({ item }) {
    const isMobile = (0, use_mobile_1.useIsMobile)();
    return (<drawer_1.Drawer direction={isMobile ? 'bottom' : 'right'}>
      <drawer_1.DrawerTrigger asChild>
        <button_1.Button variant="link" className="w-fit px-0 text-left text-foreground">
          {item.header}
        </button_1.Button>
      </drawer_1.DrawerTrigger>
      <drawer_1.DrawerContent>
        <drawer_1.DrawerHeader className="gap-1">
          <drawer_1.DrawerTitle>{item.header}</drawer_1.DrawerTitle>
          <drawer_1.DrawerDescription>
            Showing total visitors for the last 6 months
          </drawer_1.DrawerDescription>
        </drawer_1.DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (<>
              <chart_1.ChartContainer config={chartConfig}>
                <recharts_1.AreaChart accessibilityLayer data={chartData} margin={{
                left: 0,
                right: 10,
            }}>
                  <recharts_1.CartesianGrid vertical={false}/>
                  <recharts_1.XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} hide/>
                  <chart_1.ChartTooltip cursor={false} content={<chart_1.ChartTooltipContent indicator="dot"/>}/>
                  <recharts_1.Area dataKey="mobile" type="natural" fill="var(--color-mobile)" fillOpacity={0.6} stroke="var(--color-mobile)" stackId="a"/>
                  <recharts_1.Area dataKey="desktop" type="natural" fill="var(--color-desktop)" fillOpacity={0.4} stroke="var(--color-desktop)" stackId="a"/>
                </recharts_1.AreaChart>
              </chart_1.ChartContainer>
              <separator_1.Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Trending up by 5.2% this month{' '}
                  <icons_react_1.IconTrendingUp className="size-4"/>
                </div>
                <div className="text-muted-foreground">
                  Showing total visitors for the last 6 months. This is just
                  some random text to test the layout. It spans multiple lines
                  and should wrap around.
                </div>
              </div>
              <separator_1.Separator />
            </>)}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <label_1.Label htmlFor="header">Header</label_1.Label>
              <input_1.Input id="header" defaultValue={item.header}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <label_1.Label htmlFor="type">Type</label_1.Label>
                <select_1.Select defaultValue={item.type}>
                  <select_1.SelectTrigger id="type" className="w-full">
                    <select_1.SelectValue placeholder="Select a type"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectItem value="Table of Contents">
                      Table of Contents
                    </select_1.SelectItem>
                    <select_1.SelectItem value="Executive Summary">
                      Executive Summary
                    </select_1.SelectItem>
                    <select_1.SelectItem value="Technical Approach">
                      Technical Approach
                    </select_1.SelectItem>
                    <select_1.SelectItem value="Design">Design</select_1.SelectItem>
                    <select_1.SelectItem value="Capabilities">Capabilities</select_1.SelectItem>
                    <select_1.SelectItem value="Focus Documents">
                      Focus Documents
                    </select_1.SelectItem>
                    <select_1.SelectItem value="Narrative">Narrative</select_1.SelectItem>
                    <select_1.SelectItem value="Cover Page">Cover Page</select_1.SelectItem>
                  </select_1.SelectContent>
                </select_1.Select>
              </div>
              <div className="flex flex-col gap-3">
                <label_1.Label htmlFor="status">Status</label_1.Label>
                <select_1.Select defaultValue={item.status}>
                  <select_1.SelectTrigger id="status" className="w-full">
                    <select_1.SelectValue placeholder="Select a status"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectItem value="Done">Done</select_1.SelectItem>
                    <select_1.SelectItem value="In Progress">In Progress</select_1.SelectItem>
                    <select_1.SelectItem value="Not Started">Not Started</select_1.SelectItem>
                  </select_1.SelectContent>
                </select_1.Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <label_1.Label htmlFor="target">Target</label_1.Label>
                <input_1.Input id="target" defaultValue={item.target}/>
              </div>
              <div className="flex flex-col gap-3">
                <label_1.Label htmlFor="limit">Limit</label_1.Label>
                <input_1.Input id="limit" defaultValue={item.limit}/>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label_1.Label htmlFor="reviewer">Reviewer</label_1.Label>
              <select_1.Select defaultValue={item.reviewer}>
                <select_1.SelectTrigger id="reviewer" className="w-full">
                  <select_1.SelectValue placeholder="Select a reviewer"/>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  <select_1.SelectItem value="Eddie Lake">Eddie Lake</select_1.SelectItem>
                  <select_1.SelectItem value="Jamik Tashpulatov">
                    Jamik Tashpulatov
                  </select_1.SelectItem>
                  <select_1.SelectItem value="Emily Whalen">Emily Whalen</select_1.SelectItem>
                </select_1.SelectContent>
              </select_1.Select>
            </div>
          </form>
        </div>
        <drawer_1.DrawerFooter>
          <button_1.Button>Submit</button_1.Button>
          <drawer_1.DrawerClose asChild>
            <button_1.Button variant="outline">Done</button_1.Button>
          </drawer_1.DrawerClose>
        </drawer_1.DrawerFooter>
      </drawer_1.DrawerContent>
    </drawer_1.Drawer>);
}
//# sourceMappingURL=data-table.js.map