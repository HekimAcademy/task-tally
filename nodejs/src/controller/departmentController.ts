/**

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
import {
	getFirestore,
	setDoc,
	doc,
	addDoc,
	collection,
	getDoc,
	query,
	where,
	getDocs,
	updateDoc,
	deleteDoc,
	DocumentData,
} from "firebase/firestore/lite";
import express, { Express, Request, Response } from "express";
import { DepartmentInfo } from "../types/department";
const { app } = require("../firebase/firebaseConnection");
const db = getFirestore(app);

/* ----------------------- */
/* ---- API FUNCTIONS ---- */
/* ----------------------- */
/**
 * @param {Object} req                           request body
 * @param {string} req.body.department_name      department name
 * @returns {Object}                             department info
 */
async function createDepartment(req: Request, res: Response) {
	const { userId, body:{department_name} } = req;

	if (!(await isAdmin(userId!))) {
		return res.status(403).send("Not authorized for this action.");
	}

	if (!department_name) {
		return res.status(400).send("Missing parameters in request body");
	}

	if (await departmentNameExists(department_name)) {
		return res.status(409).send("Department already exists");
	}

	try {
		const docRef = await addDoc(collection(db, "departments"), {
			department_name: department_name,
		});
		res.status(200).send({ department_id: docRef.id});
	} catch (error) {
		res.status(500).send(error);
	}
}

/**
 *
 * @param {Object} req
 * @param {string} req.body.department_id   Department ID
 * @param {string} req.body.user_id         User id to join department
 * @param {string} req.userId               Api callers user id
 */
async function joinDepartment(req: Request, res: Response) {
	const {
		userId,
		body: { department_id, user_id },
	} = req;

	if (!department_id || !user_id) {
		res.status(400).send("Missing parameters in request body");
	}

	if (!(await departmentExists(department_id))) {
		return res.status(404).send("Department does not exist");
	}

	if (!(await userIsDepartmentManager(userId!, department_id))) {
		return res.status(403).send("User is not a department manager");
	}

	if (!(await userExists(user_id))) {
		return res.status(404).send("User does not exist");
	}

	if (user_id === req.userId) {
		return res
			.status(403)
			.send("Department Managers cannot join their department.");
	}

	try {
		const docRef = await addDoc(collection(db, "department_members"), {
			user_id: user_id,
			department_id: department_id,
		});
		res.status(200).send("Joined to Department ");
	} catch (e) {
		console.error("Error adding document: ", e);
		res.status(500).send("Error joining department");
	}
}

/**
 * @param {Object} req                      Request object
 * @param {string} req.body.department_id   Department ID
 * @param {string} req.body.user_id         User id to leave department
 * @param {string} req.userId               Api callers user id
 */
async function leaveDepartment(req: Request, res: Response) {
	const {
		userId,
		body: { department_id, user_id },
	} = req;

	if (!department_id || !user_id) {
		res.status(400).send("Missing parameters in request body");
	}

	if (!(await departmentExists(department_id))) {
		return res.status(404).send("Department does not exist");
	}

	if (!(await userIsDepartmentMember(user_id, department_id))) {
		return res.status(403).send("User is not a department member");
	}

	if (!(await userIsDepartmentManager(userId!, department_id))) {
		return res.status(403).send("User is not a department manager");
	}

	if (!(await userExists(user_id))) {
		return res.status(404).send("User does not exist");
	}

	if (user_id === userId) {
		return res.status(403).send("Department Managers cannot leave.");
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
		res.status(200).send("Department Left");
	} catch (e) {
		console.error("Error deleting document: ", e);
		res.status(500).send("Error leaving department");
	}
}

/**
 * @param {Object} req                      Request object
 * @param {string} req.body.department_id   Department ID
 * @param {string} req.body.user_id         User id to remove from department
 */
async function makeDepartmentManager(req: Request, res: Response) {
	const { userId, body: {department_id, user_id} } = req;

	if(!(await isAdmin(userId!))) {
		return res.status(403).send("Not authorized for this action.");
	}

	if (!(await departmentExists(department_id))) {
		return res.status(404).send("Department does not exist");
	}

	if (!(await userExists(user_id))) {
		return res.status(404).send("User does not exist");
	}

	try {
		const docRef = await addDoc(collection(db, "department_managers"), {
			user_id: user_id,
			department_id: department_id,
		});
		res.status(200).send("Department Manager Added");
	} catch (e) {
		console.error("Error adding document: ", e);
		res.status(500).send("Error adding department manager");
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
async function getDepartment(req: Request, res: Response) {
	const departmentRef = doc(db, "departments", req.params.departmentId);
	const departmentSnap = await getDoc(departmentRef);

	if (!departmentSnap.exists()) {
		res.status(404);
		return;
	}

	let data = departmentSnap.data();

	req.params.departmentId = departmentSnap.id;
	const departmentManager = await getDepartmentManagerId(departmentSnap.id);
	const departmentMembers = await getDepartmentMembersId(departmentSnap.id);

	let members: Array<DocumentData> = [];
	for (const member of departmentMembers) {
		console.log(member);
		const user = await getUserById(member);
		console.log(user);
		members.push(user!);
	}

	console.log(members);

	data.department_manager = departmentManager[0];
	data.department_members = members;

	res.status(200).send(data);
}

/**
 * @returns {Array}                        Departments
 */
async function getDepartments(req: Request, res: Response) {
	try {
		const q = query(collection(db, "departments"));
		const querySnapshot = await getDocs(q);
		const departments = [];

		for (const document of querySnapshot.docs) {
			const department = document.data();
			department.id = document.id;
			departments.push(department);
		}

		res.status(200).send({ departments: departments });
	} catch (e) {
		console.error("Error getting document: ", e);
		res.status(500).send("Error getting departments");
	}
}

/* -------------------------- */
/* ---- HELPER FUNCTIONS ---- */
/* -------------------------- */
async function userIsDepartmentManager(user_id: string, department_id: string) {
	const q = query(
		collection(db, "department_managers"),
		where("user_id", "==", user_id),
		where("department_id", "==", department_id)
	);
	const querySnapshot = await getDocs(q);
	return querySnapshot.size > 0;
}

async function userExists(user_id: string) {
	const docRef = doc(db, "users", user_id);
	const docSnap = await getDoc(docRef);
	return docSnap.exists();
}

async function departmentExists(department_id: string) {
	const docRef = doc(db, "departments", department_id);
	const docSnap = await getDoc(docRef);
	return docSnap.exists();
}

async function userIsDepartmentMember(user_id: string, department_id: string) {
	const q = query(
		collection(db, "department_members"),
		where("user_id", "==", user_id),
		where("department_id", "==", department_id)
	);
	const querySnapshot = await getDocs(q);
	return querySnapshot.size > 0;
}

async function departmentNameExists(department_name: string) {
	const q = query(
		collection(db, "departments"),
		where("name", "==", department_name)
	);
	const querySnapshot = await getDocs(q);
	return querySnapshot.size > 0;
}

async function getDepartmentManagerId(department_id: string) {
	const q = query(
		collection(db, "department_managers"),
		where("department_id", "==", department_id)
	);
	const querySnapshot = await getDocs(q);
	const managers = [];
	return querySnapshot.docs.map((doc) => doc.data().user_id);
}

async function getDepartmentMembersId(department_id: string) {
	const q = query(
		collection(db, "department_members"),
		where("department_id", "==", department_id)
	);
	const querySnapshot = await getDocs(q);
	const members = [];
	return querySnapshot.docs.map((doc) => doc.data().user_id);
}

async function getUserById(userId: string) {
	const docRef = doc(db, "users", userId);
	const docSnap = await getDoc(docRef);

	if (!docSnap.exists()) {
		return;
	}

	let data = docSnap.data();
	data.user_uid = docSnap.id;

	return data;
};

async function isAdmin(userId: string) {
	const q = query(
		collection(db, "admins"),
		where("user_id", "==", userId)
	);
	const querySnapshot = await getDocs(q);
	return querySnapshot.size > 0;
}

module.exports = {
	createDepartment,
	joinDepartment,
	leaveDepartment,
	makeDepartmentManager,
	getDepartment,
	getDepartments,
};
