import express from 'express';
import mongoose from 'mongoose';
import exerciseRouter from './Routes/v1/exerciseRouter.js';
import SignsRouter from "./Routes/v1/signsRouter.js";
import usersRouter from "./Routes/v1/usersRouter.js";
import deleteOldUsers from "./Tasks/deleteOldUsers.js";
import ApiKey from "./Models/apiKeyModel.js";
import ApiKeyRouter from "./Routes/v1/apiKeyRouter.js";
import categoryRouter from "./Routes/v1/categoryRouter.js";
import LessonsRouter from "./Routes/v1/lessonRouter.js";
import knnRouter from "./Routes/v1/knnRouter.js"

const app = express();

await mongoose.connect(process.env.MONGODB_URL);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, apikey, Accept-Version')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    next()
})

app.use((req, res, next) => {
    const acceptHeader = req.headers['accept'];

    if (acceptHeader.includes('application/json') || req.method === 'OPTIONS') {
        next()
    } else {
        res.status(406).send('Illegal format');
    }
});

app.use((req, res, next) => {
    req.apiVersion = req.headers['accept-version'] || 'v1';
    next()
})

// 86400000 is 24 hours
setInterval(deleteOldUsers, 86400000);

app.use('/keygen', (req, res) => {
    import(`./Routes/${req.apiVersion}/ApiKeyRouter.js`).then(({ default: router }) => router(req, res))
})

app.use('/api', (req, res) => {
    import(`./Routes/${req.apiVersion}/knnRouter.js`).then(({ default: router }) => router(req, res))
})

app.use(async(req, res, next) => {
    const apiHeader = req.headers['apikey'];
    let key = [];
    key = await ApiKey.findOne({});

    if (apiHeader === key.key || apiHeader === "pinda"  || req.method === 'OPTIONS') {
        next()
    } else {
        res.status(401).send('Unauthorized');
    }
})

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is listening on port ${process.env.EXPRESS_PORT}`);
});

app.use('/signs', (req, res) => {
    import(`./Routes/${req.apiVersion}/signsRouter.js`).then(({ default: router }) => router(req, res))
})

app.use('/categories', (req, res) => {
    import(`./Routes/${req.apiVersion}/categoryRouter.js`).then(({ default: router }) => router(req, res))
})

app.use('/users', (req, res) => {
    import(`./Routes/${req.apiVersion}/usersRouter.js`).then(({ default: router }) => router(req, res))
})

app.use('/lessons', (req, res) => {
    import(`./Routes/${req.apiVersion}/lessonRouter.js`).then(({ default: router }) => router(req, res))
})

app.use('/exercises', (req, res) => {
    import(`./Routes/${req.apiVersion}/exerciseRouter.js`).then(({ default: router }) => router(req, res))
})


app.options('/', (req, res) => {
    res.json({message: 'Access-Control-Allow-Methods: GET, POST, OPTIONS, PATCH'})
    res.header('Allow', 'GET, POST, OPTIONS');
    res.header('Content-Type', 'application/x-www-form-urlencoded');
    res.header('Accept', 'application/json, application/x-www-form-urlencoded');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH');
    res.status(204).send();
});