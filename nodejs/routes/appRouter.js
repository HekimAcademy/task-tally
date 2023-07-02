const Router = require('express').Router()

const { firebaseSignUp, firebaseSignIn } = require('../controller/authController')
const { createProject, getProject, joinProject } = require('../controller/projectsController')

const { validateFirebaseIdToken } = require('../controller/tokenMiddleware')


Router.post('/auth/signUp', firebaseSignUp)
Router.post('/auth/signIn', firebaseSignIn)

Router.post('/projects', validateFirebaseIdToken, createProject)
Router.post('/projects/join', validateFirebaseIdToken, joinProject)
Router.get('/projects/:projectId', validateFirebaseIdToken, getProject)


module.exports = Router