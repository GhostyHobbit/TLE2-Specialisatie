import mongoose, {Schema} from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: ['user', 'teacher'],
    },
    created_at: {type: Date, default: Date.now},
    lessons: [{
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    }],
    signs: [{
        type: Schema.Types.ObjectId,
        ref: 'Signs',
        required: true
    }],
    lessonProgress: [{
            lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
            progress: {type: Number, default: 0}
    }],
    signsSaved: [{
        sign_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Signs' },
        saved: {type: Boolean, default: false}
    }]
});

const Users =  mongoose.model('Users', userSchema);

export default Users;