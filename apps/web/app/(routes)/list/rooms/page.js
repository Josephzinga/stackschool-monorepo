'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RoomsPage;
const data_table_1 = require("@/components/school/room/data-table");
const columns_1 = require("@/components/school/room/columns");
const ui_1 = require("@stackschool/ui");
const react_1 = require("react");
const room_form_dialog_1 = require("@/components/school/room/room-form-dialog");
const useDebounce_1 = require("@/hooks/useDebounce");
const table_header_1 = require("@/components/school/room/table-header");
function RoomsPage() {
    const [open, setOpen] = (0, react_1.useState)(false);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const search = (0, useDebounce_1.useDebounce)(searchTerm, 400);
    const { data, isPending } = (0, ui_1.useGetSchoolRoomQuery)({
        filter: {
            limit: 10,
            searchTerm: search,
        },
    });
    const roomData = data?.getSchoolRooms?.data || [];
    return (<div className="flex flex-col h-full p-3 md:p-6 z-10 gap-3">
      <table_header_1.RoomTableHeader />
      <data_table_1.RoomDataTable data={roomData} meta={data?.getSchoolRooms?.meta ?? undefined} columns={columns_1.columns} isLoading={false}/>
      <div className="flex justify-between">
        <room_form_dialog_1.RoomFormDialog open={open} onOpenChange={setOpen}/>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map