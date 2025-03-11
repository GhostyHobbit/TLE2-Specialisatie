import express from 'express';
import Exercise  from '../Models/exercisesModel.js';
import { faker } from '@faker-js/faker';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const exercises = await Exercise.find({});
        const collection = {
            "items" : exercises,
            "_links" : {
                "self" : { "href" : process.env.BASE_URL + "exercises/" },
                "collection" : { "href" : process.env.BASE_URL + "exercises/" }
            },
        }
        res.json(collection);            
    } catch (error) {
        res.json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try{
    const { type, question, answer, lesson } = req.body;
        if (!lesson) {
            return res.status(404).json({
                message: 'Lesson not found',
            });
        }
        const exercise = await Exercise.create({
            type, question, answer, lesson
        });
        res.status(201).json(exercise);
    }catch{
        res.status(400).json({error: 'Invalid data'});
    }
});


export default router;