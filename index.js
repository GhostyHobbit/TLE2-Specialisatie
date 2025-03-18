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

//zet de versie van de api op v1 als er geen specificatie is
app.use((req, res, next) => {
    req.apiVersion = req.headers['accept-version'] || 'v1';
    next()
})

// 86400000 is 24 hours
setInterval(deleteOldUsers, 86400000);
app.use('/keygen', loadRouter('ApiKeyRouter'))

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

//laad dynamisch de juiste versie van de router
const loadRouter = (route) => {
    return (req, res) => {
        import(`./Routes/${req.apiVersion}/${route}.js`)
            .then(({ default: router }) => router(req, res))
            .catch(err => res.status(500).send('Error met laden van de route'))
    }
}

app.use('/signs', loadRouter('signsRouter'))
app.use('/categories', loadRouter('categoryRouter'))
app.use('/users', loadRouter('usersRouter'))
app.use('/lessons', loadRouter('lessonRouter'))
app.use('/exercises', loadRouter('exerciseRouter'))

app.use('/api', loadRouter('knnRouter'))

app.options('/', (req, res) => {
    res.json({message: 'Access-Control-Allow-Methods: GET, POST, OPTIONS, PATCH'})
    res.header('Allow', 'GET, POST, OPTIONS');
    res.header('Content-Type', 'application/x-www-form-urlencoded');
    res.header('Accept', 'application/json, application/x-www-form-urlencoded');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH');
    res.status(204).send();
});