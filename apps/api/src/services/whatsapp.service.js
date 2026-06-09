"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sendWhatsAppMessage;
const twilio_1 = __importDefault(require("twilio"));
const api_errors_1 = require("../utils/api-errors");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_ACCOUNT_TOKEN;
const client = (0, twilio_1.default)(accountSid, authToken);
async function sendWhatsAppMessage(to, message) {
    try {
        console.log('Message send to', to, message);
    }
    catch (error) {
        (0, api_errors_1.createServiceError)("Erreur d'envoie de message whatsapp:", 500, error);
    }
}
//# sourceMappingURL=whatsapp.service.js.map