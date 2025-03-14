import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema({
    key: { type: String, required: true },
});

const ApiKey = mongoose.model('ApiKey', apiKeySchema);

export default ApiKey;