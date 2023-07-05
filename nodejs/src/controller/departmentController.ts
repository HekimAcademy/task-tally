/*

Departments
    department_id
    department_name

Department Managers
    user_id
    department_id

Department Members
    user_id
    department_id

*/
/**
 * @todo getDepartment, getManager and getMembers should work together. 
 *       Right now getDepartment uses different functions for receiving 
 *       manager and members.
 */
const { getFirestore, setDoc, doc, addDoc, collection, getDoc, query, where, getDocs, updateDoc, deleteDoc } = require('firebase/firestore/lite')
const { app } = require('../firebase/firebaseConnection')
const db = getFirestore(app);


// ---- API FUNCTIONS ---- //
/**
 * @param {Object} req                           request body
 * @param {string} req.body.department_name      department name
 * @returns {Object}                             department info
 */
const createDepartment = async (req, res) => {

    const { department_name } = req.body;

    // Check if department exists
    //const departmentExists = await departmentExists(department_name);
    if (await departmentNameExists(department_name)) {
        res.status(409).json({ message: "Department already exists" });
        return;
    }

    const docRef = await addDoc(collection(db, "departments"), {
        department_name: department_name
    });
    res.status(200).json({ message: "Department Created" });

    try {
        const docRef = await addDoc(collection(db, "departments"), {
            department_name: department_name
        });
        res.status(200).json({ message: "Department Created" });
    } catch (e) {
        console.error("Error adding document: ", e);
        res.status(500).json({ message: "Error creating department" });
    }

}

/**
 * 
 * @param {Object} req 
 * @param {string} req.body.department_id   Department ID 
 * @param {string} req.body.user_id         User id to join department
 * @param {string} req.userId               Api callers user id
 */
const joinDepartment = async (req, res) => {

    const { department_id, user_id } = req.body;

    // Check if department exists
    if (!(await departmentExists(department_id))) {
        res.status(404).json({ message: "Department does not exist" });
        return;
    }

    // Check if caller is department manager
    if (!(await userIsDepartmentManager(req.userId, department_id))) {
        res.status(403).json({ message: "User is not a department manager" });
        return;
    }

    // Check if user exists
    if (!(await userExists(user_id))) {
        res.status(404).json({ message: "User does not exist" });
        return;
    }

    if (user_id === req.userId) {
        res.status(403).json({ message: "Department Managers cannot join their department." });
        return;
    }


    try {
        const docRef = await addDoc(collection(db, "department_members"), {
            user_id: user_id,
            department_id: department_id
        });
        res.status(200).json({ message: "Department Joined" });
    } catch (e) {
        console.error("Error adding document: ", e);
        res.status(500).json({ message: "Error joining department" });
    }


}

/**
 * @param {Object} req                      Request object
 * @param {string} req.body.department_id   Department ID
 * @param {string} req.body.user_id         User id to leave department
 * @param {string} req.userId               Api callers user id
 */
const leaveDepartment = async (req, res) => {

    const { department_id, user_id } = req.body;

    // Check if department exists
    if (!(await departmentExists(department_id))) {
        res.status(404).json({ message: "Department does not exist" });
        return;
    }

    // Check if user is department member
    if (!(await userIsDepartmentMember(user_id, department_id))) {
        res.status(403).json({ message: "User is not a department member" });
        return;
    }

    // Check if caller is department manager
    if (!(await userIsDepartmentManager(req.userId, department_id))) {
        res.status(403).json({ message: "User is not a department manager" });
        return;
    }

    // Check if user exists
    if (!(await userExists(user_id))) {
        res.status(404).json({ message: "User does not exist" });
        return;
    }

    if (user_id === req.userId) {
        res.status(403).json({ message: "Department Managers cannot leave." });
        return;
    }

    try {
        const q = query(
            collection(db, "department_members"),
            where("user_id", "==", user_id),
            where("department_id", "==", department_id)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            deleteDoc(doc.ref);
        });
        res.status(200).json({ message: "Department Left" });
    } catch (e) {
        console.error("Error deleting document: ", e);
        res.status(500).json({ message: "Error leaving department" });
    }


}

/**
 * @param {Object} req                      Request object
 * @param {string} req.body.department_id   Department ID
 * @param {string} req.body.user_id         User id to remove from department
 */
const makeDepartmentManager = async (req, res) => {

    const { department_id, user_id } = req.body;

    // Check if department exists
    if (!(await departmentExists(department_id))) {
        res.status(404).json({ message: "Department does not exist" });
        return;
    }

    // Check if user exists
    if (!(await userExists(user_id))) {
        res.status(404).json({ message: "User does not exist" });
        return;
    }

    try {
        const docRef = await addDoc(collection(db, "department_managers"), {
            user_id: user_id,
            department_id: department_id
        });
        res.status(200).json({ message: "Department Manager Added" });
    } catch (e) {
        console.error("Error adding document: ", e);
        res.status(500).json({ message: "Error adding department manager" });
    }


}

/**
 * @param {Object} req                      Request object
 * @param {string} req.body.department_id   Department ID
 * @returns {Object}                        Department members
 */
const getDepartmentMembers = async (req, res) => {

    const department_id = req.params.departmentId;

    // Check if department exists
    if (!(await departmentExists(department_id))) {
        res.status(404).json({ message: "Department does not exist" });
        return;
    }

    try {
        const q = query(
            collection(db, "department_members"),
            where("department_id", "==", department_id)
        );
        const querySnapshot = await getDocs(q);
        const members = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            delete data.department_id
            members.push(data);
        });
        res.status(200).json({ members: members });
    } catch (e) {
        console.error("Error getting document: ", e);
        res.status(500).json({ message: "Error getting department members" });
    }

}

/**
 * @param {Object} req                      Request object
 * @param {string} req.body.department_id   Department ID
 * @returns {Object}                        Department managers
 */
const getDepartmentManager = async (req, res) => {

    console.log(req)
    console.log(req.params)
    console.log(req.params.departmentId)

    const department_id = req.params.departmentId;

    // Check if department exists
    if (!(await departmentExists(department_id))) {
        res.status(404).json({ message: "Department does not exist" });
        return;
    }

    try {
        if (!(await departmentExists(department_id))) {
            res.status(404).json({ message: "Department does not exist" });
            return;
        }


        const q = query(
            collection(db, "department_managers"),
            where("department_id", "==", department_id)
        );
        const querySnapshot = await getDocs(q);
        const managers = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            delete data.department_id
            managers.push(data);
        });
        res.status(200).json({ managers: managers });
    } catch (e) {
        console.error("Error getting document: ", e);
        res.status(500).json({ message: "Error getting department managers" });
    }


}

/** 
 * @param {Object} req                      Request object
 * @param {string} req.body.department_id   Department ID
 * @returns {Object}                        Department
 * @returns {string}                        Department.department_name
 * @returns {Array}                         Department.department_members
 * @returns {Array}                         Department.department_manager
*/
const getDepartment = async (req, res) => {
    const departmentRef = doc(db, "departments", req.params.departmentId);
    const departmentSnap = await getDoc(departmentRef);

    if (!(departmentSnap.exists())) {
        res.sendStatus(404)
        return
    }

    let data = departmentSnap.data()

    req.params.departmentId = departmentSnap.id
    const departmentManager = await getDepartmentManagerId(departmentSnap.id)
    const departmentMembers = await getDepartmentMembersId(departmentSnap.id)

    data.department_manager = departmentManager
    data.department_members = departmentMembers

    res.status(200).json(data)
}


/**
 * @returns {Array}                        Departments
 */
const getDepartments = async (req, res) => {

    try {
        const q = query(
            collection(db, "departments")
        );
        const querySnapshot = await getDocs(q);
        const departments = [];

        for (const document of querySnapshot.docs) {
            const department = document.data();
            department.id = document.id;
            departments.push(department);
        }

        res.status(200).json({ departments: departments });
    } catch (e) {
        console.error("Error getting document: ", e);
        res.status(500).json({ message: "Error getting departments" });
    }

}


// ---- HELPER FUNCTIONS ---- //
const userIsDepartmentManager = async (user_id, department_id) => {

    const q = query(
        collection(db, "department_managers"),
        where("user_id", "==", user_id),
        where("department_id", "==", department_id)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size > 0;
}

const userExists = async (user_id) => {
    const docRef = doc(db, "users", user_id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
}

const departmentExists = async (department_id) => {
    const docRef = doc(db, "departments", department_id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
}

const userIsDepartmentMember = async (user_id, department_id) => {

    const q = query(
        collection(db, "department_members"),
        where("user_id", "==", user_id),
        where("department_id", "==", department_id)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size > 0;

}

const departmentNameExists = async (department_name) => {

    const q = query(
        collection(db, "departments"),
        where("name", "==", department_name)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size > 0;

}

const getDepartmentManagerId = async (department_id) => {
    const q = query(
        collection(db, "department_managers"),
        where("department_id", "==", department_id)
    );
    const querySnapshot = await getDocs(q);
    const managers = [];
    return querySnapshot.docs.map(doc => doc.data().user_id)
}

const getDepartmentMembersId = async (department_id) => {
    const q = query(
        collection(db, "department_members"),
        where("department_id", "==", department_id)
    );
    const querySnapshot = await getDocs(q);
    const members = [];
    return querySnapshot.docs.map(doc => doc.data().user_id)
}

module.exports = { createDepartment, joinDepartment, leaveDepartment, makeDepartmentManager, getDepartmentMembers, getDepartmentManager, getDepartment, getDepartments }