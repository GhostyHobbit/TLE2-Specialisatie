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

        res.json({ users: items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//GET single user
router.get('/:id', async (req, res) => {
    try {
        const user = await Users.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
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
        const { username, email, password, role } = req.body;

        const validRoles = ['user', 'teacher'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Ongeldige rol. Toegestane rollen zijn: user, teacher' });
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

//PUT voor users
router.put('/:id', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const user = await Users.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User niet gevonden' });
        }

        user.username = username
        user.email = email
        user.password = password
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
            return res.status(404).json({ message: 'User niet gevonden' });
        }
        res.json({ message: `Gebruiker ${user.username} succesvol verwijderd` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;
