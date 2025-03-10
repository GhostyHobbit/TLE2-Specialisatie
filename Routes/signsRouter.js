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

router.get('/', async (req, res) => {

    const signs = await Signs.find();
    const baseUrl = `${req.protocol}://${req.get('host')}/signs`;

    const items = signs.map(signs => ({
        ...signs.toObject(),
        _links: {
            self: {href: `${baseUrl}/${signs._id}`},
            collection: {href: baseUrl}
        }
    }));

    res.json({
        items,
        _links: {
            self: {href: baseUrl},
            collection: {href: baseUrl}
        }
    });



    // res.json({message: "Get All"})
    // res.status(200).send();
});

router.get('/:id', async (req, res) => {

    try {
        const sign = await Signs.findOne({_id: req.params.id});
        if (!sign) {
            return res.status(404).json({message: 'Sign not found'});
        }

        const baseUrl = `${req.protocol}://${req.get('host')}/signs`;
        res.json({
            ...sign.toObject(),
            _links: {
                self: {href: `${baseUrl}/${sign._id}`},
                collection: {href: baseUrl}
            }
        });

    } catch (err) {
        res.status(404).json({message: 'Failed to fetch sign'});
    }




    // res.json({message: "Get One"})
    // res.status(200).send();
});

router.post('/', async (req, res) => {

    const newSign = await Signs.create({
        title: req.body.title,
        image: req.body.image,
        lesson_id: req.body.lesson_id,
        category_id: req.body.category_id,
        saved: req.body.saved,
    });
    res.status(201).json({
        message: `You created ${newSign.title}`,
        id: newSign._id
    });


    //res.json({message: "Post One"})
    //res.status(200).send();
});

router.put('/:id', (req, res) => {
    res.json({message: "Update One"})
    res.status(200).send();
});

router.delete('/:id', (req, res) => {
    res.json({message: "Delete One"})
    res.status(200).send();
});


export default router;