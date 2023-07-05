import express, { Express, Request, Response } from 'express';
require('dotenv').config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./firebase/firebaseConnection');
require('./firebase/firebaseAdminConnection');


const router = require('./routes/appRouter');
app.use("/", router);


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})
