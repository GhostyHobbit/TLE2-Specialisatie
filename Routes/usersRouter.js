import express from 'express';
import Users from '../models/usersModel.js';

const router = express.Router();

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
        }));

        res.json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//POST voor Users
router.post('/', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const validRoles = ['user', 'docent'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Ongeldige rol. Toegestane rollen zijn: user, teacher, moderator, admin.' });
        }

        const newUser = await Users.create({
            username,
            email,
            password,
            role,
        });

        res.status(201).json({
            message: `Gebruiker ${newUser.username} succesvol aangemaakt`,
            id: newUser._id
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;
