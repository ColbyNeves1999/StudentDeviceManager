import { google } from 'googleapis';

import { addStudent } from './studentModel';
import customLogger from '../utils/logging';

const GOOGLEUSEREMAIL = process.env.GOOGLEUSEREMAIL;
//This is necessary due to how the Private key is stored
const GOOGLEUSERKEY= process.env.GOOGLEUSERKEY?.replace(/\\n/g, '\n');;
const SHEETID = process.env.SHEETID;

function createSheetsClient() {
    if (!GOOGLEUSEREMAIL || !GOOGLEUSERKEY) {
        throw new Error("Google credentials are not set.");
    }

    const auth = new google.auth.JWT(
        GOOGLEUSEREMAIL,
        undefined,
        GOOGLEUSERKEY,
        ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );

    return google.sheets({ version: 'v4', auth });
}

//The function that actually pulls the student data from the google sheet
async function studentDataPull(sheet: string): Promise<null> {

    try{

        const sheets = createSheetsClient(); // Initialize client only when needed

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
        
    }catch(error){

        //If something happens to prevent student data pulls, the error is recorded
        customLogger.log('error', error);
    
    }
    return null;

}

export {studentDataPull};