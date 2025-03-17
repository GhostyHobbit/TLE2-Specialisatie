import express from 'express';
import Exercise  from '../Models/exercisesModel.js';
import { faker } from '@faker-js/faker';
import Signs from "../Models/signsModel.js";
import mongoose from "mongoose";

const exerciseRouter = express.Router();

exerciseRouter.get('/', async (req, res) => {
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

exerciseRouter.post('/', async (req, res) => {
    try{
        const data = req.body;
        if(Array.isArray(data)){
            const exercises = req.body;
            const result = await Exercise.insertMany(exercises);
            res.status(201).json({
                message: 'Exercises added',
                exercises: result
            });

        }else if(typeof data === 'object' && !Array.isArray(data)){
            const { type, question, answer, lesson, video } = req.body;
            if (!lesson) {
                return res.status(404).json({
                    message: 'Lesson not found',
                });
            }
            const exercise = await Exercise.create({
                type, question, answer, lesson, video
            });
            res.status(201).json(exercise);
        }
}catch(error){
        res.status(400).json({error: error.message});
    }
});

exerciseRouter.delete('/', async (req, res) => {
    try {
        await Exercise.deleteMany({});
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


exerciseRouter.get('/multiplechoice/:id', async (req, res) => {
    try {
        // Fetch the correct sign by ID
        const correctAnswer = await Signs.findById(req.params.id);

        if (!correctAnswer) {
            return res.status(404).json({ message: 'Sign not found' });
        }

        // Fetch three random signs from the same theme, excluding the correct answer
        const randomSigns = await Signs.aggregate([
            {
                $match: {
                    category: new mongoose.Types.ObjectId(correctAnswer.category),
                    _id: { $ne: correctAnswer._id }
                }
            },
            { $sample: { size: 3 } }
        ]);
        console.log(randomSigns)
        res.json({
            correctAnswer,
            choices: randomSigns
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


export default exerciseRouter;