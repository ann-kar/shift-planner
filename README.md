## Shift Planner

**PURPOSE:** A coffeeshop employee scheduling app.

**TECHNOLOGIES:** Node.js (Express.js), EJS templates, Bootstrap, PostgreSQL.

# Main features:

### HOMEPAGE:
1.	Fetch data from the database and display the weekly shifts of all employees on a calendar.
2.	Usernames are links pointing to individual user profiles.

### USERS: 
1.	“Add new user” feature. JS form with front-end & back-end validation checking against:
a.	empty input fields
b.	repeated emails
c.	faulty emails (basic regex)
d.	string length (for firstname, lastname, password)
2.	A list of all users with links pointing to individual user profiles.

### USER PROFILE:
1.	Main profile of the user with a link pointing to all their schedules.

### SCHEDULES:
1.	“Add new schedule” feature. JS form with front-end & back-end validation checking against:
a.	empty inputs
b.	shifts shorter than the minimum length (10 minutes)
c.	shifts ending before they even began! (eg. 14:30 – 14:15)
d.	shifts outside the coffeeshop’s opening hours
2.	A list of all schedules in table form.

# To do next:
1.	Hashing function for the passwords.
2.	Authorization: user registration & login.
3.	Deployment on heroku with the database.