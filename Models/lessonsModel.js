import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    progress: { type: Number, required: true },
    exercise_id: { type: Number, required: true },
});

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;