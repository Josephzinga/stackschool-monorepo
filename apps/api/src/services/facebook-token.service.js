"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyFacebookToken = verifyFacebookToken;
const shared_1 = require("@stackschool/shared");
const crypto_1 = __importDefault(require("crypto"));
const api_errors_1 = require("../utils/api-errors");
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
async function verifyFacebookToken(accessToken) {
    const appsecret_proof = crypto_1.default
        .createHmac('sha256', FACEBOOK_APP_SECRET)
        .update(accessToken)
        .digest('hex');
    const field = 'id,name,email,first_name,last_name,picture';
    const url = `https://graph.facebook.com/me?fields=${field}&access_token=${accessToken}&appsecret_proof=${appsecret_proof}`;
    try {
        const res = await shared_1.api.post(url);
        if (!res.data || res.data.error) {
            throw (0, api_errors_1.createServiceError)('Invalid Facebook token');
        }
        return res.data;
    }
    catch (error) {
        throw (0, api_errors_1.createServiceError)('Invalid Facebook token', 401, error);
    }
}
//# sourceMappingURL=facebook-token.service.js.map