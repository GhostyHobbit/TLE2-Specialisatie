import express from 'express';
import Signs from "../Models/signsModel.js";
import Users from '../Models/usersModel.js';
import {tr} from "@faker-js/faker";
import Category from "../Models/categoriesModel.js";
import mongoose from "mongoose";
import Lesson from "../Models/lessonsModel.js";

const router = express.Router();

router.options('/', (req, res) => {
    res.header('Allow', 'GET, POST, OPTIONS');
    res.header('Content-Type', 'application/x-www-form-urlencoded');
    res.header('Accept', 'application/json, application/x-www-form-urlencoded');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH');
    res.status(204).send();
});

router.get('/', async (req, res) => {
    try {
        // Extract pagination parameters from the query string (defaults: page 1, limit 10)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit;
        const search = req.query.search ? req.query.search.trim().toLowerCase() : "";
        // Build a query object with optional filters
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
            ];
        }

        // Execute count and query concurrently with the defined filters and pagination
        const [total, signs] = await Promise.all([
            Signs.countDocuments(query),
            Signs.find(query)
                .skip(skip)
                .limit(limit)
        ]);

        const baseUrl = `${req.protocol}://${req.get('host')}/signs`;
        const items = signs.map(sign => ({
            ...sign.toObject(),
            _links: {
                self: { href: `${baseUrl}/${sign._id}` },
                collection: { href: baseUrl }
            }
        }));

        const totalPages = Math.ceil(total / limit);
        const pagination = {
            totalItems: total,
            totalPages,
            currentPage: page,
            perPage: limit,
            previousPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            search: search
        };

        res.json({
            items,
            pagination,
            _links: {
                self: { href: baseUrl },
                collection: { href: baseUrl }
            }
        });
    } catch (e) {
        console.error('Error in GET /signs:', e);
        res.status(500).json({ message: 'Internal server error', error: e.message });
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
            const data = req.body;
            if (Array.isArray(data)) {
                await Signs.deleteMany({});
                const signs = req.body;

                const users = await Users.find()
                let userIds = users.map(user => new mongoose.Types.ObjectId(user._id));
                for (const sign of signs) {
                    sign.users = userIds
                }

                const result = await Signs.insertMany(signs);

                for (const sign of result) {
                    await Users.updateMany(
                        { _id: { $in: userIds } },
                        { $addToSet: { signs: sign._id } }
                    );
                }
                res.status(201).json({
                    message: 'Signs added',
                    signs: result
                });
            } else if (typeof data === 'object' && !Array.isArray(data)) {
                const {title, image, category, lesson} = req.body;

                // Validate that the category exists
                const categoryExists = await Category.findById(category);
                if (!categoryExists) {
                    return res.status(400).json({message: 'Category not found'});
                }

                // Create a new sign
                const newSign = new Signs({
                    title,
                    image,
                    category,
                    lesson
                });
                const users = await Users.find()
                let userIds = users.map(user => new mongoose.Types.ObjectId(user._id));
                newSign.users = userIds;

                // Save the sign to the database
                await newSign.save();

                await Users.updateMany(
                    { _id: { $in: userIds } },
                    { $addToSet: { lessons: newSign._id } }
                );

                // Respond with the created sign
                res.status(201).json(newSign);
            }
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