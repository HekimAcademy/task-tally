
# TASK-TALLY
## AUTH 
| name    | method | route        | params                        |      |      |
| :------ | :----: | :----------- | :---------------------------- | :--- | :--- |
| Sign Up |  POST  | /auth/signUp | email <br> password <br> name |      |      |
| Sign In |  POST  | /auth/signIn | email <br> password           |      |      |

## PROJECTS
| name                   | method | route                  | params                                                |      |      |
| :--------------------- | :----: | :--------------------- | :---------------------------------------------------- | :--- | :--- |
| Create <br> Project    |  POST  | /projects              | project_name <br> description <br> project_manager_id |      |      |
| Join <br> Project      |  POST  | /projects/join         | project_id                                            |      |      |
| Get <br> Project       |  GET   | /projects/:projectId   | project_id                                            |      |      |
| Get User <br> Projects |  GET   | /projects/user/:userId | email <br> password                                   |      |      |

## APP
| name                | method | route             | params     |      |      |
| :------------------ | :----: | :---------------- | :--------- | :--- | :--- |
| Use <br> Cronometer |  POST  | /app/cronometer   | project_id |      |      |
| Get <br> Work Logs  |  GET   | /app/user/:userId | user_id    |      |      |
