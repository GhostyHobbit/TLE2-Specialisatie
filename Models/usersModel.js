import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: ['user', 'teacher'],
    },
    created_at: {type: Date, default: Date.now},
    user_key: { type: String, required: true },
    });

const Users = mongoose.model('Users', userSchema);

 

export default Users;