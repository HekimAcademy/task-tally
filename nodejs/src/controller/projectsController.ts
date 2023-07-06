/**
 * @description For handling projects requests
 * @todo Implement getting user_id by access token
 * @todo Implement if user has access to create
 *       project via access token
 * @todo Implement only department managers can create projects
 */
import {
	getFirestore,
	setDoc,
	deleteDoc,
	doc,
	addDoc,
	collection,
	getDoc,
	query,
	where,
	getDocs,
} from "firebase/firestore/lite";
const { app } = require("../firebase/firebaseConnection");
import express, { Express, Request, Response } from "express";
const db = getFirestore(app);

/* ----------------------- */
/* ---- API FUNCTIONS ---- */
/* ----------------------- */
/**
 * @param {Object} req                           request body
 * @param {string} req.body.project_name         project name
 * @param {string} req.body.description          project description
 * @param {string} req.body.project_manager_id   project manager id
 * @returns {Object}                             project info
 * @returns {string}                             project_info.project_id
 */
async function createProject(req: Request, res: Response) {
	const {
		userId,
		body: { project_name, description, project_manager_id, department_id },
	} = req;

	if (
		!userId &&
		!project_name &&
		!description &&
		!project_manager_id &&
		!department_id
	) {
		return res.status(400).send("Missing parameters in request body");
	}

	if (!(await userExists(project_manager_id))) {
		return res.status(404).send("Manager does not exist");
	}

	if (!(await departmentExists(department_id))) {
		return res.status(404).send("Department does not exist");
	}

	if (!(await userIsDepartmentManager(userId!, department_id))) {
		return res.status(403).send("User is not the department manager");
	}

	const docRef = await addDoc(collection(db, "projects"), {
		project_name: project_name,
		description: description,
		project_manager_id: project_manager_id,
		department_id: department_id,
	});

	res.status(201).send({ project_id: docRef.id });
}

/**
 *
 * @param {Object} req                   request body
 * @param {string} req.body.project_id   project id to join
 * @param {string} req.userId            user id to join project. Received from middleware through access token
 */
async function joinProject(req: Request, res: Response) {
	const {
		userId,
		body: { project_id },
	} = req;

	if (!userId && !project_id) {
		return res.status(400).send("Missing parameters in request body");
	}

	if (!(await projectExists(project_id))) {
		return res.status(404).send("project does not exist");
	}

	if (await userIsInProject(project_id, userId!)) {
		return res.status(409).send("user is already in this project");
	}

	const docRef = await addDoc(collection(db, "user_projects"), {
		user_id: userId,
		project_id: project_id,
	});
	res.status(201).send("Success!");
}

async function leaveProject(req: Request, res: Response) {

	const {
		userId,
		body: { project_id, user_id },
	} = req;

	if (!userId && !project_id) {
		return res.status(400).send("Missing parameters in request body");
	}

	let userToBeRemoved = userId

	if (user_id) {
		if (!(await userExists(user_id))) {
			return res.status(404).send("user does not exist");
		}

		if (!(await userIsInProject(project_id, user_id))) {
			return res.status(409).send("user is not in this project");
		}

		userToBeRemoved = user_id
	}



	if (!(await projectExists(project_id))) {
		return res.status(404).send("project does not exist");
	}

	if (!(await userIsInProject(project_id, userToBeRemoved!))) {
		return res.status(409).send("user is not in this project");
	}

	const q = query(
		collection(db, "user_projects"),
		where("user_id", "==", userToBeRemoved),
		where("project_id", "==", project_id)
	);

	const querySnapshot = await getDocs(q);

	for (const document of querySnapshot.docs) {
		await deleteDoc(doc(db, "user_projects", document.id));
	}

	res.status(200).send("Success!");

}

/**
 *
 * @param {Object} req                           request body
 * @param {string} req.params.projectId          project id to get
 *
 */
async function getProject(req: Request, res: Response) {
	const { projectId } = req.params;

	if (!projectId) {
		res.status(400).send("Missing parameters in request body");
	}

	const docRef = doc(db, "projects", projectId);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		let project = docSnap.data();

		await getProjectUsers(projectId).then((users) => {
			project.users = users;
		});

		res.status(200).send(project);
	} else {
		res.status(500);
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
async function getUserProjects(req: Request, res: Response) {
	const { userId } = req.params;

	if (!userId) {
		res.status(400).send("Missing parameters in params");
	}

	if (!(await userExists(userId))) {
		return res.status(404).send("user does not exist");
	}

	const q = query(
		collection(db, "user_projects"),
		where("user_id", "==", userId)
	);

	const querySnapshot = await getDocs(q);

	const userProjects = [];
	for (const document of querySnapshot.docs) {
		const docRef = doc(db, "projects", document.data().project_id);
		const docSnap = await getDoc(docRef);

		let project = docSnap.data();
		project!.project_id = docSnap.id;

		userProjects.push(project);
	}

	res.send(userProjects);
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
async function getDepartmentProjects(req: Request, res: Response) {
	const { departmentId } = req.params;

	if (!departmentId) {
		res.status(400).send("Missing parameters in params");
	}

	if (!(await departmentExists(departmentId))) {
		return res.status(404).send("Department does not exist");
	}

	const q = query(
		collection(db, "projects"),
		where("department_id", "==", departmentId)
	);

	const querySnapshot = await getDocs(q);

	const departmentProjects = [];
	for (const document of querySnapshot.docs) {
		const docRef = doc(db, "projects", document.id);
		const docSnap = await getDoc(docRef);

		let project = docSnap.data();
		project!.project_id = docSnap.id;

		departmentProjects.push(project);
	}

	res.send(departmentProjects);
}

/**
 * @returns {Object[]}                           array of projects
 * @returns {string}                             project.project_id
 * @returns {string}                             project.project_name
 * @returns {string}                             project.description
 * @returns {string}                             project.project_manager_id
 * @returns {string}                             project.department_id
 */
async function getAllProjects(req: Request, res: Response) {
	const q = query(collection(db, "projects"));

	const querySnapshot = await getDocs(q);

	const allProjects = [];
	for (const document of querySnapshot.docs) {
		const docRef = doc(db, "projects", document.id);
		const docSnap = await getDoc(docRef);

		let project = docSnap.data();
		project!.project_id = docSnap.id;

		allProjects.push(project);
	}

	res.send(allProjects);
}

/* -------------------------- */
/* ---- HELPER FUNCTIONS ---- */
/* -------------------------- */
async function userExists(userId: string) {
	const userRef = doc(db, "users", userId);
	const userSnap = await getDoc(userRef);

	return userSnap.exists();
}

async function projectExists(projectId: string) {
	const projectRef = doc(db, "projects", projectId);
	const projectSnap = await getDoc(projectRef);

	if (projectSnap.exists()) {
		return true;
	} else {
		return false;
	}
}

async function userIsInProject(projectId: string, userId: string) {
	const q = query(
		collection(db, "user_projects"),
		where("project_id", "==", projectId),
		where("user_id", "==", userId)
	);

	const querySnapshot = await getDocs(q);
	return querySnapshot.size > 0;
}

async function userIsDepartmentManager(userId: string, departmentId: string) {
	const q = query(
		collection(db, "department_managers"),
		where("department_id", "==", departmentId),
		where("user_id", "==", userId)
	);

	const querySnapshot = await getDocs(q);
	return querySnapshot.size > 0;
}

async function departmentExists(departmentId: string) {
	const departmentRef = doc(db, "departments", departmentId);
	const departmentSnap = await getDoc(departmentRef);

	return departmentSnap.exists();
}

async function getProjectUsers(projectId: string) {
	const q = query(
		collection(db, "user_projects"),
		where("project_id", "==", projectId)
	);

	const querySnapshot = await getDocs(q);

	const projectUsers = [];
	for (const document of querySnapshot.docs) {
		const docRef = doc(db, "users", document.data().user_id);
		const docSnap = await getDoc(docRef);

		let user = docSnap.data();
		user!.user_id = docSnap.id;

		projectUsers.push(user);
	}

	return projectUsers;
}

module.exports = {
	createProject,
	joinProject,
	getProject,
	getUserProjects,
	getDepartmentProjects,
	getAllProjects,
	leaveProject
};
