import express from 'express';
import Signs from "../Models/signsModel.js";

const router = express.Router();

router.options('/', (req, res) => {
    res.json("hallo")
    res.header('Allow', 'GET, POST, OPTIONS');
    res.header('Content-Type', 'application/x-www-form-urlencoded');
    res.header('Accept', 'application/json, application/x-www-form-urlencoded');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH');
    res.status(204).send();
});

router.get('/', (req, res) => {
    res.json({message: "Get All"})
    res.status(200).send();
});

router.get('/:id', (req, res) => {
    res.json({message: "Get One"})
    res.status(200).send();
});

router.post('/', (req, res) => {
    res.json({message: "Post One"})
    res.status(200).send();
});

router.put('/:id', (req, res) => {
    res.json({message: "Update One"})
    res.status(200).send();
});

router.delete('/:id', (req, res) => {
    res.json({message: "Update One"})
    res.status(200).send();
});


export default router;