import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: ['user', 'docent'],
    },
    created_at: { type: Date, default: Date.now }
});

const Users = mongoose.model('Users', userSchema);

export default Users;
