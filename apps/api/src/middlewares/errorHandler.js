"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendApiResponse = sendApiResponse;
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const shared_1 = require("@stackschool/shared");
function sendApiResponse(res, statusCode, data = {}, ok = false) {
    if (res.headersSent) {
        return;
    }
    return res.status(statusCode).json({
        ok,
        ...data,
    });
}
function errorHandler(err, req, res, next) {
    console.error('🔥 Erreur capturée :', err);
    if (err instanceof shared_1.ServiceError) {
        return sendApiResponse(res, err.statusCode, {
            message: err.message || 'Erreurr interne du serveur',
            details: err.details,
        });
    }
    if (err instanceof zod_1.ZodError) {
        console.log('ZodError', err.message);
        return sendApiResponse(res, 400, {
            message: "Données d'entrée non valides",
            issues: err.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            })),
        });
    }
    if ((Array.isArray(err) && err.length > 0 && err[0].field) ||
        err[0].message) {
        return sendApiResponse(res, 400, {
            message: 'Erreur de validation',
            issues: err,
        });
    }
    if (err.message &&
        !err.statusCode &&
        (err.name === 'AuthenticationError' || err.type === 'auth')) {
        return sendApiResponse(res, 401, { message: err.message });
    }
    const isProduction = process.env.NODE_ENV === 'production';
    return sendApiResponse(res, 500, {
        message: 'Une erreur interne est survenue. Veuillez réessayer plus tard.',
        ...(isProduction ? {} : { originalError: err.message, stack: err.stack }),
    });
}
//# sourceMappingURL=errorHandler.js.map