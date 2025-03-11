import mongoose, {Schema} from "mongoose";

const exerciseSchema = new mongoose.Schema({
     type: { type: String, required: true },
     question: { type: String, required: true },
     answer: { type: String, required: true },
     lesson: {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
     }
    });

const Exercise = mongoose.model('Exercise', exerciseSchema);

export default Exercise;