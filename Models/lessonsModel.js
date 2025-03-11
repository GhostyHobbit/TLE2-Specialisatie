import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    // exercise_id: { type: Number, required: true },
});

lessonSchema.virtual('lessonCategories', {
    ref: 'Category', //The Model to use
    localField: '_id', //Find in Model, where localField
    foreignField: 'lesson', // is equal to foreignField
});

lessonSchema.virtual('lessonExercises', {
    ref: 'Exercise', //The Model to use
    localField: '_id', //Find in Model, where localField
    foreignField: 'lesson', // is equal to foreignField
});

// Set Object and Json property to true. Default is set to false
lessonSchema.set('toObject', { virtuals: true });
lessonSchema.set('toJSON', { virtuals: true });

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;
