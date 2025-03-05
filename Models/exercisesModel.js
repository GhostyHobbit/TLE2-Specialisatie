import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
     type: { type: String, required: true },
     question: { type: String, required: true },
     answer: { type: String, required: true },
     lesson_id : { type: Number, required: true },
    });

const Exercise = mongoose.model('Excercise', exerciseSchema);



export default Exercise;

