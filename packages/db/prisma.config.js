"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("prisma/config");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.default = (0, config_1.defineConfig)({
    schema: './src/prisma/schema.prisma',
    migrations: {
        seed: 'tsx ./src/prisma/seed.ts',
        path: './src/prisma/migrations',
    },
    datasource: {
        url: process.env.DATABASE_URL,
    },
});
//# sourceMappingURL=prisma.config.js.map