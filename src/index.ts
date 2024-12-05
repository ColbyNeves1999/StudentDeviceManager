import './config';
import 'express-async-errors';
import express, { Express } from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
//import { scheduleJob } from 'node-schedule';
//import argon2 from 'argon2';

//Controller imports
import { registerUser, logIn, adminStatusManagment, sessionRefresh } from './controllers/userController';
import { studentDeviceCheckout } from './controllers/studentController';
import { toStudentDataPage } from './controllers/pageController';
import { makeNote } from './controllers/noteController';

//Model imports
import { firstAdminInitializer } from './models/userModel';

const app: Express = express();
const { PORT, COOKIE_SECRET } = process.env;

const SQLiteStore = connectSqlite3(session);


app.use(
  session({
    store: new SQLiteStore({ db: 'sessions.sqlite' }),
    secret: COOKIE_SECRET,
    cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours
    name: 'session',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public', { extensions: ['html'] }));
app.set('view engine', 'ejs');

//Function that is ran in order to execute a student data grab
///////
//Student Data Grab Function location
///////

//Account Managment links
//Logs the user in
app.post('/login', logIn);
//Allows for registration of a new student
app.post('/register', registerUser);
//Allows for modification of admin status
app.post('/adminStatus', adminStatusManagment);
//Directs user to their homepage
app.post('/homepage', sessionRefresh);
///////////////////////////

//Student Managment
app.post('/setDevice', studentDeviceCheckout);
///////////////////////////

//Device Managment
///////////////////////////

//Page Transitions
app.post('/studentData', toStudentDataPage);
///////////////////////////

//Student Notes
app.post('/makeNote', makeNote);
///////////////////////////

//Misc. Functionality
///////////////////////////

app.listen(PORT, () => {
  firstAdminInitializer();
  console.log(`Listening at http://localhost:${PORT}`);
});