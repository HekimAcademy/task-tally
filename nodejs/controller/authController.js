const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithCustomToken } = require("firebase/auth");
const { getFirestore, setDoc, doc } = require('firebase/firestore/lite')
const axios = require('axios');

const { app } = require('../firebase/firebaseConnection')

const auth = getAuth();
const db = getFirestore(app);


// ---- API FUNCTIONS ---- //
/**
 * @param {Object} req                  request body
 * @param {string} req.body.email       user email
 * @param {string} req.body.password    user password 
 * @param {string} req.body.name        user display name
 * @returns {Object}                    user info
 * @returns {string}                    user_info.uid
 * @returns {string}                    user_info.refreshToken
 * @returns {string}                    user_info.accessToken
 * @returns {string}                    user_info.expirationTime
*/
const firebaseSignUp = async (req, res) => {

    createUserWithEmailAndPassword(auth, req.body.email, req.body.password)
        .then((userInfo) => {
            let userRec = {
                uid: userInfo.user.uid,
                email: userInfo.user.email,
                name: req.body.name
            }
            firebaseSetUserData(userRec)

            userInfo = {
                uid: userInfo.user.uid,
                refreshToken: userInfo.user.refreshToken,
                accessToken: userInfo._tokenResponse.idToken,
                expirationTime: userInfo._tokenResponse.expiresIn,
            }
            res.send(userInfo)

            //res.sendStatus(201)
        })

        .catch((error) => {
            res.end(JSON.stringify(error))
        })
}

/**
 * @param {Object} req                  request body
 * @param {string} req.body.email       user email
 * @param {string} req.body.password    user password
 * @returns {Object}                    user info
 * @returns {string}                    user_info.uid
 * @returns {string}                    user_info.refreshToken
 * @returns {string}                    user_info.accessToken
 * @returns {string}                    user_info.expirationTime
 */
const firebaseSignIn = async (req, res) => {
    signInWithEmailAndPassword(auth, req.body.email, req.body.password)
        .then((userInfo) => {
            console.log(userInfo)
            userInfo = {
                uid: userInfo.user.uid,
                refreshToken: userInfo.user.refreshToken,
                accessToken: userInfo._tokenResponse.idToken,
                expirationTime: userInfo._tokenResponse.expiresIn,
            }
            res.send(userInfo)
        })

        .catch((error) => {
            res.end(JSON.stringify(error))
        })
}

const firebaseSignInWithToken = async (req, res) => {

    try {
        const response = await axios.post(`https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_CONFIG_API_KEY}`, {
            grant_type: 'refresh_token',
            refresh_token: req.body.refreshToken
        });

        let userInfo = {
            uid: response.data.user_id,
            refreshToken: response.data.refresh_token,
            accessToken: response.data.id_token,
            expirationTime: response.data.expires_in,
        }

        res.send(userInfo);
    } catch (error) {
        console.error('Error refreshing access token:', error);
    }
}


// ---- HELPER FUNCTIONS ---- //
/**
 * @param {Object} userInfo             user info
 * @param {string} userInfo.body.uid    user id
 * @param {string} userInfo.body.email  user email
 * @param {string} userInfo.body.name   user display name
 */
const firebaseSetUserData = async (userInfo) => {

    await setDoc(doc(db, "users", userInfo.uid), {
        user_mail: userInfo.email,
        user_name: userInfo.name
    })

}


module.exports = { firebaseSignUp, firebaseSignIn, firebaseSignInWithToken }
