import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
    type: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    lesson_id : { type: Number, required: true },
    video: {type: String, required: false},
},
{
    toJSON:{
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {
            ret._links = {
                self:{
                    href: process.env.BASE_URL + `exercises/${ret.id}`
                },
                collection: {
                    href: process.env.BASE_URL + `exercises/`
                },
                pagination: {
                    total: ret.length,
                    limit: 5,
                    offset: 0
            }
            },
          
        

            delete ret._id
            delete ret.__v
        }
    }
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

 

export default Exercise;