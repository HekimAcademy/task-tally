import express, { Express, Request, Response } from 'express';
require('dotenv').config();
const cors = require('cors')
const app: Express = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./src/firebase/firebaseConnection');
require('./src/firebase/firebaseAdminConnection');


const router = require('./src/routes/appRouter');
app.use("/", router);


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})
