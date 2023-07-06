import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signInWithCustomToken,
} from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore/lite";
import axios from "axios";
import express, { Express, Request, Response } from "express";
import { UserInfo, UserOutput } from "../types/user";
import { RefreshTokenReqOutput } from "../types/firebase";

const { app } = require("../firebase/firebaseConnection");

const auth = getAuth();
const db = getFirestore(app);
const expiresIn = 3600; // 1 hour

/* ----------------------- */
/* ---- API FUNCTIONS ---- */
/* ----------------------- */
/**
 * @param {Object} req                  request body
 * @param {string} req.body.email       user email
 * @param {string} req.body.password    user password
 * @param {string} req.body.name        user display name
 * @returns {UserOutput}                user info
 */
async function firebaseSignUp(req: Request, res: Response) {
	const { email, password, name } = req.body;

	if (!email || !password || !name) {
		return res.status(400).send("Missing parameters in request body");
	}

	createUserWithEmailAndPassword(auth, email, password)
		.then((userInfo) => {
			let userRec = {
				uid: userInfo.user.uid,
				email: email,
				name: name,
			};
			firebaseSetUserData(userRec);

			var accessToken, expirationTime;

			Promise.all([userInfo.user.getIdToken()]).then((token) => {
				accessToken = token[0];
				expirationTime = expiresIn;

				res.status(201).send({
					uid: userInfo.user.uid,
					refreshToken: userInfo.user.refreshToken,
					accessToken: accessToken,
					expirationTime: expirationTime,
				});
			});
		})

		.catch((error) => {
			res.status(500).send(error);
		});
}

/**
 * @param {Object} req                  request body
 * @param {string} req.body.email       user email
 * @param {string} req.body.password    user password
 * @returns {UserOutput}                user info
 */
async function firebaseSignIn(req: Request, res: Response) {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).send("Missing parameters in request body");
	}

	signInWithEmailAndPassword(auth, req.body.email, req.body.password)
		.then((userInfo) => {
			var accessToken, expirationTime;

			Promise.all([userInfo.user.getIdToken()]).then((token) => {
				accessToken = token[0];
				expirationTime = expiresIn;

				res.status(200).send({
					uid: userInfo.user.uid,
					refreshToken: userInfo.user.refreshToken,
					accessToken: accessToken,
					expirationTime: expirationTime,
				});
			});
		})

		.catch((error) => {
			res.status(500).send(error);
		});
}

/**
 * @param {Object} req                      request body
 * @param {string} req.body.refreshToken    user refresh token
 * @returns {UserOutput}                    user info
 */
async function firebaseSignInWithToken(req: Request, res: Response) {
	const { refreshToken } = req.body;

	if (!refreshToken) {
		return res.status(400).send("Missing parameters in request body");
	}

	try {
		const response: any = await axios.post(
			`https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_CONFIG_API_KEY}`,
			{
				grant_type: "refresh_token",
				refresh_token: refreshToken,
			}
		);

		const resData: RefreshTokenReqOutput = response.data

		res.status(200).send({
			uid: resData.user_id,
			refreshToken: resData.refresh_token,
			accessToken: resData.id_token,
			expirationTime: resData.expires_in,
		});
	} catch (error) {
		res.status(500).send(error);
	}
}

/* -------------------------- */
/* ---- HELPER FUNCTIONS ---- */
/* -------------------------- */
/**
 * @param {UserInfo} userInfo             user info
 */
async function firebaseSetUserData(userInfo: UserInfo) {
	await setDoc(doc(db, "users", userInfo.uid), {
		user_email: userInfo.email,
		user_name: userInfo.name,
	});
}

module.exports = { firebaseSignUp, firebaseSignIn, firebaseSignInWithToken };
