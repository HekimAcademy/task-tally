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
        project_manager_id: req.body.project_manager_id,
        department_id: req.body.department_id
    }

    if (!(await userExists(project.project_manager_id))) {
        res.send("manager does not exist")
        return;
    }

    if (!await departmentExists(project.department_id)) {
        res.send("department does not exist")
        return;
    }

    if (!(await userIsDepartmentManager(req.userId, project.department_id))) {
        res.send("user is not the department manager")
        return;
    }



    const docRef = await addDoc(collection(db, "projects"), project);
    res.send({ project_id: docRef.id })
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
 * @param {Object} req                           request body
 * @param {string} req.params.userId             user id to get projects from
 * @returns {Object[]}                           array of projects
 * @returns {string}                             project.project_id
 * @returns {string}                             project.project_name
 * @returns {string}                             project.description
 * @returns {string}                             project.project_manager_id
 * @returns {string}                             project.department_id
*/
const getUserProjects = async (req, res) => {

    if (!(await userExists(req.params.userId))) {
        res.send("user does not exist")
        return;
    }

    const q = query(
        collection(db, "user_projects"),
        where("user_id", "==", req.params.userId),
    );

    const querySnapshot = await getDocs(q);

    const userProjects = []
    for (const document of querySnapshot.docs) {

        const docRef = doc(db, "projects", document.data().project_id);
        const docSnap = await getDoc(docRef);

        project = docSnap.data()
        project.project_id = docSnap.id;

        userProjects.push(project)
    }

    res.send(userProjects)
}

/**
 * 
 * @param {Object} req                          request body
 * @param {string} req.params.departmentId      department id to get projects from 
 * @returns {Object[]}                           array of projects
 * @returns {string}                             project.project_id
 * @returns {string}                             project.project_name
 * @returns {string}                             project.description
 * @returns {string}                             project.project_manager_id
 * @returns {string}                             project.department_id
 * @returns 
 */
const getDepartmentProjects = async (req, res) => {

    if (!(await departmentExists(req.params.departmentId))) {
        res.send("department does not exist")
        return;
    }

    const q = query(
        collection(db, "projects"),
        where("department_id", "==", req.params.departmentId),
    );

    const querySnapshot = await getDocs(q);

    const departmentProjects = []
    for (const document of querySnapshot.docs) {

        const docRef = doc(db, "projects", document.id);
        const docSnap = await getDoc(docRef);

        project = docSnap.data()
        project.project_id = docSnap.id;

        departmentProjects.push(project)
    }

    res.send(departmentProjects)
}


/**
 * @returns {Object[]}                           array of projects
 * @returns {string}                             project.project_id
 * @returns {string}                             project.project_name
 * @returns {string}                             project.description
 * @returns {string}                             project.project_manager_id
 * @returns {string}                             project.department_id
 */
const getAllProjects = async (req, res) => {

    const q = query(
        collection(db, "projects"),
    );

    const querySnapshot = await getDocs(q);

    const allProjects = []
    for (const document of querySnapshot.docs) {

        const docRef = doc(db, "projects", document.id);
        const docSnap = await getDoc(docRef);

        project = docSnap.data()
        project.project_id = docSnap.id;

        allProjects.push(project)
    }

    res.send(allProjects)

}





// ---- HELPER FUNCTIONS ---- //
const userExists = async (userId) => {

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    return userSnap.exists()

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

const userIsDepartmentManager = async (userId, departmentId) => {

    const q = query(
        collection(db, "department_managers"),
        where("department_id", "==", departmentId),
        where("user_id", "==", userId)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.size > 0;
}

const departmentExists = async (departmentId) => {

    const departmentRef = doc(db, "departments", departmentId);
    const departmentSnap = await getDoc(departmentRef);

    return departmentSnap.exists();
}

module.exports = { createProject, joinProject, getProject, getUserProjects, getDepartmentProjects, getAllProjects }
