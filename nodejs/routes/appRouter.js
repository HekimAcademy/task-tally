const Router = require('express').Router()


const { firebaseSignUp, firebaseSignIn } = require('../controller/authController')
const { createProject, getProject, getUserProjects, joinProject } = require('../controller/projectsController')
const { useCronometer, getUserWorkLogs } = require('../controller/appController')
const { createDepartment, joinDepartment, leaveDepartment, makeDepartmentManager, getDepartmentMembers, getDepartmentManager, getDepartment, getDepartments } = require('../controller/departmentController')

const { validateFirebaseIdToken } = require('../controller/tokenMiddleware')


Router.post('/auth/signUp', firebaseSignUp)
Router.post('/auth/signIn', firebaseSignIn)

Router.post('/projects', validateFirebaseIdToken, createProject)
Router.post('/projects/join', validateFirebaseIdToken, joinProject)
Router.get('/projects/:projectId', validateFirebaseIdToken, getProject)
Router.get('/projects/user/:userId', validateFirebaseIdToken, getUserProjects)

Router.post('/app/cronometer', validateFirebaseIdToken, useCronometer)
Router.get('/app/:userId', validateFirebaseIdToken, getUserWorkLogs)

Router.post('/departments', validateFirebaseIdToken, createDepartment)
Router.post('/departments/join', validateFirebaseIdToken, joinDepartment)
Router.delete('/departments/leave', validateFirebaseIdToken, leaveDepartment)
Router.post('/departments/makeManager', validateFirebaseIdToken, makeDepartmentManager)
Router.get('/departments/:departmentId/members', validateFirebaseIdToken, getDepartmentMembers)
Router.get('/departments/:departmentId/manager', validateFirebaseIdToken, getDepartmentManager)
Router.get('/departments/:departmentId', validateFirebaseIdToken, getDepartment)
Router.get('/departments', validateFirebaseIdToken, getDepartments)


module.exports = Router