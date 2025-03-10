import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
     categoryName: { type: String, required: true },
     lesson_id: { type: Number, required: true },
    });

const Category = mongoose.model('Category', categorySchema);

 

export default Category;