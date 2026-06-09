"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CreateInvitation;
const Container_1 = require("@/components/Container");
const create_invitation_form_1 = require("@/components/school/create-invitation-form");
const card_1 = require("@/components/ui/card");
function CreateInvitation() {
    return (<Container_1.Container>
      <card_1.Card>
        <create_invitation_form_1.CreateInvitationForm schoolId="cmkfkbtoy00003pqhbh6nn8ch"/>
      </card_1.Card>
    </Container_1.Container>);
}
//# sourceMappingURL=page.js.map