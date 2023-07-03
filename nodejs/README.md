
# TASK-TALLY

## TO-DO
* Add department logic.
* Only department managers can create projects.
* Adjust routes.
* Create signing in with refresh token.

___


## AUTH 
| name    | method | route        | params                        | Parameter Placement | returns     |
| :------ | :----: | :----------- | :---------------------------- | :-----------------: | :--- |
| Sign Up |  POST  | /auth/signUp | email <br> password <br> name |        Body         |  user_info.uid <br> user_info.refreshToken <br> user_info.accessToken <br> user_info.expirationTime    |
| Sign In |  POST  | /auth/signIn | email <br> password           |        Body         |   user_info.uid <br> user_info.refreshToken <br> user_info.accessToken <br> user_info.expirationTime    |

## PROJECTS
| name                   | method | route                  | params                                                | params place | returns     |
| :--------------------- | :----: | :--------------------- | :---------------------------------------------------- | :----------: | :--- |
| Create <br> Project    |  POST  | /projects              | project_name <br> description <br> project_manager_id |     Body     |  project_id    |
| Join <br> Project      |  POST  | /projects/join         | project_id                                            |     Body     |  |
| Get <br> Project       |  GET   | /projects/:projectId   | project_id                                            |     URL      | project.project_name <br>project.description <br>project.project_manager_id     |
| Get User <br> Projects |  GET   | /projects/user/:userId | user_id                                               |     URL      | projects[] <br> project.project_id <br>project.project_name <br>project.description <br>project.project_manager_id         |

## APP
| name                | method | route             | params     | params place | returns     |
| :------------------ | :----: | :---------------- | :--------- | :----------: | :--- |
| Use <br> Cronometer |  POST  | /app/cronometer   | project_id |     Body     |      |
| Get <br> Work Logs  |  GET   | /app/user/:userId | user_id    |     URL      | workLogs[] <br> workLog.start_time<br>workLog.end_time<br>workLog.user_id<br>workLog.project_id<br>     |
