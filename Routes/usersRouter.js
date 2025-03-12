import express from 'express';
import Users from '../Models/usersModel.js';
import Lesson from "../Models/lessonsModel.js";
import mongoose from "mongoose";
import Signs from "../Models/signsModel.js";

const router = express.Router();



router.options('/', (req, res) => {
    res.json("hallo");
    res.header('Allow', 'GET, POST, OPTIONS, DELETE');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, DELETE');
    res.status(204).send();
});


//GET voor Users
router.get('/', async (req, res) => {
    try {
        const users = await Users.find()
            .populate({path: 'lessons', select: 'title'})
            .populate({path: 'signs', select: 'title'});
        const baseUrl = `${req.protocol}://${req.get('host')}/users`;

        const items = users.map(user => ({
            ...user.toObject(),
            _links: {
                self: { href: `${baseUrl}/${user._id}` },
                collection: { href: baseUrl }
            }
        }))

        res.json({ users: items })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//GET single user
router.get('/:id', async (req, res) => {
    try {
        const user = await Users.findById(req.params.id);
        if(!user) {
            return res.status(404).json({ message: 'User bestaat niet of is niet gevonden' });
        }
        const baseUrl = `${req.protocol}://${req.get('host')}/users`;
        const item = {
            ...user.toObject(),
            _links: {
                self: { href: `${baseUrl}/${user._id}` },
                collection: { href: baseUrl }
            }
        };
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//POST voor Users
router.post('/', async (req, res) => {
    try {
        let users = req.body; // Assuming req.body contains user data
        const lessons = await Lesson.find(); // Fetch all lessons
        let lessonIds = lessons.map(lesson => new mongoose.Types.ObjectId(lesson._id));
        users.lessons = lessonIds;

        const signs = await Signs.find(); // Fetch all lessons
        let signIds = signs.map(sign => new mongoose.Types.ObjectId(sign._id));
        users.signs = signIds;

        if (!Array.isArray(users)) {
            users = [users]
        }
        const validRoles = ['user', 'teacher']

        for (const user of users) {
            if(!validRoles.includes(user.role)) {
                return res.status(400).json({ message: `Ongeldige rol voor ${user.email}. Toegestane rollen zijn: user, teacher` });
            }
        }

        const emails = users.map(user =>  user.email)
        const existingUsers = await Users.find({ email: { $in: emails } })
        const existingEmails = existingUsers.map(user => user.email)
        const newUsers = users.filter(user => !existingEmails.includes(user.email))

        const insertedUsers = await Users.insertMany(newUsers);

        for (const user of insertedUsers) {
            await Lesson.updateMany(
                { _id: { $in: lessonIds } },
                { $addToSet: { users: user._id } }
            );
            await Signs.updateMany(
                { _id: { $in: signIds } },
                { $addToSet: { users: user._id } }
            );
        }

        res.status(201).json({
            message: `${insertedUsers.length} gebruikers succesvol aangemaakt. ${existingEmails.length} Gebruikers bestaan al`,
            NewUsers: insertedUsers.map(user => ({
                id: user._id,
                email: user.email
            })),
            ExistingUsers: existingEmails.map(email => ({ email }))
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message })
        }
        res.status(500).json({ message: 'Internal server error' })
    }
})


//PUT voor users
router.put('/:id', async (req, res) => {
    try {
        const { email, role, username } = req.body;

        const user = await Users.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User niet gevonden' })
        }
        user.username = username
        user.email = email
        user.role = role

        await user.save();

        const baseUrl = `${req.protocol}://${req.get('host')}/users`;
        const updatedUser = {
            ...user.toObject(),
            _links: {
                self: { href: `${baseUrl}/${user._id}` },
                collection: { href: baseUrl }
            }
        };

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//DELETE voor users
router.delete('/:id', async (req, res) => {
    try {
        const user = await Users.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User niet gevonden' })
        }
        res.json({ message: `Gebruiker ${user.email} succesvol verwijderd` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' })
    }
})

//DELETE all voor testing
router.delete('/', async (req, res) => {
    try {
        const result = await Users.deleteMany({})
        res.json({ message: `${ result.deletedCount} gebruikers deleted` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' })
    }
})
export default router;
