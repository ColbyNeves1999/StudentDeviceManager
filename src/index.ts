import './config';
import 'express-async-errors';
import express, { Express } from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import { scheduleJob } from 'node-schedule';
import customLogger from './utils/logging';

//Controller imports
import { registerUser, logIn, logOut, adminStatusManagment, sessionRefresh } from './controllers/userController';
import { studentDeviceCheckout } from './controllers/studentController';
import { splashPageRedirect, toStudentDataPage } from './controllers/pageController';
import { makeNote } from './controllers/noteController';

//Model imports
import { firstAdminInitializer } from './models/userModel';
import { studentDataPull } from './models/googleModel';


const app: Express = express();
const { PORT, COOKIE_SECRET } = process.env;

const SQLiteStore = connectSqlite3(session);

//Session managment
///////
app.use(
  session({
    store: new SQLiteStore({ db: 'sessions.sqlite' }),
    secret: COOKIE_SECRET,
    cookie: { maxAge: 105 * 60 * 60 * 1000 }, // 8 hours
    name: 'session',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Primary spalsh page manager
//Redirects the user based on whether they're logged in or not
app.get('/', splashPageRedirect);

app.use(express.static('public', { extensions: ['html'] }));
app.set('view engine', 'ejs');
///////

//Function and timing that is ran in order to execute a student data grab
///////
const SHEETS = [process.env.SHEET1, process.env.SHEET2, process.env.SHEET3];

async function refresh(){

  //This log will be used with others to determine length of runtime if necessary
  //Logs that a data pull has started
  customLogger.log('information', "Starting student pull request.");

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

    //Logs that the data pull was successful
    customLogger.log('success', "Finished at pulling student data");
    
  }catch (error){

    //Logs if something causes this reoccuring function to fail
    customLogger.log('error', error);

  }

}

//Runs at 6 AM and PM everyday, this can be changed.
scheduleJob('0 6,18 * * *', refresh);
///////

//Account Managment links
//Logs the user in
app.post('/login', logIn);
//Logs the user out
app.post('/logout', logOut);
//Allows for registration of a new student
app.post('/register', registerUser);
//Allows for modification of admin status
app.post('/adminStatus', adminStatusManagment);
//Directs user to their homepage
app.get('/homepage', sessionRefresh);
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
  customLogger.log("success", "Website started successfully");

});