const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

const ejs = require('ejs');
const path = require('path');

app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const getSchedules = new Promise((resolve, reject) => {
  client.query(`SELECT day,
    to_char(start_at, 'HH24:MI') as start_at,
    to_char(end_at, 'HH24:MI') as end_at,
    users.firstname,
    users.lastname,
    users.email,
    users.id,
    user_id from schedules
    FULL JOIN users
    ON users.id = schedules.user_id 
    ORDER BY day, start_at`, (err, dbRes) => {
    resolve(dbRes);
    reject(err);
  });
});

app.get('/', (req, res) => {
  getSchedules.then(
    (result) => res.render('./pages/index.ejs', { schedules: result.rows }),
    (error) => res.status(400).render('./pages/error.ejs', { title: error }),
  );
});

app.get('/users', (req, res) => {
  client.query(`SELECT 
    lastname, 
    firstname, 
    id, 
    email from users 
    ORDER BY lastname`, (err, dbRes) => {
    res.render('./pages/users.ejs', {
      users: dbRes.rows,
    });
  });
});

app.post('/users-success', (req, res) => {
  const formData = req.body;
  if (Object.values(formData).some((el) => !(String(el).trim().length))) {
    res.status(400).render('./pages/error.ejs', { message: 'Please fill out all fields.' });
    return;
  }

  client.query(`SELECT COUNT(*) FROM users WHERE email='${formData.emailInput}'`, (err, dbRes) => {
    if (parseInt((dbRes.rows[0].count), 10) > 0) {
      res.status(400).render('./pages/error.ejs', { message: 'This email is already taken.' });
    }
  });

  client.query(`INSERT into users (firstname, lastname, email) 
      VALUES (
        '${formData.firstnameInput}',
        '${formData.lastnameInput}',
        '${formData.emailInput}')`, () => {
    res.render('./pages/users-success.ejs');
  });
});

app.get('/users/:id', (req, res) => {
  client.query(`SELECT 
    lastname, 
    firstname, 
    id, 
    email from users ORDER BY id`, (err, dbRes) => {
    const currentUser = dbRes.rows.filter((user) => String(user.id) === String(req.params.id));
    if (!currentUser.length) {
      res.status(404).render('./pages/error.ejs', { message: 'No such user here.' });
    } else {
      res.render('./pages/user.ejs', { userData: Object.assign(...currentUser) });
    }
  });
});

app.get('/users/:id/schedules', (req, res) => {
  client.query(`SELECT day, 
    to_char(start_at, 'HH24:MI') as start_at, 
    to_char(end_at, 'HH24:MI') as end_at, 
    user_id, 
    users.id, 
    lastname, 
    firstname from users 
                LEFT JOIN schedules 
                ON users.id = schedules.user_id 
                WHERE users.id=${req.params.id}`, (err, dbRes) => {
    if (dbRes.rows.length === 0) {
      res.status(404).render('./pages/error.ejs', { message: 'No such user here.' });
      return;
    }
    res.render('./pages/userSchedule.ejs', { schedules: dbRes.rows });
  });
});

app.get('/schedules', (req, res) => {
  getSchedules.then(
    (result) => res.render('./pages/schedules.ejs', { schedules: result.rows }),
    (error) => res.status(500).render('./pages/error.ejs', { message: error }),
  );
});

app.post('/schedules-success', (req, res) => {
  const formData = req.body;
  if (String(formData.from) > String(formData.to)) {
    res.status(400).render(
      './pages/error.ejs',
      { message: 'Sorry, you cannot end your shift before it starts.' },
    );
    return;
  }
  if (parseInt(String(formData.to).replace(':', ''), 10) - parseInt(String(formData.from).replace(':', ''), 10) < 10) {
    res.status(400).render(
      './pages/error.ejs',
      { message: 'Sorry, the shift must be at least 10 minutes long.' },
    );
    return;
  }

  client.query(`SELECT day,
      to_char(start_at, 'HH24:MI') as start_at,
      to_char(end_at, 'HH24:MI') as end_at
      from schedules`, (err, dbRes) => {
    if (dbRes !== undefined) {
      dbRes.rows.forEach((schedule) => {
        if (String(schedule.day) === String(formData.day)) {
          const parseTime = (d) => parseInt(d.replace(':', ''), 10);
          const schedStart = parseTime(schedule.start_at);
          const schedEnd = parseTime(schedule.end_at);
          const formStart = parseTime(formData.from);
          const formEnd = parseTime(formData.to);
          if ((schedStart < formStart && schedEnd > formStart)
            || (schedStart < formEnd && schedEnd > formEnd)) {
            res.status(400).render('./pages/error.ejs', { message: 'This time slot has already been filled.' });
          }
        }
      });
    }
  });
  client.query(`INSERT into schedules (day, start_at, end_at, user_id) VALUES (
        ${parseInt(formData.day, 10)},
        '${String(formData.from, 10)}',
        '${String(formData.to, 10)}',
        ${parseInt(formData.id, 10)})`, () => {
    res.render('./pages/schedules-success.ejs');
  });
});

const port = 3002;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
