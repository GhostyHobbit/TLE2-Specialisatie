import mongoose, {Schema} from "mongoose";

const signsSchema = new mongoose.Schema({
     title: { type: String, required: true },
     image: { type: String, required: true },
     lesson_id: { type: Number, required: true },
     category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
     }
    });

const Signs = mongoose.model('Signs', signsSchema);

export default Signs;