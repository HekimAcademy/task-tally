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
import express, { Express, Request, Response } from "express";

const { app } = require("../firebase/firebaseConnection");
const db = getFirestore(app);

/* ----------------------- */
/* ---- API FUNCTIONS ---- */
/* ----------------------- */
/**
 * @param {Object} req                  request body
 * @param {string} req.body.project_id  project id to start cronometer on
 * @param {string} req.userId           user id to start cronometer on project. Received from middleware through access token
 * @returns {string} work_log_id        doc id of the started cronometer
 */
async function useCronometer(req: Request, res: Response) {
	const {
		userId,
		body: { project_id, start_time, end_time },
	} = req;

	if (!userId && !project_id && !start_time) {
		return res.status(400).send("Missing parameters in request body");
	}

	if (!(await userIsInProject(userId!, project_id))) {
		return res.send(
			"user is not in this project or project does not exist at all"
		);
	}

	const [cronometerIsRunning, workLogDocId, WorkLogProjectId] =
		await userHasCronometer(userId!);
	if (cronometerIsRunning) {
		if (WorkLogProjectId === project_id) {
			const docRef = doc(db, "work_logs", workLogDocId);
			await updateDoc(docRef, {
				end_time: Math.round(new Date().getTime() / 1000),
			});

			return res.send("cronometer stopped");
		} else {
			return res.send(
				"User already has cronometer going on in another project"
			);
		}
	}

	const workLog = {
		user_id: userId,
		project_id: project_id,
		start_time: Math.round(new Date().getTime() / 1000),
		end_time: null,
	};

	const docRef = await addDoc(collection(db, "work_logs"), workLog);
	res.send({ work_log_id: docRef.id });
}

/**
 * @param {Object} req                  request body
 * @param {string} req.userId           user id to start cronometer on project. Received from middleware through access token
 * @param {string} req.body.project_id  project id to start cronometer on
 * @param {number} req.body.start_time  start time of work log (timestamp in milliseconds)
 * @param {number} req.body.end_time    end time of work log (timestamp in milliseconds)
 * @returns {string} work_log_id        doc id of the started cronometer
 */
async function addWorkLog(req: Request, res: Response) {
	const {
		userId,
		body: { project_id, start_time, end_time },
	} = req;

	if (start_time === undefined || end_time === undefined) {
		return res.send("start_time or end_time is undefined");
	}

	if (typeof start_time !== "number" || typeof end_time !== "number") {
		return res.send("start_time or end_time is not a number");
	}

	if (!isTimestamp(start_time) || !isTimestamp(end_time)) {
		return res.send("start_time or end_time is not a timestamp");
	}

	if (start_time > end_time) {
		return res.send("start_time is greater than end_time");
	}

	if (start_time === end_time) {
		return res.send("start_time is equal to end_time");
	}

	if (!(await userExists(userId!))) {
		return res.send("user does not exist");
	}

	if (!(await userIsInProject(userId!, project_id))) {
		return res.send(
			"user is not in this project or project does not exist at all"
		);
	}

	const workLog = {
		user_id: userId,
		project_id: project_id,
		start_time: start_time / 1000,
		end_time: end_time / 1000,
	};

	const docRef = await addDoc(collection(db, "work_logs"), workLog);
	res.send({ work_log_id: docRef.id });
}

/**
 * @param {Object} req                  request body
 * @param {string} req.userId           user id received from middleware through access token
 * @param {number} req.body.start_time  start time of work log (timestamp in milliseconds)
 * @param {number} req.body.end_time    end time of work log (timestamp in milliseconds)
 */
async function updateWorkLog(req: Request, res: Response) {
	const {
		userId,
		body: { start_time, end_time },
		params: { workLogId },
	} = req;

	if (start_time === undefined || end_time === undefined) {
		return res.send("start_time or end_time is undefined");
	}

	if (typeof start_time !== "number" || typeof end_time !== "number") {
		return res.send("start_time or end_time is not a number");
	}

	if (!isTimestamp(start_time) || !isTimestamp(end_time)) {
		return res.send("start_time or end_time is not a timestamp");
	}

	if (start_time > end_time) {
		return res.send("start_time is greater than end_time");
	}

	if (start_time === end_time) {
		return res.send("start_time is equal to end_time");
	}

	if (!(await userExists(userId!))) {
		return res.send("user does not exist");
	}

	const workLogRef = doc(db, "work_logs", workLogId);
	const workLogSnap = await getDoc(workLogRef);

	if (!workLogSnap.exists()) {
		return res.send("work log does not exist");
	}

	const workLog = workLogSnap.data();

	if (workLog.user_id !== userId) {
		return res.send("user does not own this work log");
	}

	const docRef = await updateDoc(workLogRef, {
		start_time: start_time / 1000,
		end_time: end_time / 1000,
	});

	res.send("work log updated");
}

/* -------------------------- */
/* ---- HELPER FUNCTIONS ---- */
/* -------------------------- */
/**
 *
 * @param {string} userId       user id to check if it exists
 * @param {string} projectId    project id to check if it exists
 * @returns {boolean}           true if user is in project, false if not
 */
async function userIsInProject(
	userId: string,
	projectId: string
): Promise<boolean> {
	const q = query(
		collection(db, "user_projects"),
		where("project_id", "==", projectId),
		where("user_id", "==", userId)
	);

	const querySnapshot = await getDocs(q);
	return querySnapshot.size > 0;
}

/**
 * @param {string} userId   	user id to check if it has cronometer going on
 * @returns {boolean}
 */
async function userHasCronometer(userId: string) {
	const q = query(
		collection(db, "work_logs"),
		where("user_id", "==", userId),
		where("end_time", "==", null)
	);
	const querySnapshot = await getDocs(q);

	console.log(querySnapshot.size > 0);

	if (!(querySnapshot.size > 0)) {
		return [false, null, null];
	}

	return [
		querySnapshot.size > 0,
		querySnapshot.docs[0].id,
		querySnapshot.docs[0].data().project_id,
	];
}

/**
 * @param {string} userId   	user id to check if user exists
 * @returns {boolean}
 */
async function userExists(userId: string): Promise<boolean> {
	const docRef = doc(db, "users", userId);
	const docSnap = await getDoc(docRef);
	return docSnap.exists();
}

/**
 *
 * @param {number} value		timestamp in milliseconds as number
 * @returns {boolean}
 */
function isTimestamp(value: number): boolean {
	return (
		value.toString().length === 13 &&
		!isNaN(value) &&
		value > 0 &&
		value < 32503680000000 &&
		value % 1 === 0 &&
		value > 1609459200000
	);
}

module.exports = { useCronometer, addWorkLog, updateWorkLog };

/**
 * res.status(200).send({}); // OK
 * res.status(201).send({}); // Created
 * res.status(204).send({}); // No Content
 *
 * res.status(400).send({}); // Bad Request
 * res.status(401).send({}); // Unauthorized
 * res.status(403).send({}); // Forbidden
 */
