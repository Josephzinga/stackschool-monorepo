"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const connect_pg_simple_1 = __importDefault(require("connect-pg-simple"));
const pg_1 = __importDefault(require("pg"));
const helmet_1 = __importDefault(require("helmet"));
const setup_local_strategy_1 = __importDefault(require("./lib/setup-local-strategy"));
const handle_redis_user_1 = require("./lib/handle-redis-user");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./constant/config");
const errorHandler_1 = require("./middlewares/errorHandler");
const graphql_1 = __importDefault(require("./graphql"));
const auth_1 = require("./middlewares/auth");
const routes_1 = __importDefault(require("./routes"));
const express_useragent_1 = require("express-useragent");
const node_http_1 = require("node:http");
const socket_1 = require("./lib/socket");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const passport_social_controller_1 = __importDefault(require("./controllers/passport-social.controller"));
const forgot_password_controller_1 = __importDefault(require("./controllers/auth/forgot-password.controller"));
(0, dotenv_1.config)();
const PORT = Number(process.env.PORT) || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:3000';
const NODE_ENV = process.env.NODE_ENV || 'development';
const app = (0, express_1.default)();
const httpServer = (0, node_http_1.createServer)(app);
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [FRONTEND_ORIGIN],
    credentials: true,
    methods: ['POST', 'GET', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-school-id'],
}));
exports.io = (0, socket_1.initSocket)(httpServer, FRONTEND_ORIGIN);
app.use((0, express_useragent_1.express)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
const pgSession = (0, connect_pg_simple_1.default)(express_session_1.default);
const pgPool = new pg_1.default.Pool({
    connectionString: process.env.DATABASE_URL,
});
const SESSION_TTL = 1000 * 60 * 30;
app.use((0, express_session_1.default)({
    store: new pgSession({
        pool: pgPool,
        tableName: 'Session',
    }),
    name: 'sid',
    secret: config_1.JWT_SECRET || 'default_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: NODE_ENV === 'production',
        httpOnly: true,
        maxAge: SESSION_TTL,
        sameSite: 'lax',
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await (0, handle_redis_user_1.getUserFromRedis)(id);
        if (!user)
            return done(null, false);
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
});
(0, setup_local_strategy_1.default)();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => (0, passport_social_controller_1.default)(accessToken, refreshToken, profile, done, 'google')));
passport_1.default.use(new passport_facebook_1.Strategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    enableProof: true,
    profileFields: ['id', 'displayName', 'emails', 'photos'],
}, (accessToken, refreshToken, profile, done) => (0, passport_social_controller_1.default)(refreshToken, accessToken, profile, done, 'facebook')));
app.use('/api', routes_1.default);
app.use('/api/auth', forgot_password_controller_1.default);
app.all('/graphql', auth_1.isAuthenticated, graphql_1.default);
app.get('/', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, './index.html'));
});
app.use(express_1.default.static(path_1.default.resolve(process.cwd(), 'public')));
app.use(errorHandler_1.errorHandler);
httpServer.listen(PORT, () => {
    console.log(`server is running on port http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map