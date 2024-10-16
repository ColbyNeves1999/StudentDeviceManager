import './config';
import 'express-async-errors';
import express, { Express } from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import { scheduleJob } from 'node-schedule';
import argon2 from 'argon2';

//Controller imports
import { registerUser, logIn, createAdmin, adminControl } from './controllers/userController';
import { googleAuthorization, callBack } from './controllers/googleAuthController';
import { grabSheet } from './controllers/googleSheetController';
import { grabSheetModel } from './models/googleSheetModel';
import { studentDeviceCheckout } from './controllers/studentController';
import { refreshTokens } from './models/googleAuthModel';
import { toStudentDataPage, toStudentFromComputer } from './controllers/pageController';
import { makeNote, deleteNote } from './controllers/noteController';
import { addUser, getUserByEmail } from './models/userModel';
//import { initializeAdmins } from './controllers/adminController';

const app: Express = express();
const { PORT, COOKIE_SECRET } = process.env;

const SQLiteStore = connectSqlite3(session);

const ADMIN_PASS = process.env.ADMIN_PASS;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

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


//Runs every hour in order to grab new students
function iRunEveryHour() {

  const range = "A2:E";
  const spreadsheetId = '1RSfxLHQBe6CRDDRnYgcDF25Lbr2cfQa-YpvJAV0xHUw';
  const userEmail = "colby.neves@jonesboroschools.net"

  refreshTokens();
  grabSheetModel(spreadsheetId, range, userEmail);

}

scheduleJob('1 * * * *', iRunEveryHour);

//Makes sure there's a new admin at runtime
async function adminUser(){
  const user = await getUserByEmail(ADMIN_EMAIL); 
  if(!user){
    addUser(ADMIN_EMAIL, await argon2.hash(ADMIN_PASS));
  }
}

adminUser();

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public', { extensions: ['html'] }));
app.set('view engine', 'ejs');

//Account set up links
app.post('/register', registerUser);
app.post('/login', logIn);
app.post('/createAdmin', createAdmin);
app.get('/adminStatus', adminControl);
app.get('/googleAuth', googleAuthorization);
app.get('/callBack', callBack);

//Student Addition Setup
app.get('/grabSheet', grabSheet);
app.post('/setDevice', studentDeviceCheckout);

//Page changes
app.post('/studentData', toStudentDataPage);
app.post('/computerLookup', toStudentFromComputer);

//Student Notes
app.post('/makeNote', makeNote);
app.post('/deleteNote', deleteNote);

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
