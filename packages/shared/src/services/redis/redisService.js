"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisService = exports.RedisService = void 0;
const api_1 = __importDefault(require("../../lib/api"));
class RedisService {
    client;
    constructor(client = api_1.default) {
        this.client = client;
    }
    async saveProgressToRedis(data) {
        const res = await this.client.post('/api/complete-profile/save-progress', data);
        return res.data;
    }
    async loadFromRedis() {
        const res = await this.client.get('/api/complete-profile/load-progress');
        return res.data;
    }
    async clearAllData() {
        await this.client.delete('/api/complete-profile/clear-progress');
    }
}
exports.RedisService = RedisService;
exports.redisService = new RedisService();
//# sourceMappingURL=redisService.js.map