"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Page;
const table_provider_1 = require("@/components/school/class/table/table-provider");
const class_view_1 = require("@/app/(routes)/list/classes/class-view");
function Page() {
    return (<table_provider_1.TableProvider>
      <class_view_1.ClassView />
    </table_provider_1.TableProvider>);
}
//# sourceMappingURL=page.js.map