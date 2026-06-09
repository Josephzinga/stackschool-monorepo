"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = require("redis");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
if (!REDIS_URL) {
    throw new Error('REDIS_URL is not defined in environment variables');
}
exports.redisClient = (0, redis_1.createClient)({
    url: REDIS_URL,
});
exports.redisClient.on('connect', () => {
    console.log('Connecté à Redis !');
});
exports.redisClient.on('error', (err) => {
    console.error('Erreur de connexion à Redis :', err);
});
exports.redisClient.connect();
//# sourceMappingURL=redis.js.map