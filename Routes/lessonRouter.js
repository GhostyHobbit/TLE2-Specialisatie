import express from 'express';
import Lesson from "../Models/lessonsModel.js";

const LessonsRouter = express.Router();

// List all lessons
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

// Get a single lesson
LessonsRouter.get('/:id', async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) return res.status(404).json({ message: "Lesson not found" });
        res.json(lesson);
    } catch (err) {
        res.status(500).json({ message: "Error fetching lesson" });
    }
});

// Create a lesson
LessonsRouter.post('/', async (req, res) => {
    try {
    const data = req.body;
    if(Array.isArray(data)){
        const lessons = req.body;
        const result = await Lesson.insertMany(lessons);
        res.status(201).json({
            message: 'Lessons added',
            lessons: result
        });
    }else if(typeof data === 'object' && !Array.isArray(data)){
        const { title, } = req.body
        if (!title) {
            return res.status(400).json({
                message: 'Missing or empty required field',
            });
        }
        const lesson = new Lesson({ title });

        try {
            await lesson.save();
            res.status(201).json({ lesson });
        } catch (error) {
            res.status(500).json({ message: 'Error saving lesson', error: error.message });
        }
    }else{
        res.status(400).json({ error: 'Invalid data' });
    }
    } catch (err) {
        res.status(400).json({ message: "Error creating lesson" });
    }
});

// Update a lesson
LessonsRouter.put('/:id', async (req, res) => {
    try {
        const updatedLesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedLesson) return res.status(404).json({ message: "Lesson not found" });
        res.json(updatedLesson);
    } catch (err) {
        res.status(400).json({ message: "Error updating lesson" });
    }
});

// Delete a lesson
LessonsRouter.delete('/:id', async (req, res) => {
    try {
        const deletedLesson = await Lesson.findByIdAndDelete(req.params.id);
        if (!deletedLesson) return res.status(404).json({ message: "Lesson not found" });
        res.json({ message: "Lesson deleted" });
    } catch (err) {
        res.status(400).json({ message: "Error deleting lesson" });
    }
});

export default LessonsRouter;
