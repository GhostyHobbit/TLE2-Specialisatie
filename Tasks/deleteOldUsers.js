import Users from '../Models/usersModel.js';

// Function that deletes users older than 6 months
async function deleteOldUsers() {
    // const oneSecondAgo = new Date();
    // oneSecondAgo.setSeconds(oneSecondAgo.getSeconds() - 1);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    try {
        const result = await Users.deleteMany({
            role: "user",
            // oneSecondAgo
            created_at: { $lt: sixMonthsAgo }
        });

        console.log(`${result.deletedCount} gebruikers ouder dan 6 maanden verwijderd.`);
    } catch (err) {
        console.error('Error tijdens het verwijderen van oude gebruikers:', err);
    }
}

export default deleteOldUsers;
