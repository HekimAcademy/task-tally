import { Express, Request, Response } from "express";
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
} from "firebase/firestore/lite";
const { app } = require("../firebase/firebaseConnection");
const db = getFirestore(app);

/* ----------------------- */
/* ---- API FUNCTIONS ---- */
/* ----------------------- */
/**
 * @returns {Object[]}                             array of user info
 * @returns {string}                               user_info.user_uid
 * @returns {string}                               user_info.user_name
 * @returns {string}                               user_info.user_email
 */
async function getAllUsers(req: Request, res: Response) {
	const q = query(collection(db, "users"));

	const querySnapshot = await getDocs(q);
	res.status(200).send(
		querySnapshot.docs.map((doc) => {
			let data = doc.data();
			data.user_uid = doc.id;
			return data;
		})
	);
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
async function getUser(req: Request, res: Response) {
	const { type, id, email } = req.body;

	var user;

	switch (type) {
		case "id":
			user = await getUserById(id);
			break;
		case "email":
			user = await getUserByEmail(email);
			break;
	}

	console.log(user);

	res.status(200).send(user);
}

/**
 *
 * @param {Object} req                         request body
 * @param {string} req.params.userId           user id to get work logs from
 */
async function getUserWorkLogs(req: Request, res: Response) {
	const user_id = req.params.userId;

	if (!user_id) {
		return res.status(400).send("Missing parameter in request params");
	}

	const q = query(collection(db, "work_logs"), where("user_id", "==", user_id));

	const querySnapshot = await getDocs(q);
	res.send(querySnapshot.docs.map((doc) => doc.data()));
}

async function editUser(req: Request, res: Response) {
	
	const senderId = req.userId;

	const {
		params: { userId },
		body: { user_name },
	} = req;

	if (!userId) {
		return res.status(400).send("Missing parameter in request params");
	}

	if (!user_name) {
		return res.status(400).send("Missing parameters in request body");
	}

	if (!(await userExists(userId))) {
		return res.status(404).send("User does not exist");
	}

	if (userId !== senderId) {
		return res.status(403).send("User is not authorized to edit this user");
	}

	const docRef = doc(db, "users", userId);
	const update = await updateDoc(docRef, { user_name: user_name });

	res.status(200).send("Success!");
}

/* -------------------------- */
/* ---- HELPER FUNCTIONS ---- */
/* -------------------------- */
async function getUserById(userId: string) {
	const docRef = doc(db, "users", userId);
	const docSnap = await getDoc(docRef);

	if (!docSnap.exists()) {
		return;
	}

	let data = docSnap.data();
	data.user_uid = docSnap.id;

	return data;
}

async function getUserByEmail(email: string) {
	const q = query(collection(db, "users"), where("user_email", "==", email));

	const querySnapshot = await getDocs(q);
	if (querySnapshot.docs.length === 0) {
		return;
	}

	let data = querySnapshot.docs[0].data();
	data.user_uid = querySnapshot.docs[0].id;

	return data;
}

async function userExists(userId: string) {
	const docRef = doc(db, "users", userId);
	const docSnap = await getDoc(docRef);

	return docSnap.exists();
}

module.exports = { getAllUsers, getUser, getUserWorkLogs, editUser };
