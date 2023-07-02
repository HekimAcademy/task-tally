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
        start_time: new Date(),
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
                end_time: new Date(),
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

    console.log("querySnapshot")
    console.log(querySnapshot)
    return [querySnapshot.size > 0, querySnapshot.docs[0]];
}


module.exports = { useCronometer }
