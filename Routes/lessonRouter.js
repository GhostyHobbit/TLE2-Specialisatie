import {Router} from "express";
import Lesson from "../Models/lessonsModel.js";

const LessonsRouter = new Router();

LessonsRouter.get('/', async (req, res) => {
    try {
        const lessons = await Lesson.find()
            .populate([
                {path: 'lessonCategories', select: 'categoryName'},
                {path: 'lessonExercises', select: 'type question answer'},
            ]);
        res.status(200).json({
            "items": lessons,
            "_links": {
                "self": {
                    "href": `${process.env.SELF_LINK}/Lessons`
                },
                "collection": {
                    "href": `${process.env.SELF_LINK}/Lessons`
                }
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lessons', error: error.message });
    }
});

LessonsRouter.post('/', async (req, res) => {
    const { title,  } = req.body;

    if (!title ) {
        return res.status(400).json({
            message: 'Missing or empty required field (name)',
        });
    }

    const lesson = new Lesson({ title });

    try {
        await lesson.save();
        res.status(201).json({ lesson });
    } catch (error) {
        res.status(500).json({ message: 'Error saving category', error: error.message });
    }
});

export default LessonsRouter;