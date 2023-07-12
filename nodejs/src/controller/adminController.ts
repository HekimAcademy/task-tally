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

const { app } = require("../firebase/firebaseConnection");
const db = getFirestore(app);

/* ----------------------- */
/* ---- API FUNCTIONS ---- */
/* ----------------------- */

/**
 * @param {Object} req                      Express request object
 * @param {string} req.userId               Senders user_id received from middleware
 * @param {Object} req.body.user_id         User_id of user to make admin
 */
async function makeAdmin(req: Request, res: Response) {
	const {
		userId,
		body: { user_id },
	} = req;

	if (!user_id) {
		return res.status(400).send("Missing user_id.");
	}

	if (!(await isAdmin(userId!))) {
		return res.status(403).send("Not authorized for this action.");
	}

	if (await isAdmin(user_id)) {
		return res.status(409).send("User is already an admin.");
	}

	const docRef = await addDoc(collection(db, "admins"), {
		user_id: req.body.user_id,
	});

	res.sendStatus(200);
}

/**
 * @param {Object} req                      Express request object
 * @param {string} req.userId               Senders user_id received from middleware
 * @param {Object} req.body.user_id         User_id of user to remove from admins
 */
async function removeAdmin(req: Request, res: Response) {
	const {
		userId,
		body: { user_id },
	} = req;

	if (!user_id) {
		return res.status(400).send("Missing user_id.");
	}

	if (!(await isAdmin(userId!))) {
		return res.status(403).send("Not authorized for this action.");
	}

	if (!(await isAdmin(user_id))) {
		return res.status(409).send("User is not an admin.");
	}

	const q = query(collection(db, "admins"), where("user_id", "==", user_id));
	const statusSnapshot = await getDocs(q);

	const docRef = doc(db, "admins", statusSnapshot.docs[0].id);
	await deleteDoc(docRef);

	res.sendStatus(200);
}

/**
 * @returns {Object} admins                 Array of admins
*/
async function getAdmins(req: Request, res: Response) {
	const { userId } = req;

	if (!(await isAdmin(userId!))) {
		return res.status(403).send("Not authorized for this action.");
	}

	const q = query(collection(db, "admins"));
	const statusSnapshot = await getDocs(q);

	let admins: Array<DocumentData> = [];

	for (const member of statusSnapshot.docs) {
		let memberData = await getUserById(member.data().user_id);
		admins.push(memberData!);
	}

	res.status(200).send({ admins: admins });
}

/* --------------------------- */
/* ---- HELPER FUNCTIONS ----- */
/* --------------------------- */
async function isAdmin(userId: string) {
	const q = query(collection(db, "admins"), where("user_id", "==", userId));
	const statusSnapshot = await getDocs(q);

	return statusSnapshot.docs.length > 0;
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
}

module.exports = { makeAdmin, removeAdmin, getAdmins };
