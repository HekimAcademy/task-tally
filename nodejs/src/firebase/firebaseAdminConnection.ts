import { initializeApp } from 'firebase-admin/app';
const serviceAcoount = require('../env/service-account-credentials.json')
const admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert(serviceAcoount),
    databaseURL: "https://task-tally-default-rtdb.europe-west1.firebasedatabase.app"
});

console.log("Firebase Admin connection established!")

module.exports = admin;
