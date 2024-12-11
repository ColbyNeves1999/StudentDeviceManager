import { google } from 'googleapis';

import { addStudent } from './studentModel';

const GOOGLEUSEREMAIL = process.env.GOOGLEUSEREMAIL;
//This is necessary due to how the Private key is stored
const GOOGLEUSERKEY= process.env.GOOGLEUSERKEY?.replace(/\\n/g, '\n');;
const SHEETID = process.env.SHEETID;

//Creates an authorized user to access the google sheet and grab student data
const auth = new google.auth.JWT(

    GOOGLEUSEREMAIL,
    undefined,
    GOOGLEUSERKEY,
    ['https://www.googleapis.com/auth/spreadsheets.readonly']

);

//Triggers the sheets API to allow for access to google sheets
const sheets = google.sheets({ version: 'v4', auth });

//The function that actually pulls the student data from the google sheet
async function studentDataPull(sheet: string): Promise<null> {

    //Grabs data from the google sheet
    const result = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEETID,
        range: sheet,
    });
  
    //Preemptively parses through the structure of the returned data
    const data = result.data.values;
  
    for(let i = 0; i < data.length; i++){

        //Adds the data for the student into the data base
        await addStudent(data[i][0], data[i][1], data[i][2], data[i][3]);
  
    }
  
    return null;

}

export {studentDataPull};