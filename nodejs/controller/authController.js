const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
const { getFirestore, setDoc, doc } = require('firebase/firestore/lite')
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
    //res.end("idk")
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


module.exports = { firebaseSignUp, firebaseSignIn }
