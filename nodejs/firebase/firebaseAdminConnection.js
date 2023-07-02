const { initializeApp } = require('firebase-admin/app');
const serviceAcoount = require('../env/service-account-credentials.json')
const admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert(serviceAcoount),
    databaseURL: "https://task-tally-default-rtdb.europe-west1.firebasedatabase.app"
});

console.log("Firebase Admin connection established!")

// ONLY FOR TEST PURPOSES !!!
// try {
//     admin.auth().getUserByEmail('keremeksioglu42@gmail.com')
//         .then((userRecord) => {
//             // See the UserRecord reference doc for the contents of userRecord.
//             console.log('Successfully fetched user data:', userRecord.toJSON());
//         })
//         .catch((error) => {
//             console.log('Error fetching user data:', error);
//         });
// } catch (error) {
//     console.error('Admin SDK not initialized', error);
// }

//console.log("Firebase Admin connection established!")

module.exports = admin;