"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlateForm = getPlateForm;
exports.parseState = parseState;
function getPlateForm(req) {
    const platform = req.query.plateform === 'mobile' ? 'mobile' : 'web';
    const state = Buffer.from(JSON.stringify({ plateform: platform })).toString('base64');
    return state;
}
function parseState(state) {
    try {
        if (!state)
            return { platform: 'web' };
        return JSON.parse(Buffer.from(state, 'base64').toString());
    }
    catch {
        return { platform: 'web' };
    }
}
//# sourceMappingURL=deep.link.js.map