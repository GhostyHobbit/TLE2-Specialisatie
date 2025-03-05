import mongoose from "mongoose";

const signsSchema = new mongoose.Schema({
     title: { type: String, required: true },
     image: { type: String, required: true },
     lesson_id: { type: Number, required: true },
     category_id: { type: Number, required: false },
     saved: { type: Boolean, required: true },
    });

const Signs = mongoose.model('Signs', signsSchema);



export default Signs;