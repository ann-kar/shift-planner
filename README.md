# Shift Planner

An Express.js app for employee shift scheduling at a small business (like a coffeshop or a store).

## Built with:

**Express.js / EJS templates / Bootstrap / PostgreSQL / ESLint**

## Motivation

The project was an assignment during the web development course organized by INCO Academy. The tutors provided main guidelines and a list of required features, but the design, the logic, and the final product was up to the student. Main focus: building endpoints in server-side applications, GET / POST requests, fetching data from a database.

## Pages:

### HOME:
1.	Fetch data from the database and display the weekly shifts of all employees on a calendar.
2.	Usernames are links pointing to individual user profiles.

**Screenshot:**
[![shift-planner.png](https://i.postimg.cc/ZnM1HNCj/shift-planner.png)](https://postimg.cc/CnbPLzCf)

### USERS: 
1.	“Add new user” feature. JS form with front-end & back-end validation checking against:
  -	empty input fields
  -	repeated emails
  -	faulty emails (basic regex)
  -	string length (for firstname, lastname, password)
2.	A list of all users with links pointing to individual user profiles.

### USER PROFILE:
1.	Main profile of the user with a link pointing to all their schedules.

### SCHEDULES:
1.	“Add new schedule” feature. JS form with front-end & back-end validation checking against:
- empty inputs
- shifts shorter than the minimum length (10 minutes)
- shifts ending before they even began! (eg. 14:30 – 14:15)
- shifts outside the coffeeshop’s opening hours
2.	A list of all schedules in table form.

# Planned updates:
1.	Hashing function for the passwords.
2.	Authorization: user registration & login.
3.	Deployment on heroku with the database.
