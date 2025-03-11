import express from 'express';
import Lesson from "../Models/lessonsModel.js";

const router = express.Router();

// List all lessons
router.get('/', async (req, res) => {
    try {
        const lessons = await Lesson.find();
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ message: "Error fetching lessons" });
    }
});

// Get a single lesson
router.get('/:id', async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) return res.status(404).json({ message: "Lesson not found" });
        res.json(lesson);
    } catch (err) {
        res.status(500).json({ message: "Error fetching lesson" });
    }
});

// Create a lesson
router.post('/', async (req, res) => {
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
        const newLesson = await Lesson.create({
            title: req.body.title,
            exercise_id: req.body.exercise_id,
        });
        res.status(201).json(newLesson);
    }else{
        res.status(400).json({ error: 'Invalid data' });
    }
    } catch (err) {
        res.status(400).json({ message: "Error creating lesson" });
    }
});

// Update a lesson
router.put('/:id', async (req, res) => {
    try {
        const updatedLesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedLesson) return res.status(404).json({ message: "Lesson not found" });
        res.json(updatedLesson);
    } catch (err) {
        res.status(400).json({ message: "Error updating lesson" });
    }
});

// Delete a lesson
router.delete('/:id', async (req, res) => {
    try {
        const deletedLesson = await Lesson.findByIdAndDelete(req.params.id);
        if (!deletedLesson) return res.status(404).json({ message: "Lesson not found" });
        res.json({ message: "Lesson deleted" });
    } catch (err) {
        res.status(400).json({ message: "Error deleting lesson" });
    }
});

export default router;
