import {Router} from "express";
import apiKeyModel from "../Models/apiKeyModel.js";
import ApiKey from "../Models/apiKeyModel.js";

const apiRouter = new Router();

apiRouter.get('/', async (req, res) => {
    let key = [];

    key = await ApiKey.find({});

    res.json({key})
    res.status(200).send();
});

apiRouter.post('/', async (req, res) => {
    await ApiKey.deleteMany({});
    const key = generateApiKey(32);
    console.log(key);

    try {
        let apiKey = new ApiKey({
            key: key
        })
        await apiKey.save();

        res.status(201).json({
            message: "Key saved"
        });
    } catch (e) {
        res.status(400).json({
            error: e.message
        })
    }
});

function generateApiKey(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let apiKey = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        apiKey += characters[randomIndex];
    }
    return apiKey;
}

export default apiRouter;