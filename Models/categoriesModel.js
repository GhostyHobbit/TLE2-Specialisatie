import mongoose, {Schema} from "mongoose";

const categorySchema = new mongoose.Schema({
     categoryName: { type: String, required: true },
     lesson: {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
     }
    });

categorySchema.virtual('categorySigns', {
    ref: 'Signs', //The Model to use
    localField: '_id', //Find in Model, where localField
    foreignField: 'category', // is equal to foreignField
});

// Set Object and Json property to true. Default is set to false
categorySchema.set('toObject', { virtuals: true });
categorySchema.set('toJSON', { virtuals: true });

const Category = mongoose.model('Category', categorySchema);

 

export default Category;