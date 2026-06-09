"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoomSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createRoomSchema = zod_1.default.object({
    id: zod_1.default.cuid().optional(),
    name: zod_1.default.string().min(1, 'Le nom de la salle est requise.'),
    capacity: zod_1.default.coerce
        .number()
        .min(1, 'Le nombre de place doit être superieur à 1')
        .optional(),
    type: zod_1.default.string().optional(),
    defaultClassId: zod_1.default.cuid().optional(),
    code: zod_1.default.string().optional(),
});
//# sourceMappingURL=room.schema.js.map