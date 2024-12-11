import './config';
import 'express-async-errors';
import express, { Express } from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import { scheduleJob } from 'node-schedule';

//Controller imports
import { registerUser, logIn, adminStatusManagment, sessionRefresh } from './controllers/userController';
import { studentDeviceCheckout } from './controllers/studentController';
import { toStudentDataPage } from './controllers/pageController';
import { makeNote } from './controllers/noteController';

//Model imports
import { firstAdminInitializer } from './models/userModel';
import { studentDataPull } from './models/googleModel';


const app: Express = express();
const { PORT, COOKIE_SECRET } = process.env;

const SQLiteStore = connectSqlite3(session);

//Session managment
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


//Function and timing that is ran in order to execute a student data grab
///////
const SHEETS = [process.env.SHEET1, process.env.SHEET2, process.env.SHEET3];

async function refresh(){

  let datetime = new Date();

  console.log("Starting pull: " + datetime);

  try {

    //Makes sure to promise multiple results
    await Promise.all(

        //This is making sure that each sheet is ran in parallel
        SHEETS.map(async (sheet) => {
            if(sheet){
                await studentDataPull(sheet);
            }
        })

    )

    datetime = new Date();
    console.log("Finished at: " + datetime);
    
  }catch (error){

    datetime = new Date();
    console.log("failed to pull the data at: " + datetime);

  }

}

scheduleJob('0 6,18 * * *', refresh);
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
//Manages the assignment of a device to a student
app.post('/setDevice', studentDeviceCheckout);
///////////////////////////

//Device Managment
///////////////////////////

//Page Transitions
//Forwards user to the found student's page
app.post('/studentData', toStudentDataPage);
///////////////////////////

//Student Notes
//Manages to creation of notes
app.post('/makeNote', makeNote);
///////////////////////////

//Misc. Functionality
///////////////////////////

app.listen(PORT, () => {
  //When the application is started, the admin is initialized/verified
  firstAdminInitializer();
  console.log(`Listening at http://localhost:${PORT}`);
});