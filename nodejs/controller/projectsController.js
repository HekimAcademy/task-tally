/**
 * @description For handling projects requests
 * @todo Implement getting user_id by access token
 * @todo Implement if user has access to create 
 *       project via access token
 * @todo Implement only department managers can create projects
 */
const { getFirestore, setDoc, doc, addDoc, collection, getDoc, query, where, getDocs } = require('firebase/firestore/lite')
const { app } = require('../firebase/firebaseConnection')
const db = getFirestore(app);


// ---- API FUNCTIONS ---- //
/**
 * @param {Object} req                           request body
 * @param {string} req.body.project_name         project name
 * @param {string} req.body.description          project description
 * @param {string} req.body.project_manager_id   project manager id
 * @returns {Object}                             project info
 * @returns {string}                             project_info.project_id
 */
const createProject = async (req, res) => {
    const project = {
        project_name: req.body.project_name,
        description: req.body.description,
        project_manager_id: req.body.project_manager_id
    }

    if (userExists(project.project_manager_id)) {
        const docRef = await addDoc(collection(db, "projects"), project);
        res.send({ project_id: docRef.id })
    } else {
        res.send("manager does not exist")
    }
}

/**
 * 
 * @param {Object} req                           request body
 * @param {string} req.params.projectId          project id to get
 * 
 */
const getProject = async (req, res) => {
    const docRef = doc(db, "projects", req.params.projectId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        res.send(docSnap.data())
    } else {
        res.sendStatus(404)
    }
}

/**
 * 
 * @param {Object} req                   request body
 * @param {string} req.body.project_id   project id to join
 * @param {string} req.userId            user id to join project. Received from middleware through access token
 */
const joinProject = async (req, res) => {
    const project = {
        project_id: req.body.project_id,
        user_id: req.userId
    }

    if (!(await projectExists(project.project_id))) {
        res.send("project does not exist");
        return;
    }
    if (await userIsInProject(project.project_id, project.user_id)) {
        res.send("user is already in this project");
        return;
    }

    const docRef = await addDoc(collection(db, "user_projects"), project);
    res.send('Success!')
}



// ---- HELPER FUNCTIONS ---- //
const userExists = async (userId) => {

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return true
    } else {
        return false
    }

}

const projectExists = async (projectId) => {

    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (projectSnap.exists()) {
        return true
    } else {
        return false
    }

}

const userIsInProject = async (projectId, userId) => {

    const q = query(
        collection(db, "user_projects"),
        where("project_id", "==", projectId),
        where("user_id", "==", userId)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.size > 0;

}

module.exports = { createProject, getProject, joinProject }
