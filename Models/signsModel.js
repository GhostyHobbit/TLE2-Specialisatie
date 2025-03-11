import mongoose, {Schema} from "mongoose";

const signsSchema = new mongoose.Schema({
     title: { type: String, required: true },
     image: { type: String, required: true },
     saved: {type: Boolean, default: false, required: true },
     category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
     },
     lesson: {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
     },
     users: [{
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
     }]
    });

const Signs = mongoose.model('Signs', signsSchema);

export default Signs;