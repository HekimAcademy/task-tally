const { getFirestore, setDoc, doc, addDoc, collection, getDoc, query, where, getDocs, updateDoc } = require('firebase/firestore/lite')
const { app } = require('../firebase/firebaseConnection')
const db = getFirestore(app);

// ---- API FUNCTIONS ---- //
/**
 * @returns {Object[]}                             array of user info
 * @returns {string}                               user_info.user_uid
 * @returns {string}                               user_info.user_name
 * @returns {string}                               user_info.user_email
 */
const getAllUsers = async (req, res) => {

    const q = query(
        collection(db, "users"),
    );

    const querySnapshot = await getDocs(q);
    res.send(querySnapshot.docs.map(doc => {

        let data = doc.data()
        data.user_uid = doc.id
        return data
    }))

}

/**
 * @param {Object} req                           request body
 * @param {string} req.body.type                 id or email
 * @param {string} req.body.id                   user id
 * @param {string} req.body.email                user email
 * @returns {Object}                             user info
 * @returns {string}                             user_info.user_uid
 * @returns {string}                             user_info.user_name
 * @returns {string}                             user_info.user_email
*/
const getUser = async (req, res) => {

    var user;

    switch (req.body.type) {
        case "id":
            console.log("id")
            //user = "id"
            user = await getUserById(req.body.id)
            break;
        case "email":
            console.log("email")
            //user = "email"
            user = await getUserByEmail(req.body.email)
            break;
    }

    console.log(user)

    res.send(user)
}

/**
 * 
 * @param {Object} req                         request body
 * @param {string} req.params.userId           user id to get work logs from  
 */
const getUserWorkLogs = async (req, res) => {
    const q = query(
        collection(db, "work_logs"),
        where("user_id", "==", req.params.userId),
    );

    const querySnapshot = await getDocs(q);
    res.send(querySnapshot.docs.map(doc => doc.data()))
}



// ---- HELPER FUNCTIONS ---- //
const getUserById = async (userId) => {

    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (!(docSnap.exists())) {
        return;
    }

    let data = docSnap.data();
    data.user_uid = docSnap.id;

    return (data)


}

const getUserByEmail = async (email) => {

    const q = query(
        collection(db, "users"),
        where("user_mail", "==", email)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length === 0) {
        return;
    }


    let data = querySnapshot.docs[0].data()
    data.user_uid = querySnapshot.docs[0].id

    return (data)
}

module.exports = { getAllUsers, getUser, getUserWorkLogs }