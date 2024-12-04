import './config';
import 'express-async-errors';
import express, { Express } from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
//import { scheduleJob } from 'node-schedule';
//import argon2 from 'argon2';

//Controller imports
import { registerUser, logIn, createAdmin, adminControl } from './controllers/userController';
import { googleAuthorization, callBack } from './controllers/googleAuthController';
//import { grabSheet } from './controllers/googleSheetController';
//import { grabSheetModel } from './models/googleSheetModel';
import { studentDeviceCheckout } from './controllers/studentController';
//import { refreshTokens } from './models/googleAuthModel';
import { toStudentDataPage, toStudentFromComputer } from './controllers/pageController';
import { makeNote, deleteNote } from './controllers/noteController';
//import { addUser, getUserByEmail } from './models/userModel';
//import { initializeAdmins } from './controllers/adminController';

import { firstAdminInitializer } from './models/userModel';

//Model imports
import {} from './models/userModel';

const app: Express = express();
const { PORT, COOKIE_SECRET } = process.env;

const SQLiteStore = connectSqlite3(session);

//const ADMIN_PASS = process.env.ADMIN_PASS;
//const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

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


//Function that is ran in order to execute a student data grab
///////
//Student Data Grab Function location
///////


app.use(express.urlencoded({ extended: false }));
app.use(express.static('public', { extensions: ['html'] }));
app.set('view engine', 'ejs');

//Account Managment links
app.post('/register', registerUser);
app.post('/login', logIn);
app.post('/createAdmin', createAdmin);
app.get('/adminStatus', adminControl);

//Student Managment
app.post('/setDevice', studentDeviceCheckout);

//Device Managment

//Page Transitions
app.post('/studentData', toStudentDataPage);
app.post('/computerLookup', toStudentFromComputer);

//Student Notes
app.post('/makeNote', makeNote);
app.post('/deleteNote', deleteNote);

//Misc. Functionality
app.get('/googleAuth', googleAuthorization);
app.get('/callBack', callBack);

app.listen(PORT, () => {
  firstAdminInitializer();
  console.log(`Listening at http://localhost:${PORT}`);
});