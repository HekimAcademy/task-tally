const { getFirestore, setDoc, doc, addDoc } = require('firebase/firestore/lite')
const { app } = require('../firebase/firebaseConnection')
const db = getFirestore(app);


const startCronometer = async (req, res) => {

}

module.exports = { startCronometer }