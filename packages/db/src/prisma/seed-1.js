"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
async function main() {
    const students = await index_1.prisma.student.findMany();
    for (let i = 0; i < students.length; i++) {
        await index_1.prisma.student.update({
            where: {
                id: students[i].id,
            },
            data: {
                studentNumber: i + 1,
            },
        });
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await index_1.prisma.$disconnect();
});
//# sourceMappingURL=seed-1.js.map