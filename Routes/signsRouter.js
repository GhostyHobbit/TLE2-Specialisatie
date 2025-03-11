import express from 'express';
import Signs from "../Models/signsModel.js";
import {tr} from "@faker-js/faker";

const router = express.Router();

router.options('/', (req, res) => {
    res.json("hallo");
    res.header('Allow', 'GET, POST, OPTIONS');
    res.header('Content-Type', 'application/x-www-form-urlencoded');
    res.header('Accept', 'application/json, application/x-www-form-urlencoded');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH');
    res.status(204).send();
});

router.get('/', async (req, res) => {
    try {
        const signs = await Signs.find();
        const baseUrl = `${req.protocol}://${req.get('host')}/signs`;

        const items = signs.map(signs => ({
            ...signs.toObject(),
            _links: {
                self: {href: `${baseUrl}/${signs._id}`},
                collection: {href: baseUrl}
            }
        }));

        res.json({
            items,
            _links: {
                self: {href: baseUrl},
                collection: {href: baseUrl}
            }
        });
    } catch (e) {
        res.status(404).send('Not found');
    }
});

router.get('/multiplechoice/:id', async (req, res) => {
    try {
        // Fetch the correct sign by ID
        const correctAnswer = await Signs.findById(req.params.id);

        if (!correctAnswer) {
            return res.status(404).json({ message: 'Sign not found' });
        }

        // Fetch three random signs from the same theme, excluding the correct answer
        const randomSigns = await Signs.aggregate([
            { $match: { theme: correctAnswer.category, _id: { $ne: correctAnswer._id } } }, // Match same theme but exclude the correct answer
            { $sample: { size: 3 } } // Get 3 random documents
        ]);

        res.json({
            correctAnswer,
            choices: randomSigns
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', async (req, res) => {

    try {
        const sign = await Signs.findOne({_id: req.params.id});
        if (!sign) {
            return res.status(404).json({message: 'Sign not found'});
        }

        const baseUrl = `${req.protocol}://${req.get('host')}/signs`;
        res.json({
            ...sign.toObject(),
            _links: {
                self: {href: `${baseUrl}/${sign._id}`},
                collection: {href: baseUrl}
            }
        });

    } catch (err) {
        res.status(404).json({message: 'Failed to fetch sign'});
    }
});

router.post('/', async (req, res) => {
    try {
        if (req.body.title === "") {
            res.status(400).json({
                message: `Fill in the title`,
            });
        } else {

            const newSign = await Signs.create({
                title: req.body.title,
                image: req.body.image,
                lesson_id: req.body.lesson_id,
                category_id: req.body.category_id,
                handShape: req.body.handShape,
                saved: req.body.saved,
            });
            res.status(201).json({
                message: `You created ${newSign.title}`,
                id: newSign._id
            });
        }
    } catch (e) {
        res.status(404).send('Not found');
    }
});

router.put('/:id', async (req, res) => {

    try {
        const updatedSign = await Signs.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedSign) {
            return res.status(404).json({message: "Sign not found"});
        }
        res.status(200).json({message: "Sign updated successfully", Signs: updatedSign});

    } catch (e) {
        res.status(404).send('Not found');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedSign = await Signs.findByIdAndDelete(req.params.id);
        if (!deletedSign) {
            return res.status(404).json({message: "Sign not found"});
        }
        res.status(204).json({message: "Sign deleted successfully", skyscraper: deletedSign});
    } catch (e) {
        res.status(400).json({message: "Failed to delete Sign", error: e.message});
    }
});

router.post('/seed', async (req, res) => {

    let letters = ['a', 'b', 'c', 'd', 'e'];
    for (let i = 0; i < letters.length; i++) {
        const newSign = await Signs.create({
            title: letters[i],
            image: 'lorem',
            lesson_id: '1',
            category_id: '1',
            handShape: '1',
            saved: '0',
        });
    }
    res.status(201).json({
        message: `You created a,b,c,d,e`
    });
});


export default router;