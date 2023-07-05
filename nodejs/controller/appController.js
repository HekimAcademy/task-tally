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
        start_time: (Date().getTime()) / 1000,
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
                end_time: (Date().getTime()) / 1000
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

const addWorkLog = async (req, res) => {
    
        const workLog = {
            user_id: req.userId,
            project_id: req.body.project_id,
            start_time: req.body.start_time,
            end_time: req.body.end_time
        }

        if (workLog.start_time === undefined || workLog.end_time === undefined) {
            res.send("start_time or end_time is undefined")
            return
        }

        if (typeof workLog.start_time !== "number" || typeof workLog.end_time !== "number") {
            res.send("start_time or end_time is not a number")
            return
        }

        if (!isTimestamp(workLog.start_time) || !isTimestamp(workLog.end_time)) {
            res.send("start_time or end_time is not a timestamp")
            return
        }

        if (workLog.start_time > workLog.end_time) {
            res.send("start_time is greater than end_time")
            return
        }

        if (workLog.start_time === workLog.end_time) {
            res.send("start_time is equal to end_time")
            return
        }
    
        if (!(await userIsInProject(workLog.user_id, workLog.project_id))) {
            res.send("user is not in this project or project does not exist at all")
            return
        }
    
        const docRef = await addDoc(collection(db, "work_logs"), workLog);
        res.send({ work_log_id: docRef.id })
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


module.exports = { useCronometer }
