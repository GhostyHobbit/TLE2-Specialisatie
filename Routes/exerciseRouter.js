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
    const data = req.body;
        const exercise = await Exercise.create({
            type: req.body.type,
            question: req.body.question,
            answer: req.body.answer,
            lesson_id: req.body.lesson_id,
        });
        res.status(201).json(exercise);
    }catch(error){
        res.status(400).json({error: "invalid data"});
    }
}); 


export default router;