
# TASK-TALLY

## TO-DO
* Only department managers can create projects.
* Adjust routes.
* Create signing in with refresh token.
* Arrange res.statuses.
* Create leaving project logic.
* User profiles.
* Get all users.
* Allow users to add work log later.
* Allow users to edit their work log.
* getDepartment, getManager and getMembers should work together. Right now getDepartment uses different functions for receiving manager and members.

___
:heavy_check_mark:
:x:

## AUTH 
| name    | method | route        | params                        | parameter placement | returns                                                                                            | needs auth |
| :------ | :----: | :----------- | :---------------------------- | :-----------------: | :------------------------------------------------------------------------------------------------- | :--------: |
| Sign Up |  POST  | /auth/signUp | email <br> password <br> name |        Body         | user_info.uid <br> user_info.refreshToken <br> user_info.accessToken <br> user_info.expirationTime |    :x:     |
| Sign In |  POST  | /auth/signIn | email <br> password           |        Body         | user_info.uid <br> user_info.refreshToken <br> user_info.accessToken <br> user_info.expirationTime |    :x:     |

## PROJECTS
| name                   | method | route                  | params                                                                   | parameter placement | returns                                                                                                            |     needs auth     |
| :--------------------- | :----: | :--------------------- | :----------------------------------------------------------------------- | :-----------------: | :----------------------------------------------------------------------------------------------------------------- | :----------------: |
| Create <br> Project    |  POST  | /projects              | project_name <br> description <br> project_manager_id <br> department_id |        Body         | project_id                                                                                                         | :heavy_check_mark: |
| Join <br> Project      |  POST  | /projects/join         | project_id                                                               |        Body         |                                                                                                                    | :heavy_check_mark: |
| Get <br> Project       |  GET   | /projects/:projectId   | project_id                                                               |         URL         | project.project_name <br>project.description <br>project.project_manager_id                                        | :heavy_check_mark: |
| Get User <br> Projects |  GET   | /projects/user/:userId | user_id                                                                  |         URL         | projects[] <br> project.project_id <br>project.project_name <br>project.description <br>project.project_manager_id | :heavy_check_mark: |

## APP
| name                | method | route             | params     | parameter placement | returns                                                                                             |     needs auth     |
| :------------------ | :----: | :---------------- | :--------- | :-----------------: | :-------------------------------------------------------------------------------------------------- | :----------------: |
| Use <br> Cronometer |  POST  | /app/cronometer   | project_id |        Body         |                                                                                                     | :heavy_check_mark: |
| Get <br> Work Logs  |  GET   | /app/user/:userId | user_id    |         URL         | workLogs[] <br> workLog.start_time<br>workLog.end_time<br>workLog.user_id<br>workLog.project_id<br> | :heavy_check_mark: |

## DEPARTMENTS
| name                             | method | route                              | params                     | parameter placement | returns                                                             |     needs auth     |
| :------------------------------- | :----: | :--------------------------------- | :------------------------- | :-----------------: | :------------------------------------------------------------------ | :----------------: |
| Create <br> Department           |  POST  | /departments                       | department_name            |        Body         |                                                                     | :heavy_check_mark: |
| Join <br> Department             |  POST  | /departments/join                  | department_id <br> user_id |        Body         |                                                                     | :heavy_check_mark: |
| Leave <br> Department            | DELETE | /departments/leave                 | department_id <br> user_id |        Body         |                                                                     | :heavy_check_mark: |
| Make <br> Department<br> Manager |  POST  | /departments/makeManager           | department_id <br> user_id |        Body         |                                                                     | :heavy_check_mark: |
| Get <br> Department<br> Members  |  GET   | /departments/:departmentId/members | department_id              |         URL         | members[] <br> member.user_id                                       | :heavy_check_mark: |
| Get <br> Department<br> Manager  |  GET   | /departments/:departmentId/manager | department_id              |         URL         | managers[] <br> manager.user_id                                     | :heavy_check_mark: |
| Get <br> Department              |  GET   | /departments/:departmentId         | department_id              |         URL         | department_name <br> department_manager[] <br> department_members[] | :heavy_check_mark: |
| Get <br> Departments             |  GET   | /departments                       |                            |                     | departments[] <br> department.department_name <br> department.id    | :heavy_check_mark: |