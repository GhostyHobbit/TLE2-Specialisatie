import mongoose from "mongoose";

const lessonUserSchema = new mongoose.Schema({
    user_id: { type: Number, required: true },
    lesson_id: { type: Number, required: true },
    progress: { type: Number, required: true },
});

const LessonUser = mongoose.model('LessonUser', lessonUserSchema);

export default LessonUser;