const Router = require('express').Router()


const { firebaseSignUp, firebaseSignIn, firebaseSignInWithToken } = require('../controller/authController')
const { createProject, getProject, getUserProjects, joinProject, getDepartmentProjects, getAllProjects } = require('../controller/projectsController')
const { useCronometer, addWorkLog, updateWorkLog } = require('../controller/appController')
const { createDepartment, joinDepartment, leaveDepartment, makeDepartmentManager, getDepartmentMembers, getDepartmentManager, getDepartment, getDepartments } = require('../controller/departmentController')
const { getAllUsers, getUser, getUserWorkLogs } = require('../controller/userController')

const { validateFirebaseIdToken } = require('../controller/tokenMiddleware')


Router.post('/auth/signUp', firebaseSignUp)
Router.post('/auth/signIn', firebaseSignIn)
Router.post('/auth/signIn/token', firebaseSignInWithToken)

Router.post('/projects', validateFirebaseIdToken, createProject)
Router.post('/projects/join', validateFirebaseIdToken, joinProject)
Router.get('/projects', validateFirebaseIdToken, getAllProjects)
Router.get('/projects/:projectId', validateFirebaseIdToken, getProject)
Router.get('/projects/user/:userId', validateFirebaseIdToken, getUserProjects)
Router.get('/projects/department/:departmentId', validateFirebaseIdToken, getDepartmentProjects)

Router.post('/app/cronometer', validateFirebaseIdToken, useCronometer)
Router.post('/app/addWorkLog', validateFirebaseIdToken, addWorkLog)
Router.put('/app/:workLogId', validateFirebaseIdToken, updateWorkLog)


Router.get('/users', validateFirebaseIdToken, getAllUsers)
Router.get('/user', validateFirebaseIdToken, getUser)
Router.get('/user/:userId/workLogs', validateFirebaseIdToken, getUserWorkLogs)

Router.post('/departments', validateFirebaseIdToken, createDepartment)
Router.post('/departments/join', validateFirebaseIdToken, joinDepartment)
Router.delete('/departments/leave', validateFirebaseIdToken, leaveDepartment)
Router.post('/departments/makeManager', validateFirebaseIdToken, makeDepartmentManager)
Router.get('/departments/:departmentId/members', validateFirebaseIdToken, getDepartmentMembers)
Router.get('/departments/:departmentId/manager', validateFirebaseIdToken, getDepartmentManager)
Router.get('/departments/:departmentId', validateFirebaseIdToken, getDepartment)
Router.get('/departments', validateFirebaseIdToken, getDepartments)


module.exports = Router