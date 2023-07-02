const Router = require('express').Router()


const { firebaseSignUp, firebaseSignIn } = require('../controller/authController')
const { createProject, getProject, getUserProjects, joinProject } = require('../controller/projectsController')
const { useCronometer, getUserWorkLogs } = require('../controller/appController')

const { validateFirebaseIdToken } = require('../controller/tokenMiddleware')


Router.post('/auth/signUp', firebaseSignUp)
Router.post('/auth/signIn', firebaseSignIn)

Router.post('/projects', validateFirebaseIdToken, createProject)
Router.post('/projects/join', validateFirebaseIdToken, joinProject)
Router.get('/projects/:projectId', validateFirebaseIdToken, getProject)
Router.get('/projects/user/:userId', validateFirebaseIdToken, getUserProjects)

Router.post('/app/cronometer', validateFirebaseIdToken, useCronometer)
Router.get('/app/:userId', validateFirebaseIdToken, getUserWorkLogs)


module.exports = Router