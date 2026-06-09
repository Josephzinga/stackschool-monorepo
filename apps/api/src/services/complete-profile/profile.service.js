"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleProfileUpdate = handleProfileUpdate;
async function handleProfileUpdate(tx, userId, profileData) {
    if (!profileData)
        return;
    const userDataToUpdate = {};
    if (profileData.email)
        userDataToUpdate.email = profileData.email;
    if (profileData.phoneNumber)
        userDataToUpdate.phoneNumber = profileData.phoneNumber;
    if (Object.keys(userDataToUpdate).length > 0) {
        await tx.user.update({
            where: { id: userId },
            data: userDataToUpdate,
        });
    }
    await tx.profile.upsert({
        where: { userId },
        create: {
            userId,
            firstname: profileData.firstname,
            lastname: profileData.lastname,
            photo: profileData.photo,
            gender: profileData.gender,
        },
        update: {
            firstname: profileData.firstname,
            lastname: profileData.lastname,
            photo: profileData.photo,
            gender: profileData.gender,
        },
    });
}
//# sourceMappingURL=profile.service.js.map