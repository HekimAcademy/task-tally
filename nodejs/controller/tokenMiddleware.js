/**
 * @fileoverview Middleware for validating Firebase access token
 */

const admin = require('../firebase/firebaseAdminConnection')

/**
 * @param {Object} req                          request body
 * @param {string} req.headers.authorization    access token
 * @returns req.userId                          User UID from access token
 */
const validateFirebaseIdToken = (req, res, next) => {

    // If Authorization header is set or not
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        res.status(403).send('No access token was passed as a Bearer token in the Authorization header');
        return;
    }

    // Read the ID token from the Bearer token.
    let idToken;
    idToken = req.headers.authorization.split('Bearer ')[1];

    // If access token is valid
    admin.auth().verifyIdToken(idToken).then((decodedIdToken) => {
        console.log('ID token was valid');
        req.userId = decodedIdToken.uid;
        next();
    }).catch(error => {
        console.error('Error:', error);
        res.status(403).send('Unauthorized');
    });
}

module.exports = { validateFirebaseIdToken }