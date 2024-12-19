//Importing Entities

//Importing Controller Functions

//Importing Model Functions
import { Request, Response } from 'express';
import { firstAdminInitializer } from '../models/userModel';
import customLogger from '../utils/logging';

async function initializeAdmins(req: Request, res: Response): Promise<void> {

    //Calls for the creation of an admin on server startup
    try{

        await firstAdminInitializer();

    }catch(error){

        //Logs a failed call
        customLogger.log('error', error);

    }

    return null;

}

export { initializeAdmins };