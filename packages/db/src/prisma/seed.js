"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const generated_1 = require("../prisma/client/generated");
const date_fns_1 = require("date-fns");
const TARGET_SCHOOL_ID = '';
const START_HOUR = 8;
const END_HOUR = 17;
const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
const LESSON_DURATION = 50;
const BREAK_START = 12;
const BREAK_DURATION = 1;
async function main() {
    console.log('🌱 Début du seeding ciblé...');
    let schoolId = TARGET_SCHOOL_ID;
    const existingSchool = await _1.prisma.school.findUnique({
        where: { id: schoolId },
    });
    if (!existingSchool) {
        console.log("⚠️ École cible introuvable, création d'une nouvelle école...");
        const newSchool = await _1.prisma.school.create({
            data: {
                name: 'Lycée Moderne de Bamako (Seed)',
                address: 'Bamako, Mali',
                code: `LMB${Math.floor(Math.random() * 1000)}`,
                slug: `lycee-moderne-bamako-${Date.now()}`,
            },
        });
        schoolId = newSchool.id;
        console.log(`🏫 Nouvelle école créée : ${schoolId}`);
    }
    else {
        console.log(`🏫 Utilisation de l'école existante : ${existingSchool.name} (${schoolId})`);
    }
    console.log('🧹 Nettoyage des données existantes...');
    await _1.prisma.attendance.deleteMany();
    await _1.prisma.payment.deleteMany();
    await _1.prisma.lesson.deleteMany();
    await _1.prisma.student.deleteMany();
    await _1.prisma.class.deleteMany();
    await _1.prisma.classSubjects.deleteMany();
    await _1.prisma.group.deleteMany();
    await _1.prisma.subject.deleteMany();
    await _1.prisma.teacher.deleteMany();
    const subjectsList = [
        { name: 'Mathématiques', code: 'MATH' },
        { name: 'Physique', code: 'PC' },
        { name: 'SVT', code: 'SVT' },
        { name: 'Français', code: 'FR' },
        { name: 'Anglais', code: 'ANG' },
        { name: 'Histoire-Géo', code: 'HG' },
        { name: 'Philosophie', code: 'PHILO' },
        { name: 'EPS', code: 'EPS' },
    ];
    const subjects = [];
    for (const sub of subjectsList) {
        const s = await _1.prisma.subject.create({
            data: { ...sub, schoolId },
        });
        subjects.push(s);
    }
    console.log(`📚 ${subjects.length} matières créées.`);
    const teachers = [];
    for (const sub of subjects) {
        const username = `prof.${sub?.code?.toLowerCase()}.${Date.now().toString().slice(-4)}`;
        const user = await _1.prisma.user.create({
            data: {
                email: `${username}@stackschool.com`,
                username: username,
                password: 'password123',
                phoneNumber: `+243 85${Math.floor(100000 + Math.random() * 900000)}`,
                profileCompleted: true,
                hasMembership: true,
                profile: {
                    create: {
                        firstname: `${sub.name}prof`,
                        lastname: sub.name,
                        gender: generated_1.Gender.MALE,
                    },
                },
            },
        });
        const schoolUser = await _1.prisma.schoolUser.create({
            data: { userId: user.id, schoolId, role: 'TEACHER' },
        });
        const teacher = await _1.prisma.teacher.create({
            data: {
                schoolUserId: schoolUser.id,
                specialization: sub.name,
                isActive: true,
            },
        });
        teachers.push({ ...teacher, subjectId: sub.id });
    }
    console.log(`👨‍🏫 ${teachers.length} professeurs créés.`);
    const classesList = [
        { name: '10ème B', level: '10eme', section: 'Science' },
        { name: '9ème Sciences', level: '11eme', section: 'Commercial' },
        { name: 'Terminale Sciences', level: 'Tle', section: 'Science' },
        { name: '11ème A', level: '11eme', section: 'Sciences' },
        { name: 'Terminale Lettres', level: 'Tle', section: 'Lettres' },
        { name: 'Terminal Commercial', level: 'Tle', section: 'Commercial' },
    ];
    const classes = [];
    let assignments = [];
    let groupIndex = 1;
    for (const clsData of classesList) {
        const supervisor = teachers[Math.floor(Math.random() * teachers.length)];
        const group = await _1.prisma.group.create({
            data: {
                schoolId,
                name: `Group-${groupIndex}`,
                classSubjects: {
                    create: subjects.map((s) => ({
                        schoolId,
                        subjectId: s.id,
                    })),
                },
            },
            include: {
                classSubjects: true,
            },
        });
        const cls = await _1.prisma.class.create({
            data: {
                ...clsData,
                schoolId,
                supervisorId: supervisor.id,
                groupId: group?.id,
            },
            include: {
                group: {
                    include: {
                        classSubjects: true,
                    },
                },
            },
        });
        groupIndex++;
        classes.push(cls);
    }
    let teacherIndex = 0;
    for (const classe of classes) {
        const randomClassSubject = classe.group.classSubjects[Math.floor(Math.random() * classe.group.classSubjects.length)];
        const assignment = await _1.prisma.teacherAssignment.create({
            data: {
                schoolId,
                teacherId: teachers[Math.floor(Math.random() * teachers.length)]?.id,
                classSubjectId: randomClassSubject.id,
            },
        });
        assignments.push(assignment);
        teacherIndex++;
    }
    console.log(`🎓 ${classes.length} classes créées.`);
    console.log(`${assignments?.length}  crée avec succés.`);
    const createdStudents = [];
    for (const cls of classes) {
        for (let i = 0; i < 5; i++) {
            const gender = i % 2 === 0 ? generated_1.Gender.MALE : generated_1.Gender.FEMALE;
            const fname = gender === 'MALE' ? `Eleve${i}` : `Eleve${i}`;
            const uniqueSuffix = Date.now().toString().slice(-6) + i;
            const user = await _1.prisma.user.create({
                data: {
                    email: `eleve.${cls.id.substring(0, 4)}.${uniqueSuffix}@stackschool.com`,
                    username: `eleve.${uniqueSuffix}`,
                    password: 'password123',
                    profileCompleted: true,
                    hasMembership: true,
                    profile: {
                        create: { firstname: fname, lastname: 'Test', gender },
                    },
                },
                include: { profile: true },
            });
            const schoolUser = await _1.prisma.schoolUser.create({
                data: { userId: user.id, schoolId, role: 'STUDENT' },
            });
            const student = await _1.prisma.student.create({
                data: {
                    schoolUserId: schoolUser.id,
                    schoolId,
                    profileId: user.profile.id,
                    matricule: `STU-${new Date().getFullYear()}-${uniqueSuffix}`,
                    enrollmentYear: '2023-2024',
                    birthDate: new Date('2005-01-01'),
                    classId: cls.id,
                },
            });
            createdStudents.push({ student, user });
        }
    }
    console.log(`👨‍🎓 ${createdStudents.length} élèves créés.`);
    console.log("📅 Génération de l'emploi du temps...");
    let index = 0;
    console.log("📅 Génération de l'emploi du temps...");
    const lessonsCreated = [];
    for (const assignment of assignments) {
        for (const dayEnum of DAYS) {
            let currentHour = START_HOUR;
            let currentMinute = 0;
            while (currentHour < END_HOUR) {
                if (currentHour === 12) {
                    currentHour = 13;
                    currentMinute = 0;
                    continue;
                }
                const isDoubleLesson = Math.random() > 0.5;
                const startTime = (0, date_fns_1.setMinutes)((0, date_fns_1.setHours)(new Date(), currentHour), currentMinute);
                const endTime = (0, date_fns_1.addMinutes)(startTime, isDoubleLesson ? 120 : 60);
                let lesson = {};
                lesson = await _1.prisma.lesson.create({
                    data: {
                        title: `Cours de ...`,
                        day: dayEnum,
                        startTime,
                        endTime,
                        schoolId,
                        teacherAssignmentId: assignment?.id,
                    },
                });
                currentHour = (0, date_fns_1.getHours)(endTime);
                currentMinute = (0, date_fns_1.getMinutes)(endTime);
                lessonsCreated.push(lesson);
            }
        }
    }
    console.log('✅ Emploi du temps généré !');
    console.log('💸 Génération des paiements...');
    for (const { student, user } of createdStudents) {
        await _1.prisma.payment.create({
            data: {
                amount: 50000,
                netAmount: 49500,
                serviceFee: 500,
                status: generated_1.PaymentStatus.SUCCESS,
                type: generated_1.PaymentType.TUITION,
                description: 'Scolarité Trimestre 1',
                providerRef: `OM-${Math.floor(Math.random() * 1000000)}`,
                payerId: user.id,
                payerName: `${user.username}`,
                payerPhone: '+22300000000',
                schoolId,
                studentId: student.id,
                createdAt: (0, date_fns_1.subDays)(new Date(), Math.floor(Math.random() * 30)),
            },
        });
        if (Math.random() > 0.5) {
            await _1.prisma.payment.create({
                data: {
                    amount: 15000,
                    netAmount: 14850,
                    serviceFee: 150,
                    status: generated_1.PaymentStatus.PENDING,
                    type: generated_1.PaymentType.CANTEEN,
                    description: 'Cantine Octobre',
                    schoolId,
                    studentId: student.id,
                    payerName: 'Parent X',
                    payerPhone: '+22311111111',
                    createdAt: new Date(),
                },
            });
        }
    }
    console.log('✅ Paiements générés !');
    console.log('📝 Génération des présences...');
    for (const lesson of lessonsCreated) {
        const studentsInClass = createdStudents.filter((s) => s.student.classId === lesson.classId);
        for (const { student } of studentsInClass) {
            const rand = Math.random();
            let status = 'PRESENT';
            if (rand > 0.95)
                status = 'ABSENT';
            else if (rand > 0.9)
                status = 'LATE';
            await _1.prisma.attendance.create({
                data: {
                    date: lesson.startTime,
                    status,
                    studentId: student.id,
                    schoolId,
                },
            });
        }
    }
    console.log('✅ Présences générées !');
    console.log('🚀 Seeding terminé avec succès.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await _1.prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map