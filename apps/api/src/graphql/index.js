"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("graphql-http/lib/use/express");
const schema_1 = require("@graphql-tools/schema");
const node_path_1 = __importDefault(require("node:path"));
const fs = __importStar(require("node:fs"));
const searchSchool_resolver_1 = require("./resolvers/searchSchool.resolver");
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const confirm_complete_profile_resolver_1 = require("./resolvers/confirm-complete-profile.resolver");
const me_resolver_1 = require("./resolvers/me.resolver");
const school_resolver_1 = require("./resolvers/school.resolver");
const shared_1 = require("@stackschool/shared");
const db_1 = require("@stackschool/db");
const zod_1 = require("zod");
const data_loader_1 = require("./resolvers/data-loader");
const subject_resolver_1 = require("./resolvers/subject.resolver");
const api_errors_1 = require("../utils/api-errors");
const room_resolver_1 = require("./resolvers/room.resolver");
const groups_resolver_1 = require("./resolvers/groups.resolver");
const parent_query_resolver_1 = require("./resolvers/parent/parent-query.resolver");
const parent_resolver_1 = require("./resolvers/parent/parent.resolver");
const parent_mutation_resolver_1 = require("./resolvers/parent/parent-mutation.resolver");
const lesson_1 = require("./resolvers/lesson");
const classSubject_1 = require("./resolvers/classSubject");
const class_1 = require("./resolvers/class");
const teacher_1 = require("./resolvers/teacher");
const student_1 = require("./resolvers/student");
const attendance_resolver_1 = require("./resolvers/attendance.resolver");
const dirPath = node_path_1.default.resolve(__dirname, '../../../../packages/shared/src/graphql');
const dirSchema = fs.readdirSync(dirPath, 'utf-8');
const files = dirSchema.filter((f) => f.includes('.graphql'));
let typeDefs = '';
for (const file of files) {
    typeDefs += fs.readFileSync(`${dirPath}/${file}`, 'utf-8') + '\n';
}
const resolvers = (0, lodash_merge_1.default)({}, me_resolver_1.meResolver, school_resolver_1.schoolResolver, teacher_1.teacherResolvers, student_1.studentResolvers, class_1.classResolvers, lesson_1.lessonResolvers, searchSchool_resolver_1.searchSchoolResolver, confirm_complete_profile_resolver_1.confirmCompleteProfileResolver, classSubject_1.classSubjectResolvers, subject_resolver_1.subjectResolver, room_resolver_1.RoomResolver, groups_resolver_1.groupResolver, parent_query_resolver_1.parentQueryResolver, parent_resolver_1.parentResolver, parent_mutation_resolver_1.parentMutationResolver, attendance_resolver_1.attendanceResolver);
const schema = (0, schema_1.makeExecutableSchema)({
    typeDefs,
    resolvers,
});
const graphqlMiddleware = (0, express_1.createHandler)({
    schema,
    context: async (req) => {
        const { user, schoolId, membership } = await getSchoolMember(req);
        return {
            user,
            schoolId,
            membership,
            loaders: (0, data_loader_1.createLoaders)(db_1.prisma),
            prisma: db_1.prisma,
        };
    },
    formatError: (err) => {
        console.error("Message d'erreur graphql \n", err.message);
        if (err instanceof zod_1.ZodError) {
            return {
                message: 'Erreur de validation',
                code: 400,
                name: 'VALIDATION_ERROR',
                details: err.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                })),
            };
        }
        if (err instanceof shared_1.ServiceError) {
            return {
                message: err.message,
                code: err.statusCode || 500,
                name: 'SERVICE_ERROR',
            };
        }
        return {
            message: err.message || 'Une erreur interne est survenue',
            code: 500,
            name: 'INTERNAL_SERVER_ERROR',
        };
    },
});
exports.default = graphqlMiddleware;
const getSchoolMember = async (req) => {
    const user = req.raw.user;
    const schoolId = req.raw.headers['x-school-id'];
    let membership = null;
    if (user && schoolId) {
        membership = await db_1.prisma.schoolUser.findUnique({
            where: {
                schoolId_userId: {
                    userId: user.id,
                    schoolId: schoolId,
                },
            },
        });
        if (!membership) {
            throw (0, api_errors_1.createServiceError)('Accès refusé à cette école', 403);
        }
    }
    return {
        user,
        schoolId,
        membership,
    };
};
//# sourceMappingURL=index.js.map