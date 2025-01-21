//Controller Calls

//Model Calls
import { google } from 'googleapis';
import { addStudent } from './studentModel';
import { dataDecrypt } from './securityModel';
import customLogger from '../utils/logging';
import fs from 'fs';

//Entity Calls

//Repository Calls

//.env Calls
const SHEETID = process.env.SHEETID;

//The function that actually pulls the student data from the google sheet
async function studentDataPull(sheet: string): Promise<null> {

    

    try{

        await fs.writeFileSync('tempData.json', await dataDecrypt(await fs.readFileSync(process.env.ENCRYPDATA, 'utf-8')));

        const auth = new google.auth.GoogleAuth({
            keyFile:'./tempData.json',
            scopes:['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({version:'v4', auth});
        console.log(SHEETID);
        console.log(sheet);

        //const resource = {values};

        //Grabs data from the google sheet
        const result = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId: SHEETID,
            range: sheet,
        });
  
        //Preemptively parses through the structure of the returned data
        const data = result.data.values;
  
        for(let i = 0; i < data.length; i++){

            //Adds the data for the student into the data base
            console.log(data[i][0] + " " + data[i][1] + " " + data[i][2] + " " + data[i][3]);
            await addStudent(data[i][0], data[i][1], data[i][2], data[i][3]);
            
        }
        
        await fs.unlinkSync('tempData.json');

    }catch(error){

        //If something happens to prevent student data pulls, the error is recorded
        customLogger.log('error', 'Failed to grab student data.' + error);
    
    }
    return null;

}

export {studentDataPull};