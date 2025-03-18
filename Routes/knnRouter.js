import express from 'express';
import { classifyData } from '../Models/knnModel.js';

const router = express.Router();

router.post('/predict', (req, res) => {
    let { input } = req.body;

    // Convert single numbers to an array
    if (typeof input === 'number') {
        input = [input]; // Wrap in an array
    }

    // Validate input
    if (!input || !Array.isArray(input)) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    const result = classifyData(input);
    res.json({ prediction: result });
});

export default router;
