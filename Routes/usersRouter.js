import express from 'express';
import Users from '../Models/usersModel.js';
import Lesson from "../Models/lessonsModel.js";
import mongoose from "mongoose";
import Signs from "../Models/signsModel.js";
import Category from "../Models/categoriesModel.js";


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
        const users = await Users.find();
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

router.get('/:identifier', async (req, res) => {
    try {
        const identifier = req.params.identifier;
        let user = null;

        // Check if the identifier looks like an email
        if (identifier.includes('@')) {
            // Search by email (case insensitive if needed)
            user = await Users.findOne({ email: identifier });
        } else {
            // Optionally, check if the identifier is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(identifier)) {
                return res.status(400).json({ message: 'Invalid ID format' });
            }
            // Search by id
            user = await Users.findById(identifier);
        }

        if (!user) {
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
        if (req.body.email === "") {
            res.status(400).json({
                message: `Fill in the email`,
            });
        } else {
            const data = req.body;
            if (Array.isArray(data)) {
                let users = req.body; // Assuming req.body contains user data
                const lessons = await Lesson.find(); // Fetch all lessons
                let lessonArray = [];

                for (const lesson of lessons) {
                    lessonArray.push({ lesson_id: new mongoose.Types.ObjectId(lesson._id) });
                }
                for (const user of users) {
                    user.lessonProgress = lessonArray
                }

                const signs = await Signs.find(); // Fetch all lessons
                let signsArray = [];

                for (const sign of signs) {
                    signsArray.push({ sign_id: new mongoose.Types.ObjectId(sign._id) });
                }
                for (const user of users) {
                    user.signsSaved = signsArray
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

                const result = await Users.insertMany(newUsers);
                res.status(201).json({
                    message: 'Users added',
                    users: result
                });
            } else if (typeof data === 'object' && !Array.isArray(data)) {
                const {username, email, role} = req.body;

                // Create a new sign
                const newUser = new Users({
                    username,
                    email,
                    role
                });
                const lessons = await Lesson.find()
                const signs = await Signs.find()
                let lessonArray = [];
                for (const lesson of lessons) {
                    lessonArray.push({ lesson_id: new mongoose.Types.ObjectId(lesson._id) });
                }
                newUser.lessonProgress = lessonArray
                let signsArray = [];
                for (const sign of signs) {
                    signsArray.push({ sign_id: new mongoose.Types.ObjectId(sign._id) });
                }
                newUser.signsSaved = signsArray

                // Save the user to the database
                await newUser.save();

                // Respond with the created sign
                res.status(201).json(newUser);
            }
        }
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

router.patch('/:id', async (req, res) => {
    try {
        const { lessonId, signId, progress, saved } = req.body;
        if (!signId) {
            const lesson_id = new mongoose.Types.ObjectId(lessonId)
            await Users.updateOne(
                { _id: req.params.id, 'lessonProgress.lesson_id': lesson_id },
                { $set: { 'lessonProgress.$.progress': progress } },
                { upsert: true } // Create if it does not exist
            );
        } else {
            const sign_id = new mongoose.Types.ObjectId(signId)
            await Users.updateOne(
                { _id: req.params.id, 'signsSaved.sign_id': sign_id },
                { $set: { 'signsSaved.$.saved': saved } },
                { upsert: true } // Create if it does not exist
            );
        }
        res.status(201).json({ message: 'progress updated'})
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
