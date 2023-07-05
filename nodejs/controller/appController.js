const { getFirestore, setDoc, doc, addDoc, collection, getDoc, query, where, getDocs, updateDoc } = require('firebase/firestore/lite')
const { app } = require('../firebase/firebaseConnection')
const db = getFirestore(app);



// ---- API FUNCTIONS ---- //
/**
 * @param {Object} req                  request body
 * @param {string} req.body.project_id  project id to start cronometer on
 * @param {string} req.userId           user id to start cronometer on project. Received from middleware through access token 
 * @returns {string} work_log_id        doc id of the started cronometer 
 */
const useCronometer = async (req, res) => {

    const workLog = {
        user_id: req.userId,
        project_id: req.body.project_id,
        start_time: (new Date().getTime()) / 1000,
        end_time: null
    }

    if (!(await userIsInProject(workLog.user_id, workLog.project_id))) {
        res.send("user is not in this project or project does not exist at all")
        return
    }

    const [cronometerIsRunning, cronometerProject] = await userHasCronometer(workLog.user_id);
    if (cronometerIsRunning) {
        if (cronometerProject.data().project_id === workLog.project_id) {

            const docRef = doc(db, "work_logs", cronometerProject.id);
            await updateDoc(docRef, {
                end_time: (new Date().getTime()) / 1000
            });

            res.send("cronometer stopped")
            return

        } else {
            res.send("User already has cronometer going on in another project")
            return
        }
    }

    const docRef = await addDoc(collection(db, "work_logs"), workLog);
    res.send({ work_log_id: docRef.id })
}


/**
 * @param {Object} req                  request body
 * @param {string} req.userId           user id to start cronometer on project. Received from middleware through access token
 * @param {string} req.body.project_id  project id to start cronometer on
 * @param {number} req.body.start_time  start time of work log (timestamp in milliseconds)
 * @param {number} req.body.end_time    end time of work log (timestamp in milliseconds)
 * @returns {string} work_log_id        doc id of the started cronometer
 */
const addWorkLog = async (req, res) => {

    const { userId, body: { project_id, start_time, end_time } } = req;

    if (start_time === undefined || end_time === undefined) {
        return res.send("start_time or end_time is undefined")
    }

    if (typeof start_time !== "number" || typeof end_time !== "number") {
        return res.send("start_time or end_time is not a number")
    }

    if (!isTimestamp(start_time) || !isTimestamp(end_time)) {
        return res.send("start_time or end_time is not a timestamp")
    }

    if (start_time > end_time) {
        return res.send("start_time is greater than end_time")
    }

    if (start_time === end_time) {
        return res.send("start_time is equal to end_time")
    }

    if (!(await userExists(userId))) {
        return res.send("user does not exist")
    }

    if (!(await userIsInProject(userId, project_id))) {
        return res.send("user is not in this project or project does not exist at all")
    }

    const workLog = {
        user_id: userId,
        project_id: project_id,
        start_time: start_time / 1000,
        end_time: end_time / 1000
    }

    const docRef = await addDoc(collection(db, "work_logs"), workLog);
    res.send({ work_log_id: docRef.id })
}

const updateWorkLog = async (req, res) => {
    const { userId, body: { start_time, end_time }, params: { workLogId } } = req;

    if (start_time === undefined || end_time === undefined) {
        return res.send("start_time or end_time is undefined")
    }

    if (typeof start_time !== "number" || typeof end_time !== "number") {
        return res.send("start_time or end_time is not a number")
    }

    if (!isTimestamp(start_time) || !isTimestamp(end_time)) {
        return res.send("start_time or end_time is not a timestamp")
    }

    if (start_time > end_time) {
        return res.send("start_time is greater than end_time")
    }

    if (start_time === end_time) {
        return res.send("start_time is equal to end_time")
    }

    if (!(await userExists(userId))) {
        return res.send("user does not exist")
    }

    const workLogRef = doc(db, "work_logs", workLogId);
    const workLogSnap = await getDoc(workLogRef);

    if (!workLogSnap.exists()) {
        return res.send("work log does not exist")
    }

    const workLog = workLogSnap.data();

    if (workLog.user_id !== userId) {
        return res.send("user does not own this work log")
    }

    const docRef = await updateDoc(workLogRef, {
        start_time: start_time / 1000,
        end_time: end_time / 1000
    });

    res.send("work log updated")
}



// ---- HELPER FUNCTIONS ---- //
/**
 * 
 * @param {string} userId       user id to check if it exists
 * @param {string} projectId    project id to check if it exists
 * @returns {boolean}           true if user is in project, false if not
 */
const userIsInProject = async (userId, projectId) => {

    const q = query(
        collection(db, "user_projects"),
        where("project_id", "==", projectId),
        where("user_id", "==", userId)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.size > 0;
}

/** 
 * @param {string} userId   user id to check if it has cronometer going on
 * @returns {boolean}       true if user has cronometer going on, false if not
*/
const userHasCronometer = async (userId) => {
    const q = query(
        collection(db, "work_logs"),
        where("user_id", "==", userId),
        where("end_time", "==", null)
    );
    const querySnapshot = await getDocs(q);

    return [querySnapshot.size > 0, querySnapshot.docs[0]];
}

const userExists = async (user_id) => {
    const docRef = doc(db, "users", user_id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
}

// Function for checking if the given value is a timestamp (for example: 1688498722084)
const isTimestamp = (value) => {
    return (
        value.toString().length === 13
        && !isNaN(value)
        && value > 0
        && value < 32503680000000
        && value % 1 === 0
        && value > 1609459200000
    )
}


module.exports = { useCronometer, addWorkLog, updateWorkLog }
