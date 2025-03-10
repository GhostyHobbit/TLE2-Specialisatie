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
     if(Array.isArray(data)){
            const exercises = req.body;
            const result = await Exercise.insertMany(exercises);
            res.status(201).json({
                message: 'Exercises added',
                exercises: result
            });
    
    }else if(typeof data === 'object' && !Array.isArray(data)){
        const exercise = await Exercise.create({
            type: req.body.type,
            question: req.body.question,
            answer: req.body.answer,
            lesson_id: req.body.lesson_id,
        });
        res.status(201).json(exercise);
}
}catch(error){
        res.status(400).json({error: error.message});
    }
}); 

router.delete('/', async (req, res) => {
    try {
        await Exercise.deleteMany({});
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;