const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


require('dotenv').config();
require('./firebase/firebaseConnection');
require('./firebase/firebaseAdminConnection');


const router = require('./routes/appRouter');
app.use("/", router);


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})
