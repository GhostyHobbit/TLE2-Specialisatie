import express from 'express';
import mongoose from 'mongoose';
import SignsRouter from "./Routes/signsRouter.js";
import usersRouter from "./Routes/usersRouter.js";

const app = express();

await mongoose.connect(process.env.MONGODB_URL);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept')
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


app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is listening on port ${process.env.EXPRESS_PORT}`);
});

app.get('/',(req,res)=> {
    res.json({message: 'Welcome to the API, use OPTIONS for more options.'})
})

app.use('/signs', SignsRouter)

app.use('/users', usersRouter)

app.options('/', (req, res) => {
    res.json({message: 'Access-Control-Allow-Methods: GET, POST, OPTIONS, PATCH'})
    res.header('Allow', 'GET, POST, OPTIONS');
    res.header('Content-Type', 'application/x-www-form-urlencoded');
    res.header('Accept', 'application/json, application/x-www-form-urlencoded');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH');
    res.status(204).send();
});