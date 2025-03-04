import mongoose from "mongoose";

const signsSchema = new mongoose.Schema( {
    title: {type: String, required: true},
    image: {type: String, required: true},
    lesson_id: {type: String, required: true},
    category_id: {type: String, required: false},
    saved: {type: String, required: false},
});

const Signs = mongoose.model('Signs', signsSchema);

export default Signs