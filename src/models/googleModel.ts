//Importing Entities

//Importing Controller Functions

//Importing Model Functions
import { google } from 'googleapis';
//import {authenticate } from '@google-cloud/local-auth';
import { addStudent } from './studentModel';
import customLogger from '../utils/logging';
import { dataEncrypt, dataDecrypt } from './securityModel';
import * as fs from 'fs';
import { error } from 'console';

const GOOGLEUSEREMAIL = process.env.GOOGLEUSEREMAIL;
//This is necessary due to how the Private key is stored
const GOOGLEUSERKEY= process.env.GOOGLEUSERKEY?.replace(/\\n/g, '\n');
const SHEETID = process.env.SHEETID;

async function createSheetsClient() {

    console.log(GOOGLEUSEREMAIL);

    const temp = await googleDataDecryption();

    if(temp){

        const content = JSON.parse(temp);
        const credentials = google.auth.fromJSON(content);

        console.log(credentials);

        //['https://www.googleapis.com/auth/spreadsheets.readonly']

        //return google.sheets({ version: 'v4',  });

        return "hello";

    }else{

        return null;

    }

}

//The function that actually pulls the student data from the google sheet
async function studentDataPull(sheet: string): Promise<null> {

    try{

        const sheets = await createSheetsClient(); // Initialize client only when needed

        //Grabs data from the google sheet
        /*const result = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEETID,
            range: sheet,
        });
  
        //Preemptively parses through the structure of the returned data
        const data = result.data.values;
  
        for(let i = 0; i < data.length; i++){

            //Adds the data for the student into the data base
            await addStudent(data[i][0], data[i][1], data[i][2], data[i][3]);
            console.log(data[i][1]);
  
        }*/
        
    }catch(error){

        //If something happens to prevent student data pulls, the error is thrown
        throw error;
    
    }

    return null;

}

//Encrypts Google Cloud Project data for API usage
//Realistically this function should only ever be called at app launch or Google key changes
async function initialGoogleEncryption(): Promise<void> {

    try{

        //Grabs data from given file to encrypt
        let data = fs.readFileSync(process.env.FILETOENCRYPT, 'utf8');
        const temp = dataEncrypt(data);

        //Writes the encrypted data to a new file
        await fs.writeFileSync(process.env.ENCRYPDATA, temp);

        //Deletes data to prevent plain text file from being left on server
        fs.unlinkSync(process.env.FILETOENCRYPT);

    }catch(error){

        customLogger.log('information', error);

    }

}

//Decrypts Google Data in order to use it when using API
async function googleDataDecryption(): Promise<string | void> {
    
    //Grabs data from given file to decrypt
    let data = fs.readFileSync(process.env.ENCRYPDATA, 'utf8');
    const temp = dataDecrypt(data);

    return temp;

}

export {studentDataPull, initialGoogleEncryption, googleDataDecryption, createSheetsClient};