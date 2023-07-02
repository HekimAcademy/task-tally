
# TASK-TALLY
## AUTH 
| name    | method | route        | params                        | params place |      |
| :------ | :----: | :----------- | :---------------------------- | :----------: | :--- |
| Sign Up |  POST  | /auth/signUp | email <br> password <br> name |     Body     |      |
| Sign In |  POST  | /auth/signIn | email <br> password           |     Body     |      |

## PROJECTS
| name                   | method | route                  | params                                                | params place |      |
| :--------------------- | :----: | :--------------------- | :---------------------------------------------------- | :----------: | :--- |
| Create <br> Project    |  POST  | /projects              | project_name <br> description <br> project_manager_id |     Body     |      |
| Join <br> Project      |  POST  | /projects/join         | project_id                                            |     Body     |      |
| Get <br> Project       |  GET   | /projects/:projectId   | project_id                                            |     URL      |      |
| Get User <br> Projects |  GET   | /projects/user/:userId | user_id                                               |     URL      |      |

## APP
| name                | method | route             | params     | params place |      |
| :------------------ | :----: | :---------------- | :--------- | :----------: | :--- |
| Use <br> Cronometer |  POST  | /app/cronometer   | project_id |     Body     |      |
| Get <br> Work Logs  |  GET   | /app/user/:userId | user_id    |     URL      |      |
